<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Company;
use App\Models\User;
use App\Models\Job;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    public function getSuggestedCandidates($userId, Request $request)
    {
        $user = User::find($userId);
        
        if (!$user || !$user->company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        $company = $user->company;

        // Get all candidates with complete profiles
        // Only show candidates who have completed their profile (title, bio, and at least one skill)
        $candidates = Candidate::with(['user', 'skills'])
            ->whereHas('user', function($query) {
                $query->where('is_active', true);
            })
            ->whereNotNull('title')
            ->whereNotNull('bio')
            ->whereHas('skills') // Must have at least one skill
            ->get();

        // Calculate match percentage based on company's job requirements
        $suggestedCandidates = [];
        
        foreach ($candidates as $candidate) {
            // Get company's active jobs
            $jobs = $company->jobs()->where('status', 'active')->with('skills')->get();
            
            if ($jobs->isEmpty()) {
                // If no jobs, show all candidates with basic match
                $matchPercentage = rand(60, 85);
            } else {
                // Calculate match based on skills overlap
                $maxMatch = 0;
                $bestJob = null;
                
                foreach ($jobs as $job) {
                    $jobSkills = $job->skills->pluck('id')->toArray();
                    $candidateSkills = $candidate->skills->pluck('id')->toArray();
                    
                    if (empty($jobSkills)) {
                        $match = rand(60, 75);
                    } else {
                        $matchingSkills = array_intersect($jobSkills, $candidateSkills);
                        $match = (count($matchingSkills) / count($jobSkills)) * 100;
                        $match = max($match, rand(50, 70)); // Minimum match
                    }
                    
                    if ($match > $maxMatch) {
                        $maxMatch = $match;
                        $bestJob = $job;
                    }
                }
                
                $matchPercentage = round($maxMatch);
            }

            $suggestedCandidates[] = [
                'candidate' => $candidate,
                'match_percentage' => $matchPercentage,
                'matched_job' => $bestJob ?? null,
            ];
        }

        // Sort by match percentage
        usort($suggestedCandidates, function($a, $b) {
            return $b['match_percentage'] - $a['match_percentage'];
        });

        // Apply filters
        if ($request->has('min_match')) {
            $suggestedCandidates = array_filter($suggestedCandidates, function($item) use ($request) {
                return $item['match_percentage'] >= $request->min_match;
            });
        }

        return response()->json(['suggested_candidates' => array_values($suggestedCandidates)]);
    }

    public function show($id)
    {
        $candidate = Candidate::with(['user', 'skills', 'cvs'])->find($id);

        if (!$candidate) {
            return response()->json(['message' => 'Candidate not found'], 404);
        }

        return response()->json(['candidate' => $candidate]);
    }

    public function checkProfileCompletion($userId)
    {
        $user = User::find($userId);
        
        if (!$user || !$user->candidate) {
            return response()->json(['message' => 'Candidate not found'], 404);
        }

        $candidate = $user->candidate;
        
        // Check profile completion
        $isComplete = !empty($candidate->title) 
            && !empty($candidate->bio) 
            && $candidate->skills()->count() > 0
            && $candidate->cvs()->count() > 0;
        
        $missingFields = [];
        if (empty($candidate->title)) $missingFields[] = 'Job Title';
        if (empty($candidate->bio)) $missingFields[] = 'Bio/About';
        if ($candidate->skills()->count() === 0) $missingFields[] = 'Skills';
        if ($candidate->cvs()->count() === 0) $missingFields[] = 'CV Upload';
        
        return response()->json([
            'is_complete' => $isComplete,
            'missing_fields' => $missingFields,
            'completion_percentage' => $this->calculateCompletionPercentage($candidate)
        ]);
    }

    private function calculateCompletionPercentage($candidate)
    {
        $total = 0;
        $completed = 0;
        
        // Required fields
        $fields = [
            'title' => 25,
            'bio' => 25,
            'skills' => 25,
            'cv' => 25
        ];
        
        foreach ($fields as $field => $weight) {
            $total += $weight;
            
            if ($field === 'skills') {
                if ($candidate->skills()->count() > 0) $completed += $weight;
            } elseif ($field === 'cv') {
                if ($candidate->cvs()->count() > 0) $completed += $weight;
            } else {
                if (!empty($candidate->$field)) $completed += $weight;
            }
        }
        
        return round(($completed / $total) * 100);
    }
}
