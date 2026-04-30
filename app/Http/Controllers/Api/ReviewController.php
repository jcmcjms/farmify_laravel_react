<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewStoreRequest;
use App\Http\Resources\ApiResponse;
use App\Http\Resources\ReviewResource;
use App\Models\Notification;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
class ReviewController extends Controller{
public function store(ReviewStoreRequest $request): JsonResponse{
$user=Auth::user();
$validated=$request->validated();
if(ProductReview::where('reviewer_id',$user->id)->where('product_id',$validated['product_id'])->exists()){return new ApiResponse(null,'You have already reviewed this product',422);}
$review=ProductReview::create([...$validated,'reviewer_id'=>$user->id]);
$product=Product::find($validated['product_id']);
if($product){
Notification::create([
'user_id'=>$product->farmer_id,
'type'=>'product_review',
'title'=>'New Product Review',
'message'=>"{$user->name} left a {$validated['rating']}-star review on your product.",
'data'=>['product_id'=>$product->id],
]);}
$review->loadMissing('reviewer');
return new ApiResponse(new ReviewResource($review),'Review submitted successfully',201);
}
}