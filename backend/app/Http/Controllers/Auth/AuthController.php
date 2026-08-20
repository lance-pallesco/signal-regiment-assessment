<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * POST /api/auth/login
     * Authenticate the user and create session/token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $user = $this->authService->login($request);

        // Also create a Sanctum plain text token for token-based fallback
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Authenticated successfully.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * POST /api/auth/logout
     * Log the user out of the application.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request);

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * GET /api/auth/me
     * Get the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $this->authService->me($request);

        return response()->json([
            'user' => $user,
        ]);
    }
}
