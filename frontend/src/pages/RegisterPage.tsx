import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';
import { MOCK_COLLEGES, MOCK_BRANCHES } from '../data/mockData';
import { AuthService } from '../services/authService';
import {
  GraduationCap, ArrowRight, ArrowLeft, CheckCircle2,
  Lock, Shield, UserCheck, Sparkles, Building, BookOpen,
  Phone, Mail, KeyRound, Eye, EyeOff, AlertTriangle, Fingerprint, RefreshCw, Check
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();

  // Wizard Step: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  // Step 1: BEU Registration ID
  const [beuRegNo, setBeuRegNo] = useState('23105101001');
  const [beuToken, setBeuToken] = useState('');
  const [isVerifyingBeu, setIsVerifyingBeu] = useState(false);
  const [beuMeta, setBeuMeta] = useState<any>(null);

  // Step 2: Student Details
  const [fullName, setFullName] = useState('Aman Kumar');
  const [dob, setDob] = useState('2004-05-15');
  const [college, setCollege] = useState(MOCK_COLLEGES[0].name);
  const [collegeCode, setCollegeCode] = useState(MOCK_COLLEGES[0].code);
  const [branch, setBranch] = useState(MOCK_BRANCHES[0].name);
  const [branchCode, setBranchCode] = useState(MOCK_BRANCHES[0].code);
  const [semester, setSemester] = useState(3);

  // Step 3: Mobile OTP
  const [mobile, setMobile] = useState('9876543210');
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileToken, setMobileToken] = useState('');
  const [mobileCooldown, setMobileCooldown] = useState(0);
  const [isSendingMobileOtp, setIsSendingMobileOtp] = useState(false);

  // Step 4: Email OTP
  const [email, setEmail] = useState('aman.beu@gmail.com');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailToken, setEmailToken] = useState('');
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);

  // Step 5: Privacy-Conscious Identity Verification (Aadhaar / DigiLocker)
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [idvRefId, setIdvRefId] = useState('');
  const [idvOtp, setIdvOtp] = useState('');
  const [idvOtpSent, setIdvOtpSent] = useState(false);
  const [identityToken, setIdentityToken] = useState('');
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [isVerifyingIdentity, setIsVerifyingIdentity] = useState(false);

  // Step 6: Create Password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timers for cooldowns
  useEffect(() => {
    let interval: any = null;
    if (mobileCooldown > 0) {
      interval = setInterval(() => setMobileCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mobileCooldown]);

  useEffect(() => {
    let interval: any = null;
    if (emailCooldown > 0) {
      interval = setInterval(() => setEmailCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailCooldown]);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  // STEP 1: Verify BEU Registration ID
  const handleVerifyBEU = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beuRegNo.trim()) {
      showToast('Please enter your BEU Registration ID', 'error');
      return;
    }

    try {
      setIsVerifyingBeu(true);
      const res = await AuthService.verifyBEURegistration(beuRegNo);
      setBeuToken(res.verificationToken);
      setBeuMeta(res);
      showToast('BEU Registration ID validated successfully!', 'success');
      setStep(2);
    } catch (err: any) {
      showToast(err.message || 'Invalid BEU Registration ID', 'error');
    } finally {
      setIsVerifyingBeu(false);
    }
  };

  // STEP 2: Submit Student Details
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    setStep(3);
  };

  // STEP 3: Mobile OTP Send & Verify
  const handleSendMobileOtp = async () => {
    if (!mobile.match(/^[6-9]\d{9}$/)) {
      showToast('Please enter a valid 10-digit Indian mobile number', 'error');
      return;
    }
    try {
      setIsSendingMobileOtp(true);
      const res = await AuthService.sendMobileOTP(mobile);
      setMobileOtpSent(true);
      setMobileCooldown(res.cooldownSeconds || 60);
      if (res.demoOtp) {
        setMobileOtp(res.demoOtp);
        showToast(`Demo OTP ${res.demoOtp} sent to mobile`, 'info');
      } else {
        showToast(res.message, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to send Mobile OTP', 'error');
    } finally {
      setIsSendingMobileOtp(false);
    }
  };

  const handleVerifyMobileOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileOtp.trim()) {
      showToast('Please enter the 6-digit verification code', 'error');
      return;
    }
    try {
      const res = await AuthService.verifyMobileOTP(mobile, mobileOtp);
      setMobileToken(res.verificationToken);
      showToast('Mobile number verified successfully!', 'success');
      setStep(4);
    } catch (err: any) {
      showToast(err.message || 'Invalid Mobile OTP', 'error');
    }
  };

  // STEP 4: Email OTP Send & Verify
  const handleSendEmailOtp = async () => {
    if (!email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    try {
      setIsSendingEmailOtp(true);
      const res = await AuthService.sendEmailOTP(email);
      setEmailOtpSent(true);
      setEmailCooldown(res.cooldownSeconds || 60);
      if (res.demoOtp) {
        setEmailOtp(res.demoOtp);
        showToast(`Demo OTP ${res.demoOtp} sent to ${email}`, 'info');
      } else {
        showToast(res.message, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to send Email OTP', 'error');
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOtp.trim()) {
      showToast('Please enter the 6-digit email verification code', 'error');
      return;
    }
    try {
      const res = await AuthService.verifyEmailOTP(email, emailOtp);
      setEmailToken(res.verificationToken);
      showToast('Email verified successfully!', 'success');
      setStep(5);
    } catch (err: any) {
      showToast(err.message || 'Invalid Email OTP', 'error');
    }
  };

  // STEP 5: Identity Verification (Aadhaar / DigiLocker)
  const handleInitiateIdentity = async () => {
    if (aadhaarNumber.replace(/[^0-9]/g, '').length !== 12) {
      showToast('Please enter a 12-digit Aadhaar number', 'error');
      return;
    }
    if (!consentGiven) {
      showToast('Please provide consent for identity verification', 'error');
      return;
    }
    try {
      setIsVerifyingIdentity(true);
      const res = await AuthService.initiateIdentity(aadhaarNumber, fullName, consentGiven, dob);
      setIdvRefId(res.referenceId);
      setIdvOtpSent(true);
      setIdvOtp('123456'); // Demo OTP
      showToast('UIDAI verification initiated. (Demo OTP: 123456)', 'info');
    } catch (err: any) {
      showToast(err.message || 'Identity verification initiation failed', 'error');
    } finally {
      setIsVerifyingIdentity(false);
    }
  };

  const handleConfirmIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsVerifyingIdentity(true);
      const res = await AuthService.confirmIdentity(idvRefId, idvOtp);
      setIdentityToken(res.verificationToken);
      setIsIdentityVerified(true);
      showToast('Identity verified successfully!', 'success');
      setStep(6);
    } catch (err: any) {
      showToast(err.message || 'Identity verification failed', 'error');
    } finally {
      setIsVerifyingIdentity(false);
    }
  };

  const handleSkipIdentity = () => {
    showToast('Identity verification skipped. You can verify later from settings.', 'info');
    setStep(6);
  };

  // STEP 6: Password Creation & Final Registration
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordScore < 4) {
      showToast('Please create a stronger password', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: fullName,
        email,
        password,
        mobile,
        dob,
        college,
        branch,
        semester,
        beuRegNo,
        beuToken,
        mobileToken,
        emailToken,
        identityToken: isIdentityVerified ? identityToken : undefined,
        identityReference: idvRefId || undefined,
      };

      await AuthService.registerVerified(payload);

      // Hydrate frontend AuthContext
      register({
        name: fullName,
        email,
        mobile,
        college,
        collegeCode,
        branch,
        branchCode,
        semester,
        beuRegNo,
        verificationStatus: isIdentityVerified ? 'verified' : 'pending',
        skills: ['Data Structures', 'Algorithms', 'Core Engineering'],
      });

      setStep(7);
      showToast('Student Account Activated Successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Please review your details.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <button
          onClick={() => navigateTo('landing')}
          className="inline-flex items-center gap-2 mb-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-emerald-300" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">BEU CONNECT HUB</span>
        </button>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Verified Student Registration
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Authorized Multi-Step Verification & Identity Architecture for BEU Students
        </p>

        {/* 7-Step Progress Stepper */}
        <div className="flex items-center justify-between gap-1 mt-6 px-2 overflow-x-auto py-2">
          {[
            { num: 1, label: 'BEU ID' },
            { num: 2, label: 'Profile' },
            { num: 3, label: 'Mobile' },
            { num: 4, label: 'Email' },
            { num: 5, label: 'Identity' },
            { num: 6, label: 'Password' },
            { num: 7, label: 'Activate' },
          ].map((item, idx) => {
            const isCompleted = step > item.num;
            const isCurrent = step === item.num;
            return (
              <React.Fragment key={item.num}>
                <div className="flex flex-col items-center min-w-[50px]">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : item.num}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium ${
                      isCurrent ? 'text-indigo-400 font-semibold' : isCompleted ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {idx < 6 && (
                  <div
                    className={`flex-1 h-[2px] mb-4 transition-colors ${
                      step > idx + 1 ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-slate-700/80">
          {/* ================================================================ */}
          {/* STEP 1: BEU REGISTRATION ID VERIFICATION */}
          {/* ================================================================ */}
          {step === 1 && (
            <form onSubmit={handleVerifyBEU} className="space-y-5">
              <div className="border-b border-slate-700 pb-4">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <Shield className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white">Step 1: Official BEU Registration ID</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Verify your Bihar Engineering University registration number before account creation.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  BEU Registration Number / Roll
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={beuRegNo}
                    onChange={e => setBeuRegNo(e.target.value.toUpperCase())}
                    placeholder="e.g. 23105101001 or BEU/2026/CSE/042"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <div className="absolute right-3 top-3 text-xs text-slate-400">
                    BEU Reg
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Format: 10–13 numeric digits (e.g. 23105101001) as issued by Bihar Engineering University.
                </p>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Anti-Duplicate Protection: </span>
                  Each BEU Registration ID can only be registered once. Unauthorized or duplicate attempts are blocked.
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifyingBeu}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isVerifyingBeu ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying with BEU Records...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================================================================ */}
          {/* STEP 2: STUDENT PROFILE & ACADEMIC DETAILS */}
          {/* ================================================================ */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <UserCheck className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white">Step 2: Student Academic Profile</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Verified Registration: <span className="font-mono text-emerald-400 font-bold">{beuRegNo}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name (as per BEU Admit Card)</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Aman Kumar"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Engineering College</label>
                  <select
                    value={college}
                    onChange={e => {
                      setCollege(e.target.value);
                      const c = MOCK_COLLEGES.find(col => col.name === e.target.value);
                      if (c) setCollegeCode(c.code);
                    }}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {MOCK_COLLEGES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Branch / Discipline</label>
                  <select
                    value={branch}
                    onChange={e => {
                      setBranch(e.target.value);
                      const b = MOCK_BRANCHES.find(br => br.name === e.target.value);
                      if (b) setBranchCode(b.code);
                    }}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {MOCK_BRANCHES.map(b => (
                      <option key={b.code} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Semester</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSemester(s)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        semester === s
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      Sem {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-semibold text-xs border border-slate-700 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Continue to Mobile OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ================================================================ */}
          {/* STEP 3: MOBILE NUMBER OTP VERIFICATION */}
          {/* ================================================================ */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <Phone className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white">Step 3: Mobile Phone OTP Verification</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Authenticate your mobile number to receive exam notices, admit card alerts, and login OTPs.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">10-Digit Mobile Number</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-3 text-xs text-slate-400 font-semibold">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobile}
                      disabled={mobileOtpSent}
                      onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="9876543210"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono disabled:opacity-60"
                    />
                  </div>
                  {!mobileOtpSent ? (
                    <button
                      type="button"
                      onClick={handleSendMobileOtp}
                      disabled={isSendingMobileOtp}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-3 rounded-xl shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isSendingMobileOtp ? 'Sending...' : 'Send OTP'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMobileOtpSent(false)}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-3 rounded-xl shrink-0 cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {mobileOtpSent && (
                <form onSubmit={handleVerifyMobileOtp} className="space-y-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">Enter 6-Digit OTP</label>
                      {mobileCooldown > 0 ? (
                        <span className="text-[11px] text-amber-400 font-mono">
                          Resend in {mobileCooldown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendMobileOtp}
                          className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={mobileOtp}
                      onChange={e => setMobileOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] text-emerald-400 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-semibold text-xs border border-slate-700 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Mobile OTP</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 4: EMAIL ADDRESS OTP VERIFICATION */}
          {/* ================================================================ */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <Mail className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white">Step 4: Email Address Verification</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Verify your primary email address for academic communications and security recovery.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    disabled={emailOtpSent}
                    onChange={e => setEmail(e.target.value.toLowerCase())}
                    placeholder="student@gmail.com"
                    className="flex-1 bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                  />
                  {!emailOtpSent ? (
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={isSendingEmailOtp}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-3 rounded-xl shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isSendingEmailOtp ? 'Sending...' : 'Send OTP'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEmailOtpSent(false)}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-3 rounded-xl shrink-0 cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {emailOtpSent && (
                <form onSubmit={handleVerifyEmailOtp} className="space-y-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">Enter Email 6-Digit OTP</label>
                      {emailCooldown > 0 ? (
                        <span className="text-[11px] text-amber-400 font-mono">
                          Resend in {emailCooldown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={emailOtp}
                      onChange={e => setEmailOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] text-emerald-400 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-semibold text-xs border border-slate-700 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Email OTP</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 5: PRIVACY-CONSCIOUS IDENTITY VERIFICATION (AADHAAR/DIGILOCKER) */}
          {/* ================================================================ */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <Fingerprint className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white">Step 5: Privacy-Conscious Identity Verification</h3>
                </div>
                <p className="text-xs text-slate-400">
                  UIDAI / DigiLocker authorized verification. Strict privacy guarantee: No raw Aadhaar stored.
                </p>
              </div>

              {/* Statutory DPDP Consent & Privacy Notice */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-indigo-500/30 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-indigo-300">
                  <Shield className="w-4 h-4" />
                  <span>Statutory Privacy & Consent Notice (DPDP Act & UIDAI)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your Aadhaar number is used strictly to verify your student identity via authorized government gateways.
                  BEU Connect Hub stores <span className="text-amber-300 font-semibold">zero raw Aadhaar data</span>;
                  only masked reference hashes (`idv_ref_...`) and timestamped verification flags are retained.
                </p>
                <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={e => setConsentGiven(e.target.checked)}
                    className="rounded-sm border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>I hereby provide consent to verify my identity for BEU academic portal access.</span>
                </label>
              </div>

              {!idvOtpSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">12-Digit Aadhaar Number</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={aadhaarNumber}
                      onChange={e => setAadhaarNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 555566667777"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSkipIdentity}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-semibold text-xs border border-slate-700 cursor-pointer"
                    >
                      Skip For Now
                    </button>
                    <button
                      type="button"
                      onClick={handleInitiateIdentity}
                      disabled={isVerifyingIdentity || !consentGiven}
                      className="flex-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isVerifyingIdentity ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Contacting Gateway...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify with UIDAI</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmIdentity} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Enter UIDAI OTP (sent to registered mobile)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={idvOtp}
                      onChange={e => setIdvOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="123456"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] text-emerald-400 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSkipIdentity}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-semibold text-xs border border-slate-700 cursor-pointer"
                    >
                      Skip
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifyingIdentity}
                      className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Identity</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 6: CREATE PASSWORD & CREDENTIALS */}
          {/* ================================================================ */}
          {step === 6 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <KeyRound className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white">Step 6: Create Account Password</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Set a strong master password to secure your BEU student account.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Master Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Checklist */}
                <div className="grid grid-cols-2 gap-1.5 mt-2 text-[11px]">
                  <span className={hasMinLength ? 'text-emerald-400' : 'text-slate-400'}>
                    {hasMinLength ? '✓' : '○'} Min 8 characters
                  </span>
                  <span className={hasUppercase ? 'text-emerald-400' : 'text-slate-400'}>
                    {hasUppercase ? '✓' : '○'} Uppercase letter
                  </span>
                  <span className={hasLowercase ? 'text-emerald-400' : 'text-slate-400'}>
                    {hasLowercase ? '✓' : '○'} Lowercase letter
                  </span>
                  <span className={hasNumber && hasSpecial ? 'text-emerald-400' : 'text-slate-400'}>
                    {hasNumber && hasSpecial ? '✓' : '○'} Number & Special Char
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-semibold text-xs border border-slate-700 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Activating Student Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================================================================ */}
          {/* STEP 7: REGISTRATION COMPLETE & ACTIVATED */}
          {/* ================================================================ */}
          {step === 7 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">Registration Complete!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Welcome to BEU Connect Hub, <span className="text-emerald-400 font-bold">{fullName}</span>!
                </p>
              </div>

              {/* Verified Badges Grid */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/80 space-y-2.5 text-left text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>BEU Registration ID ({beuRegNo})</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Mobile Phone (+91 {mobile})</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>Email ({email})</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-emerald-400" />
                    <span>Identity / UIDAI Status</span>
                  </span>
                  <span className={isIdentityVerified ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                    {isIdentityVerified ? '✓ Verified' : '○ Pending'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('dashboard')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Launch Digital Campus Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
