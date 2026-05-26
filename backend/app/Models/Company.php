<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'logo', 'industry', 'size', 'founded_year',
        'website', 'about', 'culture', 'benefits', 'values',
        'social_linkedin', 'social_twitter', 'social_github'
    ];

    protected $casts = [
        'benefits' => 'array',
        'values' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }
}
