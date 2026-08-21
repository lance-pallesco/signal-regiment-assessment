<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RankTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_authenticated_user_can_fetch_all_military_ranks_ordered_by_seniority(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/ranks');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'code', 'name', 'category', 'order'],
                ],
            ]);

        $ranks = $response->json('data');
        $this->assertCount(16, $ranks);
        $this->assertEquals('PVT', $ranks[0]['code']);
        $this->assertEquals('MG', $ranks[15]['code']);
    }

    public function test_unauthenticated_request_to_ranks_is_rejected(): void
    {
        $response = $this->getJson('/api/ranks');

        $response->assertUnauthorized();
    }
}
