<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    /**
     * Authenticate user session.
     */
    public function login(Request $request): User
    {
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        /** @var User $user */
        $user = Auth::user();

        return $user;
    }

    /**
     * Terminate user session and revoke tokens.
     */
    public function logout(Request $request): void
    {
        if ($user = $request->user()) {
            $user->tokens()->delete();
        }

        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request): ?User
    {
        return $request->user();
    }
}
