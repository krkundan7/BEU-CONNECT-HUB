import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';
import { MOCK_COLLEGES, MOCK_BRANCHES } from '../data/mockData';
import {
  GraduationCap, ArrowRight, ArrowLeft, CheckCircle2,
  Lock, Shield, UserCheck, Sparkles, Building, BookOpen
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  // Step 2 Form State
  const [college, setCollege] = useState(MOCK_COLLEGES[0].name);
  const [collegeCode, setCollegeCode] = useState(MOCK_COLLEGES[0].code);
  const [branch, setBranch] = useState(MOCK_BRANCHES[0].name);
  const [branchCode, setBranchCode] = useState(MOCK_BRANCHES[0].code);
  const [semester, setSemester] = useState(3);
  const [beuRegNo, setBeuRegNo] = useState('');

  // Step 3 State
  const [isInstantVerified, setIsInstantVerified] = useState(true);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      showToast('Please fill all mandatory fields', 'error');
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beuRegNo) {
      showToast('Please provide your BEU Registration number or Roll', 'error');
      return;
    }
    setStep(3);
  };

  const handleFinalizeRegistration = () => {
    const newUser = register({
      name: fullName,
      email,
      mobile,
      college,
      collegeCode,
      branch,
      branchCode,
      semester,
      beuRegNo,
      verificationStatus: isInstantVerified ? 'verified' : 'pending',
      skills: branchCode === 'CSE' ? ['Data Structures', 'C++', 'Web Dev'] : ['Circuit Design', 'IoT', 'MATLAB']
    });

    showToast(`Welcome to BEU Connect Hub, ${newUser.name}!`, 'success');
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen bg-beu-light py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <button
          onClick={() => navigateTo('landing')}
          className="inline-flex items-center gap-2 mb-4 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-navy-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="font-extrabold text-xl text-navy-900 tracking-tight">BEU CONNECT HUB</span>
        </button>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-beu-dark">
          Student Registration Flow
        </h2>
        <p className="text-xs text-beu-muted mt-1">
          Join the verified digital campus ecosystem for Bihar Engineering University
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            step === 1 ? 'bg-navy-900 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>Account</span>
          </div>

          <span className="text-slate-300">―</span>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            step === 2 ? 'bg-navy-900 text-white' : step > 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
          }`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            <span>Academic Info</span>
          </div>

          <span className="text-slate-300">―</span>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            step === 3 ? 'bg-navy-900 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
            <span>Verification</span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-card border border-slate-200">
          {/* STEP 1: ACCOUNT */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-beu-dark">Step 1: Student Account Credentials</h3>
                <p className="text-xs text-beu-muted">Enter your basic identification information</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-beu-dark mb-1">Full Name (As per College Records)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Aman Kumar"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-beu-dark mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. aman.beu@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-beu-dark mb-1">Mobile Number (For verification & alerts)</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-beu-dark mb-1">Choose Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue to Academic Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: ACADEMIC INFO */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-beu-dark">Step 2: BEU Academic Information</h3>
                <p className="text-xs text-beu-muted">This personalizes your syllabus, PYQs, and college groups</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-beu-dark mb-1">Engineering College</label>
                <select
                  value={college}
                  onChange={(e) => {
                    setCollege(e.target.value);
                    const c = MOCK_COLLEGES.find(col => col.name === e.target.value);
                    if (c) setCollegeCode(c.code);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                >
                  {MOCK_COLLEGES.map(col => (
                    <option key={col.id} value={col.name}>{col.name} ({col.location})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-beu-dark mb-1">Engineering Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => {
                      setBranch(e.target.value);
                      const b = MOCK_BRANCHES.find(br => br.name === e.target.value);
                      if (b) setBranchCode(b.code);
                    }}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  >
                    {MOCK_BRANCHES.map(br => (
                      <option key={br.id} value={br.name}>{br.name} ({br.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-beu-dark mb-1">Current Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>{sem}{sem === 1 ? 'st' : sem === 2 ? 'nd' : sem === 3 ? 'rd' : 'th'} Semester</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-beu-dark mb-1">BEU Registration Number / Roll No</label>
                <input
                  type="text"
                  value={beuRegNo}
                  onChange={(e) => setBeuRegNo(e.target.value)}
                  required
                  placeholder="e.g. 23101108042"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
                <p className="text-[11px] text-beu-muted mt-1">
                  🔒 Strictly confidential. Used only for university status verification.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Review Verification Status</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: VERIFICATION & COMPLETION */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-beu-dark">University Verification Summary</h3>
                <p className="text-xs text-beu-muted">Please confirm your student credentials</p>
              </div>

              {/* Verification Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-beu-dark">{fullName}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">College:</span>
                  <span className="font-semibold text-beu-dark truncate max-w-[200px]">{college}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Branch & Semester:</span>
                  <span className="font-semibold text-beu-dark">{branchCode} • Sem {semester}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">BEU Status:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-emerald-700">Verified BEU Student</span>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  Your registration number (<strong>{beuRegNo.slice(0, 4)}••••{beuRegNo.slice(-3)}</strong>) is encrypted and will NEVER appear publicly on your profile.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Edit Info
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeRegistration}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Enter My Personalized Campus</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
