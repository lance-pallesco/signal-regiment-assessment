import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield } from 'lucide-react';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="h-14 w-14 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <Shield className="absolute h-6 w-6 text-emerald-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold tracking-wider text-emerald-400 uppercase">
              Signal Regiment
            </p>
            <p className="text-xs text-slate-400">Verifying Security Credentials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
