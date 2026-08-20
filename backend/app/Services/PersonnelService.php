<?php

namespace App\Services;

use App\Models\Personnel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PersonnelService
{
    /**
     * Get paginated, filtered personnel list.
     *
     * @param array<string, mixed> $filters
     */
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $operator = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return Personnel::query()
            ->when(! empty($filters['search']), function ($q) use ($filters, $operator) {
                $search = $filters['search'];
                $q->where(function ($query) use ($search, $operator) {
                    $query->where('first_name', $operator, "%{$search}%")
                          ->orWhere('last_name', $operator, "%{$search}%")
                          ->orWhere('serial_number', $operator, "%{$search}%");
                });
            })
            ->when(! empty($filters['status']), fn ($q) => $q->where('status', $filters['status']))
            ->when(! empty($filters['rank']), fn ($q) => $q->where('rank', $filters['rank']))
            ->when(! empty($filters['unit']), fn ($q) => $q->where('unit', $filters['unit']))
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
