<?php

namespace App\Services;

use App\Models\Personnel;

class DashboardService
{
    /**
     * Get summary metric counts using Eloquent scopes and model counts.
     *
     * @return array<string, int>
     */
    public function getMetrics(): array
    {
        return [
            'total'    => Personnel::count(),
            'active'   => Personnel::active()->count(),
            'reserve'  => Personnel::byStatus('Reserve')->count(),
            'awol'     => Personnel::byStatus('AWOL')->count(),
            'retired'  => Personnel::byStatus('Retired')->count(),
        ];
    }

    /**
     * Get rank distribution for bar chart using Eloquent collection aggregation.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getRankDistribution(): array
    {
        return Personnel::all()
            ->groupBy('rank')
            ->map(fn ($group, $rank) => [
                'rank'  => (string) $rank,
                'count' => $group->count(),
            ])
            ->sortByDesc('count')
            ->values()
            ->toArray();
    }

    /**
     * Get status breakdown for pie/donut chart using Eloquent collection aggregation.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getStatusBreakdown(): array
    {
        return Personnel::all()
            ->groupBy('status')
            ->map(fn ($group, $status) => [
                'status' => (string) $status,
                'count'  => $group->count(),
            ])
            ->values()
            ->toArray();
    }

    /**
     * Get enlistment trends by year using Eloquent date casting and collection grouping.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getEnlistmentTrends(): array
    {
        return Personnel::all()
            ->groupBy(fn (Personnel $personnel) => (string) $personnel->date_of_enlistment->format('Y'))
            ->map(fn ($group, $year) => [
                'year'  => (int) $year,
                'count' => $group->count(),
            ])
            ->sortKeys()
            ->values()
            ->toArray();
    }

    /**
     * Get gender and civil status distribution using Eloquent collection aggregation.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getGenderCivilStatus(): array
    {
        return Personnel::all()
            ->groupBy(fn (Personnel $personnel) => "{$personnel->gender}_{$personnel->civil_status}")
            ->map(fn ($group) => [
                'gender'       => $group->first()->gender,
                'civil_status' => $group->first()->civil_status,
                'count'        => $group->count(),
            ])
            ->values()
            ->toArray();
    }
}
