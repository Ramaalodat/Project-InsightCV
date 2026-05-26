<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Company;
use App\Models\User;
use App\Models\Skill;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = Job::with(['company.user', 'skills'])
            ->where('status', 'active');

        // Filter by search term
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by experience level
        if ($request->has('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        $jobs = $query->orderBy('created_at', 'desc')->get();

        return response()->json(['jobs' => $jobs]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'type' => 'required|in:full-time,part-time,contract,internship',
            'experience_level' => 'required|in:entry,mid,senior,lead',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'salary_min' => 'nullable|integer',
            'salary_max' => 'nullable|integer',
            'skills' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);
        $company = $user->company;

        if (!$company) {
            return response()->json(['message' => 'Company profile not found'], 404);
        }

        $job = Job::create([
            'company_id' => $company->id,
            'title' => $request->title,
            'location' => $request->location,
            'type' => $request->type,
            'experience_level' => $request->experience_level,
            'description' => $request->description,
            'requirements' => $request->requirements,
            'salary_min' => $request->salary_min,
            'salary_max' => $request->salary_max,
            'status' => 'active',
        ]);

        // Attach skills
        if ($request->has('skills') && is_array($request->skills)) {
            foreach ($request->skills as $skillName) {
                $skill = Skill::firstOrCreate(['name' => $skillName]);
                $job->skills()->attach($skill->id, ['is_required' => true]);
            }
        }

        return response()->json([
            'message' => 'Job posted successfully',
            'job' => $job->load('skills')
        ], 201);
    }

    public function show($id)
    {
        $job = Job::with(['company.user', 'skills', 'applications.candidate.user'])->find($id);

        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        return response()->json(['job' => $job]);
    }

    public function update(Request $request, $id)
    {
        $job = Job::find($id);

        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:full-time,part-time,contract,internship',
            'experience_level' => 'sometimes|in:entry,mid,senior,lead',
            'description' => 'sometimes|string',
            'status' => 'sometimes|in:active,closed,draft',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job->update($request->only([
            'title', 'location', 'type', 'experience_level',
            'description', 'requirements', 'salary_min', 'salary_max', 'status'
        ]));

        return response()->json([
            'message' => 'Job updated successfully',
            'job' => $job
        ]);
    }

    public function destroy($id)
    {
        $job = Job::find($id);

        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        $job->delete();

        return response()->json(['message' => 'Job deleted successfully']);
    }

    public function getCompanyJobs($userId)
    {
        $user = User::find($userId);
        
        if (!$user || !$user->company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        $jobs = $user->company->jobs()
            ->with(['skills', 'applications.candidate.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['jobs' => $jobs]);
    }

    public function apply(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_id' => 'required|exists:jobs,id',
            'user_id' => 'required|exists:users,id',
            'cover_letter' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);
        $candidate = $user->candidate;

        if (!$candidate) {
            return response()->json(['message' => 'Candidate profile not found'], 404);
        }

        // Check if already applied
        $existingApplication = Application::where('job_id', $request->job_id)
            ->where('candidate_id', $candidate->id)
            ->first();

        if ($existingApplication) {
            return response()->json(['message' => 'You have already applied to this job'], 400);
        }

        $application = Application::create([
            'job_id' => $request->job_id,
            'candidate_id' => $candidate->id,
            'cover_letter' => $request->cover_letter,
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        // Increment applicants count
        $job = Job::find($request->job_id);
        $job->increment('applicants_count');

        // Send notification to company
        $companyUserId = $job->company->user_id;
        NotificationController::createNotification(
            $companyUserId,
            'application_received',
            'New Application Received',
            "{$user->name} has applied for {$job->title}",
            [
                'job_id' => $job->id,
                'application_id' => $application->id,
                'candidate_name' => $user->name,
                'job_title' => $job->title
            ]
        );

        return response()->json([
            'message' => 'Application submitted successfully',
            'application' => $application
        ], 201);
    }

    public function getJobApplicants($jobId)
    {
        $job = Job::with('company')->find($jobId);

        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        $applicants = Application::with(['candidate.user', 'candidate.skills'])
            ->where('job_id', $jobId)
            ->orderBy('applied_at', 'desc')
            ->get()
            ->map(function($application) {
                return [
                    'id' => $application->id,
                    'candidate_id' => $application->candidate_id,
                    'name' => $application->candidate->user->name,
                    'email' => $application->candidate->user->email,
                    'phone' => $application->candidate->user->phone,
                    'title' => $application->candidate->title,
                    'experience_years' => $application->candidate->experience_years,
                    'skills' => $application->candidate->skills->pluck('name'),
                    'status' => $application->status,
                    'cover_letter' => $application->cover_letter,
                    'applied_at' => $application->applied_at,
                    'avatar' => $application->candidate->user->avatar,
                ];
            });

        return response()->json([
            'job' => $job,
            'applicants' => $applicants
        ]);
    }

    public function updateApplicationStatus(Request $request, $applicationId)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,reviewed,shortlisted,rejected,hired',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $application = Application::find($applicationId);

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        $oldStatus = $application->status;
        
        $application->update([
            'status' => $request->status,
            'notes' => $request->notes,
            'reviewed_at' => now(),
        ]);

        // Send notification to candidate if status changed
        if ($oldStatus !== $request->status) {
            $candidate = $application->candidate;
            $job = $application->job;
            
            $statusMessages = [
                'reviewed' => 'Your application has been reviewed',
                'shortlisted' => 'Congratulations! You have been shortlisted',
                'rejected' => 'Your application status has been updated',
                'hired' => 'Congratulations! You have been hired',
            ];

            $message = $statusMessages[$request->status] ?? 'Your application status has been updated';

            NotificationController::createNotification(
                $candidate->user_id,
                'application_status_changed',
                'Application Status Update',
                "{$message} for {$job->title}",
                [
                    'job_id' => $job->id,
                    'application_id' => $application->id,
                    'status' => $request->status,
                    'job_title' => $job->title
                ]
            );
        }

        return response()->json([
            'message' => 'Application status updated successfully',
            'application' => $application
        ]);
    }

    public function getApplicants($jobId)
    {
        $job = Job::with('company')->find($jobId);

        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        $applications = Application::with(['candidate.user', 'candidate.skills'])
            ->where('job_id', $jobId)
            ->orderBy('applied_at', 'desc')
            ->get();

        // Format applicants data
        $applicants = $applications->map(function($application) {
            $candidate = $application->candidate;
            $user = $candidate->user;
            
            return [
                'id' => $application->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'title' => $candidate->title,
                'experience_years' => $candidate->experience_years,
                'skills' => $candidate->skills->pluck('name')->toArray(),
                'status' => $application->status,
                'cover_letter' => $application->cover_letter,
                'applied_at' => $application->applied_at,
                'reviewed_at' => $application->reviewed_at,
                'notes' => $application->notes,
            ];
        });

        return response()->json([
            'job' => $job,
            'applicants' => $applicants
        ]);
    }
}
