<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    public $timestamps = false;
    
    protected $fillable = ['name', 'category'];

    public function candidates()
    {
        return $this->belongsToMany(Candidate::class, 'candidate_skills');
    }

    public function jobs()
    {
        return $this->belongsToMany(Job::class, 'job_skills');
    }
}
