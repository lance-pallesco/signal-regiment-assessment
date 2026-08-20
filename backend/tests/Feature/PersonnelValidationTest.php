<?php

namespace Tests\Feature;

use App\Models\Personnel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class PersonnelValidationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_validates_unique_serial_number_when_creating_personnel(): void
    {
        Personnel::factory()->create(['serial_number' => 'SIG-2024-100']);

        $response = $this->actingAs($this->user)->postJson('/api/personnel', [
            'serial_number'      => 'SIG-2024-100',
            'first_name'         => 'Test',
            'last_name'          => 'User',
            'rank'               => 'PVT',
            'birthday'           => '1998-01-01',
            'gender'             => 'Male',
            'civil_status'       => 'Single',
            'phone'              => '09123456789',
            'address'            => 'Camp Aguinaldo',
            'unit'               => 'Signal Company Alpha',
            'position'           => 'Radio Operator',
            'date_of_enlistment' => '2021-01-01',
            'status'             => 'Active',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['serial_number']);
    }

    public function test_validates_mandatory_personnel_fields(): void
    {
        $response = $this->actingAs($this->user)->postJson('/api/personnel', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'serial_number',
                'first_name',
                'last_name',
                'rank',
                'birthday',
                'gender',
                'civil_status',
                'phone',
                'address',
                'unit',
                'position',
                'date_of_enlistment',
                'status',
            ]);
    }

    public function test_validates_valid_military_rank_enum(): void
    {
        $response = $this->actingAs($this->user)->postJson('/api/personnel', [
            'serial_number'      => 'SIG-2024-101',
            'first_name'         => 'Test',
            'last_name'          => 'User',
            'rank'               => 'COMMANDER_IN_CHIEF', // Invalid rank
            'birthday'           => '1998-01-01',
            'gender'             => 'Male',
            'civil_status'       => 'Single',
            'phone'              => '09123456789',
            'address'            => 'Camp Aguinaldo',
            'unit'               => 'Signal Company Alpha',
            'position'           => 'Radio Operator',
            'date_of_enlistment' => '2021-01-01',
            'status'             => 'Active',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['rank']);
    }

    public function test_validates_birthday_must_be_a_date_before_today(): void
    {
        $response = $this->actingAs($this->user)->postJson('/api/personnel', [
            'serial_number'      => 'SIG-2024-102',
            'first_name'         => 'Test',
            'last_name'          => 'User',
            'rank'               => 'PVT',
            'birthday'           => now()->addDay()->toDateString(), // Future date
            'gender'             => 'Male',
            'civil_status'       => 'Single',
            'phone'              => '09123456789',
            'address'            => 'Camp Aguinaldo',
            'unit'               => 'Signal Company Alpha',
            'position'           => 'Radio Operator',
            'date_of_enlistment' => '2021-01-01',
            'status'             => 'Active',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['birthday']);
    }

    public function test_validates_photo_mime_type_and_maximum_size(): void
    {
        $textDoc = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');

        $response = $this->actingAs($this->user)->postJson('/api/personnel', [
            'serial_number'      => 'SIG-2024-103',
            'first_name'         => 'Test',
            'last_name'          => 'User',
            'rank'               => 'PVT',
            'birthday'           => '1998-01-01',
            'gender'             => 'Male',
            'civil_status'       => 'Single',
            'phone'              => '09123456789',
            'address'            => 'Camp Aguinaldo',
            'unit'               => 'Signal Company Alpha',
            'position'           => 'Radio Operator',
            'date_of_enlistment' => '2021-01-01',
            'status'             => 'Active',
            'photo'              => $textDoc,
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['photo']);
    }
}
