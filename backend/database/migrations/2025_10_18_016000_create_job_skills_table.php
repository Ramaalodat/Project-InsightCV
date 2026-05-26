<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('job_skills')) {
            Schema::create('job_skills', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('job_id');
                $table->unsignedBigInteger('skill_id');
                $table->boolean('is_required')->default(true);
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
                $table->foreign('skill_id')->references('id')->on('skills')->onDelete('cascade');
                $table->unique(['job_id', 'skill_id'], 'unique_job_skill');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('job_skills');
    }
};
