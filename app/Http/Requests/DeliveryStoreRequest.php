<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class DeliveryStoreRequest extends FormRequest{
public function authorize(): bool{return true;}
public function rules(): array{
return ['order_id'=>'required|uuid|exists:orders,id',];}}