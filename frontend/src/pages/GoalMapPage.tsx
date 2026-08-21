import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import { GoalDiscoveryWizard } from '../components/GoalDiscoveryWizard';
import { GoalMap, GoalMilestone, GoalTask } from '../types';
import confetti from 'canvas-confetti';
import {
  Compass, Sparkles, Target, ArrowRight, CheckCircle2, Circle,
  Clock, Calendar, BookOpen, Layers, Award, Zap,
  Search, ShieldCheck, Flame, RefreshCw, Plus, Trash2,
  HelpCircle, ChevronRight, Check, ExternalLink, Bot,
  Send, AlertTriangle, Filter, Laptop, Cpu, GraduationCap,
  Briefcase, BarChart3, TrendingUp, Lightbulb, Play, Share2,
  Printer, Edit3, X, Sliders, CheckSquare, PlusCircle, ChevronDown,
  Code, Terminal, Rocket
} from 'lucide-react';

/* NOV-LOGIC-113: Personalized AI GoalMap Execution Engine
 * Bridges student career goals with semester exam preparation through dynamic milestone mapping and task tracking. */
export const GoalMapPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  // Active GoalMaps & Selection
  const [goalMaps, setGoalMaps] = useState<GoalMap[]>([]);
  const [activeGoalMapId, setActiveGoalMapId] = useState<string | null>(null);

  // Wizard Mode: true if creating new / no goalmap exists
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

  // Active View Tab: 'roadmap' | 'daily_plan' | 'gap_analysis' | 'beu_synergy'
  const [viewTab, setViewTab] = useState<'roadmap' | 'daily_plan' | 'gap_analysis' | 'beu_synergy'>('roadmap');

  // Expanded Milestones State
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});

  // AI Goal Mentor Chat
  const [isMentorOpen, setIsMentorOpen] = useState<boolean>(false);
  const [mentorQuery, setMentorQuery] = useState<string>('');
  const [mentorMessages, setMentorMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([
    {
      sender: 'assistant',
      text: 'Namaste! 🧭 Main aapka **BEU AI Goal Mentor** hoon. Apne active GoalMap, daily tasks, ya semester exam balancing ke baare me koi bhi question poochhein!'
    }
  ]);
  const [isMentorTyping, setIsMentorTyping] = useState<boolean>(false);

  /* NOV-LOGIC-114: Local Storage Goal Roadmap Synchronization Hook */
  useEffect(() => {
    if (currentUser) {
      const stored = StorageService.getGoalMaps(currentUser.id);
      setGoalMaps(stored);
      if (stored.length > 0) {
        if (!activeGoalMapId || !stored.some(g => g.id === activeGoalMapId)) {
          setActiveGoalMapId(stored[0].id);
        }
        setIsWizardOpen(false);
      } else {
        setIsWizardOpen(true);
      }
    }
  }, [currentUser]);

  const activeGoalMap = goalMaps.find(g => g.id === activeGoalMapId) || goalMaps[0] || null;

  /* NOV-LOGIC-115: Auto-Accordion Expansion for Active Milestone */
  useEffect(() => {
    if (activeGoalMap?.milestones && activeGoalMap.milestones.length > 0) {
      setExpandedMilestones({ [activeGoalMap.milestones[0].id]: true });
    }
  }, [activeGoalMap?.id]);

  /* NOV-LOGIC-116: Goal Creation & Confetti Celebration Trigger */
  const handleGoalMapCreated = (newGoalMap: GoalMap) => {
    if (!currentUser) return;
    const updated = [newGoalMap, ...goalMaps];
    setGoalMaps(updated);
    setActiveGoalMapId(newGoalMap.id);
    StorageService.saveGoalMap(newGoalMap);
    setIsWizardOpen(false);
    showToast(`🎉 GoalMap generated: ${newGoalMap.goalTitle}!`, 'success');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  /* NOV-LOGIC-117: Interactive Task Completion & Momentum Feedback */
  const handleToggleTask = (milestoneId: string, taskId: string) => {
    if (!activeGoalMap || !currentUser) return;

    let totalTasks = 0;
    let completedTasks = 0;

    const updatedMilestones = activeGoalMap.milestones.map(ms => {
      if (ms.id === milestoneId) {
        const updatedTasks = ms.tasks.map(t => {
          if (t.id === taskId) {
            const nextCompleted = !t.completed;
            if (nextCompleted) {
              showToast('Task completed! Keep up the momentum! 🔥', 'success');
            }
            return { ...t, completed: nextCompleted };
          }
          return t;
        });

        const allTasksDone = updatedTasks.every(t => t.completed);
        const anyTaskDone = updatedTasks.some(t => t.completed);
        const status = allTasksDone ? 'completed' : anyTaskDone ? 'in_progress' : ms.status;

        return { ...ms, tasks: updatedTasks, status: status as any };
      }
      return ms;
    });

    updatedMilestones.forEach(m => {
      m.tasks.forEach(t => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });

    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const updatedGoalMap: GoalMap = {
      ...activeGoalMap,
      progressPercent,
      milestones: updatedMilestones,
    };

    const updatedList = goalMaps.map(g => g.id === updatedGoalMap.id ? updatedGoalMap : g);
    setGoalMaps(updatedList);
    StorageService.saveGoalMap(updatedGoalMap);

    if (progressPercent === 100) {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      showToast('🏆 Magnificent! All milestones in this GoalMap are 100% completed!', 'success');
    }
  };

  const handleToggleDailyTask = (weekNumber: number, taskId: string) => {
    if (!activeGoalMap || !currentUser || !activeGoalMap.dailySchedule) return;

    const updatedSchedule = activeGoalMap.dailySchedule.map(w => {
      if (w.weekNumber === weekNumber) {
        return {
          ...w,
          days: w.days.map(d => {
            if (d.id === taskId) {
              const nextVal = !d.completed;
              if (nextVal) showToast('Daily action completed! Streak updated ⚡', 'success');
              return { ...d, completed: nextVal };
            }
            return d;
          })
        };
      }
      return w;
    });

    const updatedGoalMap: GoalMap = {
      ...activeGoalMap,
      dailySchedule: updatedSchedule,
    };

    const updatedList = goalMaps.map(g => g.id === updatedGoalMap.id ? updatedGoalMap : g);
    setGoalMaps(updatedList);
    StorageService.saveGoalMap(updatedGoalMap);
  };

  const handleDeleteGoalMap = (id: string) => {
    if (!confirm('Are you sure you want to delete this GoalMap?')) return;
    const remaining = goalMaps.filter(g => g.id !== id);
    setGoalMaps(remaining);
    StorageService.deleteGoalMap(id);
    if (remaining.length > 0) {
      setActiveGoalMapId(remaining[0].id);
    } else {
      setIsWizardOpen(true);
    }
    showToast('GoalMap deleted', 'info');
  };

  const toggleMilestoneExpanded = (id: string) => {
    setExpandedMilestones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendMentorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorQuery.trim()) return;

    const userText = mentorQuery.trim();
    setMentorMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setMentorQuery('');
    setIsMentorTyping(true);

    setTimeout(() => {
      let reply = `Shandar question! Aapke **${activeGoalMap?.goalTitle || 'active goal'}** ke liye main recommend karunga ki aap pehle daily 45 mins core concepts par dein aur fir practical code likhein. Semester exams ke time high-yield units par focus karein.`;
      
      if (userText.toLowerCase().includes('dsa') || userText.toLowerCase().includes('leetcode')) {
        reply = `DSA ke liye Arrays aur Two-Pointer technique se start karein. Daily 2 LeetCode problems solve karein aur har solution ka dry-run notebook me likhein.`;
      } else if (userText.toLowerCase().includes('time') || userText.toLowerCase().includes('college')) {
        reply = `College time ke saath best strategy hai: Weekdays par 1.5 - 2 Hours theory & drills, aur Saturday/Sunday ko 4-5 Hours hands-on project sprint!`;
      }

      setMentorMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
      setIsMentorTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {/* If Wizard is active, render interactive 8-step wizard */}
      {isWizardOpen ? (
        <GoalDiscoveryWizard
          userId={currentUser?.id || 'usr-student'}
          initialBranch={(currentUser?.branch as any) || 'CSE'}
          initialSemester={(currentUser?.semester as any) || 3}
          initialCollege={currentUser?.college || 'Government Engineering College'}
          onGoalMapGenerated={handleGoalMapCreated}
          onCancel={goalMaps.length > 0 ? () => setIsWizardOpen(false) : undefined}
        />
      ) : activeGoalMap ? (
        <div className="space-y-6">
          {/* Top Hero Banner */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-navy-950 to-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-800 overflow-hidden">
            {/* Ambient Glow Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-md">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Active Personalized Roadmap</span>
                  </span>

                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-slate-300 border border-white/15 backdrop-blur-md">
                    {activeGoalMap.studentProfile.branch} • Sem {activeGoalMap.studentProfile.semester}
                  </span>

                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>{activeGoalMap.streakDays} Day Streak</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                  {activeGoalMap.goalTitle}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {activeGoalMap.targetOutcome}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2 max-w-md">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Goal Completion Progress</span>
                    <span className="text-emerald-400 font-black">{activeGoalMap.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${activeGoalMap.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Goal Controls & Switcher */}
              <div className="flex flex-col gap-2.5 flex-shrink-0">
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create / Switch Goal</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMentorOpen(!isMentorOpen)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AI Goal Mentor</span>
                  </button>

                  <button
                    onClick={() => handleDeleteGoalMap(activeGoalMap.id)}
                    className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete GoalMap"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation View Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setViewTab('roadmap')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
                viewTab === 'roadmap'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-slate-900/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>🗺️ Step-by-Step Roadmap ({activeGoalMap.milestones.length} Phases)</span>
            </button>

            <button
              onClick={() => setViewTab('daily_plan')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
                viewTab === 'daily_plan'
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>⚡ Aaj Mujhe Kya Karna Hai? (Daily Plan)</span>
            </button>

            <button
              onClick={() => setViewTab('gap_analysis')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
                viewTab === 'gap_analysis'
                  ? 'bg-blue-600 text-white shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>🧠 Skill Gap Analysis</span>
            </button>

            <button
              onClick={() => setViewTab('beu_synergy')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
                viewTab === 'beu_synergy'
                  ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>🏛️ BEU Semester Synergy</span>
            </button>
          </div>

          {/* Tab 1: Roadmap View */}
          {viewTab === 'roadmap' && (
            <div className="space-y-4">
              {activeGoalMap.milestones.map((milestone, idx) => {
                const isExpanded = expandedMilestones[milestone.id] !== false;
                const completedCount = milestone.tasks.filter(t => t.completed).length;
                const totalCount = milestone.tasks.length;

                return (
                  <div
                    key={milestone.id}
                    className={`rounded-3xl border transition-all overflow-hidden ${
                      milestone.status === 'completed'
                        ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-900/40'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* Milestone Header Bar */}
                    <div
                      onClick={() => toggleMilestoneExpanded(milestone.id)}
                      className="p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                          milestone.status === 'completed'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-900 dark:bg-slate-800 text-white'
                        }`}>
                          {milestone.status === 'completed' ? <Check className="w-4 h-4" /> : milestone.phaseNumber}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              {milestone.timeframe}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              {completedCount}/{totalCount} Tasks Done
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            {milestone.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Milestone Expanded Body */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-6 text-xs leading-relaxed">
                        {/* Why This Step Callout */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Why This Step Matters:</span>
                          <p className="text-slate-700 dark:text-slate-300 font-medium">
                            {milestone.whyThisStep}
                          </p>
                        </div>

                        {/* What to Learn & What to Do Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                            <h4 className="font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wide">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                              <span>What to Learn (Core Concepts)</span>
                            </h4>
                            <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                              {milestone.whatToLearn?.map((item, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-emerald-600 font-bold">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                            <h4 className="font-black text-blue-900 dark:text-blue-300 flex items-center gap-1.5 uppercase tracking-wide">
                              <Terminal className="w-3.5 h-3.5 text-blue-600" />
                              <span>What to Do (Action Guide)</span>
                            </h4>
                            <p className="text-slate-700 dark:text-slate-300">
                              {milestone.whatToDo}
                            </p>
                          </div>
                        </div>

                        {/* Tasks Checklist */}
                        <div className="space-y-2.5">
                          <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                            Milestone Action Tasks ({completedCount}/{totalCount})
                          </h4>

                          <div className="space-y-2">
                            {milestone.tasks.map(task => (
                              <div
                                key={task.id}
                                onClick={() => handleToggleTask(milestone.id, task.id)}
                                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                  task.completed
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                                    task.completed
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                                  }`}>
                                    {task.completed && <Check className="w-3 h-3" />}
                                  </div>

                                  <div className="space-y-0.5">
                                    <p className={`font-bold text-xs ${task.completed ? 'line-through opacity-70' : 'text-slate-900 dark:text-white'}`}>
                                      {task.title}
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                      {task.description}
                                    </p>
                                  </div>
                                </div>

                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex-shrink-0">
                                  {task.estimatedHours} hrs
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Project Idea Spec */}
                        {milestone.projectIdea && (
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-300/40 dark:border-purple-600/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-black text-purple-900 dark:text-purple-300 flex items-center gap-1.5 uppercase tracking-wide">
                                <Rocket className="w-4 h-4 text-purple-600" />
                                <span>Milestone Capstone Build: {milestone.projectIdea.title}</span>
                              </h4>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-600 text-white">
                                PORTFOLIO PROJECT
                              </span>
                            </div>

                            <p className="text-slate-700 dark:text-slate-300">
                              {milestone.projectIdea.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="font-bold text-purple-900 dark:text-purple-300">Stack:</span>
                              {milestone.projectIdea.techStack.map((tech, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-800 dark:text-purple-200">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Verified Resources & Practice */}
                        {milestone.recommendedResources && milestone.recommendedResources.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                              Curated Documentation & Free High-Yield Resources
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {milestone.recommendedResources.map(res => (
                                <a
                                  key={res.id}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 flex items-center justify-between gap-3 group transition-colors"
                                >
                                  <div className="space-y-0.5">
                                    <p className="font-black text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                                      {res.title}
                                    </p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                      {res.whyUseful}
                                    </p>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 flex-shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: "Aaj Mujhe Kya Karna Hai?" Daily Action Schedule */}
          {viewTab === 'daily_plan' && activeGoalMap.dailySchedule && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-emerald-950 dark:text-emerald-200">
                    Day-by-Day Action Schedule Calibrated for {activeGoalMap.studentProfile.hoursDaily} hrs/day
                  </h3>
                  <p className="text-xs text-emerald-900 dark:text-emerald-300">
                    No guesswork on what to study today. Complete your daily card, tick the checkbox, and maintain your active streak!
                  </p>
                </div>
              </div>

              {activeGoalMap.dailySchedule.map(week => (
                <div key={week.weekNumber} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Week {week.weekNumber}: {week.weekTheme}
                    </h3>
                    <span className="text-xs font-bold text-slate-400">
                      {week.days.filter(d => d.completed).length}/{week.days.length} Completed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {week.days.map(day => (
                      <div
                        key={day.id}
                        onClick={() => handleToggleDailyTask(week.weekNumber, day.id)}
                        className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          day.completed
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-200 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {day.dayLabel}
                            </span>

                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                              day.completed
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800'
                            }`}>
                              {day.completed && <Check className="w-3 h-3" />}
                            </div>
                          </div>

                          <h4 className={`text-xs font-black leading-snug ${day.completed ? 'line-through opacity-70' : 'text-slate-900 dark:text-white'}`}>
                            {day.title}
                          </h4>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                            {day.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-400">
                          <span className="uppercase">{day.category}</span>
                          <span>{day.durationMinutes} mins</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Skill Gap Analysis View */}
          {viewTab === 'gap_analysis' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Skill Gap & Readiness Analysis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detailed gap assessment bridging your current academic foundations to professional readiness.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Current Position</span>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {activeGoalMap.gapAnalysis.currentPositionSummary}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {activeGoalMap.gapAnalysis.alreadyLearned.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                  <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">Target Competency</span>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {activeGoalMap.gapAnalysis.targetPositionSummary}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {activeGoalMap.gapAnalysis.highPriority.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white">
                        Target: {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: BEU Semester Synergy View */}
          {viewTab === 'beu_synergy' && activeGoalMap.beuAcademicContext && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  BEU Semester Academic & Career Integration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  How your current Bihar Engineering University semester subjects directly support this career roadmap.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">Curriculum Bridge</span>
                <p className="text-xs font-medium text-indigo-950 dark:text-indigo-200 leading-relaxed">
                  {activeGoalMap.beuAcademicContext.curriculumBridgeNote}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">Directly Relevant Semester Subjects</h4>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {activeGoalMap.beuAcademicContext.relevantSubjects.map((sub, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">High-Yield Exam Units</h4>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {activeGoalMap.beuAcademicContext.highYieldUnits.map((u, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Floating AI Goal Mentor Drawer */}
      {isMentorOpen && (
        <div className="fixed bottom-20 right-4 sm:right-8 z-50 w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[500px] animate-in slide-in-from-bottom-5">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs font-black">BEU AI Goal Mentor</p>
                <p className="text-[10px] text-slate-300">{activeGoalMap?.goalTitle || 'Career Advisor'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMentorOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs scrollbar-thin">
            {mentorMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-emerald-600 text-white'
                    : 'mr-auto bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isMentorTyping && (
              <div className="text-[10px] text-slate-400 italic">Mentor is typing...</div>
            )}
          </div>

          <form onSubmit={handleSendMentorMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={mentorQuery}
              onChange={e => setMentorQuery(e.target.value)}
              placeholder="Ask about roadmap, daily tasks..."
              className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
