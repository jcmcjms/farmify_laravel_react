<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class ProductStoreRequest extends FormRequest{public function authorize(): bool{return true;}
public function rules(): array{return ['farm_id' => 'nullable|uuid|exists:farms,id','name' => 'required|string|max:255','description' => 'nullable|string|max:2000','category' => 'required|string|max:100','price' => 'required|numeric|min:0','price_unit' => 'nullable|string|max:20','stock_quantity' => 'nullable|numeric|min:0','stock_unit' => 'nullable|string|max:20','status' => 'nullable|in:active,inactive,out_of_stock,discontinued','images' => 'nullable|array','images.*' => 'string',];}}