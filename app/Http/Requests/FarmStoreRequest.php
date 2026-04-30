<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class FarmStoreRequest extends FormRequest{public function authorize(): bool{return true;}
public function rules(): array{return ['name' => 'required|string|max:255','description' => 'nullable|string|max:2000','address' => 'nullable|string|max:500','latitude' => 'nullable|numeric|min:-90|max:90','longitude' => 'nullable|numeric|min:-180|max:180','size_value' => 'nullable|numeric|min:0','size_unit' => 'nullable|string|max:20',];}}