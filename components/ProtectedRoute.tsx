"use client";

import React from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Show a loading state while AuthProvider is initializing
  if (loading) {
    return <div className="flex items-center justify-center h-screen"><ClipLoader color="#000000" loading={loading} size={50} /></div>;
  }

  // Redirect if the user is not authenticated or does not have the required role
  if (!user || !allowedRoles.includes(user.role)) {
    console.log("Redirecting to login due to missing or unauthorized role");
    router.push("/auth/login");
    return null;
  }

  // Render the protected content if the user is authenticated and has the correct role
  return <>{children}</>;
};

export default ProtectedRoute;
