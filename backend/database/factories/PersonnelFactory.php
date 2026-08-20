<?php

namespace Database\Factories;

use App\Models\Personnel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Personnel>
 */
class PersonnelFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Personnel>
     */
    protected $model = Personnel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['Male', 'Female']);
        $firstName = $gender === 'Male' ? fake()->firstNameMale() : fake()->firstNameFemale();
        $lastName = fake()->lastName();
        $ranks = [
            'PVT', 'PFC', 'CPL', 'SGT', 'SSG', 'SFC', 'MSG', 'SGM',
            '2LT', '1LT', 'CPT', 'MAJ', 'LTC', 'COL', 'BG', 'MG',
        ];
        $units = [
            'Signal Company Alpha',
            'Signal Company Bravo',
            'Signal Company Charlie',
            'Signal Battalion HQ',
            '1st Signal Brigade',
            'Cyber Defense Squadron',
            'Electronic Warfare Battalion',
            'Satellite Communications Unit',
        ];
        $positions = [
            'Communications NCO',
            'Radio Operator',
            'Platoon Sergeant',
            'Network Systems Specialist',
            'Cyber Security Specialist',
            'Signal Staff Officer',
            'Field Radio Technician',
            'Satellite Systems Engineer',
            'Transmission Team Leader',
            'Command & Control Technician',
        ];

        $enlistmentYear = fake()->numberBetween(2010, 2024);
        $enlistmentMonth = fake()->numberBetween(1, 12);
        $enlistmentDay = fake()->numberBetween(1, 28);
        $enlistmentDate = sprintf('%04d-%02d-%02d', $enlistmentYear, $enlistmentMonth, $enlistmentDay);

        $birthYear = fake()->numberBetween(1975, 2003);
        $birthMonth = fake()->numberBetween(1, 12);
        $birthDay = fake()->numberBetween(1, 28);
        $birthDate = sprintf('%04d-%02d-%02d', $birthYear, $birthMonth, $birthDay);

        $serialSuffix = fake()->unique()->numberBetween(1000, 9999);

        return [
            'serial_number' => "SIG-{$enlistmentYear}-{$serialSuffix}",
            'first_name' => $firstName,
            'last_name' => $lastName,
            'rank' => fake()->randomElement($ranks),
            'birthday' => $birthDate,
            'gender' => $gender,
            'civil_status' => fake()->randomElement(['Single', 'Married', 'Widowed', 'Separated', 'Divorced']),
            'phone' => '09' . fake()->numerify('#########'),
            'email' => strtolower($firstName[0] . $lastName . '@signal.mil'),
            'address' => fake()->streetAddress() . ', ' . fake()->city(),
            'unit' => fake()->randomElement($units),
            'position' => fake()->randomElement($positions),
            'date_of_enlistment' => $enlistmentDate,
            'status' => fake()->randomElement(['Active', 'Active', 'Active', 'Reserve', 'AWOL', 'Retired']),
            'photo_path' => null,
        ];
    }

    /**
     * State for Active personnel.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Active',
        ]);
    }

    /**
     * State for Officer personnel.
     */
    public function officer(): static
    {
        return $this->state(fn (array $attributes) => [
            'rank' => fake()->randomElement(['2LT', '1LT', 'CPT', 'MAJ', 'LTC', 'COL']),
        ]);
    }
}
