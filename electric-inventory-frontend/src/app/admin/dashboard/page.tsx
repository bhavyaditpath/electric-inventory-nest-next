"use client";

import { useRouter } from "next/navigation";
import { tokenManager } from "../../../lib/api";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    tokenManager.removeToken();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, User</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Electric Inventory Dashboard
              </h2>
              <p className="text-gray-600">
                Welcome to the Electric Inventory Management System.
                This dashboard will show inventory statistics, branch information, and user management tools.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}