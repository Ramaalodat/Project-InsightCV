<?php

namespace App\Http\Controllers;

use App\Models\AIInterviewSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AIInterviewController extends Controller
{
    public function startSession(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'mode' => 'required|in:chat,voice',
            'job_title' => 'nullable|string|max:255',
            'cv_uploaded' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::find($request->user_id);
            
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $candidate = $user->candidate;

            if (!$candidate) {
                return response()->json(['message' => 'Candidate profile not found'], 404);
            }

            $jobTitle = $request->get('job_title', 'this position');

            $session = AIInterviewSession::create([
                'candidate_id' => $candidate->id,
                'mode' => $request->mode,
                'job_title' => $jobTitle,
                'cv_uploaded' => $request->get('cv_uploaded', false),
                'started_at' => now(),
            ]);

            // Generate first question
            $firstQuestion = $this->generateQuestion(1, $jobTitle);

            return response()->json([
                'message' => 'Interview session started',
                'session_id' => $session->id,
                'first_question' => $firstQuestion
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Start session error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to start session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function submitAnswer(Request $request, $sessionId)
    {
        $validator = Validator::make($request->all(), [
            'question' => 'required|string',
            'answer' => 'required|string',
            'voice_analysis' => 'nullable|array',
            'language' => 'nullable|string|in:en,ar'
        ]);

        if ($validator->fails()) {
            \Log::error('Submit answer validation failed:', $validator->errors()->toArray());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $session = AIInterviewSession::find($sessionId);

            if (!$session) {
                return response()->json(['message' => 'Session not found'], 404);
            }

            // Add Q&A to session
            $questions = $session->questions ?? [];
            $answers = $session->answers ?? [];
            $voiceAnalysis = $session->voice_analysis ?? [];
            
            $questions[] = $request->question;
            $answers[] = $request->answer;
            
            // Store voice analysis if provided
            if ($request->has('voice_analysis')) {
                $voiceAnalysis[] = $request->voice_analysis;
            }

            $session->questions = $questions;
            $session->answers = $answers;
            $session->voice_analysis = $voiceAnalysis;
            $session->save();

            // Generate next question or end session
            if (count($questions) >= 10) {
                return $this->completeSession($session);
            }

            $nextQuestion = $this->generateQuestion(count($questions) + 1, $session->job_title ?? 'this position');

            return response()->json([
                'next_question' => $nextQuestion,
                'questions_completed' => count($questions),
                'total_questions' => 10
            ]);
        } catch (\Exception $e) {
            \Log::error('Submit answer error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to submit answer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function completeSession($session)
    {
        try {
            // If session is an ID, fetch it
            if (!$session instanceof AIInterviewSession) {
                $session = AIInterviewSession::find($session);
                if (!$session) {
                    return response()->json(['message' => 'Session not found'], 404);
                }
            }

            $feedback = $this->generateFeedback($session);
            $overallScore = rand(70, 95);
            $pointsEarned = $overallScore;

            $session->update([
                'overall_score' => $overallScore,
                'feedback' => $feedback,
                'points_earned' => $pointsEarned,
                'completed_at' => now(),
                'duration_minutes' => now()->diffInMinutes($session->started_at),
            ]);

            // Update user points
            $session->candidate->user->increment('points', $pointsEarned);

            return response()->json([
                'message' => 'Interview session completed',
                'overall_score' => $overallScore,
                'feedback' => $feedback,
                'points_earned' => $pointsEarned
            ]);
        } catch (\Exception $e) {
            \Log::error('Complete session error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to complete session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserSessions($userId)
    {
        $user = User::find($userId);
        
        if (!$user || !$user->candidate) {
            return response()->json(['message' => 'Candidate not found'], 404);
        }

        $sessions = $user->candidate->interviewSessions()
            ->orderBy('started_at', 'desc')
            ->get();

        return response()->json(['sessions' => $sessions]);
    }

    public function getSession($id)
    {
        $session = AIInterviewSession::with('candidate.user')->find($id);

        if (!$session) {
            return response()->json(['message' => 'Session not found'], 404);
        }

        return response()->json(['session' => $session]);
    }

    private function generateQuestion($questionNumber, $jobTitle = 'this position')
    {
        $questions = [
            "Can you tell me about yourself and your professional background?",
            "What are your key strengths that make you suitable for {$jobTitle}?",
            "Describe a challenging project you worked on and how you overcame obstacles.",
            "How do you handle working under pressure and tight deadlines?",
            "Tell me about a time when you had to work with a difficult team member or resolve conflict.",
            "What are your career goals for the next 3-5 years and how does {$jobTitle} fit into them?",
            "How do you stay updated with the latest industry trends and technologies relevant to {$jobTitle}?",
            "Describe a situation where you had to learn a new skill or technology quickly.",
            "Tell me about a time when you failed at something. How did you handle it and what did you learn?",
            "Why are you interested in {$jobTitle} and what motivates you in this field?"
        ];

        return $questions[$questionNumber - 1] ?? $questions[0];
    }

    private function generateFeedback($session)
    {
        $answers = $session->answers ?? [];
        $answerCount = count($answers);
        
        // Analyze answers - supports both English and Arabic
        $avgAnswerLength = 0;
        $hasExamples = 0;
        $positiveWords = 0;
        
        foreach ($answers as $answer) {
            $avgAnswerLength += str_word_count($answer);
            
            // Detect examples in both English and Arabic
            if (preg_match('/\b(example|experience|project|achieved|successful|improved|مثال|تجربة|مشروع|حققت|نجحت|حسنت)\b/i', $answer)) {
                $hasExamples++;
            }
            
            // Detect positive words in both English and Arabic
            if (preg_match('/\b(passionate|excited|motivated|enjoy|love|excellent|متحمس|مهتم|أحب|ممتاز|رائع)\b/i', $answer)) {
                $positiveWords++;
            }
        }
        
        $avgAnswerLength = $answerCount > 0 ? $avgAnswerLength / $answerCount : 0;
        
        // Generate feedback
        $strengths = [];
        $improvements = [];
        $recommendations = [];
        
        // Strengths based on performance
        if ($avgAnswerLength > 50) {
            $strengths[] = 'Detailed and comprehensive responses';
        }
        if ($hasExamples >= 5) {
            $strengths[] = 'Good use of specific examples and experiences';
        }
        if ($positiveWords >= 3) {
            $strengths[] = 'Positive attitude and enthusiasm';
        }
        
        // Default strengths if none detected
        if (empty($strengths)) {
            $strengths = [
                'Completed the full interview session',
                'Showed willingness to practice and improve',
                'Engaged with all questions asked'
            ];
        }
        
        // Areas for improvement
        if ($avgAnswerLength < 30) {
            $improvements[] = 'Provide more detailed responses with specific examples';
        }
        if ($hasExamples < 3) {
            $improvements[] = 'Include more concrete examples from your experience';
        }
        
        // Default improvements
        $improvements = array_merge($improvements, [
            'Structure answers using the STAR method (Situation, Task, Action, Result)',
            'Practice maintaining confident body language and eye contact',
            'Prepare quantifiable achievements to strengthen your responses'
        ]);
        
        // Recommendations based on session mode
        if ($session->mode === 'voice') {
            $recommendations[] = 'Practice speaking clearly and at an appropriate pace';
            $recommendations[] = 'Work on eliminating filler words';
        }
        
        $recommendations = array_merge($recommendations, [
            'Research the company and role thoroughly before interviews',
            'Prepare thoughtful questions to ask the interviewer',
            'Practice common behavioral interview questions',
            'Consider taking additional courses to strengthen technical skills'
        ]);
        
        return [
            'strengths' => array_slice($strengths, 0, 4),
            'improvements' => array_slice($improvements, 0, 4),
            'recommendations' => array_slice($recommendations, 0, 4)
        ];
    }
}
