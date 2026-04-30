<?php
namespace App\Http\Requests;
use App\Enums\ApplicationStatus;use Illuminate\Foundation\Http\FormRequest;
class ReviewStoreRequest extends FormRequest{public function authorize(): bool{return true;}
public function rules(): array{return ['product_id' => 'required|uuid|exists:products,id','farmer_id' => 'required|uuid|exists:users,id','rating' => 'required|integer|min:1|max:5','comment' => 'nullable|string|max:1000',];}
public function messages(): array{return ['rating.min' => 'Rating must be at least 1 star.', 'rating.max' => 'Rating cannot exceed 5 stars.',];}}