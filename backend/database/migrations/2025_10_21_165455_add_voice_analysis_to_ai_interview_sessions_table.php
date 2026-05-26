<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ai_interview_sessions', function (Blueprint $table) {
            // Add voice_analysis column if it doesn't exist
            if (!Schema::hasColumn('ai_interview_sessions', 'voice_analysis')) {
                $table->json('voice_analysis')->nullable()->after('answers');
            }
            
            // Add job_title column if it doesn't exist
            if (!Schema::hasColumn('ai_interview_sessions', 'job_title')) {
                $table->string('job_title', 255)->nullable()->after('mode');
            }
            
            // Add cv_uploaded column if it doesn't exist
            if (!Schema::hasColumn('ai_interview_sessions', 'cv_uploaded')) {
                $table->boolean('cv_uploaded')->default(false)->after('job_title');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_interview_sessions', function (Blueprint $table) {
            if (Schema::hasColumn('ai_interview_sessions', 'voice_analysis')) {
                $table->dropColumn('voice_analysis');
            }
            if (Schema::hasColumn('ai_interview_sessions', 'job_title')) {
                $table->dropColumn('job_title');
            }
            if (Schema::hasColumn('ai_interview_sessions', 'cv_uploaded')) {
                $table->dropColumn('cv_uploaded');
            }
        });
    }
};
