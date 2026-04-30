<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Resources\ApiResponse;
use App\Http\Resources\FarmMemberResource;
use App\Models\Farm;
use App\Models\FarmMember;
use App\Enums\FarmMemberRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FarmMemberController extends Controller
{
    public function index(string $farmId): JsonResponse
    {
        $farm = Farm::findOrFail($farmId);
        if ($farm->owner_id !== Auth::id() && !$farm->members()->where('user_id', Auth::id())->exists() && !Auth::user()->isAdmin()) {
            return new ApiResponse(null, 'Forbidden', 403);
        }
        $members = $farm->members()->with('user')->get();
        return new ApiResponse(FarmMemberResource::collection($members));
    }

    public function inviteMember(\App\Http\Requests\FarmInviteRequest $request, string $farmId): JsonResponse
    {
        $farm = Farm::findOrFail($farmId);
        if ($farm->owner_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return new ApiResponse(null, 'Forbidden', 403);
        }
        $existing = FarmMember::where('farm_id', $farmId)->where('user_id', $request->user_id)->first();
        if ($existing) {
            return new ApiResponse(null, 'User is already a member', 422);
        }
        $member = FarmMember::create([
            'farm_id' => $farmId,
            'user_id' => $request->user_id,
            'role' => $request->role ?? FarmMemberRole::LABORER,
            'status' => 'pending'
        ]);
        return new ApiResponse(new FarmMemberResource($member->load('user')), 'Member invited', 201);
    }

    public function removeMember(string $farmId, string $memberId): JsonResponse
    {
        $farm = Farm::findOrFail($farmId);
        if ($farm->owner_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return new ApiResponse(null, 'Forbidden', 403);
        }
        $member = FarmMember::findOrFail($memberId);
        $member->delete();
        return new ApiResponse(null, 'Member removed');
    }

    public function updateMemberRole(\App\Http\Requests\FarmMemberRoleRequest $request, string $farmId, string $memberId): JsonResponse
    {
        $farm = Farm::findOrFail($farmId);
        if ($farm->owner_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return new ApiResponse(null, 'Forbidden', 403);
        }
        $member = FarmMember::findOrFail($memberId);
        $member->update(['role' => $request->role]);
        return new ApiResponse(new FarmMemberResource($member->fresh()->load('user')), 'Role updated');
    }
}