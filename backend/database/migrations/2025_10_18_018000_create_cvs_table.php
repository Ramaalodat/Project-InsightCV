<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('cvs')) {
            Schema::create('cvs', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('candidate_id');
                $table->string('file_path', 500);
                $table->string('file_name', 255);
                $table->integer('file_size');
                $table->string('job_title', 255)->nullable();
                $table->json('analysis_data')->nullable();
                $table->integer('overall_score')->nullable();
                $table->json('strengths')->nullable();
                $table->json('weaknesses')->nullable();
                $table->json('missing_skills')->nullable();
                $table->json('suggestions')->nullable();
                $table->json('matched_companies')->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->foreign('candidate_id')->references('id')->on('candidates')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('cvs');
    }
};
