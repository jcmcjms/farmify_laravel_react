<?php
namespace App\Http\Requests;
use App\Enums\FarmMemberRole;
use Illuminate\Foundation\Http\FormRequest;
class FarmMemberRoleRequest extends FormRequest{
public function authorize(): bool{return true;}
public function rules(): array{
$roles=array_column(FarmMemberRole::cases(),'value');
return ['role'=>'required|in:'.implode(',',$roles),];}}