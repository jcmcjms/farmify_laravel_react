<?php
namespace App\Http\Requests;
use App\Enums\ProductStatus;use Illuminate\Foundation\Http\FormRequest;
class ProductUpdateRequest extends FormRequest{public function authorize(): bool{return true;}
public function rules(): array{return ['farm_id' => 'nullable|uuid|exists:farms,id','name' => 'sometimes|string|max:255','description' => 'nullable|string|max:2000','category' => 'sometimes|string|max:100','price' => 'sometimes|numeric|min:0','price_unit' => 'nullable|string|max:20','stock_quantity' => 'sometimes|numeric|min:0','stock_unit' => 'nullable|string|max:20','status' => 'nullable|enum:' . implode(',', array_column(ProductStatus::cases(), 'value')),'images' => 'nullable|array','images.*' => 'string',];}}