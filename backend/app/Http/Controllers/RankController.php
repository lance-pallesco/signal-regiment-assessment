<?php

namespace App\Http\Controllers;

use App\Models\Rank;
use Illuminate\Http\JsonResponse;

class RankController extends Controller
{
    /**
     * GET /api/ranks
     * List all military ranks ordered by hierarchical seniority.
     */
    public function index(): JsonResponse
    {
        $ranks = Rank::orderBy('order', 'asc')->get();

        return response()->json([
            'data' => $ranks,
        ]);
    }
}
