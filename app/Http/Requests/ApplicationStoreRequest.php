<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class ApplicationStoreRequest extends FormRequest{public function authorize(): bool{return true;}
public function rules(): array{return ['job_id' => 'required|uuid|exists:jobs,id','cover_letter' => 'nullable|string|max:2000',];}}