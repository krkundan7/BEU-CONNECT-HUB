import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';
import { GraduationCap, Mail, Lock, Key, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchPersona } = useAuth();
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('aman.beu@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);
    if (success) {
      showToast('Welcome back to your digital campus!', 'success');
      navigateTo('dashboard');
    } else {
      setError('Invalid credentials. You can use the quick Demo Logins below.');
    }
  };

  const handleSendOtp = () => {
    if (!email) {
      setError('Please enter your email or registered mobile number');
      return;
    }
    setOtpSent(true);
    setOtp('5842'); // Simulated OTP
    showToast('Demo OTP 5842 sent to ' + email, 'info');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '5842' || otp.length === 4) {
      login('aman.beu@gmail.com');
      showToast('OTP verified successfully!', 'success');
      navigateTo('dashboard');
    } else {
      setError('Incorrect OTP. Please enter 5842 for demo.');
    }
  };

  const handleQuickDemo = (userId: string, personaName: string) => {
    switchPersona(userId);
    showToast(`Logged in as ${personaName}`, 'success');
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen bg-beu-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          onClick={() => navigateTo('landing')}
          className="inline-flex items-center gap-2 mb-4 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-navy-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="font-extrabold text-xl text-navy-900 tracking-tight">BEU CONNECT HUB</span>
        </button>
        <h2 className="text-2xl font-bold tracking-tight text-beu-dark">
          Welcome back to your digital campus
        </h2>
        <p className="text-xs text-beu-muted mt-1">
          Access your personalized study hub, syllabus, and peer networks
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-card border border-slate-200 space-y-6">
          {/* Auth Tab Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => { setAuthMode('password'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'password' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Email & Password
            </button>
            <button
              onClick={() => { setAuthMode('otp'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'otp' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Instant OTP Login
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {authMode === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-beu-dark mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. aman.beu@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-beu-dark">Password</label>
                  <button
                    type="button"
                    onClick={() => showToast('Demo password reset link simulated.', 'info')}
                    className="text-[11px] text-emerald-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Login to Digital Campus</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-beu-dark mb-1">Registered Email or Phone</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter student email"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                >
                  Send OTP Code
                </button>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-beu-dark mb-1">Enter 4-Digit OTP Code</label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        placeholder="e.g. 5842"
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 font-mono tracking-widest text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    Verify OTP & Proceed
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Quick 1-Click Demo Personas */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('usr-aman-101', 'Aman Kumar (Student)')}
                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-center transition-colors"
              >
                <p className="text-[11px] font-bold truncate">Student</p>
                <p className="text-[9px] text-blue-700">MIT Muz (3rd)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('usr-priya-102', 'Priya Sharma (Senior Mentor)')}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-center transition-colors"
              >
                <p className="text-[11px] font-bold truncate">Senior Mentor</p>
                <p className="text-[9px] text-emerald-700">BCE Bhag (4th)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('usr-prof-admin', 'Prof. R.K. Verma (Admin)')}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-center transition-colors"
              >
                <p className="text-[11px] font-bold truncate">Admin</p>
                <p className="text-[9px] text-amber-700">BEU HQ Patna</p>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-beu-muted">
              Don't have an account?{' '}
              <button
                onClick={() => navigateTo('register')}
                className="font-bold text-emerald-600 hover:underline ml-1"
              >
                Register Now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
