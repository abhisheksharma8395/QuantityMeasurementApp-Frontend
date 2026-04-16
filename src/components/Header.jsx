import { useState, useEffect, useRef } from 'react';

export default function Header({
  onToggleTheme,
  onOpenHistory,
  isAuthenticated,
  onLogout,
  onShowAuthModal
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const userBtnRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        userMenuRef.current && !userMenuRef.current.contains(e.target) &&
        userBtnRef.current && !userBtnRef.current.contains(e.target)
      ) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <header className="header" id="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <span className="brand-text">Quantity Measurement</span>
          </div>
          <div className="header-actions">
            <button
              id="theme-toggle-btn"
              className="btn-icon"
              title="Toggle dark mode"
              aria-label="Toggle dark mode"
              onClick={onToggleTheme}
            >
              <svg className="theme-icon" id="theme-icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg className="theme-icon" id="theme-icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
            <button
              id="history-btn"
              className="btn btn-outline"
              title="View conversion history"
              onClick={onOpenHistory}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>History</span>
            </button>
            {isAuthenticated && (
              <button
                ref={userBtnRef}
                id="auth-user-btn"
                className="btn-icon"
                title="User menu"
                aria-label="User menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(prev => !prev);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* User Menu Dropdown */}
      {isAuthenticated && showUserMenu && (
        <div ref={userMenuRef} id="user-menu" className="user-menu">
          <div className="user-menu-header" id="user-menu-name">User</div>
          <button
            id="logout-btn"
            className="user-menu-item"
            onClick={() => {
              setShowUserMenu(false);
              onLogout();
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      )}
    </>
  );
}
