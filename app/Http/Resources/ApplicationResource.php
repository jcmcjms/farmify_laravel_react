<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;use Illuminate\Http\Resources\Json\JsonResource;
class ApplicationResource extends JsonResource{
public function toArray(Request $request): array{
return ['id' => $this->id,'job_id' => $this->job_id,'laborer_id' => $this->laborer_id,'cover_letter' => $this->cover_letter,'status' => $this->status->value,'job' => new JobResource($this->whenLoaded('job')),'laborer' => new UserResource($this->whenLoaded('laborer')),'created_at' => $this->created_at?->toIso8601String(),];}
}