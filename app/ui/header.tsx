'use client';

import { LayoutGrid, Database } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();

    const isBuilder = pathname === '/' || pathname === '/builder';
    const isDashboard = pathname === '/dashboard';
    const isPublicForm = pathname.startsWith('/f/');

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
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isBuilder
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Form Builder
                        </div>
                    </Link>
                    <Link href="/dashboard">
                        <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDashboard
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Database className="w-4 h-4" />
                            Dashboard
                        </div>
                    </Link>
                </nav>
            </div>
        </header>
    );
}