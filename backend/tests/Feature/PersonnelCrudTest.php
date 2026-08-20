<?php

namespace Tests\Feature;

use App\Models\Personnel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PersonnelCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_list_personnel_with_pagination(): void
    {
        Personnel::factory()->count(15)->create();

        $response = $this->actingAs($this->user)->getJson('/api/personnel');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'serial_number',
                        'first_name',
                        'last_name',
                        'rank',
                        'unit',
                        'position',
                        'status',
                    ],
                ],
                'current_page',
                'last_page',
                'per_page',
                'total',
            ]);
    }

    public function test_can_filter_personnel_by_status_rank_and_unit(): void
    {
        Personnel::factory()->create([
            'status' => 'Active',
            'rank'   => 'CPT',
            'unit'   => 'Signal Battalion HQ',
        ]);

        Personnel::factory()->create([
            'status' => 'Reserve',
            'rank'   => 'PVT',
            'unit'   => '1st Signal Brigade',
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/personnel?status=Active&rank=CPT&unit=Signal Battalion HQ');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.rank', 'CPT')
            ->assertJsonPath('data.0.status', 'Active');
    }

    public function test_can_search_personnel_by_first_name_last_name_or_serial_number(): void
    {
        Personnel::factory()->create([
            'first_name'    => 'Arthur',
            'last_name'     => 'Pendelton',
            'serial_number' => 'SIG-2024-999',
        ]);

        Personnel::factory()->create([
            'first_name'    => 'John',
            'last_name'     => 'Doe',
            'serial_number' => 'SIG-2024-111',
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/personnel?search=Pendelton');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.last_name', 'Pendelton');
    }

    public function test_can_enlist_new_personnel_with_valid_data_and_optional_photo(): void
    {
        Storage::fake('public');

        $photo = UploadedFile::fake()->image('soldier.jpg', 300, 300);

        $payload = [
            'serial_number'      => 'SIG-2024-001',
            'first_name'         => 'Maria',
            'last_name'          => 'Santos',
            'rank'               => '2LT',
            'birthday'           => '1995-06-15',
            'gender'             => 'Female',
            'civil_status'       => 'Single',
            'phone'              => '09171234567',
            'email'              => 'msantos@signal.mil',
            'address'            => 'Fort Bonifacio, Taguig City',
            'unit'               => 'Signal Company Alpha',
            'position'           => 'Platoon Leader',
            'date_of_enlistment' => '2020-01-10',
            'status'             => 'Active',
            'photo'              => $photo,
        ];

        $response = $this->actingAs($this->user)->postJson('/api/personnel', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.serial_number', 'SIG-2024-001')
            ->assertJsonPath('data.first_name', 'Maria')
            ->assertJsonPath('data.last_name', 'Santos');

        $this->assertDatabaseHas('personnel', [
            'serial_number' => 'SIG-2024-001',
            'email'         => 'msantos@signal.mil',
        ]);
    }

    public function test_can_view_a_specific_personnel_dossier(): void
    {
        $personnel = Personnel::factory()->create([
            'serial_number' => 'SIG-2018-042',
        ]);

        $response = $this->actingAs($this->user)->getJson("/api/personnel/{$personnel->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $personnel->id)
            ->assertJsonPath('data.serial_number', 'SIG-2018-042');
    }

    public function test_can_update_an_existing_personnel_record(): void
    {
        $personnel = Personnel::factory()->create([
            'rank'   => '2LT',
            'status' => 'Active',
        ]);

        $payload = array_merge($personnel->toArray(), [
            'rank'     => '1LT',
            'position' => 'Executive Officer',
            'status'   => 'Active',
        ]);

        $response = $this->actingAs($this->user)->putJson("/api/personnel/{$personnel->id}", $payload);

        $response->assertOk()
            ->assertJsonPath('data.rank', '1LT')
            ->assertJsonPath('data.position', 'Executive Officer');

        $this->assertDatabaseHas('personnel', [
            'id'       => $personnel->id,
            'rank'     => '1LT',
            'position' => 'Executive Officer',
        ]);
    }

    public function test_can_delete_a_personnel_record(): void
    {
        $personnel = Personnel::factory()->create();

        $response = $this->actingAs($this->user)->deleteJson("/api/personnel/{$personnel->id}");

        $response->assertOk()
            ->assertJson(['message' => 'Personnel deleted successfully.']);

        $this->assertDatabaseMissing('personnel', [
            'id' => $personnel->id,
        ]);
    }

    public function test_unauthenticated_request_to_personnel_endpoints_is_rejected(): void
    {
        $response = $this->getJson('/api/personnel');

        $response->assertUnauthorized();
    }
}
