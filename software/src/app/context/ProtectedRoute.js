"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page if not authenticated
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-[#CFD6FF] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-t-transparent border-r-[#CFD6FF] border-b-transparent border-l-transparent rounded-full animate-spin-reverse"></div>
        </div>
      </div>
    );
  }

  return children;
}