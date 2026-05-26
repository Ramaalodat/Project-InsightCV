<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Candidate;
use App\Models\Company;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show($userId)
    {
        $user = User::with(['candidate.skills', 'company'])->find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Create candidate profile if doesn't exist
        if ($user->role === 'candidate' && !$user->candidate) {
            Candidate::create(['user_id' => $user->id]);
            $user->load('candidate.skills');
        }

        // Create company profile if doesn't exist
        if ($user->role === 'company' && !$user->company) {
            Company::create([
                'user_id' => $user->id,
                'name' => $user->name
            ]);
            $user->load('company');
        }

        return response()->json(['user' => $user]);
    }

    public function updateCandidate(Request $request, $userId)
    {
        $user = User::find($userId);

        if (!$user || !$user->candidate) {
            return response()->json(['message' => 'Candidate not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $userId,
            'phone' => 'sometimes|nullable|string|max:20',
            'location' => 'sometimes|nullable|string|max:255',
            'title' => 'sometimes|nullable|string|max:255',
            'experience_years' => 'sometimes|nullable|integer|min:0',
            'bio' => 'sometimes|nullable|string',
            'education' => 'sometimes|nullable|string',
            'expected_salary_min' => 'sometimes|nullable|integer|min:0',
            'expected_salary_max' => 'sometimes|nullable|integer|min:0',
            'availability' => 'sometimes|nullable|in:available,not_available,available_in_weeks',
            'skills' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update user - only update fields that are present and not null
        $userData = [];
        foreach (['name', 'email', 'phone', 'location'] as $field) {
            if ($request->has($field) && $request->input($field) !== null) {
                $userData[$field] = $request->input($field);
            }
        }
        
        if (!empty($userData)) {
            $user->update($userData);
        }

        // Update candidate - only update fields that are present in request
        $candidateData = [];
        $allowedFields = ['title', 'experience_years', 'bio', 'education', 'expected_salary_min', 'expected_salary_max', 'availability', 'availability_weeks'];
        
        foreach ($allowedFields as $field) {
            if ($request->has($field)) {
                $candidateData[$field] = $request->input($field);
            }
        }
        
        if (!empty($candidateData)) {
            $user->candidate->update($candidateData);
        }

        // Update skills
        if ($request->has('skills')) {
            $skillIds = [];
            foreach ($request->skills as $skillData) {
                $skill = Skill::firstOrCreate(['name' => $skillData['name']]);
                $skillIds[$skill->id] = ['proficiency_level' => $skillData['level'] ?? 'intermediate'];
            }
            $user->candidate->skills()->sync($skillIds);
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->load('candidate.skills')
        ]);
    }

    public function updateCompany(Request $request, $userId)
    {
        $user = User::find($userId);

        if (!$user || !$user->company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $userId,
            'phone' => 'sometimes|nullable|string|max:20',
            'location' => 'sometimes|nullable|string|max:255',
            'company_name' => 'sometimes|nullable|string|max:255',
            'industry' => 'sometimes|nullable|string|max:100',
            'size' => 'sometimes|nullable|in:1-10,11-50,50-200,200-500,500+',
            'founded_year' => 'sometimes|nullable|integer|min:1800|max:' . date('Y'),
            'website' => 'sometimes|nullable|url',
            'about' => 'sometimes|nullable|string',
            'culture' => 'sometimes|nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update user
        $user->update($request->only(['name', 'email', 'phone', 'location']));

        // Update company
        $companyData = $request->only([
            'industry', 'size', 'founded_year', 'website', 'about', 'culture',
            'social_linkedin', 'social_twitter', 'social_github'
        ]);
        
        if ($request->has('company_name')) {
            $companyData['name'] = $request->company_name;
        }

        if ($request->has('benefits')) {
            $companyData['benefits'] = $request->benefits;
        }

        if ($request->has('values')) {
            $companyData['values'] = $request->values;
        }

        $user->company->update($companyData);

        return response()->json([
            'message' => 'Company profile updated successfully',
            'user' => $user->load('company')
        ]);
    }

    public function uploadAvatar(Request $request, $userId)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Delete old avatar if exists
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store new avatar
        $file = $request->file('avatar');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('avatars', $fileName, 'public');

        $user->update(['avatar' => $filePath]);

        return response()->json([
            'message' => 'Avatar uploaded successfully',
            'avatar_url' => Storage::url($filePath)
        ]);
    }

    public function updatePassword(Request $request, $userId)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    public function getStatistics($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $stats = [];

        if ($user->role === 'candidate' && $user->candidate) {
            $stats = [
                'cvs_analyzed' => $user->candidate->cvs()->count(),
                'practice_sessions' => $user->candidate->interviewSessions()->count(),
                'points_earned' => $user->points,
                'jobs_applied' => $user->candidate->applications()->count(),
            ];
        } elseif ($user->role === 'company' && $user->company) {
            $stats = [
                'jobs_posted' => $user->company->jobs()->count(),
                'active_jobs' => $user->company->jobs()->where('status', 'active')->count(),
                'total_applicants' => $user->company->jobs()->sum('applicants_count'),
            ];
        }

        return response()->json(['statistics' => $stats]);
    }
}
