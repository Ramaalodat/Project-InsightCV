<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
