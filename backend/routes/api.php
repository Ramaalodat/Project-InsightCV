<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CVController;
use App\Http\Controllers\AIInterviewController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CandidateController;

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/logout', function() {
    return response()->json(['message' => 'Logout successful']);
});

// CV Routes
Route::post('/cv/upload', [CVController::class, 'upload']);
Route::get('/cv/user/{userId}', [CVController::class, 'getUserCVs']);
Route::get('/cv/{id}', [CVController::class, 'getCV']);
Route::delete('/cv/{id}', [CVController::class, 'delete']);

// AI Interview Routes
Route::post('/interview/start', [AIInterviewController::class, 'startSession']);
Route::post('/interview/{sessionId}/answer', [AIInterviewController::class, 'submitAnswer']);
Route::post('/interview/{sessionId}/complete', [AIInterviewController::class, 'completeSession']);
Route::get('/interview/user/{userId}', [AIInterviewController::class, 'getUserSessions']);
Route::get('/interview/{id}', [AIInterviewController::class, 'getSession']);

// TTS Routes (Text-to-Speech)
Route::post('/tts', [App\Http\Controllers\TTSController::class, 'generate']);
Route::post('/tts/clean-cache', [App\Http\Controllers\TTSController::class, 'cleanCache']);

// Voice Transcription Routes (AssemblyAI)
Route::post('/voice/transcribe', [App\Http\Controllers\VoiceTranscriptionController::class, 'transcribeAudio']);
Route::post('/voice/transcribe-url', [App\Http\Controllers\VoiceTranscriptionController::class, 'transcribeFromUrl']);

// Job Routes
Route::get('/jobs', [JobController::class, 'index']);
Route::post('/jobs', [JobController::class, 'store']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::put('/jobs/{id}', [JobController::class, 'update']);
Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
Route::get('/jobs/company/{userId}', [JobController::class, 'getCompanyJobs']);
Route::post('/jobs/apply', [JobController::class, 'apply']);
Route::get('/jobs/{id}/applicants', [JobController::class, 'getApplicants']);

// Application Routes
Route::put('/applications/{id}/status', [JobController::class, 'updateApplicationStatus']);
Route::get('/jobs/{jobId}/applicants', [JobController::class, 'getJobApplicants']);
Route::put('/applications/{applicationId}/status', [JobController::class, 'updateApplicationStatus']);

// Rating Routes
Route::post('/ratings', [RatingController::class, 'store']);
Route::get('/ratings', [RatingController::class, 'index']);
Route::put('/ratings/{id}/approve', [RatingController::class, 'approve']);
Route::delete('/ratings/{id}', [RatingController::class, 'destroy']);

// Profile Routes
Route::get('/profile/{userId}', [ProfileController::class, 'show']);
Route::put('/profile/candidate/{userId}', [ProfileController::class, 'updateCandidate']);
Route::put('/profile/company/{userId}', [ProfileController::class, 'updateCompany']);
Route::post('/profile/{userId}/avatar', [ProfileController::class, 'uploadAvatar']);
Route::put('/profile/{userId}/password', [ProfileController::class, 'updatePassword']);
Route::get('/profile/{userId}/statistics', [ProfileController::class, 'getStatistics']);

// Candidate Routes
Route::get('/candidates/suggested/{userId}', [CandidateController::class, 'getSuggestedCandidates']);
Route::get('/candidates/{id}', [CandidateController::class, 'show']);
Route::get('/candidates/check-profile/{userId}', [CandidateController::class, 'checkProfileCompletion']);

// Notification Routes
Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index']);
Route::get('/notifications/unread-count', [App\Http\Controllers\NotificationController::class, 'getUnreadCount']);
Route::put('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
Route::post('/notifications/mark-all-read', [App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
Route::delete('/notifications/{id}', [App\Http\Controllers\NotificationController::class, 'destroy']);


