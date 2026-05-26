<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('ai_interview_sessions')) {
            Schema::create('ai_interview_sessions', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('candidate_id');
                $table->enum('mode', ['chat', 'voice']);
                $table->string('job_title', 255)->nullable();
                $table->boolean('cv_uploaded')->default(false);
                $table->json('questions')->nullable();
                $table->json('answers')->nullable();
                $table->json('voice_analysis')->nullable();
                $table->integer('overall_score')->nullable();
                $table->json('feedback')->nullable();
                $table->integer('points_earned')->default(0);
                $table->integer('duration_minutes')->nullable();
                $table->timestamp('started_at')->useCurrent();
                $table->timestamp('completed_at')->nullable();
                $table->foreign('candidate_id')->references('id')->on('candidates')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_interview_sessions');
    }
};
