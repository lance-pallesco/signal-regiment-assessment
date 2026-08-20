<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('personnel', function (Blueprint $table) {
            $table->id();

            // Identity
            $table->string('serial_number', 50)->unique();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('rank', 50);

            // Personal Info
            $table->date('birthday');
            $table->string('gender', 20);
            $table->string('civil_status', 30);

            // Contact
            $table->string('phone', 30);
            $table->string('email', 150)->nullable();
            $table->text('address');

            // Military Assignment
            $table->string('unit', 150);          // Unit / Battalion
            $table->string('position', 150);      // Position / Designation
            $table->date('date_of_enlistment');

            // Status & Photo
            $table->string('status', 20)->default('Active')->index();
            $table->string('photo_path')->nullable();

            $table->timestamps();

            // Composite indexes for filtered listing and search queries
            $table->index(['status', 'rank', 'unit']);
            $table->index(['last_name', 'first_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnel');
    }
};
