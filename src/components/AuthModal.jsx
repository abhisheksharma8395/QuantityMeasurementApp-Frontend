import { useState } from 'react';

export default function AuthModal({ onClose, onLogin, onSignup }) {
  const [activeTab, setActiveTab] = useState('login');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword) return;
    setIsSubmitting(true);
    try {
      await onLogin({ username: loginUsername.trim(), password: loginPassword });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupUsername.trim() || !signupPassword) return;
    setIsSubmitting(true);
    try {
      // Backend User entity only has: username, password
      await onSignup({
        username: signupUsername.trim(),
        password: signupPassword
      });
      setActiveTab('login');
      setSignupUsername('');
      setSignupPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="auth-modal"
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" role="dialog" aria-labelledby="auth-modal-title">
        <button id="auth-modal-close" className="modal-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <div className="auth-tabs">
          <button
            className={`auth-tab${activeTab === 'login' ? ' active' : ''}`}
            id="tab-login"
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab${activeTab === 'signup' ? ' active' : ''}`}
            id="tab-signup"
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form id="login-form" className="auth-form" onSubmit={handleLoginSubmit}>
            <h3 id="auth-modal-title" className="auth-title">Welcome Back</h3>
            <div className="input-group">
              <label htmlFor="login-username" className="input-label">Username</label>
              <input
                type="text"
                id="login-username"
                className="input-field"
                placeholder="Enter username"
                required
                autoComplete="username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="login-password" className="input-label">Password</label>
              <input
                type="password"
                id="login-password"
                className="input-field"
                placeholder="Enter password"
                required
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              id="login-submit-btn"
              disabled={isSubmitting}
            >
              <span>Login</span>
            </button>
          </form>
        )}

        {/* Signup Form — Backend User entity only has username & password */}
        {activeTab === 'signup' && (
          <form id="signup-form" className="auth-form" onSubmit={handleSignupSubmit}>
            <h3 className="auth-title">Create Account</h3>
            <div className="input-group">
              <label htmlFor="signup-username" className="input-label">Username</label>
              <input
                type="text"
                id="signup-username"
                className="input-field"
                placeholder="Choose a username"
                required
                autoComplete="username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="signup-password" className="input-label">Password</label>
              <input
                type="password"
                id="signup-password"
                className="input-field"
                placeholder="Create password"
                required
                autoComplete="new-password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              id="signup-submit-btn"
              disabled={isSubmitting}
            >
              <span>Sign Up</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
