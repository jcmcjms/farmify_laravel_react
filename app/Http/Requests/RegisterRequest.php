<?php
namespace App\Http\Requests;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
class RegisterRequest extends FormRequest{
public function authorize(): bool{return true;}
public function rules(): array{
$roles=array_column(UserRole::cases(),'value');
return ['name'=>'required|string|max:255','email'=>'required|email|unique:users,email','password'=>'required|min:8|confirmed','phone'=>'nullable|string|max:20','address'=>'nullable|string|max:500','role'=>'required|in:' . implode(',',$roles),];}
public function messages(): array{
return ['email.unique'=>'This email is already registered.','role.in'=>'Invalid role selected.'];}}