<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Enums\UserRole;
use App\Http\Requests\FarmStoreRequest;
use App\Http\Requests\FarmUpdateRequest;
use App\Http\Resources\ApiResponse;
use App\Http\Resources\FarmResource;
use App\Models\Farm;
use App\Models\FarmMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
class FarmController extends Controller{
public function index(): JsonResponse{
$user=Auth::user();
$query=Farm::query()->with(['owner','plots']);
if($user->isAdmin()){}elseif($user->isFarmer()){$query->where('owner_id',$user->id);}else{$query->where('status','approved');}
$farms=$query->latest()->paginate(20);
return new ApiResponse(FarmResource::collection($farms));
}
public function store(FarmStoreRequest $request): JsonResponse{
$user=Auth::user();
if(!$user->isFarmer()&&!$user->isAdmin()){return new ApiResponse(null,'Only farmers can create farms',403);}
$farm=Farm::create([...$request->validated(),'owner_id'=>$user->id]);
FarmMember::create(['farm_id'=>$farm->id,'user_id'=>$user->id,'role'=>'owner']);
$farm->loadMissing('owner','plots');
return new ApiResponse(new FarmResource($farm),'Farm created successfully',201);
}
public function show(string $id): JsonResponse{
$farm=Farm::with(['owner','plots','products'])->findOrFail($id);
if(Auth::user()->id!==$farm->owner_id&&!Auth::user()->isAdmin()){return new ApiResponse(null,'Forbidden',403);}
return new ApiResponse(new FarmResource($farm));
}
public function update(FarmUpdateRequest $request,string $id): JsonResponse{
$farm=Farm::findOrFail($id);
if(Auth::user()->id!==$farm->owner_id&&!Auth::user()->isAdmin()){return new ApiResponse(null,'Forbidden',403);}
$farm->update($request->validated());
$farm->loadMissing('owner','plots');
return new ApiResponse(new FarmResource($farm->fresh()),'Farm updated successfully');
}
public function destroy(string $id): JsonResponse{
$farm=Farm::findOrFail($id);
if(Auth::user()->id!==$farm->owner_id&&!Auth::user()->isAdmin()){return new ApiResponse(null,'Forbidden',403);}
$farm->delete();
return new ApiResponse(null,'Farm deleted successfully');
}
}