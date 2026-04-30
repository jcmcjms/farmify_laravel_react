<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;use Illuminate\Http\Resources\Json\JsonResource;
class PlotResource extends JsonResource{
public function toArray(Request $request): array{
return ['id' => $this->id,'farm_id' => $this->farm_id,'name' => $this->name,'crop_type' => $this->crop_type,'area_value' => $this->area_value,'area_unit' => $this->area_unit,'status' => $this->status,'planted_at' => $this->planted_at?->format('Y-m-d'),'harvest_expected' => $this->harvest_expected?->format('Y-m-d'),'created_at' => $this->created_at?->toIso8601String(),];}
}