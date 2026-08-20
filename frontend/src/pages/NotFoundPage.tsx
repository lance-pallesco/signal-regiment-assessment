import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100 p-4">
      <h1 className="text-6xl font-black text-emerald-500">404</h1>
      <p className="mt-2 text-lg text-slate-400">Tactical Sector Not Found</p>
      <Link to="/dashboard" className="mt-6">
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Return to Command Center</Button>
      </Link>
    </div>
  );
}
