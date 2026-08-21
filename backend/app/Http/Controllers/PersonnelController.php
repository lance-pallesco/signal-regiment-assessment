<?php

namespace App\Http\Controllers;

use App\Http\Requests\Personnel\StorePersonnelRequest;
use App\Http\Requests\Personnel\UpdatePersonnelRequest;
use App\Models\Personnel;
use App\Services\PersonnelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PersonnelController extends Controller
{
    public function __construct(
        private PersonnelService $personnelService
    ) {}

    /**
     * GET /api/personnel/next-serial
     * Expose the next auto-generated military serial number.
     */
    public function nextSerialNumber(): JsonResponse
    {
        return response()->json([
            'serial_number' => Personnel::generateSerialNumber(),
        ]);
    }

    /**
     * GET /api/personnel
     * List all personnel with filters, search, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status', 'rank', 'unit']);
        $perPage = $request->integer('per_page', 15);

        $personnel = $this->personnelService->list($filters, $perPage);

        return response()->json($personnel);
    }

    /**
     * POST /api/personnel
     * Create a new personnel record.
     */
    public function store(StorePersonnelRequest $request): JsonResponse
    {
        $personnel = $this->personnelService->create(
            $request->validated(),
            $request->file('photo')
        );

        return response()->json([
            'message' => 'Personnel created successfully.',
            'data' => $personnel,
        ], 201);
    }

    /**
     * GET /api/personnel/{personnel}
     * Show a single personnel record.
     */
    public function show(Personnel $personnel): JsonResponse
    {
        return response()->json([
            'data' => $personnel,
        ]);
    }

    /**
     * PUT|PATCH /api/personnel/{personnel}
     * Update a personnel record.
     */
    public function update(UpdatePersonnelRequest $request, Personnel $personnel): JsonResponse
    {
        $updated = $this->personnelService->update(
            $personnel,
            $request->validated(),
            $request->file('photo')
        );

        return response()->json([
            'message' => 'Personnel updated successfully.',
            'data' => $updated,
        ]);
    }

    /**
     * DELETE /api/personnel/{personnel}
     * Delete a personnel record.
     */
    public function destroy(Personnel $personnel): JsonResponse
    {
        $this->personnelService->delete($personnel);

        return response()->json([
            'message' => 'Personnel deleted successfully.',
        ]);
    }
}
