<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Alter users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['candidate', 'company'])->default('candidate')->after('password');
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 20)->nullable()->after('role');
            }
            if (!Schema::hasColumn('users', 'location')) {
                $table->string('location', 255)->nullable()->after('phone');
            }
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar', 500)->nullable()->after('location');
            }
            if (!Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('avatar');
            }
            if (!Schema::hasColumn('users', 'points')) {
                $table->integer('points')->default(0)->after('is_active');
            }
        });

        // Ensure role enum matches ['candidate','company'] if it already existed with a different definition
        // Normalize existing data: map legacy 'user' -> 'candidate' and NULL -> 'candidate'
        try {
            DB::statement("UPDATE `users` SET `role` = 'candidate' WHERE `role` IS NULL OR `role` = 'user'");
            DB::statement("ALTER TABLE `users` MODIFY `role` ENUM('candidate','company') NOT NULL DEFAULT 'candidate'");
        } catch (\Throwable $e) {
            // ignore if column didn't exist or DB engine doesn't support this exact statement
        }

        // Companies
        if (!Schema::hasTable('companies')) {
        Schema::create('companies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->string('name', 255);
            $table->string('logo', 500)->nullable();
            $table->string('industry', 100)->nullable();
            $table->enum('size', ['1-10', '11-50', '50-200', '200-500', '500+'])->nullable();
            $table->year('founded_year')->nullable();
            $table->string('website', 255)->nullable();
            $table->text('about')->nullable();
            $table->text('culture')->nullable();
            $table->json('benefits')->nullable();
            $table->json('values')->nullable();
            $table->string('social_linkedin', 255)->nullable();
            $table->string('social_twitter', 255)->nullable();
            $table->string('social_github', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        }

        // Candidates
        if (!Schema::hasTable('candidates')) {
        Schema::create('candidates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->string('title', 255)->nullable();
            $table->integer('experience_years')->nullable();
            $table->text('bio')->nullable();
            $table->string('education', 255)->nullable();
            $table->integer('expected_salary_min')->nullable();
            $table->integer('expected_salary_max')->nullable();
            $table->enum('availability', ['available', 'not_available', 'available_in_weeks'])->default('available');
            $table->integer('availability_weeks')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        }

        // Skills
        if (!Schema::hasTable('skills')) {
        Schema::create('skills', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 100)->unique();
            $table->string('category', 50)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
        }

        // Candidate skills
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

        // Jobs - Drop Laravel's default jobs table and create our own
        Schema::dropIfExists('jobs');
        Schema::create('jobs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('company_id');
            $table->string('title', 255);
            $table->string('location', 255);
            $table->enum('type', ['full-time', 'part-time', 'contract', 'internship']);
            $table->enum('experience_level', ['entry', 'mid', 'senior', 'lead']);
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->integer('salary_min')->nullable();
            $table->integer('salary_max')->nullable();
            $table->enum('status', ['active', 'closed', 'draft'])->default('active');
            $table->integer('applicants_count')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });

        // Job skills
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

        // Applications
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

        // CVs
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

        // AI Interview Sessions
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

        // Saved Jobs
        if (!Schema::hasTable('saved_jobs')) {
        Schema::create('saved_jobs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('candidate_id');
            $table->unsignedBigInteger('job_id');
            $table->timestamp('saved_at')->useCurrent();
            $table->foreign('candidate_id')->references('id')->on('candidates')->onDelete('cascade');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
            $table->unique(['candidate_id', 'job_id']);
        });
        }

        // Suggested Candidates
        if (!Schema::hasTable('suggested_candidates')) {
        Schema::create('suggested_candidates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('candidate_id');
            $table->unsignedBigInteger('job_id')->nullable();
            $table->integer('match_percentage');
            $table->json('match_reasons')->nullable();
            $table->timestamp('suggested_at')->useCurrent();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('contacted_at')->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('candidate_id')->references('id')->on('candidates')->onDelete('cascade');
            $table->foreign('job_id')->references('id')->on('jobs')->nullOnDelete();
        });
        }

        // Activities
        if (!Schema::hasTable('activities')) {
        Schema::create('activities', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->enum('type', ['cv_analyzed', 'job_applied', 'interview_completed', 'profile_updated', 'job_posted']);
            $table->text('description');
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        }

        // Notifications
        if (!Schema::hasTable('notifications')) {
        Schema::create('notifications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->string('title', 255);
            $table->text('message');
            $table->enum('type', ['info', 'success', 'warning', 'error'])->default('info');
            $table->boolean('is_read')->default(false);
            $table->string('action_url', 500)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        }

        // Statistics
        if (!Schema::hasTable('statistics')) {
        Schema::create('statistics', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->integer('cvs_analyzed')->default(0);
            $table->integer('practice_sessions')->default(0);
            $table->integer('points_earned')->default(0);
            $table->integer('jobs_applied')->default(0);
            $table->integer('jobs_posted')->default(0);
            $table->integer('candidates_contacted')->default(0);
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique('user_id', 'unique_user_stats');
        });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('statistics');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('suggested_candidates');
        Schema::dropIfExists('saved_jobs');
        Schema::dropIfExists('ai_interview_sessions');
        Schema::dropIfExists('cvs');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('job_skills');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('candidate_skills');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('candidates');
        Schema::dropIfExists('companies');

        // Revert users table additions (best-effort)
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'points')) {
                $table->dropColumn('points');
            }
            if (Schema::hasColumn('users', 'is_active')) {
                $table->dropColumn('is_active');
            }
            if (Schema::hasColumn('users', 'avatar')) {
                $table->dropColumn('avatar');
            }
            if (Schema::hasColumn('users', 'location')) {
                $table->dropColumn('location');
            }
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }
            // Keep 'role' column as we don't know the prior definition safely
        });
    }
};
