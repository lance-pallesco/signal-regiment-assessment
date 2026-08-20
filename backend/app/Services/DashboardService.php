<?php

namespace App\Services;

use App\Models\Personnel;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Get summary metric counts.
     *
     * @return array<string, int>
     */
    public function getMetrics(): array
    {
        return [
            'total'    => Personnel::count(),
            'active'   => Personnel::where('status', 'Active')->count(),
            'reserve'  => Personnel::where('status', 'Reserve')->count(),
            'awol'     => Personnel::where('status', 'AWOL')->count(),
            'retired'  => Personnel::where('status', 'Retired')->count(),
        ];
    }

    /**
     * Get rank distribution for bar chart.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getRankDistribution(): array
    {
        return Personnel::select('rank', DB::raw('count(*) as count'))
            ->groupBy('rank')
            ->orderByDesc('count')
            ->get()
            ->toArray();
    }

    /**
     * Get status breakdown for pie/donut chart.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getStatusBreakdown(): array
    {
        return Personnel::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->toArray();
    }

    /**
     * Get enlistment trends by year for line/area chart.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getEnlistmentTrends(): array
    {
        $isPgsql = DB::connection()->getDriverName() === 'pgsql';
        $yearExpression = $isPgsql
            ? "EXTRACT(YEAR FROM date_of_enlistment)::integer as year"
            : "strftime('%Y', date_of_enlistment) as year";

        return Personnel::select(
                DB::raw($yearExpression),
                DB::raw('count(*) as count')
            )
            ->groupBy('year')
            ->orderBy('year')
            ->get()
            ->toArray();
    }

    /**
     * Get gender and civil status distribution.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getGenderCivilStatus(): array
    {
        return Personnel::select('gender', 'civil_status', DB::raw('count(*) as count'))
            ->groupBy('gender', 'civil_status')
            ->get()
            ->toArray();
    }
}
