<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CV extends Model
{
    use HasFactory;

    protected $table = 'cvs';
    
    // Disable updated_at since table doesn't have it
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'candidate_id', 'file_path', 'file_name', 'file_size', 'job_title',
        'analysis_data', 'overall_score', 'strengths', 'weaknesses',
        'missing_skills', 'suggestions', 'matched_companies', 'created_at'
    ];

    protected $casts = [
        'analysis_data' => 'array',
        'strengths' => 'array',
        'weaknesses' => 'array',
        'missing_skills' => 'array',
        'suggestions' => 'array',
        'matched_companies' => 'array',
        'created_at' => 'datetime',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
