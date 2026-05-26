<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AIInterviewSession extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'ai_interview_sessions';

    protected $fillable = [
        'candidate_id', 'mode', 'questions', 'answers', 'voice_analysis', 'overall_score',
        'feedback', 'points_earned', 'duration_minutes', 'started_at', 'completed_at', 'job_title', 'cv_uploaded'
    ];

    protected $casts = [
        'questions' => 'array',
        'answers' => 'array',
        'voice_analysis' => 'array',
        'feedback' => 'array',
        'cv_uploaded' => 'boolean',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
