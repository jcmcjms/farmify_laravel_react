<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ApiResponse;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
class ProductController extends Controller{
public function index(): JsonResponse{
$user=Auth::user();
$query=Product::query()->with(['farmer','farm']);
if($user->isFarmer()&&!$user->isAdmin()){$query->where('farmer_id',$user->id);}else{$query->active();}
$products=$query->latest()->paginate(20);
return new ApiResponse(ProductResource::collection($products));
}
public function store(ProductStoreRequest $request): JsonResponse{
$user=Auth::user();
if(!$user->isFarmer()&&!$user->isAdmin()){return new ApiResponse(null,'Forbidden',403);}
$product=Product::create([...$request->validated(),'farmer_id'=>$user->id]);
$product->loadMissing('farmer','farm');
return new ApiResponse(new ProductResource($product),'Product created successfully',201);
}
public function show(string $id): JsonResponse{
$product=Product::with(['farmer','farm','reviews.reviewer'])->findOrFail($id);
return new ApiResponse((new ProductResource($product))->additional(['average_rating'=>$product->averageRating()]));
}
public function update(ProductUpdateRequest $request,string $id): JsonResponse{
$product=Product::findOrFail($id);
if(Auth::user()->id!==$product->farmer_id&&!Auth::user()->isAdmin()){return new ApiResponse(null,'Forbidden',403);}
$product->update($request->validated());
$product->loadMissing('farmer','farm');
return new ApiResponse(new ProductResource($product->fresh()),'Product updated successfully');
}
public function destroy(string $id): JsonResponse{
$product=Product::findOrFail($id);
if(Auth::user()->id!==$product->farmer_id&&!Auth::user()->isAdmin()){return new ApiResponse(null,'Forbidden',403);}
$product->delete();
return new ApiResponse(null,'Product deleted successfully');
}
}