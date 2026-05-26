<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
