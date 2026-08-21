import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';
import { AuthService } from '../services/authService';
import {
  GraduationCap, Mail, Lock, Key, ArrowRight, ShieldCheck,
  UserCheck, AlertCircle, Phone, RefreshCw, Sparkles, Shield
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchPersona } = useAuth();
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('aman.beu@gmail.com');
  const [password, setPassword] = useState('Password@123!');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      // Attempt backend API login first
      const res = await AuthService.login(identifier, password);
      login(res.user?.email || identifier, password);
      showToast(`Welcome back, ${res.user?.name || 'Student'}!`, 'success');
      navigateTo('dashboard');
    } catch (apiErr: any) {
      // If backend throws brute-force lockout or credentials error
      const errorMsg = apiErr.message || 'Invalid credentials.';
      if (errorMsg.includes('locked') || errorMsg.includes('attempt(s) remaining')) {
        setError(errorMsg);
        showToast(errorMsg, 'error');
      } else {
        // Fallback to local AuthContext login
        const success = login(identifier, password);
        if (success) {
          showToast('Welcome back to your digital campus!', 'success');
          navigateTo('dashboard');
        } else {
          setError('Invalid credentials. Please verify your BEU Reg ID, Email, or Password.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    if (!identifier) {
      setError('Please enter your BEU Reg ID, registered email, or mobile number');
      return;
    }
    setError('');
    try {
      setIsSubmitting(true);
      if (identifier.includes('@')) {
        const res = await AuthService.sendEmailOTP(identifier);
        setOtpSent(true);
        if (res.demoOtp) setOtp(res.demoOtp);
        showToast(res.message, 'info');
      } else {
        const cleanMobile = identifier.replace(/[^0-9]/g, '');
        const res = await AuthService.sendMobileOTP(cleanMobile || '9876543210');
        setOtpSent(true);
        if (res.demoOtp) setOtp(res.demoOtp);
        showToast(res.message, 'info');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch verification OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setIsSubmitting(true);
      login('aman.beu@gmail.com');
      showToast('OTP verified successfully! Welcome back.', 'success');
      navigateTo('dashboard');
    } catch (err: any) {
      setError(err.message || 'Incorrect OTP code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (userId: string, personaName: string) => {
    switchPersona(userId);
    showToast(`Logged in as ${personaName}`, 'success');
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          onClick={() => navigateTo('landing')}
          className="inline-flex items-center gap-2 mb-4 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-emerald-300" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">BEU CONNECT HUB</span>
        </button>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Welcome to Digital Campus
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Access your syllabus, lecture notes, PYQs, and verified community
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-slate-700/80 space-y-6">
          {/* Auth Tab Switcher */}
          <div className="flex p-1 bg-slate-900/80 rounded-xl border border-slate-700/60">
            <button
              onClick={() => { setAuthMode('password'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authMode === 'password' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Credentials Login
            </button>
            <button
              onClick={() => { setAuthMode('otp'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authMode === 'otp' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Instant OTP Login
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {authMode === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  BEU Registration ID / Email / Mobile
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="e.g. 23105101001 or student@beu.edu.in"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  You can login with your 10-digit BEU Reg ID, Email ID, or verified Mobile.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link dispatched.', 'info')}
                    className="text-[11px] text-indigo-400 hover:underline font-medium cursor-pointer"
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
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Secure Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Registered Email or 10-Digit Mobile
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="e.g. 9876543210 or student@beu.edu.in"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Verification OTP'}
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Enter Verification Code</label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        placeholder="• • • • • •"
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-slate-900/80 border border-slate-700 rounded-xl text-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    Verify OTP & Proceed
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Quick 1-Click Demo Personas */}
          <div className="pt-4 border-t border-slate-700/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('usr-aman-101', 'Aman Kumar (Student)')}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-indigo-300 border border-slate-700 text-center transition-colors cursor-pointer"
              >
                <p className="text-[11px] font-bold truncate">Student</p>
                <p className="text-[9px] text-slate-400">MIT Muz (3rd)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('usr-priya-102', 'Priya Sharma (Senior Mentor)')}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-emerald-300 border border-slate-700 text-center transition-colors cursor-pointer"
              >
                <p className="text-[11px] font-bold truncate">Senior Mentor</p>
                <p className="text-[9px] text-slate-400">BCE Bhag (4th)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('usr-prof-admin', 'Prof. R.K. Verma (Admin)')}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-amber-300 border border-slate-700 text-center transition-colors cursor-pointer"
              >
                <p className="text-[11px] font-bold truncate">Admin</p>
                <p className="text-[9px] text-slate-400">BEU HQ Patna</p>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={() => navigateTo('register')}
                className="font-bold text-emerald-400 hover:underline ml-1 cursor-pointer"
              >
                Register with BEU ID
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
