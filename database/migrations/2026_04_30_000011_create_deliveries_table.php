<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration{
public function up(): void{
Schema::create('deliveries',function(Blueprint $table){$table->uuid('id')->primary();$table->foreignUuid('order_id')->constrained()->onDelete('cascade');$table->foreignUuid('rider_id')->constrained('users')->onDelete('cascade');$table->enum('status',['pending','picked_up','in_transit','delivered','failed'])->default('pending');$table->timestamp('pickup_time')->nullable();$table->timestamp('delivery_time')->nullable();$table->decimal('cod_collected',10,2)->default(0);$table->timestamps();$table->index('order_id');$table->index('rider_id');$table->index('status');});}
public function down(): void{Schema::dropIfExists('deliveries');}};