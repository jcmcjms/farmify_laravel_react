<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class ProductResource extends JsonResource{
public function toArray(Request $request): array{
return [
'id' => $this->id,
'farmer_id' => $this->farmer_id,
'farm_id' => $this->farm_id,
'name' => $this->name,
'description' => $this->description,
'category' => $this->category,
'price' => (float)$this->price,
'price_unit' => $this->price_unit,
'stock_quantity' => (float)$this->stock_quantity,
'stock_unit' => $this->stock_unit,
'status' => $this->status->value,
'images' => $this->images ?? [],
'farmer' => new UserResource($this->whenLoaded('farmer')),
'farm' => new FarmResource($this->whenLoaded('farm')),
'created_at' => $this->created_at?->toIso8601String(),
];
}
}