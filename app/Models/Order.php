<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
class Order extends Model{
use HasFactory,HasUuids,SoftDeletes;
protected $fillable=['user_id','status','total_amount','delivery_address','cod_amount','payment_status','delivery_status',];
protected function casts(): array{return ['total_amount'=>'decimal:2','cod_amount'=>'decimal:2',];}
public function user(): BelongsTo{return $this->belongsTo(User::class);}
public function items(): HasMany{return $this->hasMany(OrderItem::class);}
public function delivery(): HasMany{return $this->hasMany(Delivery::class);}
public function scopePending($q){return $q->where('status','pending');}
public function scopeProcessing($q){return $q->where('status','processing');}
public function scopeCompleted($q){return $q->where('status','delivered');}}