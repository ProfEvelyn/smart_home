"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { database } from "@/firebase/config";
import { ref, onValue, push, get, update, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const NotificationContext = createContext();

const DEFAULT_SETTINGS = {
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
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [userId, setUserId] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem("notificationSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const userNotificationsRef = ref(database, `notifications_new/${userId}`);
    const unsubscribe = onValue(userNotificationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const notificationsArray = Object.entries(data)
          .map(([id, val]) => ({ ...val, id }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setNotifications(notificationsArray);
        setUnreadCount(notificationsArray.filter((n) => !n.read).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!settings.notificationsEnabled || !userId) return;

    const sensorsRef = ref(database, "smart_sensors");
    const notificationsRef = ref(database, `notifications_new/${userId}`);

    const unsubscribe = onValue(sensorsRef, async (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.val();
      const latestData = Object.values(data).pop();
      const t = settings.thresholds;

      // Get current notifications to check for duplicates
      const notificationsSnapshot = await get(notificationsRef);
      const currentNotifications = notificationsSnapshot.exists()
        ? Object.values(notificationsSnapshot.val())
        : [];

      const isDuplicate = (newNotification) => {
        return currentNotifications.some((n) => {
          return (
            n.title === newNotification.title &&
            n.type === newNotification.type &&
            Math.abs(
              new Date(n.timestamp) - new Date(newNotification.timestamp)
            ) < 60000 // 1 min
          );
        });
      };

      const addAlert = (sensorKey, title, message, type = "alert") => {
        const newNotification = {
          title,
          type,
          message,
          timestamp: new Date().toISOString(),
          read: false,
        };

        if (!isDuplicate(newNotification)) {
          const alertRef = ref(database, `notifications_new/${userId}`);
          const newNotificationRef = push(alertRef);
          const id = newNotificationRef.key;

          const alert = { ...newNotification, id };

          set(newNotificationRef, alert);
        }
      };

      if (t.temperature.enabled) {
        if (latestData.temperature >= t.temperature.danger) {
          addAlert(
            "temperature",
            "High Temperature Alert",
            `Temperature exceeded ${t.temperature.danger}°C (Current: ${latestData.temperature}°C)`
          );
        } else if (latestData.temperature >= t.temperature.warning) {
          addAlert(
            "temperature",
            "Temperature Warning",
            `Temperature above ${t.temperature.warning}°C (Current: ${latestData.temperature}°C)`,
            "info"
          );
        }
      }

      if (t.humidity.enabled) {
        if (latestData.humidity >= t.humidity.danger) {
          addAlert(
            "humidity",
            "High Humidity Alert",
            `Humidity exceeded ${t.humidity.danger}% (Current: ${latestData.humidity}%)`
          );
        } else if (latestData.humidity >= t.humidity.warning) {
          addAlert(
            "humidity",
            "Humidity Warning",
            `Humidity above ${t.humidity.warning}% (Current: ${latestData.humidity}%)`,
            "info"
          );
        }
      }

      // if (t.pressure.enabled) {
      //   if (latestData.pressure <= t.pressure.danger && latestData.pressure >= t.pressure.warning) {
      //     addAlert(
      //       "pressure",
      //       "Low Pressure Alert",
      //       `Pressure below ${t.pressure.danger}hPa (Current: ${latestData.pressure}hPa)`
      //     );
      //   } else if (latestData.pressure <= t.pressure.warning) {
      //     addAlert(
      //       "pressure",
      //       "Pressure Warning",
      //       `Pressure below ${t.pressure.warning}hPa (Current: ${latestData.pressure}hPa)`,
      //       "info"
      //     );
      //   }
      // }

      if (t.mq2.enabled && latestData.mq2 <= t.mq2.danger && latestData.mq2 > t.mq2.warning) {
        addAlert(
          "mq2",
          "MQ2 Gas Alert",
          `Carbon monoxide Gas is value is below ${t.mq2.danger} (Current: ${latestData.mq2})`
        );
      }

      if (t.mq2.enabled && latestData.mq2 <= t.mq2.warning) {
        addAlert(
          "mq2",
          "MQ2 Gas Alert",
          `Carbon monoxide Gas is value is below ${t.mq2.warning} (Current: ${latestData.mq2})`
        );
      }


      if (t.mq7.enabled && latestData.mq7 <= t.mq7.danger && latestData.mq7 >= t.mq7.warning) {
        addAlert(
          "mq7",
          "MQ7 Gas Alert",
          `MQ7 gas is below ${t.mq7.danger} (Current: ${latestData.mq7})`
        );
      } 

      

     if (t.mq7.enabled && latestData.mq7 <= t.mq7.warning) {
        addAlert(
          "mq7",
          "MQ7 Gas Alert",
          `MQ7 gas is below ${t.mq7.warning} (Current: ${latestData.mq7})`
        );
      } 
      
      
      if (t.mq135.enabled && latestData.mq135 <= t.mq135.danger && latestData.mq135 >= t.mq135.warning) {
        addAlert(
          "mq135",
          "MQ135 Gas Alert",
          `Air quality is below ${t.mq135.danger} (Current: ${latestData.mq135})`
        );
      }

      if (latestData.flameDetected) {
        addAlert(
          "flame",
          "Fire Alert!",
          "Flame detected! Please check your sensors immediately."
        );
      }

      // Add motion detection notification
      if (latestData.motionDetected) {
        addAlert(
          "motion",
          "Motion Detected",
          "Motion has been detected in your home. Please check your security system.",
          "info"
        );
      }
    });

    return () => unsubscribe();
  }, [settings, userId]);

  const markAsRead = (notificationId) => {
    if (!userId || !notificationId) return;
    update(ref(database, `notifications_new/${userId}/${notificationId}`), {
      read: true,
    });
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    localStorage.clear();

    const userNotificationsRef = ref(database, `notifications_new/${userId}`);
    const snapshot = await get(userNotificationsRef);

    if (snapshot.exists()) {
      const updates = {};
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const notification = childSnapshot.val();
        if (!notification.read) {
          updates[`notifications_new/${userId}/${key}/read`] = true;
        }
      });

      await update(ref(database), updates);
    }
  };

  const updateNotificationSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("notificationSettings", JSON.stringify(newSettings));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        settings,
        updateNotificationSettings,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
