import { LayoutGrid, Database, LogOut } from 'lucide-react';

export default function Header() {
    const isAuthenticated = true; // Placeholder for actual auth state
    const isBuilder = true; // Placeholder for current page state
    const isSubmissions = false; // Placeholder for current page state

    return (
        <div className="h-screen flex flex-col">
            <header className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <h1 className="text-xl font-bold">TinyForm</h1>
                    </div>

                    <nav className="flex gap-2 items-center">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isBuilder
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Form Builder
                        </button>
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSubmissions
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Database className="w-4 h-4" />
                            Submissions
                        </button>

                        {isAuthenticated && (
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ml-2"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1 overflow-hidden">
            </main>
        </div>
    );
}