import { useState, useEffect, useRef } from 'react';

function Navbar({ 
  onAdminLogin, 
  onHomeClick, 
  onLabsClick, 
  onResourcesClick, 
  onAboutClick, 
  onDashboardClick,
  onLogoutClick,
  theme = 'light',
  isLoggedIn = false,
  user = null 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Theme-based styling
  const isAkira = theme === 'akira';
  const isEdu = theme === 'education';
  const isDark = theme === 'dark' || isAkira || isEdu;
  
  const navClasses = isEdu
    ? "backdrop-blur-md bg-slate-900/30 border-b border-blue-500/30 sticky top-0 z-50" 
    : isAkira
    ? "backdrop-blur-md bg-black/30 border-b border-red-500/30 sticky top-0 z-50" 
    : isDark
    ? "backdrop-blur-md bg-black/30 border-b border-white/10 sticky top-0 z-50" 
    : "bg-white border-b border-gray-200 sticky top-0 z-50";
  
  const textClasses = isDark ? "text-white" : "text-gray-700";
  const hoverTextClasses = isEdu
    ? "hover:text-blue-400"
    : isAkira 
    ? "hover:text-red-500" 
    : isDark 
    ? "hover:text-cyan-400" 
    : "hover:text-blue-600";
    
  const hoverBgClasses = isEdu
    ? "hover:bg-blue-500/10"
    : isAkira
    ? "hover:bg-red-500/10"
    : isDark 
    ? "hover:bg-white/10" 
    : "hover:bg-gray-100";
  
  const buttonClasses = isEdu
    ? "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    : isAkira
    ? "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    : isDark
    ? "bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
    : "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700";

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand */}
          <div 
            className={`flex items-center gap-2 cursor-pointer select-none`}
            title="CS Lab Portal"
            onClick={onHomeClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isAkira ? 'akira-glow' : isEdu ? 'edu-glow' : ''}`} viewBox="0 0 24 24" fill="none" stroke={isEdu ? '#3b82f6' : isAkira ? '#ef4444' : isDark ? '#22d3ee' : '#2563eb'} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <div>
              <div className={`text-xl font-bold ${isAkira ? 'text-red-500' : isDark ? 'text-cyan-400' : 'text-blue-600'} ${isAkira ? 'akira-text' : ''}`}>
                CS Lab Portal
              </div>
              <div className={`text-xs ${isAkira ? 'text-red-400' : isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                Web Tech & Advanced Networks
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <button onClick={onHomeClick} className={`${textClasses} ${hoverTextClasses} font-medium px-3 py-2 rounded-md ${hoverBgClasses}`}>Home</button>
            <button onClick={onLabsClick} className={`${textClasses} ${hoverTextClasses} font-medium px-3 py-2 rounded-md ${hoverBgClasses}`}>Labs</button>
            <button onClick={onResourcesClick} className={`${textClasses} ${hoverTextClasses} font-medium px-3 py-2 rounded-md ${hoverBgClasses}`}>Resources</button>
            <button onClick={onAboutClick} className={`${textClasses} ${hoverTextClasses} font-medium px-3 py-2 rounded-md ${hoverBgClasses}`}>About</button>
          </div>

          {/* Right Button or Profile */}
          <div className="hidden md:block">
            {isLoggedIn && user ? (
              <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
                <span className={`${textClasses} font-medium`}>{user.name || user.username}</span>
                <div 
                  className="relative cursor-pointer" 
                  onClick={toggleProfileDropdown}
                >
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name || user.username}
                      className="h-10 w-10 rounded-full object-cover border-2 border-blue-500/50" 
                    />
                  ) : (
                    <div className={`h-10 w-10 rounded-full ${isAkira ? 'bg-red-500/30' : isEdu ? 'bg-blue-500/30' : 'bg-cyan-500/30'} flex items-center justify-center text-lg font-bold text-white`}>
                      {(user.name || user.username || "U").charAt(0)}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-slate-900"></span>
                </div>
                
                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className={`absolute right-0 top-12 w-48 py-2 mt-2 rounded-md shadow-xl z-20 ${
                    isDark ? 'bg-slate-800 border border-blue-500/30' : 'bg-white border border-gray-200'
                  }`}>
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onDashboardClick && onDashboardClick();
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${textClasses} ${hoverTextClasses} ${hoverBgClasses}`}
                    >
                      Dashboard
                    </button>
                    <div className={`border-t ${isDark ? 'border-blue-500/30' : 'border-gray-200'} my-1`}></div>
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onLogoutClick && onLogoutClick();
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${textClasses} ${hoverTextClasses} ${hoverBgClasses}`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className={`${buttonClasses} transition duration-200 focus:outline-none focus:ring-2 ${isAkira ? 'focus:ring-red-400' : 'focus:ring-cyan-400'} ${isAkira ? 'akira-glow' : ''}`}
                onClick={onAdminLogin}
              >
                Developer Login
              </button>
            )}
          </div>

          {/* Hamburger (Mobile) */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className={`${textClasses} ${hoverTextClasses} focus:outline-none`}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"
                   viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden ${
          isAkira 
            ? 'bg-black/60 backdrop-blur-md border-t border-red-500/30' 
            : isDark 
              ? 'bg-black/60 backdrop-blur-md border-t border-white/10' 
              : 'bg-white border-t border-gray-200'
        } space-y-2 px-4 py-2`}>
          <button onClick={onHomeClick} className={`block w-full text-left ${textClasses} ${hoverTextClasses} py-2`}>Home</button>
          <button onClick={onLabsClick} className={`block w-full text-left ${textClasses} ${hoverTextClasses} py-2`}>Labs</button>
          <button onClick={onResourcesClick} className={`block w-full text-left ${textClasses} ${hoverTextClasses} py-2`}>Resources</button>
          <button onClick={onAboutClick} className={`block w-full text-left ${textClasses} ${hoverTextClasses} py-2`}>About</button>
          {isLoggedIn && user ? (
            <div className="py-3 border-t border-blue-500/20 mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`${textClasses} font-medium`}>{user.name || user.username}</span>
                <div className="relative">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name || user.username}
                      className="h-10 w-10 rounded-full object-cover border-2 border-blue-500/50" 
                    />
                  ) : (
                    <div className={`h-10 w-10 rounded-full ${isAkira ? 'bg-red-500/30' : isEdu ? 'bg-blue-500/30' : 'bg-cyan-500/30'} flex items-center justify-center text-lg font-bold text-white`}>
                      {(user.name || user.username || "U").charAt(0)}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-slate-900"></span>
                </div>
              </div>
              <button
                onClick={onDashboardClick}
                className={`block w-full text-left ${textClasses} ${hoverTextClasses} py-2 px-3 rounded ${hoverBgClasses} mt-2`}
              >
                Dashboard
              </button>
              <button
                onClick={onLogoutClick}
                className={`block w-full text-left ${textClasses} ${hoverTextClasses} py-2 px-3 rounded ${hoverBgClasses}`}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              className={`w-full ${buttonClasses} transition duration-200 mt-2 focus:outline-none focus:ring-2 ${isAkira ? 'focus:ring-red-400 akira-glow' : isDark ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
              onClick={onAdminLogin}
            >
              Developer Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
