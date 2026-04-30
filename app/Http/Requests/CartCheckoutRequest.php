<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class CartCheckoutRequest extends FormRequest{
public function authorize(): bool{return true;}
public function rules(): array{
return ['delivery_address'=>'required|string|max:500','cod_amount'=>'nullable|numeric|min:0',];}}