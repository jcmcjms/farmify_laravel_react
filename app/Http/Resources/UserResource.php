<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;use Illuminate\Http\Resources\Json\JsonResource;
class UserResource extends JsonResource{
public function toArray(Request $request): array{
return ['id' => $this->id,'uuid' => $this->uuid,'name' => $this->name,'email' => $this->email,'role' => $this->role->value,'phone' => $this->phone,'address' => $this->address,'avatar' => $this->avatar,'rating' => (float)$this->rating,'review_count' => $this->review_count,'is_verified' => $this->is_verified,'latitude' => $this->latitude,'longitude' => $this->longitude,'created_at' => $this->created_at?->toIso8601String(),];}
}