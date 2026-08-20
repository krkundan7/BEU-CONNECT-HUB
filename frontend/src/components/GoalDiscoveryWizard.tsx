import React, { useState } from 'react';
import {
  GOAL_PRESETS, GoalPreset, GoalMapEngine, GoalSpecificQuestion
} from '../services/goalMapEngine';
import { GoalCategoryType, SkillLevelType, GoalMap } from '../types';
import {
  Compass, Sparkles, Target, ArrowRight, ArrowLeft, CheckCircle2,
  Clock, Calendar, BookOpen, Layers, Award, Zap,
  Check, X, Laptop, Cpu, GraduationCap, Briefcase,
  BarChart3, TrendingUp, Lightbulb, ShieldCheck, AlertCircle,
  HelpCircle, ChevronRight, Sliders
} from 'lucide-react';
import { BEU_BRANCHES_LIST } from '../pages/BEUHubPage';

interface GoalDiscoveryWizardProps {
  userId: string;
  initialBranch?: string;
  initialSemester?: number;
  initialCollege?: string;
  onGoalMapGenerated: (goalMap: GoalMap) => void;
  onCancel?: () => void;
}

export const GoalDiscoveryWizard: React.FC<GoalDiscoveryWizardProps> = ({
  userId,
  initialBranch = 'CSE',
  initialSemester = 3,
  initialCollege = 'Government Engineering College',
  onGoalMapGenerated,
  onCancel,
}) => {
  // Current Wizard Step: 1 to 8
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Goal Selection
  const [selectedPreset, setSelectedPreset] = useState<GoalPreset>(GOAL_PRESETS[0]);
  const [isCustomGoal, setIsCustomGoal] = useState<boolean>(false);
  const [customGoalTitle, setCustomGoalTitle] = useState<string>('');
  const [customGoalCategory, setCustomGoalCategory] = useState<GoalCategoryType>('software_dev');
  const [customTargetOutcome, setCustomTargetOutcome] = useState<string>('');

  // Step 2: Academic Profile
  const [branch, setBranch] = useState<string>(initialBranch || 'CSE');
  const [semester, setSemester] = useState<number>(initialSemester || 3);
  const [college, setCollege] = useState<string>(initialCollege || '');
  const [cgpaRange, setCgpaRange] = useState<string>('7.5 - 8.5');
  const [backlogStatus, setBacklogStatus] = useState<string>('0 Backlogs');
  const [syllabusProgress, setSyllabusProgress] = useState<string>('Covered 50%+ of Units');

  // Step 3: Current Skills
  const [programmingKnown, setProgrammingKnown] = useState<boolean>(true);
  const [skillRatings, setSkillRatings] = useState<Record<string, SkillLevelType>>({
    'C / C++': 'basic',
    'Java': 'beginner',
    'Python': 'beginner',
    'JavaScript': 'basic',
    'HTML / CSS': 'basic',
    'React / Frontend': 'beginner',
    'Node.js / Backend': 'beginner',
    'SQL / Databases': 'beginner',
    'Git & GitHub': 'basic',
    'DSA Basics': 'basic',
  });
  const [projectsCount, setProjectsCount] = useState<string>('1-2 Mini Projects');
  const [internshipExp, setInternshipExp] = useState<string>('None yet');
  const [hackathonExp, setHackathonExp] = useState<string>('None yet');

  // Step 4: Dynamic Goal-Specific Answers
  const [goalSpecificAnswers, setGoalSpecificAnswers] = useState<Record<string, any>>({});

  // Step 5: Time Availability & Pace
  const [hoursDaily, setHoursDaily] = useState<number>(2);
  const [hoursWeekend, setHoursWeekend] = useState<number>(4);
  const [learningPace, setLearningPace] = useState<'Fast' | 'Balanced' | 'Flexible'>('Balanced');

  // Step 6: Target Timeline
  const [targetDeadline, setTargetDeadline] = useState<string>('6 Months');

  // Step 8: Generating Animation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStepText, setGenerationStepText] = useState<string>('Analyzing your academic strengths and skill prerequisites...');

  const activeCategory = isCustomGoal ? customGoalCategory : selectedPreset.category;
  const activeTitle = isCustomGoal ? customGoalTitle : selectedPreset.title;
  const dynamicQuestions = GoalMapEngine.getGoalSpecificQuestions(activeCategory, activeTitle);

  const handleSkillLevelChange = (skill: string, level: SkillLevelType) => {
    setSkillRatings(prev => ({ ...prev, [skill]: level }));
  };

  const handleGoalAnswerChange = (questionId: string, value: any) => {
    setGoalSpecificAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 7) {
      handleSynthesizeRoadmap();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSynthesizeRoadmap = () => {
    setCurrentStep(8);
    setIsGenerating(true);

    const animationSteps = [
      '🔍 Analyzing prerequisite dependencies & skill gap...',
      '📚 Cross-referencing BEU Semester syllabus & high-yield units...',
      '⏱️ Calibrating timeline against your daily available hours...',
      '🎯 Curating verified documentation, practice drills & project specs...',
      '🚀 Synthesizing your personalized BEU GoalMap & daily schedule...'
    ];

    animationSteps.forEach((msg, idx) => {
      setTimeout(() => {
        setGenerationStepText(msg);
      }, (idx + 1) * 550);
    });

    setTimeout(() => {
      const existingSkillsList = Object.entries(skillRatings)
        .filter(([_, level]) => level !== 'beginner')
        .map(([skill, level]) => `${skill} (${level})`);

      const finalGoalMap = GoalMapEngine.generatePersonalizedGoalMap({
        userId,
        goalTitle: isCustomGoal && customGoalTitle.trim() ? customGoalTitle.trim() : selectedPreset.title,
        category: isCustomGoal ? customGoalCategory : selectedPreset.category,
        targetOutcome: isCustomGoal && customTargetOutcome.trim() ? customTargetOutcome.trim() : selectedPreset.targetOutcome,
        targetDeadline,
        branch,
        semester,
        college,
        cgpaRange,
        backlogStatus,
        currentLevel: Object.values(skillRatings).includes('advanced') ? 'advanced' : Object.values(skillRatings).includes('intermediate') ? 'intermediate' : 'basic',
        existingSkills: existingSkillsList.length > 0 ? existingSkillsList : ['C / C++ (basic)', 'HTML / CSS (basic)'],
        skillRatings,
        hoursDaily,
        hoursWeekend,
        learningPace,
        learningPreference: ['Hands-on Projects', 'Practice Drills', 'Video Tutorials'],
        goalSpecificAnswers,
      });

      setIsGenerating(false);
      onGoalMapGenerated(finalGoalMap);
    }, 3200);
  };

  const progressPercent = Math.round((currentStep / 7) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Step {currentStep} of 7
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {progressPercent}% Completed
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {currentStep === 1 && '🎯 Select Your Primary Goal'}
                {currentStep === 2 && '👨‍🎓 Academic Profile & University Context'}
                {currentStep === 3 && '💻 Current Skills & Proficiency Level'}
                {currentStep === 4 && `❓ Goal-Specific Questions (${activeTitle})`}
                {currentStep === 5 && '⏱ Time Availability & Learning Pace'}
                {currentStep === 6 && '📅 Target Completion Timeline'}
                {currentStep === 7 && '🧠 Profile Analysis & Skill Gap Preview'}
                {currentStep === 8 && '🚀 Generating Your Personalized GoalMap...'}
              </h2>
            </div>
          </div>

          {onCancel && currentStep < 8 && (
            <button
              onClick={onCancel}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Step 1: Goal Selection */}
      {currentStep === 1 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs sm:text-sm font-medium text-emerald-950 dark:text-emerald-200">
              Select one of the 16 specialized engineering goals or define your own custom target outcome.
            </p>
            <button
              onClick={() => setIsCustomGoal(!isCustomGoal)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-500 transition-all flex-shrink-0"
            >
              {isCustomGoal ? 'Choose from Presets' : 'Enter Custom Goal'}
            </button>
          </div>

          {isCustomGoal ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Define Custom Personalized Goal</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={customGoalTitle}
                    onChange={e => setCustomGoalTitle(e.target.value)}
                    placeholder="e.g. Embedded Systems Firmware Engineer, or Robotics Prototyping"
                    className="w-full px-4 py-2.5 rounded-2xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category Type
                  </label>
                  <select
                    value={customGoalCategory}
                    onChange={e => setCustomGoalCategory(e.target.value as GoalCategoryType)}
                    className="w-full px-4 py-2.5 rounded-2xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="software_dev">💻 Software Development</option>
                    <option value="ai_ml">🤖 AI / ML & Data</option>
                    <option value="web_dev">🌐 Web Development</option>
                    <option value="app_dev">📱 Mobile Apps</option>
                    <option value="gate">📚 GATE / PSU</option>
                    <option value="startup">🚀 Startup / Innovation</option>
                    <option value="job">💼 Core Industry Job</option>
                    <option value="custom">🎯 Other Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Outcome / Dream Result
                  </label>
                  <textarea
                    value={customTargetOutcome}
                    onChange={e => setCustomTargetOutcome(e.target.value)}
                    rows={3}
                    placeholder="e.g. Build 2 embedded microcontrollers, publish a paper, and crack core off-campus roles."
                    className="w-full px-4 py-2.5 rounded-2xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GOAL_PRESETS.map(preset => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset)}
                    className={`p-4 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{preset.icon}</span>
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            {preset.defaultDeadline}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                        {preset.title}
                      </h4>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {preset.tagline}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
                      {preset.defaultSkillsNeeded.slice(0, 2).map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate max-w-[120px]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Academic Profile */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Your Academic Details</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              BEU Connect Hub integrates your university curriculum so you can prepare for your career without falling behind in semester exams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Branch */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Engineering Branch
              </label>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {BEU_BRANCHES_LIST.filter(b => b.code !== 'ALL').map(b => (
                  <option key={b.code} value={b.code}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Semester
              </label>
              <select
                value={semester}
                onChange={e => setSemester(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>
                    Semester {s} (B.Tech)
                  </option>
                ))}
              </select>
            </div>

            {/* CGPA Range */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Current CGPA / Academic Range
              </label>
              <select
                value={cgpaRange}
                onChange={e => setCgpaRange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="8.5+ Distinction">🌟 8.5+ SGPA / CGPA (University Distinction)</option>
                <option value="7.5 - 8.5 First Class">👍 7.5 - 8.5 CGPA (First Class with Honours)</option>
                <option value="6.5 - 7.5">👌 6.5 - 7.5 CGPA</option>
                <option value="Below 6.5">⚠️ Below 6.5 CGPA (Need academic recovery strategy)</option>
              </select>
            </div>

            {/* Backlog Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Backlog Status
              </label>
              <select
                value={backlogStatus}
                onChange={e => setBacklogStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="0 Backlogs">✅ 0 Backlogs (Clean record)</option>
                <option value="1-2 Backlogs">🟡 1-2 Backlogs (Active clearing mode)</option>
                <option value="3+ Backlogs">🔴 3+ Backlogs (Need urgent PYQ revision plan)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Current Skills & Proficiency */}
      {currentStep === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Assess Your Current Skills</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rate your actual hands-on comfort level for each domain. Be honest — this ensures your roadmap starts at the right pace!
            </p>
          </div>

          <div className="space-y-4">
            {Object.keys(skillRatings).map(skillName => {
              const currentLvl = skillRatings[skillName];
              return (
                <div
                  key={skillName}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {skillName}
                  </span>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {(['beginner', 'basic', 'intermediate', 'advanced'] as SkillLevelType[]).map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => handleSkillLevelChange(skillName, lvl)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase transition-all ${
                          currentLvl === lvl
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Completed Projects
              </label>
              <select
                value={projectsCount}
                onChange={e => setProjectsCount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
              >
                <option value="0 (Just started)">0 Projects (Beginner)</option>
                <option value="1-2 Mini Projects">1-2 Mini Projects</option>
                <option value="3-5 Good Projects">3-5 Full Projects</option>
                <option value="5+ Production Apps">5+ Production Deployed Apps</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hackathon / Contest Experience
              </label>
              <select
                value={hackathonExp}
                onChange={e => setHackathonExp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
              >
                <option value="None yet">None yet (Looking to participate)</option>
                <option value="Participated in 1-2">Participated in 1-2 hackathons</option>
                <option value="Won podium finish">Won podium / Finalist</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Goal-Specific Dynamic Questions */}
      {currentStep === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Goal Deep Dive: {activeTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              These questions adapt specifically to your chosen career path for maximum precision.
            </p>
          </div>

          <div className="space-y-5">
            {dynamicQuestions.map(q => (
              <div key={q.id} className="space-y-2">
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                  {q.question}
                </label>

                {q.type === 'select' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, idx) => {
                      const isSelected = goalSpecificAnswers[q.id] === opt || (!goalSpecificAnswers[q.id] && idx === 0);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleGoalAnswerChange(q.id, opt)}
                          className={`p-3 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/20'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === 'text' && (
                  <input
                    type="text"
                    value={goalSpecificAnswers[q.id] || ''}
                    onChange={e => handleGoalAnswerChange(q.id, e.target.value)}
                    placeholder={q.placeholder || 'Enter your response...'}
                    className="w-full px-4 py-2.5 rounded-2xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Time Availability & Learning Pace */}
      {currentStep === 5 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Time & Availability Calibration</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              We calibrate every single daily task so you never feel overwhelmed with college exams.
            </p>
          </div>

          <div className="space-y-5">
            {/* Daily Hours */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Daily Study Time for Goal
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { hours: 0.5, label: '30 Minutes', sub: 'Micro-learning' },
                  { hours: 1, label: '1 Hour', sub: 'Balanced' },
                  { hours: 2, label: '2 Hours', sub: 'Standard' },
                  { hours: 3, label: '3+ Hours', sub: 'Intensive' },
                ].map(opt => (
                  <button
                    key={opt.hours}
                    type="button"
                    onClick={() => setHoursDaily(opt.hours)}
                    className={`p-3 rounded-2xl text-center transition-all ${
                      hoursDaily === opt.hours
                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <p className="text-xs font-black">{opt.label}</p>
                    <p className="text-[10px] opacity-80">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Weekend Hours */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Weekend Study Time (Saturday & Sunday)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { hours: 2, label: '2-3 Hours' },
                  { hours: 4, label: '4-6 Hours (Project sprint)' },
                  { hours: 8, label: '8+ Hours (Deep hackathon)' },
                ].map(opt => (
                  <button
                    key={opt.hours}
                    type="button"
                    onClick={() => setHoursWeekend(opt.hours)}
                    className={`p-3 rounded-2xl text-center text-xs font-black transition-all ${
                      hoursWeekend === opt.hours
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Pace */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Preferred Learning Pace
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['Fast', 'Balanced', 'Flexible'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setLearningPace(p)}
                    className={`p-3 rounded-2xl text-center text-xs font-black transition-all ${
                      learningPace === p
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {p} Pace
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Target Timeline */}
      {currentStep === 6 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Target Completion Horizon</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When do you want to be interview-ready or achieve this target?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { deadline: '3 Months', label: '3 Months Sprint', desc: 'High intensity, rapid daily focus' },
              { deadline: '6 Months', label: '6 Months Standard', desc: '1 Semester balanced preparation' },
              { deadline: '1 Year', label: '1 Year Mastery', desc: 'Complete GATE / Placement roadmap' },
            ].map(opt => (
              <button
                key={opt.deadline}
                type="button"
                onClick={() => setTargetDeadline(opt.deadline)}
                className={`p-5 rounded-3xl text-left transition-all flex flex-col justify-between space-y-3 ${
                  targetDeadline === opt.deadline
                    ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <Calendar className="w-5 h-5 opacity-80" />
                  <p className="text-sm font-black">{opt.label}</p>
                </div>
                <p className="text-xs opacity-80">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 7: Profile Analysis & Skill Gap Preview */}
      {currentStep === 7 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              AI Profile Summary & Gap Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review your personalized discovery matrix before we synthesize your step-by-step GoalMap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Goal Target</span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{activeTitle}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Timeline: <strong>{targetDeadline}</strong> at <strong>{hoursDaily} hrs/day</strong></p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">Academic Context</span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{branch} • Semester {semester}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Academic standing: {cgpaRange} • {backlogStatus}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/40 dark:border-amber-600/30 space-y-2">
            <h4 className="text-xs font-black uppercase text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Skill Gap Highlights to be Bridged</span>
            </h4>
            <p className="text-xs text-amber-950 dark:text-amber-100 leading-relaxed">
              Your personalized GoalMap will systematically take you from your current foundations to mastery across core architecture, real-world portfolio builds, and interview question sets without sacrificing your BEU semester exam performance.
            </p>
          </div>
        </div>
      )}

      {/* Step 8: Generating Animation Screen */}
      {currentStep === 8 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xl">
              <Compass className="w-8 h-8 animate-spin" />
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Synthesizing Your BEU GoalMap
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
              {generationStepText}
            </p>
          </div>
        </div>
      )}

      {/* Wizard Action Footer Navigation */}
      {currentStep < 8 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2.5 rounded-2xl text-xs font-black text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>{currentStep === 7 ? '🚀 Generate My GoalMap' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
