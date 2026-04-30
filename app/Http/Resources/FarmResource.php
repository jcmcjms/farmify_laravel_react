<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;use Illuminate\Http\Resources\Json\JsonResource;
class FarmResource extends JsonResource{
public function toArray(Request $request): array{
return ['id' => $this->id,'owner_id' => $this->owner_id,'name' => $this->name,'description' => $this->description,'address' => $this->address,'latitude' => $this->latitude,'longitude' => $this->longitude,'size_value' => $this->size_value,'size_unit' => $this->size_unit,'status' => $this->status,'owner' => new UserResource($this->whenLoaded('owner')),'plots' => PlotResource::collection($this->whenLoaded('plots')),'created_at' => $this->created_at?->toIso8601String(),'updated_at' => $this->updated_at?->toIso8601String(),];}
}