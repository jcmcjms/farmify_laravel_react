<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class ReviewResource extends JsonResource{
public function toArray(Request $request): array{
return [
'id' => $this->id,
'reviewer_?->id' => $this->reviewer_?->id,
'product_?->id' => $this->product_?->id,
'farmer_?->id' => $this->farmer_?->id,
'rating' => $this->rating,
'comment' => $this->comment,
'created_?->at' => $this->created_?->at?->toIso8String(),
'reviewer' => new UserResource($this->whenLoaded('reviewer')),
];
}
}