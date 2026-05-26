<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('candidate_skills')) {
            Schema::create('candidate_skills', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('candidate_id');
                $table->unsignedBigInteger('skill_id');
                $table->enum('proficiency_level', ['beginner', 'intermediate', 'advanced', 'expert'])->default('intermediate');
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
                $table->foreign('candidate_id')->references('id')->on('candidates')->onDelete('cascade');
                $table->foreign('skill_id')->references('id')->on('skills')->onDelete('cascade');
                $table->unique(['candidate_id', 'skill_id'], 'unique_candidate_skill');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_skills');
    }
};
