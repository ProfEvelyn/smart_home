"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Bell, Save } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import ProtectedRoute from "../context/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { updateNotificationSettings } = useNotifications();

  const {user} = useAuth();
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    emailNotifications: false,
  thresholds: {
    temperature: { warning: 39, danger: 40, enabled: true },
    humidity: { warning: 69, danger: 70, enabled: true },
    // pressure: { warning: 1020, danger: 1040, enabled: true },
    mq2: { warning: 2000, danger: 1500, enabled: true },
    mq7: { warning: 1500, danger: 700, enabled: true },
    mq135: { warning: 1500, danger: 700, enabled: true },
  },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    console.log("Auth user:", user);
    const savedSettings = localStorage.getItem("notificationSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      localStorage.setItem("notificationSettings", JSON.stringify(settings));
      await updateNotificationSettings(settings);
      setSaveMessage("Settings saved successfully!");
    } catch (error) {
      setSaveMessage("Error saving settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleThresholdChange = (sensor, type, value) => {
    setSettings((prev) => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [sensor]: {
          ...prev.thresholds[sensor],
          [type]: Number(value),
        },
      },
    }));
  };

  const handleToggleSensor = (sensor) => {
    setSettings((prev) => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [sensor]: {
          ...prev.thresholds[sensor],
          enabled: !prev.thresholds[sensor].enabled,
        },
      },
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <ProtectedRoute>
      <DashboardHeader />
      <main className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-[#CFD6FF] mb-2">
            Profile
          </h1>
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800 mb-4 sm:mb-6">
            <div className="mb-2">
              <span className="block text-gray-400 text-sm">Name</span>
              <span className="font-semibold text-base sm:text-lg">Evelyn</span>
            </div>
            <div>
              <span className="block text-gray-400 text-sm">Email</span>
              <span className="font-semibold text-base sm:text-lg">
                {user?.email || 'evelyn@example.com'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#CFD6FF]" />
            Notification Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm sm:text-base">
                  Push Notifications
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Receive notifications in the app
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      notificationsEnabled: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CFD6FF]" />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Sensor Thresholds
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(settings.thresholds).map(([sensor, values]) => (
              <div
                key={sensor}
                className="border-b border-gray-800 last:border-0 pb-4 sm:pb-6 last:pb-0"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-medium capitalize text-sm sm:text-base">
                    {sensor}
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={values.enabled}
                      onChange={() => handleToggleSensor(sensor)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CFD6FF]" />
                  </label>
                </div>
                {values.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1">
                        Warning Threshold
                      </label>
                      <input
                        type="number"
                        value={values.warning}
                        onChange={(e) =>
                          handleThresholdChange(
                            sensor,
                            "warning",
                            e.target.value
                          )
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-[#CFD6FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1">
                        Danger Threshold
                      </label>
                      <input
                        type="number"
                        value={values.danger}
                        onChange={(e) =>
                          handleThresholdChange(
                            sensor,
                            "danger",
                            e.target.value
                          )
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-[#CFD6FF]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#CFD6FF] text-black px-4 py-2 rounded-md hover:bg-opacity-90 transition disabled:opacity-50 text-sm sm:text-base"
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          {saveMessage && (
            <span
              className={`text-xs sm:text-sm ${
                saveMessage.includes("Error")
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {saveMessage}
            </span>
          )}
        </div>
      </main>
      </ProtectedRoute>

    </div>
  );
};

export default ProfilePage;
