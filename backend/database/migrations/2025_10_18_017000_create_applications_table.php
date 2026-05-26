<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('applications')) {
            Schema::create('applications', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('job_id');
                $table->unsignedBigInteger('candidate_id');
                $table->enum('status', ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'])->default('pending');
                $table->text('cover_letter')->nullable();
                $table->timestamp('applied_at')->useCurrent();
                $table->timestamp('reviewed_at')->nullable();
                $table->text('notes')->nullable();
                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
                $table->foreign('candidate_id')->references('id')->on('candidates')->onDelete('cascade');
                $table->unique(['job_id', 'candidate_id'], 'unique_job_candidate');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
