<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    /**
     * GET /api/dashboard/metrics
     * Returns summary counts for metric cards.
     */
    public function metrics(): JsonResponse
    {
        return response()->json([
            'data' => $this->dashboardService->getMetrics(),
        ]);
    }

    /**
     * GET /api/dashboard/charts
     * Returns all chart data sets for the analytics dashboard.
     */
    public function charts(): JsonResponse
    {
        return response()->json([
            'data' => [
                'rank_distribution'    => $this->dashboardService->getRankDistribution(),
                'status_breakdown'     => $this->dashboardService->getStatusBreakdown(),
                'enlistment_trends'    => $this->dashboardService->getEnlistmentTrends(),
                'gender_civil_status'  => $this->dashboardService->getGenderCivilStatus(),
            ],
        ]);
    }
}
