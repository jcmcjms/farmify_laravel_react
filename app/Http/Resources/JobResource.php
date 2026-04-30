<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;use Illuminate\Http\Resources\Json\JsonResource;
class JobResource extends JsonResource{
public function toArray(Request $request): array{
return ['id' => $this->id,'poster_id' => $this->poster_?->id,'farm_id' => $this->farm_id,'title' => $this->title,'description' => $this->description,'job_type' => $this->job_type->value,'pay_rate' => $this->pay_rate ? (float)$this->pay_rate : null,'pay_unit' => $this->pay_unit,'status' => $this->status->value,'workers_needed' => $this->workers_needed,'expires_at' => $this->expires_at?->toIso8601String(),'poster' => new UserResource($this->whenLoaded('poster')),'farm' => new FarmResource($this->whenLoaded('farm')),'created_at' => $this->created_at?->toIso8601String(),];}
}