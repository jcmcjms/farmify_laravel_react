<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class DeliveryStatusRequest extends FormRequest{
public function authorize(): bool{return true;}
public function rules(): array{
return ['status'=>'required|in:pending,picked_up,in_transit,delivered,failed','pickup_time'=>'nullable|date','delivery_time'=>'nullable|date','cod_collected'=>'nullable|numeric|min:0',];}}