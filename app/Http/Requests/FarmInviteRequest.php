<?php
namespace App\Http\Requests;
use App\Enums\FarmMemberRole;
use Illuminate\Foundation\Http\FormRequest;
class FarmInviteRequest extends FormRequest{
public function authorize(): bool{return true;}
public function rules(): array{
$roles=array_column(FarmMemberRole::cases(),'value');
return ['user_id'=>'required|uuid|exists:users,id','role'=>'nullable|in:'.implode(',',$roles),];}}