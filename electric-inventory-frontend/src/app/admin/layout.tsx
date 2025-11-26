"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check if token exists (only on client side)
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else {
      setHasToken(true);
    }
    setIsLoading(false);
  }, [router]);

  // Show loading while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If no token, don't render anything (will redirect)
  if (!hasToken) {
    return null;
  }

  return <>{children}</>;
}