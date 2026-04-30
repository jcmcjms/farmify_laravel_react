<?php
namespace App\Http\Requests;
use App\Enums\JobType;use App\Enums\JobStatus;use Illuminate\Foundation\Http\FormRequest;
class JobStoreRequest extends FormRequest{public function authorize(): bool{return true;}
public function rules(): array{return ['farm_id' => 'nullable|uuid|exists:farms,id','title' => 'required|string|max:255','description' => 'nullable|string|max:2000','job_type' => 'nullable|enum:' . implode(',', array_column(JobType::cases(), 'value')),'pay_rate' => 'nullable|numeric|min:0','pay_unit' => 'nullable|string|max:20','workers_needed' => 'nullable|integer|min:1','expires_at' => 'nullable|date|after:now',];}}