import React from 'react';

/**
 * A collection of Education-themed UI components using Tailwind CSS
 * These provide alternatives to the Akira-themed components with colors
 * more suitable for educational purposes
 */

// Text with gentle blue glow effect
export const EduText = ({ children, className = '', ...props }) => {
  return (
    <span 
      className={`tracking-wide ${className}`}
      style={{ textShadow: '0 0 5px rgba(219, 234, 254, 0.6)' }} 
      {...props}
    >
      {children}
    </span>
  );
};

// Strong glow effect for featured elements in blue theme
export const EduGlow = ({ children, className = '', ...props }) => {
  return (
    <span 
      className={`relative ${className}`}
      style={{ 
        textShadow: `
          0 0 10px rgba(219, 234, 254, 0.8),
          0 0 20px rgba(59, 130, 246, 0.6),
          0 0 30px rgba(37, 99, 235, 0.4)
        ` 
      }} 
      {...props}
    >
      {children}
    </span>
  );
};

// Pulsing animation for UI elements with blue accent
export const EduPulse = ({ children, className = '', ...props }) => {
  return (
    <div className={`animate-edu-pulse ${className}`} {...props}>
      {children}
    </div>
  );
};

// Overlay for adding a slight blue tint
export const EduOverlay = ({ className = '', ...props }) => {
  return (
    <div 
      className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none z-[1] ${className}`} 
      {...props}
    />
  );
};

// Grid pattern for educational/technical background
export const EduGrid = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      {...props}
    >
      {children}
      <div className="absolute inset-0 pointer-events-none bg-grid z-[2] opacity-10"></div>
    </div>
  );
};
