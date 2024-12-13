"use client";

import React from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

interface ProtectedRouteProps {
  allowedRoles: string[];
  allowedFlow?: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, allowedFlow, children }) => {
  
  const { user, loading, flowState } = useAuth();
  const router = useRouter();


  if (loading) {
    return <div className="flex items-center justify-center h-screen"><ClipLoader color="#000000" loading={loading} size={50} /></div>;
  }


  if (!user || !allowedRoles.includes(user.role)) {
    console.log("Redirecting to login due to missing or unauthorized role");
    router.push("/not-found");
    return null;
  }

  if (allowedFlow && flowState !== allowedFlow) {

    console.log("Not the allowed Flow");

    router.push('/not-found');

  }

  return <>{children}</>;
};

export default ProtectedRoute;
