<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }
};
