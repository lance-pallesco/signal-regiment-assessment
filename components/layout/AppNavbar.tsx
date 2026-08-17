"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Radio, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; username: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const navLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Personnel Records",
      href: "/personnel",
      active: pathname.startsWith("/personnel"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Regiment Title */}
          <div className="flex items-center gap-3.5">
            <Link href="/dashboard" className="flex items-center gap-3">

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold tracking-tight text-foreground uppercase">
                    Signal Regiment
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground hidden sm:block">
                  Personnel Information Management System
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center ml-8 space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    link.active
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section: User & Logout */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <span className="text-xs font-semibold text-foreground">
                {user.name}
              </span>
            )}

            <div className="h-4 w-px bg-border" />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card p-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  link.active
                    ? "bg-emerald-800 text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {user && (
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <div className="text-xs">
                <p className="font-bold text-foreground">{user.name}</p>
                <p className="text-muted-foreground">{user.role}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                title="Logout"
                aria-label="Logout"
                className="h-8 w-8 text-rose-600 hover:bg-rose-50 border-border cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
