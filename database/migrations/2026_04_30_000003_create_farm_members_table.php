<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farm_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('farm_id')->constrained('farms')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('role', ['owner', 'manager', 'worker'])->default('worker');
            $table->timestamps();

            $table->unique(['farm_id', 'user_id']);
            $table->index('farm_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farm_members');
    }
};