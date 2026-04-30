<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class FarmPlotStoreRequest extends FormRequest{
public function authorize(): bool{return true;}
public function rules(): array{
return ['name'=>'required|string|max:255','size_value'=>'nullable|numeric|min:0','size_unit'=>'nullable|string|max:20','soil_type'=>'nullable|string|max:100','irrigation_type'=>'nullable|string|max:100','status'=>'nullable|in:active,fallow,preparation',];}}