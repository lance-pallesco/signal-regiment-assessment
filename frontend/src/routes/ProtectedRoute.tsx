import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield } from 'lucide-react';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="flex h-screen w-full items-center justify-center"
        style={{
          backgroundColor: '#f8fafc',
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      >
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl shadow-slate-200/60 max-w-xs w-full text-center">
          <div className="relative flex items-center justify-center">
            <div className="h-14 w-14 animate-spin rounded-full border-3 border-[#064e3b] border-t-transparent" />
            <Shield className="absolute h-6 w-6 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
              Signal Regiment
            </p>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Verifying Security Session...
            </p>
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
