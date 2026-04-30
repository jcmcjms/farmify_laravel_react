<?php
namespace Database\Factories;
use App\Enums\ApplicationStatus;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
class JobApplicationFactory extends Factory
{
    protected $model = JobApplication::class;
    public function definition(): array
    {
        return [
            'cover_letter' => fake()->paragraph(),
            'status' => ApplicationStatus::PENDING,
        ];
    }
    public function pending(): static { return $this->state(fn(array $a) => ['status' => ApplicationStatus::PENDING]); }
    public function accepted(): static { return $this->state(fn(array $a) => ['status' => ApplicationStatus::ACCEPTED]); }
    public function rejected(): static { return $this->state(fn(array $a) => ['status' => ApplicationStatus::REJECTED]); }
    public function forJob(Job $job): static { return $this->state(fn(array $a) => ['job_id' => $job->id]); }
    public function forLaborer(User $user): static { return $this->state(fn(array $a) => ['laborer_id' => $user->id]); }
}