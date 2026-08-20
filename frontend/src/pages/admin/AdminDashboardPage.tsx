import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { StorageService } from '../../services/storageService';
import {
  ShieldCheck, UserCheck, AlertOctagon, BellRing,
  BookOpen, Users, ArrowRight, TrendingUp, BarChart2
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  const reports = StorageService.getReports().filter(r => r.status === 'pending');
  const users = StorageService.getUsers();
  const pendingUsers = users.filter(u => u.verificationStatus === 'pending');
  const notices = StorageService.getNotices();

  const stats = [
    { label: 'Total Enrolled Students', value: '48,650+', change: '+12% this month', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending Verifications', value: `${pendingUsers.length}`, change: 'Needs Review', icon: UserCheck, color: 'text-amber-600 bg-amber-50', link: 'admin-verification' },
    { label: 'Reported Content Queue', value: `${reports.length}`, change: 'Open Reports', icon: AlertOctagon, color: 'text-red-600 bg-red-50', link: 'admin-moderation' },
    { label: 'Published Official Notices', value: `${notices.length}`, change: 'Verified', icon: BellRing, color: 'text-emerald-600 bg-emerald-50', link: 'admin-notices' }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            BEU Admin & Moderation Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            University verification management, official notice broadcasting, content moderation, and platform security.
          </p>
        </div>

        <button
          onClick={() => navigateTo('admin-notices')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
        >
          <BellRing className="w-4 h-4" />
          <span>Publish New Notice</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={idx}
              onClick={() => st.link && navigateTo(st.link as any)}
              className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle flex flex-col justify-between space-y-3 ${
                st.link ? 'cursor-pointer hover:border-navy-300 hover:shadow-card' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-beu-muted">{st.label}</span>
                <div className={`p-2 rounded-xl ${st.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <p className="text-2xl font-extrabold text-beu-dark">{st.value}</p>
                <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">{st.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigateTo('admin-verification')}
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-subtle hover:shadow-card hover:border-navy-300 cursor-pointer transition-all space-y-3 group"
        >
          <div className="p-3 w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-beu-dark group-hover:text-navy-900">Student Verification Queue</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Verify students against BEU college roll numbers and issue official verified badges.
          </p>
          <div className="flex items-center text-xs font-bold text-amber-700 pt-2">
            <span>Review {pendingUsers.length} Pending Students →</span>
          </div>
        </div>

        <div
          onClick={() => navigateTo('admin-moderation')}
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-subtle hover:shadow-card hover:border-navy-300 cursor-pointer transition-all space-y-3 group"
        >
          <div className="p-3 w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-beu-dark group-hover:text-navy-900">Content Moderation Queue</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Inspect reported posts, comments, or copyrighted note uploads. Take down spam.
          </p>
          <div className="flex items-center text-xs font-bold text-red-700 pt-2">
            <span>Review {reports.length} Open Reports →</span>
          </div>
        </div>

        <div
          onClick={() => navigateTo('admin-syllabus')}
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-subtle hover:shadow-card hover:border-navy-300 cursor-pointer transition-all space-y-3 group"
        >
          <div className="p-3 w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-beu-dark group-hover:text-navy-900">Syllabus & Curriculum Sync</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Manage 34 BEU branches, sync official syllabus versions, and verify 2026 UG regulations.
          </p>
          <div className="flex items-center text-xs font-bold text-blue-700 pt-2">
            <span>Manage 34 BEU Branches →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
