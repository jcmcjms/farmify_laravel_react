<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class CartStoreRequest extends FormRequest{
public function authorize(): bool{return true;}
public function rules(): array{
return ['product_id'=>'required|uuid|exists:products,id','quantity'=>'nullable|integer|min:1',];}}