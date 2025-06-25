"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";
import { auth } from "@/firebase/config";
import { useNotifications } from "@/context/NotificationContext";
import { signOut, onAuthStateChanged } from "firebase/auth";

const DashboardHeader = () => {
  const router = useRouter();
  const { unreadCount } = useNotifications();

  const handleSignOut = async () => {
    try {
      await signOut(auth);

      // Wait for auth state to update before redirecting
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.replace("/");
          unsubscribe(); // Stop listening once we've redirected
        }
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };
  const handleNotificationsClick = () => {
    router.push("/notifications");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <header className="border-b border-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button onClick={goToDashboard} className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#CFD6FF] to-purple-300 text-transparent bg-clip-text text-xl sm:text-2xl font-bold">
              HomePulse
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleNotificationsClick}
            className="relative p-2 text-gray-300 hover:text-[#CFD6FF] transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleSignOut()}
            className="hidden sm:flex items-center gap-1 text-gray-300 border border-gray-700 px-3 py-2 rounded-md hover:bg-gray-800 transition"
          >
            <ArrowLeft size={16} />
            Logout
          </button>

          <button
            onClick={handleSignOut}
            className="sm:hidden p-2 text-gray-300 hover:text-[#CFD6FF] transition-colors"
            title="Logout"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-full bg-[#CFD6FF] text-black flex items-center justify-center font-medium">
              E
            </div>
            <span className="text-gray-300 hidden sm:inline">Evelyn</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
