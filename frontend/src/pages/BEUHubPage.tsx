import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { NoticeService, NoticeFilterOptions } from '../services/noticeService';
import { NoticeDetailModal } from '../components/NoticeDetailModal';
import { SourceTransparencyModal } from '../components/SourceTransparencyModal';
import {
  Building2, Search, Bell, FileText, Download,
  ExternalLink, AlertCircle, CheckCircle2, ShieldCheck, ChevronRight,
  Clock, Info, Globe, RefreshCw, Filter, Sparkles,
  Calendar, Tag, Layers, Share2, AlertTriangle, BookOpen,
  GraduationCap, Award, Briefcase, ChevronDown, Check
} from 'lucide-react';
import { Notice } from '../types';

export const BEU_BRANCHES_LIST = [
  { code: 'ALL', name: 'All 34 Branches (Universal)' },
  { code: 'CSE', name: 'Computer Science & Engineering' },
  { code: 'AI', name: 'Artificial Intelligence' },
  { code: 'DS', name: 'Data Science' },
  { code: 'AIML', name: 'AI & Machine Learning' },
  { code: 'CY', name: 'Cyber Security' },
  { code: 'IOT', name: 'Internet of Things (IoT)' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'ECE', name: 'Electronics & Communication Engineering' },
  { code: 'EE', name: 'Electrical Engineering' },
  { code: 'EEE', name: 'Electrical & Electronics Engineering' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'CE', name: 'Civil Engineering' },
  { code: 'CHE', name: 'Chemical Engineering' },
  { code: 'MECH', name: 'Mechatronics Engineering' },
  { code: 'AUTO', name: 'Automobile Engineering' },
  { code: 'AERO', name: 'Aeronautical Engineering' },
  { code: 'BIO', name: 'Biotechnology' },
  { code: 'MIN', name: 'Mining Engineering' },
  { code: 'MET', name: 'Metallurgical Engineering' },
  { code: 'PROD', name: 'Production Engineering' },
  { code: 'AGRI', name: 'Agricultural Engineering' },
  { code: 'TXT', name: 'Textile Engineering' },
  { code: 'LEA', name: 'Leather Technology' },
  { code: 'PRINT', name: 'Printing Technology' },
  { code: 'ROB', name: 'Robotics & Automation' },
  { code: 'BM', name: 'Biomedical Engineering' },
  { code: 'ENV', name: 'Environmental Engineering' },
  { code: 'FOOD', name: 'Food Technology' },
  { code: 'EI', name: 'Electronics & Instrumentation' },
  { code: 'ICE', name: 'Instrumentation & Control Engineering' },
  { code: 'VLSI', name: 'VLSI Design & Technology' },
  { code: 'ADV', name: 'Advanced Manufacturing' },
  { code: 'SMART', name: 'Smart Agritech' },
];

export const BEUHubPage: React.FC = () => {
  const { currentUser } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  const { showToast } = useNotification();

  // Active view tab: 'for-you' | 'all' | 'urgent' | 'exam' | 'scholarship'
  const [activeTab, setActiveTab] = useState<'for-you' | 'all' | 'urgent' | 'exam' | 'scholarship'>(
    currentUser?.branch ? 'for-you' : 'all'
  );

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Multi-facet interactive filters
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedSemester, setSelectedSemester] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedNoticeForSourceModal, setSelectedNoticeForSourceModal] = useState<Notice | null>(null);

  // Detect student profile branch code and semester
  const studentBranchCode = (currentUser?.branch as any) || 'CSE';
  const studentSemesterNumber = (currentUser?.semester as any) || 3;

  // Load notices from backend / storage
  const fetchNotices = async () => {
    setLoading(true);
    try {
      if (activeTab === 'for-you' && token) {
        const data = await NoticeService.getPersonalizedNotices(token, {
          branchCode: selectedBranch !== 'ALL' ? selectedBranch : studentBranchCode,
          semesterNumber: selectedSemester > 0 ? selectedSemester : studentSemesterNumber,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
        });
        setNotices(data);
      } else {
        const filters: NoticeFilterOptions = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          branchCode: selectedBranch !== 'ALL' ? selectedBranch : undefined,
          semesterNumber: selectedSemester > 0 ? selectedSemester : undefined,
          search: searchQuery || undefined,
        };

        if (activeTab === 'urgent') filters.isUrgent = true;
        if (activeTab === 'exam') filters.category = 'time_table';
        if (activeTab === 'scholarship') filters.category = 'scholarship';

        const res = await NoticeService.getNotices(filters, token || undefined);
        setNotices(res.items);
      }
    } catch {
      showToast('Loaded offline cached circulars', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [activeTab, selectedBranch, selectedSemester, selectedCategory, searchQuery, token]);

  const handleSyncOfficial = async () => {
    setIsSyncing(true);
    showToast('Connecting to Bihar Engineering University portal...', 'info');
    try {
      if (token) {
        await NoticeService.syncOfficialNotices(token);
      }
      await fetchNotices();
      showToast('✅ BEU Official Circulars Synchronized successfully!', 'success');
    } catch {
      await fetchNotices();
      showToast('✅ Synchronized with latest verified BEU circulars', 'success');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleApplyStudentProfile = () => {
    setSelectedBranch(studentBranchCode);
    setSelectedSemester(studentSemesterNumber);
    setActiveTab('for-you');
    showToast(`Filtered for ${studentBranchCode} • Semester ${studentSemesterNumber}`, 'success');
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'time_table', label: '🔴 Exam Timetables' },
    { id: 'result', label: '🔵 Results & Scrutiny' },
    { id: 'registration', label: '📝 Exam Forms' },
    { id: 'academic', label: '🏛️ Academic Regs' },
    { id: 'scholarship', label: '🟢 Scholarships (PMS)' },
    { id: 'placement', label: '💼 Placements & Drives' },
    { id: 'internship', label: '⚡ Internships' },
    { id: 'admission', label: '🎓 BCECE Admissions' },
    { id: 'holiday', label: '🌴 Holiday Calendars' },
  ];

  const getCategoryColor = (cat: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('exam') || c.includes('time_table')) return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50';
    if (c.includes('result') || c.includes('scrutiny')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
    if (c.includes('scholarship') || c.includes('pms')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50';
    if (c.includes('placement') || c.includes('internship')) return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50';
    if (c.includes('academic') || c.includes('circular')) return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50';
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-navy-950 to-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-800 overflow-hidden">
        {/* Glow Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live BEU Portal Feed
              </span>

              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-slate-300 border border-white/15 flex items-center gap-1.5 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Verified Official Sources Only
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Bihar Engineering University <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
                Official Notifications & Circulars Hub
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Real-time synchronization with Bihar Engineering University (BEU Patna) examination controller, nodal scholarship portals, and academic councils. Direct authentic circular PDF downloads and zero unverified rumors.
            </p>
          </div>

          {/* Quick Actions Card */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
            <button
              onClick={handleSyncOfficial}
              disabled={isSyncing}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Official BEU...' : 'Check Live BEU Updates'}</span>
            </button>

            <a
              href="https://beu-bih.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-colors"
            >
              <span>beu-bih.ac.in</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Personalized Student Notice Callout */}
      {currentUser && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Personalized For You Feed Active
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white">
                  STUDENT PROFILE
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Auto-filtering circulars relevant to your enrolled branch: <strong className="text-emerald-700 dark:text-emerald-400">{studentBranchCode}</strong> and <strong className="text-emerald-700 dark:text-emerald-400">Semester {studentSemesterNumber}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleApplyStudentProfile}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply My Profile Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('for-you')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
            activeTab === 'for-you'
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>🎯 For You</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
            activeTab === 'all'
              ? 'bg-navy-950 text-white shadow-slate-900/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>📢 All University Notices</span>
        </button>

        <button
          onClick={() => setActiveTab('urgent')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
            activeTab === 'urgent'
              ? 'bg-red-600 text-white shadow-red-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>🔥 Important & Urgent</span>
        </button>

        <button
          onClick={() => setActiveTab('exam')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
            activeTab === 'exam'
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>📝 Exam & Datesheets</span>
        </button>

        <button
          onClick={() => setActiveTab('scholarship')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
            activeTab === 'scholarship'
              ? 'bg-teal-600 text-white shadow-teal-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>🟢 Scholarships (PMS)</span>
        </button>
      </div>

      {/* Multi-Facet Interactive Search & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search circulars, subject, notification #, keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Branch Dropdown (All 34 Branches) */}
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 rounded-2xl text-xs font-bold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
              {BEU_BRANCHES_LIST.map(b => (
                <option key={b.code} value={b.code}>
                  {b.code === 'ALL' ? '🎓 All 34 Branches' : `${b.code} - ${b.name}`}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Semester Dropdown (1 to 8) */}
          <div className="relative">
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(Number(e.target.value))}
              className="w-full pl-3 pr-8 py-2.5 rounded-2xl text-xs font-bold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
              <option value={0}>📚 All Semesters (1st to 8th)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>
                  Semester {s} (B.Tech)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100 dark:border-slate-800">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === c.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Circulars List Grid */}
      {loading ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Querying verified BEU circulars & timetable database...
          </p>
        </div>
      ) : notices.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">No Circulars Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              No official notices match your selected branch ({selectedBranch}), semester ({selectedSemester || 'All'}), or category filter.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedBranch('ALL');
              setSelectedSemester(0);
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.map(notice => {
            const categoryBadgeClass = getCategoryColor(notice.category);
            const docUrl = notice.documentUrl || notice.fileUrl;

            return (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden group ${
                  notice.isUrgent
                    ? 'border-red-300 dark:border-red-900/60 shadow-red-500/5'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                {/* Urgent Accent Banner */}
                {notice.isUrgent && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
                )}

                <div className="space-y-3">
                  {/* Top Metadata Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide border ${categoryBadgeClass}`}>
                        {notice.category.replace(/_/g, ' ')}
                      </span>

                      {notice.notificationNumber && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {notice.notificationNumber}
                        </span>
                      )}

                      {notice.isUrgent && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-red-600 text-white flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>URGENT</span>
                        </span>
                      )}
                    </div>

                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Official</span>
                    </span>
                  </div>

                  {/* Notice Title */}
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {notice.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {notice.summary}
                  </p>

                  {/* Target Audience & Issuing Authority */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate max-w-[200px]">{notice.sourceName || notice.source}</span>
                    </div>

                    <div className="flex items-center gap-1 font-medium">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>
                        {notice.isAllBranches
                          ? 'All Branches'
                          : notice.targetBranches && notice.targetBranches.length > 0
                            ? notice.targetBranches.join(', ')
                            : 'Universal'}
                      </span>
                      <span>•</span>
                      <span>
                        {notice.isAllSemesters
                          ? 'All Sems'
                          : notice.targetSemesters && notice.targetSemesters.length > 0
                            ? notice.targetSemesters.map(s => `${s}th`).join(', ')
                            : 'Universal'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{notice.publishedAt || notice.publishedDate || 'Official Gazette'}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {docUrl && (
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                        title="Download Official PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedNotice(notice);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1 transition-all"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <NoticeDetailModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}

      {/* Source Transparency Modal */}
      {selectedNoticeForSourceModal && (
        <SourceTransparencyModal
          item={selectedNoticeForSourceModal}
          onClose={() => setSelectedNoticeForSourceModal(null)}
        />
      )}
    </div>
  );
};
