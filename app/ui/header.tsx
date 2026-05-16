"use client";

import { LayoutGrid, Database, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

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

  // Hide header on public form pages
  if (isPublicForm) {
    return <></>;
  }

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h1 className="text-xl font-bold">TinyForm</h1>
        </Link>

        <nav className="flex gap-2 items-center">
          <Link href="/builder">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isBuilder
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Form Builder
            </div>
          </Link>

          <Link href="/dashboard">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDashboard
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
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
    </header>
  );
}
