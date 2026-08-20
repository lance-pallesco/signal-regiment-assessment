<?php

namespace App\Models;

use Database\Factories\PersonnelFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class Personnel extends Model
{
    /** @use HasFactory<PersonnelFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'personnel';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'serial_number',
        'first_name',
        'last_name',
        'rank',
        'birthday',
        'gender',
        'civil_status',
        'phone',
        'email',
        'address',
        'unit',
        'position',
        'date_of_enlistment',
        'status',
        'photo_path',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'full_name',
        'photo_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birthday' => 'date:Y-m-d',
            'date_of_enlistment' => 'date:Y-m-d',
        ];
    }

    /**
     * Get the personnel's full name.
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->first_name} {$this->last_name}",
        );
    }

    /**
     * Get the full URL to the photo.
     */
    protected function photoUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->photo_path
                ? Storage::disk('public')->url($this->photo_path)
                : null,
        );
    }

    /**
     * Scope a query to only include active personnel.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'Active');
    }

    /**
     * Scope a query to filter by rank.
     */
    public function scopeByRank(Builder $query, ?string $rank): Builder
    {
        return $rank ? $query->where('rank', $rank) : $query;
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus(Builder $query, ?string $status): Builder
    {
        return $status ? $query->where('status', $status) : $query;
    }

    /**
     * Scope a query to filter by unit.
     */
    public function scopeByUnit(Builder $query, ?string $unit): Builder
    {
        return $unit ? $query->where('unit', $unit) : $query;
    }

    /**
     * Scope a query to search by name or serial number.
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        $operator = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return $query->where(function (Builder $q) use ($search, $operator) {
            $q->where('first_name', $operator, "%{$search}%")
              ->orWhere('last_name', $operator, "%{$search}%")
              ->orWhere('serial_number', $operator, "%{$search}%");
        });
    }
}
