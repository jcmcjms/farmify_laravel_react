<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Resources\ApiResponse;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
class AuthController extends Controller{
public function register(\App\Http\Requests\RegisterRequest $request): JsonResponse{
$user=\App\Models\User::create($request->validated());
$token=Sanctum::createToken($user);
return new ApiResponse(['user'=>new UserResource($user),'token'=>$token->plainTextToken],'Registration successful',201);
}
public function login(\App\Http\Requests\LoginRequest $request): JsonResponse{
$user=\App\Models\User::where('email',$request->email)->first();
if(!$user||!Hash::check($request->password,$user->password)){return new ApiResponse(null,'Invalid credentials',401);}
$token=Sanctum::createToken($user);
return new ApiResponse(['user'=>new UserResource($user),'token'=>$token->plainTextToken],'Login successful');
}
public function logout(): JsonResponse{
Sanctum::deleteCurrentToken(Auth::user());
return new ApiResponse(null,'Logged out successfully');
}
public function me(): JsonResponse{
return new ApiResponse(new UserResource(Auth::user()->loadMissing('farms')));
}
public function updateProfile(\App\Http\Requests\RegisterRequest $request): JsonResponse{
$user=Auth::user();
$user->update($request->validated());
return new ApiResponse(new UserResource($user->fresh()));
}
}