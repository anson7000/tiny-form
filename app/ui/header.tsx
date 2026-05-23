"use client";

import { LayoutGrid, Database, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isBuilder = pathname === "/builder";
  const isDashboard = pathname.startsWith("/dashboard");
  const isPublicForm = pathname.startsWith("/form");

  const handleLogout = async () => {
    const response = await fetch("/api/sessions", {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error("Logout failed");
      return;
    }
    router.refresh();
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Hide header on public form pages
  if (isPublicForm) {
    return <></>;
  }

  const navButtonClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100";
  const activeNavButtonClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-100 text-blue-700";

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h1 className="text-xl font-bold">TinyForm</h1>
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="sr-only">Toggle navigation</span>
        </button>

        <nav className="hidden gap-2 items-center md:flex">
          <Link href="/builder">
            <div
              className={isBuilder ? activeNavButtonClasses : navButtonClasses}
            >
              <LayoutGrid className="w-4 h-4" />
              Form Builder
            </div>
          </Link>

          <Link href="/dashboard">
            <div
              className={
                isDashboard ? activeNavButtonClasses : navButtonClasses
              }
            >
              <Database className="w-4 h-4" />
              Dashboard
            </div>
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ml-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </nav>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="mt-3 flex flex-col gap-2 md:hidden"
        >
          <Link href="/builder">
            <div
              className={isBuilder ? activeNavButtonClasses : navButtonClasses}
            >
              <LayoutGrid className="w-4 h-4" />
              Form Builder
            </div>
          </Link>

          <Link href="/dashboard">
            <div
              className={
                isDashboard ? activeNavButtonClasses : navButtonClasses
              }
            >
              <Database className="w-4 h-4" />
              Dashboard
            </div>
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
