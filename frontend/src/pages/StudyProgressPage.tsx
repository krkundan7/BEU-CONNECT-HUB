import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import {
  TrendingUp, Award, CheckCircle2, Clock,
  BookOpen, Sparkles, Flame, Target, ChevronRight
} from 'lucide-react';

export const StudyProgressPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigateTo } = useNavigation();

  if (!currentUser) return null;

  const subjectsProgress = [
    { name: 'Data Structures & Algorithms', code: 'PCC-CS301', percent: 80, completedUnits: '4/5 Units', color: 'bg-emerald-500' },
    { name: 'Database Management Systems', code: 'PCC-CS401', percent: 70, completedUnits: '3.5/5 Units', color: 'bg-emerald-500' },
    { name: 'Object Oriented Programming (C++)', code: 'PCC-CS302', percent: 65, completedUnits: '3/5 Units', color: 'bg-blue-500' },
    { name: 'Digital Electronics', code: 'ESC-301', percent: 55, completedUnits: '2.5/5 Units', color: 'bg-amber-500' },
    { name: 'Discrete Mathematics', code: 'BSC-301', percent: 45, completedUnits: '2/5 Units', color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Academic Performance Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          My Study Progress
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Track syllabus completion, solved PYQs, revision milestones, and daily study streaks for B.Tech Semester {currentUser.semester}.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-1 text-center">
          <p className="text-3xl font-extrabold text-emerald-600">68%</p>
          <p className="text-xs font-bold text-beu-dark">Overall Syllabus Done</p>
          <p className="text-[10px] text-slate-400">15 of 25 Units Covered</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-1 text-center">
          <div className="flex items-center justify-center gap-1 text-3xl font-extrabold text-amber-500">
            <Flame className="w-7 h-7 fill-current" />
            <span>8</span>
          </div>
          <p className="text-xs font-bold text-beu-dark">Day Study Streak</p>
          <p className="text-[10px] text-slate-400">Top 5% in MIT Muzaffarpur</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-1 text-center">
          <p className="text-3xl font-extrabold text-blue-600">18</p>
          <p className="text-xs font-bold text-beu-dark">Solved PYQs Completed</p>
          <p className="text-[10px] text-slate-400">2019-2024 Question Papers</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-1 text-center">
          <p className="text-3xl font-extrabold text-purple-600">780</p>
          <p className="text-xs font-bold text-beu-dark">Karma Contribution Pts</p>
          <p className="text-[10px] text-slate-400">🥇 Top Contributor</p>
        </div>
      </div>

      {/* Subject-Wise Progress Breakdown */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-6">
        <div>
          <h3 className="text-base font-bold text-beu-dark">Subject-Wise Preparation Meters</h3>
          <p className="text-xs text-beu-muted">Based on your completed study tasks and unit tests</p>
        </div>

        <div className="space-y-4">
          {subjectsProgress.map((sub, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-beu-dark">{sub.name}</span>
                  <span className="text-slate-400 ml-2 font-mono text-[11px]">{sub.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">{sub.completedUnits}</span>
                  <span className="font-extrabold text-navy-900">{sub.percent}%</span>
                </div>
              </div>

              <div className="w-full h-3 bg-slate-200/70 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${sub.color}`} style={{ width: `${sub.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
