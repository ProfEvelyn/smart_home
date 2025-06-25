"use client";

import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useNotifications } from "@/context/NotificationContext";
import ProtectedRoute from "../context/ProtectedRoute";
import { getAuth } from "firebase/auth";

const NotificationPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const auth = getAuth();

  const unreadnotifications = notifications.filter((n) => !n.read);

  console.log("Unread Notifications:", unreadnotifications);
  const getIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <ProtectedRoute>
        <DashboardHeader />
        <main className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-[#CFD6FF]" />
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-[#CFD6FF] hover:text-white transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="space-y-4">
            {unreadnotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No notifications yet
              </div>
            ) : (
              unreadnotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 rounded-lg border cursor-pointer ${
                    notification.read
                      ? "border-gray-700 bg-gray-800/50"
                      : "border-[#CFD6FF] bg-gray-800"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">
                          {notification.title}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-300">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </ProtectedRoute>
    </div>
  );
};

export default NotificationPage;
