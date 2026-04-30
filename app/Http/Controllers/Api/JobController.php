<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\JobStoreRequest;
use App\Http\Requests\JobUpdateRequest;
use App\Http\Resources\ApiResponse;
use App\Http\Resources\JobResource;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class JobController extends Controller{
public function index(Request $request): JsonResponse{
$user=Auth::user();
$query=Job::query()->with(['poster','farm']);
if($user->isAdmin()){}elseif($user->isFarmer()){$query->where('poster_id',$user->id);}else{$query->where('status','open');}
if($request->filled('job_type')){$query->where('job_type',$request->job_type);}
if($request->filled('status')){$query->where('status',$request->status);}
$jobs=$query->latest()->paginate(20);
return new ApiResponse(JobResource::collection($jobs));
}
public function store(JobStoreRequest $request): JsonResponse{
$user=Auth::user();
if(!$user->isFarmer()&&!$user->isAdmin()){return new ApiResponse(null,'Forbidden',403);}
$job=Job::create([...$request->validated(),'poster_id'=>$user->id]);
$job->loadMissing('poster','farm');
return new ApiResponse(new JobResource($job),'Job posted successfully',201);
}
public function show(string $id): JsonResponse{
$job=Job::with(['poster','farm','applications.laborer'])->findOrFail($id);
return new ApiResponse(new JobResource($job));
}
public function update(JobUpdateRequest $request,string $id): JsonResponse{
$job=Job::findOrFail($id);
if(Auth::user()->id!==$job->poster_id&&!Auth::user()->isAdmin()){return new ApiResponse(null,'Forbidden',403);}
$job->update($request->validated());
$job->loadMissing('poster','farm');
return new ApiResponse(new JobResource($job->fresh()),'Job updated successfully');
}
public function destroy(string $id): JsonResponse{
$job=Job::findOrFail($id);
if(Auth::user()->id!==$job->poster_id&&!Auth::user()->isAdmin()){return new ApiResponse(null,'Forbidden',403);}
$job->delete();
return new ApiResponse(null,'Job deleted successfully');
}
}