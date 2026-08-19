import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigation } from '../context/NavigationContext';
import { StorageService } from '../services/storageService';
import { GoalMapEngine, GOAL_PRESETS, GoalPreset } from '../services/goalMapEngine';
import { GoalMap, GoalMilestone, GoalTask } from '../types';
import confetti from 'canvas-confetti';
import {
  Compass, Sparkles, Target, ArrowRight, CheckCircle2, Circle,
  Clock, Calendar, BookOpen, Layers, Award, Zap,
  Search, ShieldCheck, Flame, RefreshCw, Plus, Trash2,
  HelpCircle, ChevronRight, Check, ExternalLink, Bot,
  Send, AlertTriangle, Filter, Laptop, Cpu, GraduationCap,
  Briefcase, BarChart3, TrendingUp, Lightbulb, Play, Share2,
  Printer, Edit3, X, Sliders, CheckSquare, PlusCircle
} from 'lucide-react';

export const GoalMapPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();
  const { navigateTo } = useNavigation();

  // Active GoalMap & Stored GoalMaps
  const [goalMaps, setGoalMaps] = useState<GoalMap[]>([]);
  const [activeGoalMapId, setActiveGoalMapId] = useState<string | null>(null);

  // Creation Wizard State
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [wizardMode, setWizardMode] = useState<'preset' | 'custom'>('preset');

  // Wizard Step 1: Goal Selection
  const [selectedPreset, setSelectedPreset] = useState<GoalPreset | null>(GOAL_PRESETS[0]);
  const [customGoalTitle, setCustomGoalTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<'career' | 'academic' | 'skill' | 'project' | 'custom'>('career');
  const [targetOutcome, setTargetOutcome] = useState('');

  // Wizard Step 2: Student Profile & Time
  const [branch, setBranch] = useState(currentUser?.branchCode || 'CSE');
  const [semester, setSemester] = useState<number>(currentUser?.semester || 3);
  const [currentLevel, setCurrentLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [existingSkillsInput, setExistingSkillsInput] = useState('C/C++, HTML/CSS, Git Basics');
  const [hoursDaily, setHoursDaily] = useState<number>(3);
  const [targetDeadline, setTargetDeadline] = useState('6 Months');
  const [learningPrefs, setLearningPrefs] = useState<string[]>(['Videos', 'Projects', 'Practice']);

  // Wizard Step 4: Generating Animation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepText, setGenerationStepText] = useState('Analyzing goal and prerequisite hierarchy...');

  // UI Filters & Modals
  const [milestoneFilter, setMilestoneFilter] = useState<'all' | 'in_progress' | 'upcoming' | 'completed'>('all');
  const [isRecalibrateOpen, setIsRecalibrateOpen] = useState(false);
  const [recalibrateHours, setRecalibrateHours] = useState(3);
  const [recalibrateDeadline, setRecalibrateDeadline] = useState('6 Months');

  // Add Task Modal / Inline State
  const [activeAddingMilestoneId, setActiveAddingMilestoneId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskHours, setNewTaskHours] = useState(4);
  const [newTaskPriority, setNewTaskPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newTaskCategory, setNewTaskCategory] = useState<'learn' | 'practice' | 'project' | 'beu_prep'>('practice');

  // AI Goal Mentor Chat State
  const [mentorQuery, setMentorQuery] = useState('');
  const [mentorMessages, setMentorMessages] = useState<{ sender: 'user' | 'assistant'; text: string; action?: string }[]>([
    {
      sender: 'assistant',
      text: 'Namaste! 🧭 Main aapka **BEU AI Goal Mentor** hoon. Apne active GoalMap, daily tasks, ya semester exam balancing ke baare me koi bhi question poochhein!'
    }
  ]);
  const [isMentorTyping, setIsMentorTyping] = useState(false);

  // Sync GoalMaps with Storage on mount / user change
  useEffect(() => {
    if (currentUser) {
      const stored = StorageService.getGoalMaps(currentUser.id);
      setGoalMaps(stored);
      if (stored.length > 0) {
        if (!activeGoalMapId || !stored.some(g => g.id === activeGoalMapId)) {
          setActiveGoalMapId(stored[0].id);
        }
        setIsCreatingNew(false);
      } else {
        setIsCreatingNew(true);
        setWizardStep(1);
      }
      setBranch(currentUser.branchCode || 'CSE');
      setSemester(currentUser.semester || 3);
    }
  }, [currentUser]);

  // Active GoalMap Selection
  const activeGoalMap = goalMaps.find(g => g.id === activeGoalMapId) || goalMaps[0] || null;

  const handleStartWizard = () => {
    setIsCreatingNew(true);
    setWizardStep(1);
    setWizardMode('preset');
    setSelectedPreset(GOAL_PRESETS[0]);
    setCustomGoalTitle('');
  };

  const handleSelectPreset = (preset: GoalPreset) => {
    setSelectedPreset(preset);
    setWizardMode('preset');
    setCustomGoalTitle('');
    setCustomCategory(preset.category);
    setTargetOutcome(preset.targetOutcome);
    setTargetDeadline(preset.defaultDeadline);
  };

  const handleQuickAddSkill = (skill: string) => {
    const skills = existingSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    if (!skills.includes(skill)) {
      setExistingSkillsInput(skills.length > 0 ? `${existingSkillsInput}, ${skill}` : skill);
    }
  };

  const handleGenerateRoadmap = () => {
    if (!currentUser) return;
    setWizardStep(4);
    setIsGenerating(true);

    const steps = [
      '🔍 Analyzing goal prerequisites & skill hierarchy...',
      '📚 Cross-referencing BEU syllabus & high-yield PYQ patterns...',
      '🛠️ Calculating personalized skill gap analysis...',
      '🎯 Curating verified documentation & high-yield tasks...',
      '🚀 Finalizing your personalized BEU GoalMap...'
    ];

    steps.forEach((st, idx) => {
      setTimeout(() => {
        setGenerationStepText(st);
      }, (idx + 1) * 550);
    });

    setTimeout(() => {
      const skillsArray = existingSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const finalTitle = wizardMode === 'custom' && customGoalTitle.trim()
        ? customGoalTitle.trim()
        : selectedPreset?.title || 'Full-Stack Software Developer';

      const finalOutcome = wizardMode === 'custom' && targetOutcome.trim()
        ? targetOutcome.trim()
        : selectedPreset?.targetOutcome || 'Achieve technical mastery with verified portfolio';

      const newGoalMap = GoalMapEngine.generateGoalMap({
        userId: currentUser.id,
        goalTitle: finalTitle,
        category: wizardMode === 'custom' ? customCategory : (selectedPreset?.category || 'career'),
        targetOutcome: finalOutcome,
        targetDeadline,
        branch,
        semester,
        currentLevel,
        existingSkills: skillsArray,
        hoursDaily,
        learningPreference: learningPrefs
      });

      StorageService.saveGoalMap(newGoalMap);
      const updated = StorageService.getGoalMaps(currentUser.id);
      setGoalMaps(updated);
      setActiveGoalMapId(newGoalMap.id);
      setIsGenerating(false);
      setIsCreatingNew(false);

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}

      showToast(`Your personalized GoalMap "${newGoalMap.goalTitle}" is live! 🚀`, 'success');
    }, 2900);
  };

  const handleToggleTask = (taskId: string) => {
    if (!activeGoalMap) return;
    const updated = StorageService.toggleGoalTask(activeGoalMap.id, taskId);
    if (updated) {
      setGoalMaps(StorageService.getGoalMaps(currentUser?.id));
      showToast('Task updated! Progress recalculated.', 'info');
    }
  };

  const handleAddNewTask = (milestoneId: string) => {
    if (!activeGoalMap || !newTaskTitle.trim()) return;
    const updated = StorageService.addGoalTask(activeGoalMap.id, milestoneId, {
      title: newTaskTitle.trim(),
      description: 'Custom self-directed drill added by student.',
      estimatedHours: Number(newTaskHours) || 2,
      priority: newTaskPriority,
      completed: false,
      category: newTaskCategory
    });

    if (updated) {
      setGoalMaps(StorageService.getGoalMaps(currentUser?.id));
      setActiveAddingMilestoneId(null);
      setNewTaskTitle('');
      showToast('New task added to milestone!', 'success');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (!activeGoalMap) return;
    const updated = StorageService.deleteGoalTask(activeGoalMap.id, taskId);
    if (updated) {
      setGoalMaps(StorageService.getGoalMaps(currentUser?.id));
      showToast('Task removed from roadmap', 'info');
    }
  };

  const handleRecalibrateSchedule = () => {
    if (!activeGoalMap) return;
    const updated = StorageService.updateGoalMapSchedule(activeGoalMap.id, recalibrateHours, recalibrateDeadline);
    if (updated) {
      setGoalMaps(StorageService.getGoalMaps(currentUser?.id));
      setIsRecalibrateOpen(false);
      showToast('Schedule recalibrated successfully! ⏱️', 'success');
    }
  };

  const handleDeleteGoalMap = (goalMapId: string) => {
    if (confirm('Are you sure you want to delete this GoalMap?')) {
      StorageService.deleteGoalMap(goalMapId);
      const updated = StorageService.getGoalMaps(currentUser?.id);
      setGoalMaps(updated);
      if (activeGoalMapId === goalMapId) {
        setActiveGoalMapId(updated.length > 0 ? updated[0].id : null);
      }
      if (updated.length === 0) {
        setIsCreatingNew(true);
        setWizardStep(1);
      }
      showToast('GoalMap deleted', 'info');
    }
  };

  const handleShareToFeed = () => {
    if (!currentUser || !activeGoalMap) return;
    StorageService.addPost({
      id: `post-gm-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userCollege: currentUser.college,
      userBranch: currentUser.branchCode,
      userSemester: currentUser.semester,
      isVerified: currentUser.verificationStatus === 'verified',
      content: `🎯 **My BEU GoalMap: ${activeGoalMap.goalTitle}**\n\nI just calibrated my personalized academic & career GoalMap on BEU Connect Hub! Target: ${activeGoalMap.targetOutcome} over ${activeGoalMap.targetDeadline} (${activeGoalMap.studentProfile.hoursDaily} hrs/day). Current progress: ${activeGoalMap.progressPercent}%. Let's achieve this together! 🚀`,
      category: 'educational',
      likes: [currentUser.id],
      comments: [],
      saves: [],
      tags: ['BEUGoalMap', activeGoalMap.category, 'CareerGPS', currentUser.branchCode],
      createdAt: 'Just now'
    });

    showToast('GoalMap progress shared to Campus Social Feed! 📢', 'success');
  };

  const handlePrintRoadmap = () => {
    window.print();
  };

  const handleAskMentor = (queryText?: string) => {
    const q = queryText || mentorQuery.trim();
    if (!q || !activeGoalMap) return;

    setMentorMessages(prev => [...prev, { sender: 'user', text: q }]);
    if (!queryText) setMentorQuery('');
    setIsMentorTyping(true);

    setTimeout(() => {
      const mentorReply = GoalMapEngine.askGoalMentor(q, activeGoalMap);
      setMentorMessages(prev => [
        ...prev,
        { sender: 'assistant', text: mentorReply.answer, action: mentorReply.suggestedAction }
      ]);
      setIsMentorTyping(false);
    }, 500);
  };

  // Filtered Milestones
  const filteredMilestones = activeGoalMap ? activeGoalMap.milestones.filter(m => {
    if (milestoneFilter === 'all') return true;
    return m.status === milestoneFilter;
  }) : [];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-navy-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin [animation-duration:8s]" />
            <span>BEU GoalMap — Personal Academic & Career GPS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Your Goal. Your Path. Your Future.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            BEU GoalMap connects your <strong>Academic Syllabus</strong> + <strong>Industry Career Target</strong> + <strong>Personal Time Budget</strong> to build a personalized step-by-step roadmap with daily manageable tasks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {goalMaps.length > 0 && !isCreatingNew && (
            <button
              onClick={handleStartWizard}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New GoalMap</span>
            </button>
          )}
        </div>
      </div>

      {/* CREATION WIZARD (If no GoalMaps or Creating New) */}
      {isCreatingNew ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 max-w-4xl mx-auto animate-in fade-in">
          {/* Wizard Stepper Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                STEP {wizardStep} OF 3
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                {wizardStep === 1 && 'What is your primary goal?'}
                {wizardStep === 2 && 'Analyze Your Current Position & Time Budget'}
                {wizardStep === 3 && 'AI Gap Analysis & BEU Syllabus Mapping'}
                {wizardStep === 4 && 'Generating Your Personalized GoalMap...'}
              </h2>
            </div>

            {goalMaps.length > 0 && (
              <button
                onClick={() => setIsCreatingNew(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            )}
          </div>

          {/* STEP 1: WHAT IS YOUR GOAL? */}
          {wizardStep === 1 && (
            <div className="space-y-6">
              {/* Mode Tabs */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setWizardMode('preset')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    wizardMode === 'preset' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⭐ Popular Blueprints ({GOAL_PRESETS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setWizardMode('custom')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    wizardMode === 'custom' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ✏️ Custom Goal
                </button>
              </div>

              {wizardMode === 'preset' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-3">
                    Select a Verified Career / Academic Blueprint:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {GOAL_PRESETS.map(preset => {
                      const isSelected = selectedPreset?.id === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset)}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2.5 relative ${
                            isSelected
                              ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between pr-6">
                              <span className="text-2xl">{preset.icon}</span>
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {preset.defaultDeadline}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm leading-snug">{preset.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{preset.tagline}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="text-emerald-700 font-semibold">{preset.category.toUpperCase()}</span>
                            <span>{preset.defaultSkillsNeeded.length} Skills</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Custom Goal Form */
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-800 text-xs mb-1.5">
                      Enter Your Custom Goal Title:
                    </label>
                    <input
                      type="text"
                      value={customGoalTitle}
                      onChange={(e) => setCustomGoalTitle(e.target.value)}
                      placeholder="e.g. Cloud DevOps Engineer & AWS Certification"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-navy-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">Goal Category</label>
                      <select
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-xs font-medium"
                      >
                        <option value="career">Career / SDE / Job Placement</option>
                        <option value="academic">Academic Distinction / GATE / Exams</option>
                        <option value="skill">Technical Skill Mastery</option>
                        <option value="project">Startup / Product / Hackathon</option>
                        <option value="custom">General Custom Blueprint</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 text-xs mb-1.5">Target Outcome</label>
                      <input
                        type="text"
                        value={targetOutcome}
                        onChange={(e) => setTargetOutcome(e.target.value)}
                        placeholder="e.g. Pass AWS SAA-C03 exam with 850+ score"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-6 py-3 bg-navy-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all transform hover:scale-102"
                >
                  <span>Continue to Profile Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PROFILE ANALYSIS & TIME AVAILABILITY */}
          {wizardStep === 2 && (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Branch */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Your BEU Engineering Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    {['CSE', 'AIML', 'DS', 'ECE', 'EE', 'ME', 'CE', 'IT'].map(b => (
                      <option key={b} value={b}>{b} (Engineering)</option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Current Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Skill Level */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Current Skill Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'beginner', label: '🌱 Beginner', sub: 'Starting from scratch / Basics' },
                    { id: 'intermediate', label: '🌿 Intermediate', sub: 'Knows syntax & some projects' },
                    { id: 'advanced', label: '🌳 Advanced', sub: 'Ready for full mock interviews' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setCurrentLevel(lvl.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        currentLevel === lvl.id
                          ? 'bg-navy-900 text-white font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block text-xs">{lvl.label}</span>
                      <span className="text-[10px] opacity-80">{lvl.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Existing Skills */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Existing Skills & Languages Known (Comma-separated)
                </label>
                <input
                  type="text"
                  value={existingSkillsInput}
                  onChange={(e) => setExistingSkillsInput(e.target.value)}
                  placeholder="e.g. C++, Basic Python, HTML/CSS, Git"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-medium mb-2"
                />
                <div className="flex flex-wrap gap-1.5 items-center text-[10px]">
                  <span className="text-slate-400 font-semibold">Quick Add:</span>
                  {['C/C++', 'Python', 'JavaScript', 'HTML/CSS', 'Java', 'SQL', 'Git', 'DSA Basics'].map(sk => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => handleQuickAddSkill(sk)}
                      className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 transition-colors"
                    >
                      + {sk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Budget & Target Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block font-bold text-slate-800">
                    Daily Study Time Availability: <strong className="text-emerald-700">{hoursDaily} Hours / Day</strong>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    step={1}
                    value={hoursDaily}
                    onChange={(e) => setHoursDaily(Number(e.target.value))}
                    className="w-full accent-navy-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1 hr (Light)</span>
                    <span>3-4 hrs (Optimal)</span>
                    <span>8 hrs (Intensive)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <label className="block font-bold text-slate-800">Target Timeline</label>
                  <select
                    value={targetDeadline}
                    onChange={(e) => setTargetDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    <option value="1 Month">1 Month (Emergency Sprint)</option>
                    <option value="3 Months">3 Months (Semester Focused)</option>
                    <option value="6 Months">6 Months (Standard Job-Ready)</option>
                    <option value="1 Year">1 Year (Deep Mastery / GATE)</option>
                  </select>
                  <p className="text-[10px] text-slate-400">Calibrated for {targetDeadline} milestone phases.</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-bold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="px-6 py-2.5 bg-navy-900 hover:bg-slate-800 text-white font-black rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Preview Gap Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: GAP ANALYSIS & BEU SYLLABUS MAPPING */}
          {wizardStep === 3 && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>AI Skill Gap & Prerequisite Breakdown</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Based on your current profile in <strong>{branch} Semester {semester}</strong> and target outcome of <strong>"{customGoalTitle || selectedPreset?.title}"</strong>, here is your calculated skill gap:
                </p>
              </div>

              {/* Gap Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                    ✓ Already Learned
                  </span>
                  <p className="font-bold text-emerald-950">{existingSkillsInput || 'Basic C/C++'}</p>
                  <p className="text-[11px] text-emerald-700">Can skip beginner tutorial loops.</p>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                    🟡 High Priority Gap
                  </span>
                  <p className="font-bold text-amber-950">Production Architecture & Core Problem Sets</p>
                  <p className="text-[11px] text-amber-700">Scheduled for Months 1 & 2.</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">
                    🏛️ BEU Syllabus Connect
                  </span>
                  <p className="font-bold text-blue-950">{branch} Core Semester {semester} Units</p>
                  <p className="text-[11px] text-blue-700">Aligned with 70-Mark theory exams.</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-bold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleGenerateRoadmap}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transform hover:scale-102 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Build My Personalized GoalMap</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: GENERATION LOADER */}
          {wizardStep === 4 && isGenerating && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
              <h3 className="text-lg font-black text-slate-900">Personalizing Your Academic GPS</h3>
              <p className="text-xs text-emerald-700 font-bold max-w-sm mx-auto font-mono">
                {generationStepText}
              </p>
            </div>
          )}
        </div>
      ) : activeGoalMap ? (
        /* ACTIVE GOALMAP DASHBOARD */
        <div className="space-y-6">
          {/* Main Goal Summary Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl">🎯</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {activeGoalMap.goalTitle}
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {activeGoalMap.category.toUpperCase()} • {activeGoalMap.targetDeadline}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  {activeGoalMap.targetOutcome}
                </p>
              </div>

              {/* GoalMap Switcher & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {goalMaps.length > 1 && (
                  <select
                    value={activeGoalMap.id}
                    onChange={(e) => setActiveGoalMapId(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-700 focus:ring-2 focus:ring-navy-900"
                  >
                    {goalMaps.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.goalTitle} ({g.progressPercent}%)
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={() => {
                    setRecalibrateHours(activeGoalMap.studentProfile.hoursDaily);
                    setRecalibrateDeadline(activeGoalMap.targetDeadline);
                    setIsRecalibrateOpen(true);
                  }}
                  className="px-3 py-2 text-xs border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                  title="Recalibrate Schedule"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pacing</span>
                </button>

                <button
                  onClick={handleShareToFeed}
                  className="px-3 py-2 text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                  title="Share progress to Campus Social Feed"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  onClick={handlePrintRoadmap}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Print / Save Roadmap PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteGoalMap(activeGoalMap.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete this GoalMap"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar & Stat Badges */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Roadmap Completion</span>
                <span className="text-emerald-700 font-mono text-sm">{activeGoalMap.progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${activeGoalMap.progressPercent}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl">
                  <Flame className="w-3.5 h-3.5 fill-current" /> {activeGoalMap.streakDays} Day Active Streak
                </span>
                <span className="flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-1 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {activeGoalMap.studentProfile.hoursDaily} Hours/Day
                </span>
                <span className="flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-1 rounded-xl">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" /> {activeGoalMap.studentProfile.branch} Sem {activeGoalMap.studentProfile.semester}
                </span>
                <span className="flex items-center gap-1 font-medium bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl">
                  <Award className="w-3.5 h-3.5" /> {activeGoalMap.milestones.filter(m => m.status === 'completed').length} / {activeGoalMap.milestones.length} Phases Done
                </span>
              </div>
            </div>
          </div>

          {/* ROADMAP HEALTH CHECK CARD */}
          <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-emerald-950 text-sm">GoalMap Health Status:</h4>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                    {activeGoalMap.healthCheck.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-emerald-800">{activeGoalMap.healthCheck.summary}</p>
              </div>
            </div>

            <button
              onClick={() => handleAskMentor('Is my GoalMap realistic and on track?')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs self-start sm:self-auto whitespace-nowrap cursor-pointer"
            >
              Ask AI Mentor
            </button>
          </div>

          {/* TWO COLUMN LAYOUT: ROADMAP VISUAL JOURNEY (LEFT) & AI GOAL MENTOR (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* LEFT 2 COLUMNS: VISUAL MILESTONE JOURNEY */}
            <div className="lg:col-span-2 space-y-5">
              {/* Milestone Tabs Filter */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Visual Step-by-Step Path</span>
                  <span className="text-xs text-slate-400 font-normal">({activeGoalMap.milestones.length} Phases)</span>
                </h3>

                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  {[
                    { id: 'all', label: 'All Phases' },
                    { id: 'in_progress', label: 'Current' },
                    { id: 'upcoming', label: 'Upcoming' },
                    { id: 'completed', label: 'Completed' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setMilestoneFilter(tab.id as any)}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        milestoneFilter === tab.id
                          ? 'bg-white text-navy-900 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milestones Stepper Container */}
              <div className="space-y-6">
                {filteredMilestones.map((milestone) => {
                  const isDone = milestone.status === 'completed';
                  const inProgress = milestone.status === 'in_progress';
                  const isAddingTask = activeAddingMilestoneId === milestone.id;

                  return (
                    <div
                      key={milestone.id}
                      className={`rounded-3xl border transition-all p-5 sm:p-6 space-y-4.5 ${
                        inProgress
                          ? 'bg-white border-emerald-400 shadow-md ring-2 ring-emerald-400/20'
                          : isDone
                          ? 'bg-slate-50/80 border-slate-200 opacity-90'
                          : 'bg-white border-slate-200 shadow-xs'
                      }`}
                    >
                      {/* Milestone Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                              isDone
                                ? 'bg-emerald-500 text-white'
                                : inProgress
                                ? 'bg-navy-900 text-emerald-400 shadow-sm'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : `0${milestone.phaseNumber}`}
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              {milestone.timeframe}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 leading-snug">
                              {milestone.title}
                            </h4>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : inProgress
                              ? 'bg-navy-900 text-emerald-300'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {milestone.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* "Why This Step?" Banner */}
                      {milestone.whyThisStep && (
                        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
                          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-900 block mb-0.5">Why this step?</span>
                            <p className="text-slate-600 leading-relaxed">{milestone.whyThisStep}</p>
                          </div>
                        </div>
                      )}

                      {/* Tasks Checkbox List */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                            Phase Action Items & Drills ({milestone.tasks.filter(t => t.completed).length}/{milestone.tasks.length} Done):
                          </span>

                          <button
                            type="button"
                            onClick={() => setActiveAddingMilestoneId(isAddingTask ? null : milestone.id)}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Add Custom Task</span>
                          </button>
                        </div>

                        {/* Inline Add Task Form */}
                        {isAddingTask && (
                          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 animate-in fade-in">
                            <h5 className="font-bold text-slate-800 text-xs">Add Action Item to Phase {milestone.phaseNumber}</h5>
                            <input
                              type="text"
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              placeholder="e.g. Solve Unit 2 Previous Year Questions"
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium"
                            />
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <select
                                value={newTaskPriority}
                                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                                className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-xs"
                              >
                                <option value="HIGH">🔴 High Priority</option>
                                <option value="MEDIUM">🟡 Medium Priority</option>
                                <option value="LOW">🟢 Low Priority</option>
                              </select>

                              <select
                                value={newTaskCategory}
                                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                                className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-xs"
                              >
                                <option value="practice">Practice / Drills</option>
                                <option value="learn">Learn Theory</option>
                                <option value="project">Project Work</option>
                                <option value="beu_prep">BEU Exam Prep</option>
                              </select>

                              <input
                                type="number"
                                min={1}
                                max={50}
                                value={newTaskHours}
                                onChange={(e) => setNewTaskHours(Number(e.target.value))}
                                className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-xs"
                                placeholder="Hours"
                              />

                              <div className="flex items-center gap-1.5 ml-auto">
                                <button
                                  type="button"
                                  onClick={() => setActiveAddingMilestoneId(null)}
                                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 font-bold"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddNewTask(milestone.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                                >
                                  Save Task
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          {milestone.tasks.map(task => (
                            <div
                              key={task.id}
                              className={`p-3 rounded-2xl border flex items-start gap-3 transition-all ${
                                task.completed
                                  ? 'bg-slate-50 border-slate-200 text-slate-400'
                                  : 'bg-white border-slate-200 hover:border-emerald-400 text-slate-800'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleToggleTask(task.id)}
                                className="mt-0.5 flex-shrink-0 cursor-pointer"
                                title={task.completed ? 'Mark pending' : 'Mark completed'}
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-500" />
                                )}
                              </button>

                              <div
                                onClick={() => handleToggleTask(task.id)}
                                className="flex-1 space-y-0.5 text-xs cursor-pointer"
                              >
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className={`font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                    {task.title}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                                        task.priority === 'HIGH'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      {task.priority}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {task.estimatedHours}h
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{task.description}</p>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id);
                                }}
                                className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                                title="Remove task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Resources Box */}
                      {milestone.recommendedResources && milestone.recommendedResources.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                            Curated High-Impact Resources:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {milestone.recommendedResources.map(res => (
                              <a
                                key={res.id}
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-800 transition-colors group"
                              >
                                <div className="space-y-0.5 truncate pr-2">
                                  <p className="font-bold text-slate-900 truncate group-hover:text-blue-600">
                                    {res.title}
                                  </p>
                                  <p className="text-[10px] text-slate-500 truncate">{res.whyUseful}</p>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Capstone Project Idea */}
                      {milestone.projectIdea && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-900 to-indigo-950 text-white space-y-1.5 text-xs shadow-xs">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                            <Laptop className="w-3.5 h-3.5" />
                            <span>Recommended Resume Project for Phase {milestone.phaseNumber}</span>
                          </div>
                          <h5 className="font-bold text-white text-sm">{milestone.projectIdea.title}</h5>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {milestone.projectIdea.description}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {milestone.projectIdea.techStack.map(ts => (
                              <span key={ts} className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
                                {ts}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: AI GOAL MENTOR & ADAPTIVE CONTROLS */}
            <div className="space-y-6 sticky top-20">
              {/* AI Goal Mentor Chat Card */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between h-[620px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-xl bg-navy-900 text-emerald-400 flex items-center justify-center font-bold">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">AI Goal Mentor</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Grounded in your active GoalMap</p>
                    </div>
                  </div>

                  {/* Quick Prompts */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'What should I study today?',
                      'Why this milestone?',
                      'I am stuck on this step',
                      'Semester exam in 20 days',
                      'Suggest resume project'
                    ].map((qp, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAskMentor(qp)}
                        className="text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2 py-1 rounded-lg font-medium border border-slate-200 text-left transition-colors cursor-pointer"
                      >
                        {qp}
                      </button>
                    ))}
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
                    {mentorMessages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-navy-900 text-white ml-6'
                            : 'bg-slate-50 text-slate-800 border border-slate-200 mr-2 space-y-2'
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-sans">{m.text}</div>
                        {m.action && (
                          <div className="pt-1.5 border-t border-slate-200/80 text-[10px] font-bold text-emerald-700">
                            → Next Action: {m.action}
                          </div>
                        )}
                      </div>
                    ))}

                    {isMentorTyping && (
                      <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-500 font-medium animate-pulse">
                        Analyzing your GoalMap roadmap...
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskMentor();
                  }}
                  className="relative pt-2 border-t border-slate-100"
                >
                  <input
                    type="text"
                    value={mentorQuery}
                    onChange={(e) => setMentorQuery(e.target.value)}
                    placeholder="Ask in English, Hindi, or Hinglish..."
                    className="w-full pl-3 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!mentorQuery.trim() || isMentorTyping}
                    className="absolute right-1.5 top-3.5 p-1.5 bg-navy-900 text-emerald-400 rounded-lg disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* BEU Academic Integration Box */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <GraduationCap className="w-4 h-4" />
                  <span>BEU Curriculum Integration</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeGoalMap.beuAcademicContext?.examPatternFocus || 'Your GoalMap automatically balances daily practical coding with semester exam scoring.'}
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mapped Subjects:</span>
                  <div className="flex flex-wrap gap-1">
                    {activeGoalMap.beuAcademicContext?.relevantSubjects.map((sub, sIdx) => (
                      <span key={sIdx} className="text-[10px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-medium">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Recalibrate Pacing Modal */}
      {isRecalibrateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Recalibrate Daily Study Pacing</span>
              </div>
              <button
                type="button"
                onClick={() => setIsRecalibrateOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Daily Study Hours: <strong className="text-emerald-700">{recalibrateHours} Hours/Day</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={recalibrateHours}
                  onChange={(e) => setRecalibrateHours(Number(e.target.value))}
                  className="w-full accent-navy-900 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Target Timeline</label>
                <select
                  value={recalibrateDeadline}
                  onChange={(e) => setRecalibrateDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                >
                  <option value="1 Month">1 Month (Emergency Sprint)</option>
                  <option value="3 Months">3 Months (Semester Focused)</option>
                  <option value="6 Months">6 Months (Standard Job-Ready)</option>
                  <option value="1 Year">1 Year (Deep Mastery / GATE)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRecalibrateOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecalibrateSchedule}
                className="px-5 py-2 bg-navy-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Update Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
