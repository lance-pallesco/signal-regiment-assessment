import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import {
  Shield,
  LayoutDashboard,
  Users,
  UserPlus,
  LogOut,
  Menu,
  ChevronDown,
  Radio,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out', {
      description: 'You have been safely signed out.',
    });
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/personnel', label: 'Personnel Directory', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#064e3b] text-white shadow-sm transition-transform group-hover:scale-105">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg leading-none">
                  Signal Regiment
                </span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                  PIMS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Personnel Management System</p>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center ml-8 gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-[#064e3b] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: Action & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Add Button */}
          <NavLink to="/personnel/create" className="hidden sm:inline-flex">
            <Button className="bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-semibold h-9 px-3.5 rounded-lg shadow-sm gap-1.5">
              <UserPlus className="h-3.5 w-3.5" />
              <span>Enlist Personnel</span>
            </Button>
          </NavLink>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1.5 sm:px-2.5 text-left text-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {user?.name || 'Administrator'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {user?.email || 'admin@signal.mil'}
                  </div>
                </div>
                <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 shadow-xl rounded-xl p-1.5">
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-bold text-slate-900">{user?.name || 'Administrator'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@signal.mil'}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
                    <Shield className="h-3 w-3 text-emerald-600" /> System Administrator
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-700 text-xs rounded-lg p-2 font-medium"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Sheet */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200">
                  <Menu className="h-4 w-4 text-slate-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-white p-6 border-slate-200">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="flex items-center gap-2 text-slate-900">
                    <Radio className="h-5 w-5 text-[#064e3b]" />
                    Signal Regiment
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                          isActive
                            ? 'bg-slate-100 text-[#064e3b] font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`
                      }
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </NavLink>
                  ))}
                  <NavLink
                    to="/personnel/create"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2"
                  >
                    <Button className="w-full bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-semibold gap-1.5 h-10">
                      <UserPlus className="h-4 w-4" />
                      Enlist Personnel
                    </Button>
                  </NavLink>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
