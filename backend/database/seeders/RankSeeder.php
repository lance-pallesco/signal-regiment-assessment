<?php

namespace Database\Seeders;

use App\Models\Rank;
use Illuminate\Database\Seeder;

class RankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ranks = [
            // Enlisted Personnel (Junior)
            ['code' => 'PVT', 'name' => 'Private', 'category' => 'Enlisted Personnel', 'order' => 1],
            ['code' => 'PFC', 'name' => 'Private First Class', 'category' => 'Enlisted Personnel', 'order' => 2],
            ['code' => 'CPL', 'name' => 'Corporal', 'category' => 'Junior Non-Commissioned Officer', 'order' => 3],
            ['code' => 'SGT', 'name' => 'Sergeant', 'category' => 'Non-Commissioned Officer', 'order' => 4],
            ['code' => 'SSG', 'name' => 'Staff Sergeant', 'category' => 'Senior Non-Commissioned Officer', 'order' => 5],
            ['code' => 'SFC', 'name' => 'Sergeant First Class', 'category' => 'Senior Non-Commissioned Officer', 'order' => 6],
            ['code' => 'MSG', 'name' => 'Master Sergeant', 'category' => 'Senior Non-Commissioned Officer', 'order' => 7],
            ['code' => 'SGM', 'name' => 'Sergeant Major', 'category' => 'Principal Non-Commissioned Officer', 'order' => 8],

            // Commissioned Officers
            ['code' => '2LT', 'name' => 'Second Lieutenant', 'category' => 'Company Grade Officer', 'order' => 9],
            ['code' => '1LT', 'name' => 'First Lieutenant', 'category' => 'Company Grade Officer', 'order' => 10],
            ['code' => 'CPT', 'name' => 'Captain', 'category' => 'Company Grade Officer', 'order' => 11],
            ['code' => 'MAJ', 'name' => 'Major', 'category' => 'Field Grade Officer', 'order' => 12],
            ['code' => 'LTC', 'name' => 'Lieutenant Colonel', 'category' => 'Field Grade Officer', 'order' => 13],
            ['code' => 'COL', 'name' => 'Colonel', 'category' => 'Field Grade Officer', 'order' => 14],
            ['code' => 'BG',  'name' => 'Brigadier General', 'category' => 'General Officer', 'order' => 15],
            ['code' => 'MG',  'name' => 'Major General', 'category' => 'General Officer', 'order' => 16],
        ];

        foreach ($ranks as $rank) {
            Rank::updateOrCreate(
                ['code' => $rank['code']],
                $rank
            );
        }
    }
}
