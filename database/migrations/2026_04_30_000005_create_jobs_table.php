<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('poster_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('farm_id')->nullable()->constrained('farms')->onDelete('set null');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('job_type', ['daily', 'seasonal', 'permanent'])->default('daily');
            $table->decimal('pay_rate', 12, 2)->nullable();
            $table->string('pay_unit', 20)->default('day');
            $table->enum('status', ['open', 'closed', 'filled', 'expired'])->default('open');
            $table->integer('workers_needed')->default(1);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('poster_id');
            $table->index('farm_id');
            $table->index('job_type');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};