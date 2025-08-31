import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`notification notification--${type}`}>
      <div className="notification__content">
        <span className="notification__message">{message}</span>
        <button
          className="notification__close"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
