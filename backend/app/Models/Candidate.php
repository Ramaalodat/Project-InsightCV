<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'experience_years', 'bio', 'education',
        'expected_salary_min', 'expected_salary_max', 'availability', 'availability_weeks'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'candidate_skills')
            ->withPivot('proficiency_level')
            ->withTimestamps();
    }

    public function cvs()
    {
        return $this->hasMany(CV::class);
    }

    public function interviewSessions()
    {
        return $this->hasMany(AIInterviewSession::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
