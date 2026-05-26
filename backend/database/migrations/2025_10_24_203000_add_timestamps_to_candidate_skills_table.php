<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('candidate_skills')) {
            Schema::table('candidate_skills', function (Blueprint $table) {
                if (!Schema::hasColumn('candidate_skills', 'created_at')) {
                    $table->timestamp('created_at')->nullable()->after('proficiency_level');
                }
                if (!Schema::hasColumn('candidate_skills', 'updated_at')) {
                    $table->timestamp('updated_at')->nullable()->after('created_at');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('candidate_skills')) {
            Schema::table('candidate_skills', function (Blueprint $table) {
                if (Schema::hasColumn('candidate_skills', 'updated_at')) {
                    $table->dropColumn('updated_at');
                }
                if (Schema::hasColumn('candidate_skills', 'created_at')) {
                    $table->dropColumn('created_at');
                }
            });
        }
    }
};
