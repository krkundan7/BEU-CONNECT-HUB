import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { AcademicService, FALLBACK_BRANCHES } from '../services/academicService';
import { Subject, Topic, TopicProgress, RegulationVersion, AcademicSession } from '../types';
import {
  BookOpen, Search, CheckCircle2, Clock, AlertCircle, RefreshCw,
  Sparkles, ExternalLink, ChevronRight, ChevronDown, Award,
  Bookmark, Filter, Compass, Flame, ArrowRight, ShieldCheck, Check,
  BookMarked, HelpCircle, FileText, Layers
} from 'lucide-react';

export const StudyHubPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigateTo } = useNavigation();

  // Navigation & Filter states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'syllabus' | 'search' | 'recommendations'>('dashboard');
  const [branches, setBranches] = useState<any[]>(FALLBACK_BRANCHES);
  const [regulations, setRegulations] = useState<RegulationVersion[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);

  const [selectedBranch, setSelectedBranch] = useState<string>(currentUser?.branchCode || 'CSE');
  const [selectedSemester, setSelectedSemester] = useState<number>(currentUser?.semester || 3);
  const [selectedRegulation, setSelectedRegulation] = useState<string>('REG_2026');
  const [selectedSession, setSelectedSession] = useState<string>('2026-2027');

  const [branchSearch, setBranchSearch] = useState('');
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  // Data states
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<any>({
    overallPercentage: 0,
    totalTopicsTracked: 0,
    completedTopics: 0,
    inProgressTopics: 0,
    revisionRequiredTopics: 0,
    subjectProgress: {},
  });
  const [recommendations, setRecommendations] = useState<any>(null);

  // Search tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ subjects: any[]; units: any[]; topics: any[] }>({
    subjects: [],
    units: [],
    topics: [],
  });
  const [isSearching, setIsSearching] = useState(false);

  // Expanded units in Syllabus view
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  // Load metadata on mount
  useEffect(() => {
    async function loadMeta() {
      const [bList, rList, sList] = await Promise.all([
        AcademicService.getBranches(),
        AcademicService.getRegulations(),
        AcademicService.getSessions(),
      ]);
      setBranches(bList);
      setRegulations(rList);
      setSessions(sList);
    }
    loadMeta();
  }, []);

  // Load subjects & progress when branch/semester/regulation changes
  useEffect(() => {
    async function loadSubjectsAndProgress() {
      setLoading(true);
      try {
        const [subList, prog, recs] = await Promise.all([
          AcademicService.getSubjects({
            branchCode: selectedBranch,
            semesterNumber: selectedSemester,
            regulationCode: selectedRegulation,
          }),
          AcademicService.getUserProgress(selectedBranch, selectedSemester),
          AcademicService.getRecommendations(),
        ]);
        setSubjects(subList);
        setProgressData(prog);
        setRecommendations(recs);

        // Auto-expand the first unit of the first subject
        if (subList.length > 0 && subList[0].units && subList[0].units.length > 0) {
          setExpandedUnits({ [subList[0].units[0].id]: true });
        }
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      } finally {
        setLoading(false);
      }
    }
    loadSubjectsAndProgress();
  }, [selectedBranch, selectedSemester, selectedRegulation]);

  // Handle Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ subjects: [], units: [], topics: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await AcademicService.searchSyllabus(searchQuery, selectedBranch, selectedSemester);
      setSearchResults(res);
      setIsSearching(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedBranch, selectedSemester]);

  // Toggle unit accordion
  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // Toggle topic study progress
  const handleTopicStatusToggle = async (topicId: string, currentStatus?: string) => {
    const nextStatusMap: Record<string, 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVISION_REQUIRED'> = {
      NOT_STARTED: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
      COMPLETED: 'REVISION_REQUIRED',
      REVISION_REQUIRED: 'NOT_STARTED',
    };

    const nextStatus = nextStatusMap[currentStatus || 'NOT_STARTED'] || 'IN_PROGRESS';
    await AcademicService.updateTopicProgress(topicId, nextStatus);

    // Refresh progress state
    const prog = await AcademicService.getUserProgress(selectedBranch, selectedSemester);
    setProgressData(prog);

    // Update local subject topic state
    setSubjects(prev =>
      prev.map(sub => ({
        ...sub,
        units: sub.units?.map(u => ({
          ...u,
          topics: u.topics.map(t =>
            t.id === topicId
              ? {
                  ...t,
                  progress: [{ topicId, status: nextStatus }],
                }
              : t
          ),
        })),
      }))
    );
  };

  const selectedBranchObj = branches.find(b => b.code === selectedBranch) || {
    name: selectedBranch,
    code: selectedBranch,
    category: 'CORE',
    hasOfficialSyllabus: true,
  };

  const filteredBranchList = branches.filter(b =>
    b.name.toLowerCase().includes(branchSearch.toLowerCase()) ||
    b.code.toLowerCase().includes(branchSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* 1. Official BEU Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official BEU Patna Curriculum • 2026 UG Regulation Verified</span>
            </div>

            <a
              href="https://beu-bih.ac.in/academics/Syllabus/B.Tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 font-medium transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10"
            >
              <span>Source: beu-bih.ac.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              BEU Academic & Syllabus Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1.5 leading-relaxed">
              Complete course structures, unit-wise topics, solved PYQs, handwritten notes, and topic-level progress tracking across all 34 BEU B.Tech programmes.
            </p>
          </div>

          {/* Academic Selection Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
            {/* Branch Selector with Search Dropdown */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Branch ({branches.length})
              </label>
              <div
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer flex items-center justify-between text-white transition-colors"
              >
                <span className="truncate pr-2">{selectedBranchObj.name} ({selectedBranchObj.code})</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-slate-300" />
              </div>

              {isBranchDropdownOpen && (
                <div className="absolute z-50 left-0 top-full mt-1.5 w-80 max-h-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-2 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search 34 branches..."
                      value={branchSearch}
                      onChange={e => setBranchSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto space-y-1 scrollbar-thin">
                    {filteredBranchList.map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBranch(b.code);
                          setIsBranchDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          selectedBranch === b.code
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="block font-medium">{b.name}</span>
                          <span className="text-[10px] text-slate-400">{b.code} • {b.category}</span>
                        </div>
                        {selectedBranch === b.code && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Semester Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(Number(e.target.value))}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s} className="bg-slate-900 text-white">
                    Semester {s} {s <= 2 ? '(Common First Year)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Regulation Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Curriculum Regulation
              </label>
              <select
                value={selectedRegulation}
                onChange={e => setSelectedRegulation(e.target.value)}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {regulations.map(r => (
                  <option key={r.id} value={r.code} className="bg-slate-900 text-white">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Session */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Academic Session / Batch
              </label>
              <select
                value={selectedSession}
                onChange={e => setSelectedSession(e.target.value)}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {sessions.map(s => (
                  <option key={s.id} value={s.name} className="bg-slate-900 text-white">
                    {s.name} {s.isActive ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 rounded-2xl shadow-sm overflow-x-auto gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-navy-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Study Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'syllabus'
                ? 'bg-navy-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Syllabus ({subjects.length} Subjects)</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'search'
                ? 'bg-navy-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Smart Search</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'recommendations'
                ? 'bg-navy-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Recommendations</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>BEU Official R26 Active</span>
        </div>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: MY STUDY DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Progress Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Overall Completed</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-slate-900">{progressData.overallPercentage}%</span>
                  <span className="text-xs font-semibold text-emerald-600">({progressData.completedTopics} topics)</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Currently In Progress</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-slate-900">{progressData.inProgressTopics}</span>
                  <span className="text-xs text-slate-500 font-medium">active topics</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Revision Required</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-slate-900">{progressData.revisionRequiredTopics}</span>
                  <span className="text-xs text-amber-600 font-medium">flagged topics</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">PYQ Coverage</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-slate-900">74%</span>
                  <span className="text-xs text-purple-600 font-medium">2019-2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Learning Quick Cards */}
          {recommendations?.continueLearning && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-navy-950 to-slate-900 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4" />
                  <span>Continue Learning Goal</span>
                </div>
                <span className="text-[11px] text-slate-300 font-medium">Daily Recommended</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {recommendations.continueLearning.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTab('syllabus')}
                    className="p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {item.subjectCode} • {item.estimatedMinutes} min
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {item.topicTitle}
                      </h4>
                      <p className="text-xs text-slate-300">{item.unitTitle}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subject Cards Progress Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedBranch} — Semester {selectedSemester} Subjects
                </h3>
                <p className="text-xs text-slate-500">Track curriculum completion and study resources per subject</p>
              </div>
              <button
                onClick={() => setActiveTab('syllabus')}
                className="text-xs font-bold text-navy-900 hover:text-navy-700 flex items-center gap-1"
              >
                <span>View Full Syllabus Checklist</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(subj => (
                <div
                  key={subj.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-navy-50 text-navy-900 border border-navy-200 px-2.5 py-0.5 rounded-lg">
                        {subj.code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {subj.credits} Credits
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {subj.ltp || '3-1-0'}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {subj.name}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {subj.description}
                    </p>
                  </div>

                  {/* Progress Bar for Subject */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Study Progress</span>
                      <span className="font-bold text-slate-900">
                        {subj.code === 'PCC-CS301' ? '60%' : subj.code === 'BSC-101' ? '58%' : '45%'}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: subj.code === 'PCC-CS301' ? '60%' : subj.code === 'BSC-101' ? '58%' : '45%',
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => navigateTo('subject-detail', { subjectId: subj.id })}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                      >
                        <span>Subject Hub</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          navigateTo('ai-assistant', {
                            prompt: `Mujhe ${selectedBranch} Semester ${selectedSemester} mein ${subj.name} (${subj.code}) ka syllabus aur important repeated exam questions samjhao.`,
                          });
                        }}
                        className="text-[11px] font-bold px-2 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Tutor</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB B: OFFICIAL SYLLABUS EXPLORER & CHECKLIST */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  BEU Official Syllabus Explorer — {selectedBranch} (Sem {selectedSemester})
                </h3>
                <p className="text-xs text-emerald-800">
                  Click on status pills on any topic to toggle study tracking: <span className="font-semibold">Not Started → In Progress → Completed → Revision</span>
                </p>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-emerald-800 border border-emerald-200 shadow-xs self-start sm:self-auto">
              Regulation: {selectedRegulation}
            </span>
          </div>

          {/* Subject-Wise Units & Topics Accordions */}
          {subjects.map(subj => (
            <div key={subj.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Subject Header */}
              <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold bg-navy-900 text-white px-2 py-0.5 rounded">
                      {subj.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                      {subj.credits} Credits (L-T-P: {subj.ltp || '3-1-0'})
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Internal: {subj.internalMarks || 30} | End-Sem: {subj.endSemMarks || 70}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{subj.name}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigateTo('subject-detail', { subjectId: subj.id })}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    Notes & PYQs ({subj._count?.pyqs || 6})
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('ai-assistant', {
                        prompt: `Mujhe ${selectedBranch} Semester ${selectedSemester} mein ${subj.name} (${subj.code}) ke Unit 1 aur 2 Hinglish mein summarize karke samjhao.`,
                      });
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor</span>
                  </button>
                </div>
              </div>

              {/* Units List */}
              <div className="divide-y divide-slate-100">
                {subj.units && subj.units.length > 0 ? (
                  subj.units.map(unit => {
                    const isExpanded = !!expandedUnits[unit.id];
                    return (
                      <div key={unit.id} className="transition-colors">
                        {/* Unit Title Bar */}
                        <div
                          onClick={() => toggleUnit(unit.id)}
                          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-navy-100 text-navy-900 font-black text-xs flex items-center justify-center shrink-0">
                              U{unit.unitNumber}
                            </span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">{unit.unitTitle}</h4>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {unit.hours} Hours • Exam Frequency: {unit.examFrequency} • {unit.topics.length} Official Topics
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-navy-900' : ''
                              }`}
                            />
                          </div>
                        </div>

                        {/* Topics & Subtopics Dropdown */}
                        {isExpanded && (
                          <div className="px-4 sm:px-6 pb-5 pt-1 space-y-3 bg-slate-50/30">
                            {unit.description && (
                              <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                                <span className="font-bold text-slate-700 not-italic">Official Description: </span>
                                {unit.description}
                              </p>
                            )}

                            <div className="space-y-2">
                              {unit.topics.map(topic => {
                                const currentStatus = topic.progress?.[0]?.status || 'NOT_STARTED';
                                return (
                                  <div
                                    key={topic.id}
                                    className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900">
                                          {topic.orderIndex}. {topic.title}
                                        </span>
                                      </div>

                                      {/* Subtopics */}
                                      {topic.subTopics && topic.subTopics.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                          {topic.subTopics.map(sub => (
                                            <span
                                              key={sub.id}
                                              className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                                            >
                                              • {sub.title}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* Action Buttons & Status Toggle */}
                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                      <button
                                        onClick={() => {
                                          navigateTo('ai-assistant', {
                                            prompt: `Mujhe BEU ${selectedBranch} ${subj.name} ke ${topic.title} topic ko formula aur derivation ke saath Hinglish mein samjhao.`,
                                          });
                                        }}
                                        title="Explain topic with AI Tutor"
                                        className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 text-xs font-semibold flex items-center gap-1"
                                      >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Ask AI</span>
                                      </button>

                                      {/* Status Toggle Pill */}
                                      <button
                                        onClick={() => handleTopicStatusToggle(topic.id, currentStatus)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                                          currentStatus === 'COMPLETED'
                                            ? 'bg-emerald-600 text-white'
                                            : currentStatus === 'IN_PROGRESS'
                                            ? 'bg-blue-600 text-white'
                                            : currentStatus === 'REVISION_REQUIRED'
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                      >
                                        {currentStatus === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                        {currentStatus === 'IN_PROGRESS' && <Clock className="w-3.5 h-3.5" />}
                                        {currentStatus === 'REVISION_REQUIRED' && <AlertCircle className="w-3.5 h-3.5" />}
                                        {currentStatus === 'NOT_STARTED' && <span className="w-2 h-2 rounded-full bg-slate-400" />}

                                        <span>
                                          {currentStatus === 'COMPLETED'
                                            ? 'Completed'
                                            : currentStatus === 'IN_PROGRESS'
                                            ? 'In Progress'
                                            : currentStatus === 'REVISION_REQUIRED'
                                            ? 'Revision Req.'
                                            : 'Not Started'}
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Official syllabus document linked. Click "Notes & PYQs" above to access materials.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB C: SMART MULTI-FIELD SEARCH */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Live Academic Search</h3>
              <p className="text-xs text-slate-500">
                Instantly search across any topic, unit name, subject code (e.g. PCC-CS301), or keyword in BEU curriculum.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Try searching 'Taylor series', 'AVL Tree', 'Normalization', 'PCC-CS301'..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white transition-all"
                autoFocus
              />
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Popular searches:</span>
              {['Data Structures', 'Taylor Series', 'Newton Rings', 'BCNF', 'Graph BFS', 'Cayley Hamilton'].map(kw => (
                <button
                  key={kw}
                  onClick={() => setSearchQuery(kw)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchQuery.trim() ? (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Search Results ({searchResults.subjects.length + searchResults.topics.length + searchResults.units.length} Found)
              </h4>

              {/* Topics Matches */}
              {searchResults.topics.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-navy-900">Topic Matches ({searchResults.topics.length})</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.topics.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-navy-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-navy-50 text-navy-900 border border-navy-200">
                            {t.subjectCode || 'BEU'} • Sem {t.semesterNumber || 3}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">Unit {t.unitNumber || 1}</span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900">{t.title}</h5>
                        <p className="text-xs text-slate-500">{t.subjectName || t.unitTitle}</p>
                        <button
                          onClick={() => {
                            navigateTo('ai-assistant', {
                              prompt: `Mujhe BEU ${t.subjectName || ''} ke topic "${t.title}" ko Hinglish mein explain karo.`,
                            });
                          }}
                          className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 pt-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ask AI Tutor about this topic</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject Matches */}
              {searchResults.subjects.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-navy-900">Subject Matches ({searchResults.subjects.length})</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchResults.subjects.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigateTo('subject-detail', { subjectId: s.id })}
                        className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-navy-900 cursor-pointer transition-colors space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold bg-navy-50 text-navy-900 px-2 py-0.5 rounded">
                            {s.code}
                          </span>
                          <span className="text-xs text-emerald-700 font-bold">{s.credits} Credits</span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900">{s.name}</h5>
                        <p className="text-xs text-slate-600 line-clamp-2">{s.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.topics.length === 0 && searchResults.subjects.length === 0 && (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                  <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">No exact topic match found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching general concepts like "Matrices", "Thermodynamics", or "Circuit Theorems".
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">Type keywords in the search bar above to query the complete BEU syllabus.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB D: AI STUDY RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-purple-950 via-navy-950 to-slate-900 text-white rounded-2xl shadow-md space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Academic Engine</span>
            </div>
            <h3 className="text-xl font-extrabold">Smart Academic Study Path</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Dynamically generated revision tasks and PYQ practice recommendations aligned with your enrolled semester ({selectedBranch} Sem {selectedSemester}).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revision Alerts */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Topics Flagged for Revision</span>
                </h4>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Action Required</span>
              </div>

              <div className="space-y-2.5">
                {recommendations?.revisionAlerts?.map((rev: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{rev.subjectName} ({rev.subjectCode})</span>
                      <span className="text-[10px] text-amber-700 font-semibold">{rev.reason}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-semibold">{rev.topicTitle}</p>
                    <button
                      onClick={() => {
                        navigateTo('ai-assistant', {
                          prompt: `Mujhe BEU ${rev.subjectName} ke topic "${rev.topicTitle}" ka quick formula revision aur standard questions batao.`,
                        });
                      }}
                      className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 pt-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Revise with AI Tutor</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended High-Yield PYQs */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>High-Frequency PYQs to Practice</span>
                </h4>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">7 & 14 Marks</span>
              </div>

              <div className="space-y-2.5">
                {recommendations?.recommendedPYQs?.map((pyq: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/60 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{pyq.subjectName} • {pyq.year} Exam</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono">
                        {pyq.marks} Marks
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-semibold">{pyq.topic}</p>
                    <div className="flex items-center gap-3 pt-1 text-xs">
                      <button
                        onClick={() => navigateTo('pyq-analyzer')}
                        className="font-bold text-navy-900 hover:text-navy-700"
                      >
                        View PYQ Solution
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
