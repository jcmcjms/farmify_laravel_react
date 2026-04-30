<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationStoreRequest;
use App\Http\Resources\ApiResponse;
use App\Http\Resources\ApplicationResource;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class JobApplicationController extends Controller{
public function apply(ApplicationStoreRequest $request): JsonResponse{
$user=Auth::user();
$jobId=$request->validated()['job_id'];
$job=Job::findOrFail($jobId);
if($job->poster_id===$user->id){return new ApiResponse(null,'Cannot apply to your own job',422);}
if(JobApplication::where('job_id',$jobId)->where('laborer_id',$user->id)->exists()){return new ApiResponse(null,'Already applied to this job',422);}
$application=JobApplication::create([
'job_id'=>$jobId,
'laborer_id'=>$user->id,
'cover_letter'=>$request->cover_letter??null,
]);
Notification::create([
'user_id'=>$job->poster_id,
'type'=>'job_application',
'title'=>'New Job Application',
'message'=>"{$user->name} applied to your job: {$job->title}",
'data'=>['application_id'=>$application->id,'job_id'=>$jobId],
]);
$application->loadMissing('job','laborer');
return new ApiResponse(new ApplicationResource($application),'Application submitted successfully',201);
}
public function index(): JsonResponse{
$user=Auth::user();
$myApps=JobApplication::with(['job.poster','laborer'])->where('laborer_id',$user->id)->latest()->paginate(20);
$received=JobApplication::with(['job','laborer'])->whereHas('job',fn($q)=>$q->where('poster_id',$user->id))->latest()->paginate(20);
return new ApiResponse([
'my_applications'=>ApplicationResource::collection($myApps),
'received_applications'=>ApplicationResource::collection($received),
]);
}
public function updateStatus(Request $request,string $id): JsonResponse{
$user=Auth::user();
$application=JobApplication::with(['job','laborer'])->findOrFail($id);
if($application->job->poster_id!==$user->id){return new ApiResponse(null,'Forbidden',403);}
$request->validate(['status'=>'required|in:pending,accepted,rejected,withdrawn']);
$application->update(['status'=>$request->status]);
if($request->status==='accepted'){
Notification::create([
'user_id'=>$application->laborer_id,
'type'=>'application_accepted',
'title'=>'Application Accepted',
'message'=>"Your application for '{$application->job->title}' has been accepted!",
'data'=>['application_id'=>$id],
]);
}
return new ApiResponse(new ApplicationResource($application->fresh()),'Status updated successfully');
}
}