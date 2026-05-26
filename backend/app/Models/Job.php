<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'title', 'location', 'type', 'experience_level',
        'description', 'requirements', 'salary_min', 'salary_max',
        'status', 'applicants_count'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'job_skills')
            ->withPivot('is_required')
            ->withTimestamps();
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
