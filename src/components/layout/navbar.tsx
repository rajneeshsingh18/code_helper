"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Code2, BookOpen, LayoutDashboard, User, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Code2 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">CodePrep</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/problems"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Problems
            </Link>
            <Link
              href="/sheets"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Sheets
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
            <Link
              href="/admin"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Admin
            </Link>
          </nav>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-accent-foreground h-8 w-8">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link href="/problems" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Problems
                </div>
              </Link>
              <Link href="/sheets" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Sheets
                </div>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dashboard
                </div>
              </Link>
              <Link href="/admin" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Admin
                </div>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}