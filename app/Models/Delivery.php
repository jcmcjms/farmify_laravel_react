<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Delivery extends Model{
use HasFactory,HasUuids;
protected $fillable=['order_id','rider_id','status','pickup_time','delivery_time','cod_collected'];
protected function casts(): array{return ['pickup_time'=>'datetime','delivery_time'=>'datetime','cod_collected'=>'decimal:2',];}
public function order(): BelongsTo{return $this->belongsTo(Order::class);}
public function rider(): BelongsTo{return $this->belongsTo(User::class,'rider_id');}
public function scopePending($q){return $q->where('status','pending');}
public function scopeActive($q){return $q->whereIn('status',['picked_up','in_transit']);}}