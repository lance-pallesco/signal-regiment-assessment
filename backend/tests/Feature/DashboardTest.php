<?php

namespace Tests\Feature;

use App\Models\Personnel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_returns_accurate_metric_summary_counts_for_executive_dashboard(): void
    {
        Personnel::factory()->count(4)->create(['status' => 'Active']);
        Personnel::factory()->count(3)->create(['status' => 'Reserve']);
        Personnel::factory()->count(2)->create(['status' => 'AWOL']);
        Personnel::factory()->count(1)->create(['status' => 'Retired']);

        $response = $this->actingAs($this->user)->getJson('/api/dashboard/metrics');

        $response->assertOk()
            ->assertJsonPath('data.total', 10)
            ->assertJsonPath('data.active', 4)
            ->assertJsonPath('data.reserve', 3)
            ->assertJsonPath('data.awol', 2)
            ->assertJsonPath('data.retired', 1);
    }

    public function test_returns_all_chart_analytics_data_sets(): void
    {
        Personnel::factory()->count(5)->create();

        $response = $this->actingAs($this->user)->getJson('/api/dashboard/charts');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'rank_distribution',
                    'status_breakdown',
                    'enlistment_trends',
                    'gender_civil_status',
                ],
            ]);
    }

    public function test_unauthenticated_request_to_dashboard_analytics_is_rejected(): void
    {
        $response = $this->getJson('/api/dashboard/metrics');

        $response->assertUnauthorized();
    }
}
