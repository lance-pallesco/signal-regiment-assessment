import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased">
      <Topbar />
      <main className="flex-1 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
