<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('farmer_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('farm_id')->nullable()->constrained('farms')->onDelete('set null');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category');
            $table->decimal('price', 12, 2);
            $table->string('price_unit', 20)->default('kg');
            $table->decimal('stock_quantity', 12, 2)->default(0);
            $table->string('stock_unit', 20)->default('kg');
            $table->enum('status', ['active', 'inactive', 'out_of_stock', 'discontinued'])->default('active');
            $table->json('images')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('farmer_id');
            $table->index('farm_id');
            $table->index('category');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};