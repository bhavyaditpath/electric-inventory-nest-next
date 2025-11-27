"use client";

import { useState, ReactNode, ComponentType } from "react";
import RoleProtectedRoute from "./RoleProtectedRoute";
import { UserRole } from "../types/enums";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface LayoutWrapperProps {
  children: ReactNode;
  requiredRole: UserRole;
  SidebarComponent: ComponentType<SidebarProps>;
}

export default function LayoutWrapper({
  children,
  requiredRole,
  SidebarComponent
}: LayoutWrapperProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <RoleProtectedRoute requiredRole={requiredRole}>
      <div className="flex min-h-screen bg-gray-100">
        <SidebarComponent
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
    </RoleProtectedRoute>
  );
}