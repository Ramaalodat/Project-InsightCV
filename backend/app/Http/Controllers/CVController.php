<?php

namespace App\Http\Controllers;

use App\Models\CV;
use App\Models\Candidate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CVController extends Controller
{
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'cv_file' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'job_title' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Default job title if not provided
        $jobTitle = $request->job_title ?? 'General Position';

        $user = User::find($request->user_id);
        $candidate = $user->candidate;

        if (!$candidate) {
            return response()->json(['message' => 'Candidate profile not found'], 404);
        }

        // Store file
        $file = $request->file('cv_file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('cvs', $fileName, 'public');

        // Simulate AI analysis
        $analysis = $this->analyzeCV($file, $jobTitle);

        // Save CV record
        $cv = CV::create([
            'candidate_id' => $candidate->id,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_size' => $file->getSize(),
            'job_title' => $jobTitle,
            'analysis_data' => $analysis,
            'overall_score' => $analysis['overall_score'],
            'strengths' => $analysis['strengths'],
            'weaknesses' => $analysis['weaknesses'],
            'missing_skills' => $analysis['missing_skills'],
            'suggestions' => $analysis['suggestions'],
            'matched_companies' => $analysis['matched_companies'],
        ]);

        // Update user points
        $user->increment('points', 10);

        return response()->json([
            'message' => 'CV uploaded and analyzed successfully',
            'cv' => $cv,
            'points_earned' => 10
        ], 201);
    }

    public function getUserCVs($userId)
    {
        $user = User::find($userId);
        
        if (!$user || !$user->candidate) {
            return response()->json(['message' => 'Candidate not found'], 404);
        }

        $cvs = $user->candidate->cvs()->orderBy('created_at', 'desc')->get();

        return response()->json(['cvs' => $cvs]);
    }

    public function getCV($id)
    {
        $cv = CV::with('candidate.user')->find($id);

        if (!$cv) {
            return response()->json(['message' => 'CV not found'], 404);
        }

        return response()->json(['cv' => $cv]);
    }

    public function delete($id)
    {
        $cv = CV::find($id);

        if (!$cv) {
            return response()->json(['message' => 'CV not found'], 404);
        }

        // Delete file from storage
        if (Storage::disk('public')->exists($cv->file_path)) {
            Storage::disk('public')->delete($cv->file_path);
        }

        // Delete CV record
        $cv->delete();

        return response()->json(['message' => 'CV deleted successfully']);
    }

    private function analyzeCV($file, $jobTitle)
    {
        // Extract text from CV
        $cvText = $this->extractTextFromFile($file);
        
        // Analyze with AI (using free Hugging Face API or local analysis)
        $analysis = $this->performAIAnalysis($cvText, $jobTitle);
        
        return $analysis;
    }

    private function extractTextFromFile($file)
    {
        $extension = $file->getClientOriginalExtension();
        $filePath = $file->getRealPath();
        
        try {
            if ($extension === 'pdf') {
                // For PDF: use simple text extraction
                // In production, use: composer require smalot/pdfparser
                return $this->extractFromPDF($filePath);
            } elseif (in_array($extension, ['doc', 'docx'])) {
                // For DOCX: extract text
                return $this->extractFromDOCX($filePath);
            }
        } catch (\Exception $e) {
            \Log::error('Text extraction failed: ' . $e->getMessage());
        }
        
        // Fallback to basic analysis
        return '';
    }

    private function extractFromPDF($filePath)
    {
        try {
            // Try multiple extraction methods
            $text = '';
            
            // Method 1: Read raw content and extract text between parentheses
            $content = file_get_contents($filePath);
            if (preg_match_all('/\((.*?)\)/s', $content, $matches)) {
                $text = implode(' ', $matches[1]);
            }
            
            // Method 2: Extract text between BT and ET markers (PDF text objects)
            if (empty($text) && preg_match_all('/BT\s*(.*?)\s*ET/s', $content, $matches)) {
                foreach ($matches[1] as $match) {
                    if (preg_match_all('/\((.*?)\)/', $match, $textMatches)) {
                        $text .= ' ' . implode(' ', $textMatches[1]);
                    }
                }
            }
            
            // Clean up the text
            $text = str_replace(['\\r', '\\n', '\\t'], ' ', $text);
            $text = preg_replace('/\s+/', ' ', $text);
            $text = trim($text);
            
            \Log::info('PDF text extracted', ['length' => strlen($text), 'preview' => substr($text, 0, 200)]);
            
            return $text;
        } catch (\Exception $e) {
            \Log::error('PDF extraction failed: ' . $e->getMessage());
            return '';
        }
    }

    private function extractFromDOCX($filePath)
    {
        // Extract text from DOCX
        try {
            $zip = new \ZipArchive();
            if ($zip->open($filePath) === true) {
                $xml = $zip->getFromName('word/document.xml');
                $zip->close();
                
                if ($xml) {
                    $text = strip_tags($xml);
                    return $text;
                }
            }
        } catch (\Exception $e) {
            return '';
        }
        
        return '';
    }

    private function performAIAnalysis($cvText, $jobTitle)
    {
        // Try AI analysis first (Gemini API)
        $aiAnalysis = $this->analyzeWithGemini($cvText, $jobTitle);
        
        if ($aiAnalysis) {
            return $aiAnalysis;
        }
        
        // Fallback to basic analysis if AI fails
        return $this->basicAnalysis($cvText, $jobTitle);
    }

    private function analyzeWithGemini($cvText, $jobTitle)
    {
        $apiKey = env('GEMINI_API_KEY', 'AIzaSyBxH8vZ9K3qN2mL4pR6tY8wX1cV5dF7gH9');
        
        if (!$apiKey || $apiKey === 'your_gemini_api_key_here') {
            \Log::warning('Gemini API key not configured');
            return null;
        }

        try {
            $prompt = "You are an expert HR recruiter analyzing a CV for a {$jobTitle} position. Provide a DETAILED and SPECIFIC analysis.

CV Content:
{$cvText}

Analyze this CV thoroughly and provide SPECIFIC, ACTIONABLE feedback. Return ONLY valid JSON (no markdown, no extra text):

{
  \"overall_score\": (number 0-100, based on: technical skills 40%, experience 30%, education 20%, presentation 10%),
  \"strengths\": [
    \"SPECIFIC strength with example from CV\",
    \"Another SPECIFIC strength with details\",
    \"Third SPECIFIC strength with evidence\"
  ],
  \"weaknesses\": [
    \"SPECIFIC weakness with explanation\",
    \"Another SPECIFIC area for improvement\"
  ],
  \"missing_skills\": [
    \"SPECIFIC skill required for {$jobTitle} that's missing\",
    \"Another SPECIFIC technical skill needed\",
    \"Third SPECIFIC skill or certification\"
  ],
  \"suggestions\": [
    \"SPECIFIC actionable suggestion with steps\",
    \"Another DETAILED recommendation\",
    \"Third CONCRETE improvement idea\"
  ]
}

IMPORTANT:
- Be SPECIFIC: mention actual skills, technologies, or experiences from the CV
- For missing_skills: list ONLY skills that are ESSENTIAL for {$jobTitle} but NOT found in the CV
- For suggestions: give ACTIONABLE advice, not generic statements
- For strengths: cite SPECIFIC examples from the CV
- For weaknesses: explain WHY it's a weakness and HOW to improve
- Use professional language but be direct and helpful";

            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
                CURLOPT_POSTFIELDS => json_encode([
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.8,
                        'maxOutputTokens' => 2000,
                        'topP' => 0.95,
                        'topK' => 40,
                    ]
                ]),
                CURLOPT_TIMEOUT => 30,
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode !== 200) {
                \Log::error('Gemini API error', ['code' => $httpCode, 'response' => $response]);
                return null;
            }

            $data = json_decode($response, true);
            
            if (!isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                \Log::error('Invalid Gemini response structure');
                return null;
            }

            $aiText = $data['candidates'][0]['content']['parts'][0]['text'];
            
            // Clean the response (remove markdown code blocks if present)
            $aiText = preg_replace('/```json\s*|\s*```/', '', $aiText);
            $aiText = trim($aiText);
            
            $analysis = json_decode($aiText, true);

            if (!$analysis || !isset($analysis['overall_score'])) {
                \Log::error('Failed to parse AI analysis', ['text' => $aiText]);
                return null;
            }

            // Get matched companies
            $matchedCompanies = \App\Models\Company::with('user')
                ->limit(4)
                ->get()
                ->map(function($company) use ($analysis) {
                    return [
                        'name' => $company->name,
                        'match' => max(60, min(95, $analysis['overall_score'] + rand(-10, 10))),
                        'location' => $company->user->location ?? 'Not specified'
                    ];
                })
                ->toArray();

            $analysis['matched_companies'] = $matchedCompanies;

            \Log::info('AI CV Analysis successful', ['score' => $analysis['overall_score']]);
            
            return $analysis;

        } catch (\Exception $e) {
            \Log::error('Gemini API exception: ' . $e->getMessage());
            return null;
        }
    }

    private function basicAnalysis($cvText, $jobTitle)
    {
        \Log::warning('Using fallback basic analysis - AI analysis failed');
        
        $cvLower = strtolower($cvText);
        $jobLower = strtolower($jobTitle);
        
        // More comprehensive skill sets
        $skillSets = [
            'frontend' => ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'webpack', 'redux'],
            'backend' => ['node.js', 'python', 'java', 'php', 'laravel', 'sql', 'mongodb', 'api', 'rest', 'graphql'],
            'fullstack' => ['react', 'node.js', 'javascript', 'typescript', 'sql', 'mongodb', 'api', 'docker'],
            'mobile' => ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'firebase'],
            'devops' => ['docker', 'kubernetes', 'aws', 'azure', 'ci/cd', 'jenkins', 'terraform', 'linux'],
            'data' => ['python', 'sql', 'machine learning', 'pandas', 'numpy', 'tensorflow', 'pytorch'],
        ];
        
        // Determine job category
        $relevantSkills = [];
        $category = 'general';
        foreach ($skillSets as $cat => $skills) {
            if (strpos($jobLower, $cat) !== false) {
                $relevantSkills = $skills;
                $category = $cat;
                break;
            }
        }
        
        if (empty($relevantSkills)) {
            $relevantSkills = array_merge($skillSets['frontend'], $skillSets['backend']);
        }
        
        // Analyze skills
        $foundSkills = [];
        $missingSkills = [];
        
        foreach ($relevantSkills as $skill) {
            if (strpos($cvLower, strtolower($skill)) !== false) {
                $foundSkills[] = ucfirst($skill);
            } else {
                $missingSkills[] = ucfirst($skill);
            }
        }
        
        // Calculate scores
        $skillScore = count($foundSkills) > 0 
            ? (count($foundSkills) / count($relevantSkills)) * 100 
            : 40;
        
        $experienceYears = 0;
        if (preg_match('/(\d+)\+?\s*(years?|yrs?)/i', $cvText, $matches)) {
            $experienceYears = intval($matches[1]);
        }
        $experienceScore = min($experienceYears * 10, 30);
        
        $educationScore = 0;
        $educationLevel = '';
        if (preg_match('/(phd|doctorate)/i', $cvLower)) {
            $educationScore = 20;
            $educationLevel = 'PhD';
        } elseif (preg_match('/(master|msc|ma)/i', $cvLower)) {
            $educationScore = 18;
            $educationLevel = "Master's";
        } elseif (preg_match('/(bachelor|bsc|ba)/i', $cvLower)) {
            $educationScore = 15;
            $educationLevel = "Bachelor's";
        }
        
        $overallScore = min(round($skillScore * 0.4 + $experienceScore + $educationScore + 10), 95);
        
        // Generate detailed strengths
        $strengths = [];
        if (count($foundSkills) > 0) {
            $strengths[] = "Demonstrates proficiency in " . implode(', ', array_slice($foundSkills, 0, 4));
        }
        if ($experienceYears > 0) {
            $strengths[] = "Has {$experienceYears}+ years of relevant professional experience";
        }
        if ($educationLevel) {
            $strengths[] = "Holds a {$educationLevel} degree showing strong educational foundation";
        }
        if (preg_match('/project/i', $cvText)) {
            $strengths[] = "Shows practical project experience and hands-on work";
        }
        
        // Generate specific weaknesses
        $weaknesses = [];
        if (count($missingSkills) > 3) {
            $weaknesses[] = "Missing key {$jobTitle} skills: " . implode(', ', array_slice($missingSkills, 0, 3));
        }
        if ($experienceYears < 2) {
            $weaknesses[] = "Limited professional experience - consider internships or freelance projects";
        }
        if (!preg_match('/certification|certified/i', $cvText)) {
            $weaknesses[] = "No professional certifications mentioned - these can strengthen your profile";
        }
        
        // Generate actionable suggestions
        $suggestions = [];
        if (!empty($missingSkills)) {
            $topMissing = array_slice($missingSkills, 0, 3);
            $suggestions[] = "Learn these essential {$jobTitle} skills: " . implode(', ', $topMissing);
        }
        $suggestions[] = "Add specific metrics and achievements (e.g., 'Increased performance by 40%')";
        $suggestions[] = "Include links to GitHub, portfolio, or live projects to showcase your work";
        $suggestions[] = "Consider getting certified in {$category} technologies to stand out";
        
        // Get matched companies
        $matchedCompanies = \App\Models\Company::with('user')
            ->limit(4)
            ->get()
            ->map(function($company) use ($overallScore) {
                return [
                    'name' => $company->name,
                    'match' => max(60, min(95, $overallScore + rand(-10, 10))),
                    'location' => $company->user->location ?? 'Not specified'
                ];
            })
            ->toArray();
        
        return [
            'overall_score' => $overallScore,
            'strengths' => array_slice($strengths, 0, 4),
            'weaknesses' => array_slice($weaknesses, 0, 3),
            'missing_skills' => array_slice($missingSkills, 0, 5),
            'suggestions' => $suggestions,
            'matched_companies' => $matchedCompanies
        ];
    }
}
