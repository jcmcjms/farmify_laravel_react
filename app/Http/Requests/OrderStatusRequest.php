<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class OrderStatusRequest extends FormRequest{
public function authorize(): bool{return true;}
public function rules(): array{
return ['status'=>'nullable|in:pending,confirmed,processing,shipped,delivered,cancelled','payment_status'=>'nullable|in:pending,paid,failed,refunded','delivery_status'=>'nullable|in:pending,picked_up,in_transit,delivered,failed',];}}