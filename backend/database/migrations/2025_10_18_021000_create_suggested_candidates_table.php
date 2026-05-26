<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('suggested_candidates');
    }
};
