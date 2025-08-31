import React, { useState, useCallback } from 'react';
import Notification from './Notification';
import './Notification.css';

let notificationId = 0;

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++notificationId;
    const notification = { id, message, type, duration };

    setNotifications(prev => [...prev, notification]);

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Expose the addNotification function globally
  React.useEffect(() => {
    window.showNotification = addNotification;
  }, [addNotification]);

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// Export the manager component and utility functions
export default NotificationManager;

export const showSuccess = (message, duration) => {
  if (window.showNotification) {
    window.showNotification(message, 'success', duration);
  }
};

export const showError = (message, duration) => {
  if (window.showNotification) {
    window.showNotification(message, 'error', duration);
  }
};

export const showInfo = (message, duration) => {
  if (window.showNotification) {
    window.showNotification(message, 'info', duration);
  }
};

export const showWarning = (message, duration) => {
  if (window.showNotification) {
    window.showNotification(message, 'warning', duration);
  }
};
