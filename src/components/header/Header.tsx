import { Search, Filter, Star } from 'lucide-react';
import ClerkAccount from "../clerkAccount/ClerkAccount.tsx";

export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Star className="h-8 w-8 text-purple-600" />
                        <span className="ml-2 text-xl font-bold">ActorsList</span>
                    </div>

                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Search by name, specialty, or location..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </button>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
                            <ClerkAccount />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}