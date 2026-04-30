<?php
namespace Database\Seeders;
use App\Enums\ApplicationStatus;
use App\Enums\JobType;
use App\Enums\UserRole;
use App\Models\Farm;
use App\Models\FarmMember;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{public function run():void{
$admin=User::factory()->admin()->create(['name'=>'Admin','email'=>'admin@farmify.test','is_verified'=>true]);
$farmer1=User::factory()->farmer()->create(['name'=>'Maria Santos','email'=>'maria@farmify.test','is_verified'=>true]);
$farmer2=User::factory()->farmer()->create(['name'=>'Jose Cruz','email'=>'jose@farmify.test','is_verified'=>true]);
$laborer1=User::factory()->laborer()->create(['name'=>'Pedro Work','email'=>'pedro@farmify.test']);
$laborer2=User::factory()->laborer()->create(['name'=>'Ana Helpers','email'=>'ana@farmify.test']);
$consumer1=User::factory()->consumer()->create(['name'=>'Buyer One','email'=>'buyer1@farmify.test']);
$consumer2=User::factory()->consumer()->create(['name'=>'Buyer Two','email'=>'buyer2@farmify.test']);
$rider1=User::factory()->rider()->create(['name'=>'Delivery Rider','email'=>'rider@farmify.test']);
$farm1=Farm::factory()->approved()->forOwner($farmer1)->create(['name'=>'Green Valley Organic','description'=>'Certified organic vegetable farm.','size_value'=>12.5]);
$farm2=Farm::factory()->approved()->forOwner($farmer2)->create(['name'=>'Sunrise Fruit Plantation','description'=>'Tropical fruit farm.','size_value'=>25]);
FarmMember::create(['farm_id'=>$farm1->id,'user_id'=>$farmer1->id,'role'=>'owner']);
FarmMember::create(['farm_id'=>$farm2->id,'user_id'=>$farmer2->id,'role'=>'owner']);
$product1=Product::factory()->active()->forFarmer($farmer1)->forFarm($farm1)->create(['name'=>'Fresh Lettuce','category'=>'Vegetables','price'=>25,'price_unit'=>'kg','stock_quantity'=>100]);
$product2=Product::factory()->active()->forFarmer($farmer1)->forFarm($farm1)->create(['name'=>'Organic Basil','category'=>'Herbs','price'=>40,'price_unit'=>'bunch','stock_quantity'=>50]);
$product3=Product::factory()->active()->forFarmer($farmer2)->forFarm($farm2)->create(['name'=>'Ripe Mangoes','category'=>'Fruits','price'=>35,'price_unit'=>'kg','stock_quantity'=>200]);
$product4=Product::factory()->active()->forFarmer($farmer2)->forFarm($farm2)->create(['name'=>'Green Papaya','category'=>'Fruits','price'=>20,'price_unit'=>'kg','stock_quantity'=>150]);
$job1=Job::factory()->open()->forPoster($farmer1)->create(['title'=>'Harvesting Assistant','description'=>'Help during harvest.','job_type'=>JobType::SEASONAL,'pay_rate'=>350,'workers_needed'=>3]);
$job2=Job::factory()->open()->forPoster($farmer2)->create(['title'=>'Farm Hand','description'=>'Daily tasks.','job_type'=>JobType::DAILY,'pay_rate'=>300,'workers_needed'=>2]);
JobApplication::create(['job_id'=>$job1->id,'laborer_id'=>$laborer1->id,'cover_letter'=>'Experienced.','status'=>ApplicationStatus::PENDING]);
JobApplication::create(['job_id'=>$job2->id,'laborer_id'=>$laborer2->id,'cover_letter'=>'Prior experience.','status'=>ApplicationStatus::PENDING]);
ProductReview::create(['reviewer_id'=>$consumer1->id,'product_id'=>$product1->id,'farmer_id'=>$farmer1->id,'rating'=>5,'comment'=>'Excellent!']);
ProductReview::create(['reviewer_id'=>$consumer2->id,'product_id'=>$product3->id,'farmer_id'=>$farmer2->id,'rating'=>4,'comment'=>'Fresh mangoes.']);
$this->command->info('Seeded: 1 admin, 2 farmers, 2 laborers, 2 consumers, 1 rider, 2 farms, 4 products, 2 jobs, 2 applications, 2 reviews');
}}