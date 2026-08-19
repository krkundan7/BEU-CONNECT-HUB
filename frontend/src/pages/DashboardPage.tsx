import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { StorageService } from '../services/storageService';
import {
  BookOpen, Bot, FileSpreadsheet, Calendar, Sparkles,
  Users, Briefcase, Bell, CheckCircle2, ArrowRight,
  TrendingUp, Clock, AlertCircle, Award, ChevronRight, Check,
  Compass, Flame, Target
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigateTo } = useNavigation();

  const [aiQuickQuery, setAiQuickQuery] = useState('');
  const [tasks, setTasks] = useState(currentUser ? StorageService.getStudyTasks(currentUser.id) : []);

  if (!currentUser) return null;

  const subjects = StorageService.getSubjects(currentUser.branchCode, currentUser.semester);
  const notices = StorageService.getNotices().slice(0, 2);
  const communities = StorageService.getCommunities().filter(c => c.members.includes(currentUser.id)).slice(0, 3);
  const opportunities = StorageService.getOpportunities().slice(0, 2);
  const activeGoalMap = StorageService.getGoalMaps(currentUser.id)[0] || null;

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = tasks.length || 1;
  const progressPercent = Math.round((completedTasksCount / totalTasksCount) * 100);

  const handleToggleTask = (taskId: string) => {
    const updated = StorageService.toggleStudyTask(taskId);
    setTasks(updated.filter(t => t.userId === currentUser.id));
  };

  const handleQuickAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiQuickQuery.trim()) {
      navigateTo('ai-assistant');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Greeting Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentUser.college}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-navy-800 text-slate-300 border border-navy-700">
                {currentUser.branchCode} • Sem {currentUser.semester}
              </span>
              {currentUser.verificationStatus === 'verified' && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500 text-navy-950 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Verified Student
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good Morning, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your customized BEU academic dashboard is ready with 3rd Semester curriculum, high-frequency PYQs, and team opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => navigateTo('goalmap')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold shadow-md transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>BEU GoalMap GPS</span>
            </button>
            <button
              onClick={() => navigateTo('ai-assistant')}
              className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold border border-navy-700 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Ask BEU AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* BEU GoalMap Active Progress Widget */}
      {activeGoalMap ? (
        <div
          onClick={() => navigateTo('goalmap')}
          className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 text-white border border-slate-800 shadow-md hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0 text-xl group-hover:scale-105 transition-transform">
              🎯
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">ACTIVE GOALMAP</span>
                <span className="text-slate-500">•</span>
                <span className="text-[10px] font-bold text-slate-300">{activeGoalMap.targetDeadline} Plan</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {activeGoalMap.goalTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="space-y-1 w-48">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Progress</span>
                <span className="font-bold text-emerald-400 font-mono">{activeGoalMap.progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${activeGoalMap.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-800/80 text-emerald-400 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => navigateTo('goalmap')}
          className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-navy-900 text-white border border-slate-800 shadow-md hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Set Your Academic & Career Goal with BEU GoalMap GPS
              </h3>
              <p className="text-xs text-slate-400">
                AI Gap Analysis • Step-by-Step Personalized Roadmap • Daily Manageable Tasks
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-black rounded-xl group-hover:scale-105 transition-transform flex items-center gap-1.5">
            <span>Create GoalMap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick AI Search Prompt Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-beu-dark flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-emerald-600" />
                Ask BEU AI Academic Assistant
              </span>
              <span className="text-[11px] text-beu-muted">English • हिन्दी • Hinglish</span>
            </div>

            <form onSubmit={handleQuickAiSubmit} className="flex gap-2">
              <input
                type="text"
                value={aiQuickQuery}
                onChange={(e) => setAiQuickQuery(e.target.value)}
                placeholder="Ask any concept: 'Explain AVL Tree Rotations' or 'DBMS Normalization numerical'..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-slate-50"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Ask</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Explain AVL Tree Rotations',
                'BCNF vs 3NF condition',
                'Prim vs Kruskal MST',
                'Generate 5 practice questions'
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => {
                    setAiQuickQuery(prompt);
                    navigateTo('ai-assistant');
                  }}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg transition-colors border border-slate-200/80"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Today's Study Tasks */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-beu-dark flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Today's Planned Study Tasks
                </h3>
                <p className="text-xs text-beu-muted">Personalized to prepare for B.Tech End-Sem exams</p>
              </div>
              <button
                onClick={() => navigateTo('study-planner')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                View Full Plan →
              </button>
            </div>

            <div className="space-y-2">
              {tasks.slice(0, 3).map(task => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                      task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-slate-400' : 'text-beu-dark'}`}>
                        {task.title}
                      </p>
                      <p className="text-[11px] text-beu-muted">{task.subjectName} • {task.durationMinutes} mins</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                    task.taskType === 'pyq' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {task.taskType}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Subjects Grid */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-beu-dark flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Curriculum Subjects ({currentUser.branchCode} Sem {currentUser.semester})
                </h3>
                <p className="text-xs text-beu-muted">Browse syllabus, PYQs, handwritten notes and videos</p>
              </div>
              <button
                onClick={() => navigateTo('study-hub')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                All Subjects →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.slice(0, 4).map(sub => (
                <div
                  key={sub.id}
                  onClick={() => navigateTo('subject-detail', { subjectId: sub.id })}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-navy-200 hover:bg-navy-50/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-white text-navy-900 border border-slate-200 px-2 py-0.5 rounded">
                      {sub.code}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                      {sub.credits} Credits
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-beu-dark group-hover:text-navy-900 line-clamp-1 mb-1">
                    {sub.name}
                  </h4>
                  <p className="text-[11px] text-beu-muted line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-emerald-600">
                    <span>5 Units Syllabus</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          {/* Upcoming Exam Countdown Widget */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950 to-navy-950 text-white shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded">
                Upcoming Exam
              </span>
              <Clock className="w-4 h-4 text-red-400" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">BEU 3rd Sem End-Term Exam</h4>
              <p className="text-xs text-slate-300 mt-0.5">Commencing from Sept 18, 2025</p>
            </div>

            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-between text-center">
              <div>
                <p className="text-lg font-extrabold text-amber-400">32</p>
                <p className="text-[10px] text-slate-300">Days Left</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-lg font-extrabold text-emerald-400">5</p>
                <p className="text-[10px] text-slate-300">Theory Papers</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-lg font-extrabold text-teal-300">100%</p>
                <p className="text-[10px] text-slate-300">PYQs Available</p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('pyq-analyzer')}
              className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Analyze High-Yield PYQs →
            </button>
          </div>

          {/* Important Official Notices */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-beu-dark flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-500" />
                Important BEU Notices
              </h3>
              <button
                onClick={() => navigateTo('beu-hub')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                All Notices
              </button>
            </div>

            <div className="space-y-2.5">
              {notices.map(n => (
                <div
                  key={n.id}
                  onClick={() => navigateTo('beu-hub')}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 cursor-pointer transition-colors space-y-1.5 group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                      {n.category}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">{n.publishedAt}</span>
                  </div>
                  <p className="text-xs font-semibold text-beu-dark group-hover:text-emerald-700 transition-colors line-clamp-2">{n.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span className="truncate">Source: {n.sourceName || n.source}</span>
                    <span className="font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      View <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Progress Meter */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-beu-dark flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Semester Study Progress
              </h3>
              <span className="text-xs font-bold text-emerald-600">68% Overall</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-700">
                  <span>Data Structures & Algorithms</span>
                  <span className="text-emerald-700">80%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-700">
                  <span>DBMS & SQL</span>
                  <span className="text-emerald-700">70%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-700">
                  <span>Digital Electronics</span>
                  <span className="text-amber-700">55%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '55%' }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('study-progress')}
              className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-navy-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Track Subject Analytics →
            </button>
          </div>

          {/* Communities & Opportunities */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-beu-dark flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-purple-600" />
                Opportunities Spotlight
              </h3>
              <button
                onClick={() => navigateTo('career-hub')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Explore All
              </button>
            </div>

            <div className="space-y-2.5">
              {opportunities.map(opp => (
                <div
                  key={opp.id}
                  onClick={() => {
                    const target = opp.applicationUrl || opp.sourceUrl;
                    if (target) {
                      window.open(target, '_blank', 'noopener,noreferrer');
                    } else {
                      navigateTo('career-hub');
                    }
                  }}
                  className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 hover:bg-purple-50 hover:border-purple-200 cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                      {opp.category}
                    </span>
                    {opp.stipendOrPrize && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {opp.stipendOrPrize}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-purple-950 group-hover:text-navy-950 transition-colors line-clamp-1">{opp.title}</p>
                  <p className="text-[11px] text-purple-800 truncate">{opp.organization}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-purple-100/60">
                    <span className="text-rose-600 font-semibold">Deadline: {opp.deadline}</span>
                    <span className="font-bold text-navy-900 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Apply <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
