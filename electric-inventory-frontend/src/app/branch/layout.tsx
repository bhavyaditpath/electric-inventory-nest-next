"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenManager } from "../../lib/api";
import BranchSidebar from "../../components/BranchSidebar";

export default function BranchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check if token exists and user has branch role (only on client side)
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else {
      const userRole = tokenManager.getUserRole();
      if (userRole === 'BRANCH') {
        setHasToken(true);
      } else {
        // User doesn't have branch role, redirect to appropriate dashboard or login
        if (userRole === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/auth/login');
        }
      }
    }
    setIsLoading(false);
  }, [router]);

  // Show loading while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If no token, don't render anything (will redirect)
  if (!hasToken) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <BranchSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}