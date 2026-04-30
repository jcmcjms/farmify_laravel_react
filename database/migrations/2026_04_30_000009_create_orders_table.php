<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->text('delivery_address')->nullable();
            $table->decimal('cod_amount', 10, 2)->default(0);
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->enum('delivery_status', ['pending', 'picked_up', 'in_transit', 'delivered', 'failed'])->default('pending');
            $table->timestamps();
            $table->softDeletes();
            $table->index('user_id');
            $table->index('status');
            $table->index('payment_status');
            $table->index('delivery_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};