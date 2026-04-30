<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farm_plots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('farm_id')->constrained('farms')->onDelete('cascade');
            $table->string('name');
            $table->string('crop_type')->nullable();
            $table->decimal('area_value', 10, 2)->nullable();
            $table->string('area_unit', 20)->default('hectares');
            $table->enum('status', ['idle', 'planted', 'growing', 'harvest_ready', 'harvested'])->default('idle');
            $table->date('planted_at')->nullable();
            $table->date('harvest_expected')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('farm_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farm_plots');
    }
};