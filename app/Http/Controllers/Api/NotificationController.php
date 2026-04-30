<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Resources\ApiResponse;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
class NotificationController extends Controller{
public function index(): JsonResponse{
$notifications=Auth::user()->notifications()->latest()->paginate(30);
return new ApiResponse(NotificationResource::collection($notifications));
}
public function markRead(string $id): JsonResponse{
$notification=Auth::user()->notifications()->findOrFail($id);
$notification->update(['is_read'=>true]);
return new ApiResponse(new NotificationResource($notification));
}
public function markAllRead(): JsonResponse{
Auth::user()->notifications()->where('is_read',false)->update(['is_read'=>true]);
return new ApiResponse(null,'All notifications marked as read');
}
public function destroy(string $id): JsonResponse{
$notification=Auth::user()->notifications()->findOrFail($id);
$notification->delete();
return new ApiResponse(null,'Notification deleted successfully');
}
}