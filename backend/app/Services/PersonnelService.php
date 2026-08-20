<?php

namespace App\Services;

use App\Models\Personnel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PersonnelService
{
    /**
     * Get paginated, filtered personnel list using Eloquent model scopes.
     *
     * @param array<string, mixed> $filters
     */
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Personnel::query()
            ->search($filters['search'] ?? null)
            ->byStatus($filters['status'] ?? null)
            ->byRank($filters['rank'] ?? null)
            ->byUnit($filters['unit'] ?? null)
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create a new personnel record with optional photo.
     *
     * @param array<string, mixed> $data
     */
    public function create(array $data, ?UploadedFile $photo = null): Personnel
    {
        if ($photo) {
            $data['photo_path'] = $photo->store('photos', 'public');
        }

        return Personnel::create($data);
    }

    /**
     * Update an existing personnel record.
     *
     * @param array<string, mixed> $data
     */
    public function update(Personnel $personnel, array $data, ?UploadedFile $photo = null): Personnel
    {
        if ($photo) {
            if ($personnel->photo_path && Storage::disk('public')->exists($personnel->photo_path)) {
                Storage::disk('public')->delete($personnel->photo_path);
            }
            $data['photo_path'] = $photo->store('photos', 'public');
        }

        $personnel->update($data);

        return $personnel->fresh();
    }

    /**
     * Delete a personnel record and its photo.
     */
    public function delete(Personnel $personnel): void
    {
        if ($personnel->photo_path && Storage::disk('public')->exists($personnel->photo_path)) {
            Storage::disk('public')->delete($personnel->photo_path);
        }

        $personnel->delete();
    }
}
