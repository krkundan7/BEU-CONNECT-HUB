import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { AcademicService, FALLBACK_BRANCHES, FALLBACK_REGULATIONS, FALLBACK_SESSIONS } from '../services/academicService';
import { Subject, Topic, TopicProgress, RegulationVersion, AcademicSession } from '../types';
import {
  BookOpen, Search, CheckCircle2, Clock, AlertCircle, RefreshCw,
  Sparkles, ExternalLink, ChevronRight, ChevronDown, Award,
  Bookmark, Filter, Compass, Flame, ArrowRight, ShieldCheck, Check,
  BookMarked, HelpCircle, FileText, Layers, Video, CheckCircle,
  GraduationCap, ArrowLeft, BarChart2, Book, CheckSquare, Square
} from 'lucide-react';

/* NOV-LOGIC-109: 5-Tier Interactive Academic Curriculum Explorer
 * Orchestrates seamless navigation: Branch (34) -> Semester (8) -> Subject -> Unit (5) -> Topic Progress Tracking. */
export const StudyHubPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigateTo } = useNavigation();

  // Primary active tab
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'dashboard' | 'search' | 'recommendations'>('hierarchy');

  /* NOV-LOGIC-110: Four-Step Progressive Disclosure Stepper State
   * Enables students to drill down hierarchically or jump directly into units and topics. */
  const [hierarchyStep, setHierarchyStep] = useState<1 | 2 | 3 | 4>(4);

  // Metadata Lists
  const [branches, setBranches] = useState<any[]>(FALLBACK_BRANCHES);
  const [regulations, setRegulations] = useState<RegulationVersion[]>(FALLBACK_REGULATIONS);
  const [sessions, setSessions] = useState<AcademicSession[]>(FALLBACK_SESSIONS);

  // Selection state
  const [selectedBranch, setSelectedBranch] = useState<string>(currentUser?.branchCode || 'CSE');
  const [selectedSemester, setSelectedSemester] = useState<number>(currentUser?.semester || 1);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedRegulation, setSelectedRegulation] = useState<string>('REG_2026');
  const [selectedSession, setSelectedSession] = useState<string>('2026-2027');

  // Filter / Search in Branch Step
  const [branchCategoryFilter, setBranchCategoryFilter] = useState<'ALL' | 'CORE' | 'EMERGING_TECH' | 'INTERDISCIPLINARY'>('ALL');
  const [branchSearch, setBranchSearch] = useState('');

  // Data states
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [localProgressMap, setLocalProgressMap] = useState<Record<string, TopicProgress>>({});
  const [recommendations, setRecommendations] = useState<any>(null);

  // Search tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ subjects: any[]; units: any[]; topics: any[] }>({
    subjects: [],
    units: [],
    topics: [],
  });
  const [isSearching, setIsSearching] = useState(false);

  // Expanded units in Unit-Wise view
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  /* NOV-LOGIC-111: Initial University Metadata Hydration Hook
   * Concurrently pulls official branches, regulation versions, and sessions with deterministic static fallback. */
  useEffect(() => {
    async function loadMeta() {
      const [bList, rList, sList] = await Promise.all([
        AcademicService.getBranches(),
        AcademicService.getRegulations(),
        AcademicService.getSessions(),
      ]);
      if (bList && bList.length > 0) setBranches(bList);
      if (rList && rList.length > 0) setRegulations(rList);
      if (sList && sList.length > 0) setSessions(sList);
      setLocalProgressMap(AcademicService.getLocalProgressMap());
    }
    loadMeta();
  }, []);

  /* NOV-LOGIC-112: Reactive Syllabus Subject Hydration & Accordion Expansion
   * Re-evaluates 5-unit syllabus dataset whenever user toggles branch, semester, or regulation version. */
  useEffect(() => {
    async function loadSubjectsAndProgress() {
      setLoading(true);
      try {
        const [subList, recs] = await Promise.all([
          AcademicService.getSubjects({
            branchCode: selectedBranch,
            semesterNumber: selectedSemester,
            regulationCode: selectedRegulation,
          }),
          AcademicService.getRecommendations(),
        ]);
        setSubjects(subList);
        setRecommendations(recs);
        setLocalProgressMap(AcademicService.getLocalProgressMap());

        // Default to first subject if in subject view
        if (subList.length > 0) {
          const currentMatch = subList.find(s => s.id === selectedSubject?.id || s.code === selectedSubject?.code);
          const activeSubj = currentMatch || subList[0];
          setSelectedSubject(activeSubj);

          // Expand first unit by default
          if (activeSubj.units && activeSubj.units.length > 0) {
            setExpandedUnits({ [activeSubj.units[0].id]: true });
          }
        } else {
          setSelectedSubject(null);
        }
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      } finally {
        setLoading(false);
      }
    }
    loadSubjectsAndProgress();
  }, [selectedBranch, selectedSemester, selectedRegulation]);

  // Universal Live Search
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
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedBranch, selectedSemester]);

  // Toggle unit accordion
  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // Toggle single topic completion
  const handleToggleTopicDone = async (topicId: string, currentStatus?: string) => {
    const isCurrentlyDone = currentStatus === 'COMPLETED';
    const nextStatus = isCurrentlyDone ? 'NOT_STARTED' : 'COMPLETED';

    await AcademicService.updateTopicProgress(topicId, nextStatus, nextStatus === 'COMPLETED' ? 100 : 0);
    const updatedMap = AcademicService.getLocalProgressMap();
    setLocalProgressMap(updatedMap);

    // Update in-memory state
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

    if (selectedSubject) {
      setSelectedSubject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          units: prev.units?.map(u => ({
            ...u,
            topics: u.topics.map(t =>
              t.id === topicId
                ? { ...t, progress: [{ topicId, status: nextStatus }] }
                : t
            ),
          })),
        };
      });
    }
  };

  // Ask AI with deep syllabus context
  const handleAskAI = (subj: Subject, unit: any, topic: Topic) => {
    // BEU-COMMENT-6: Deep academic context generation for AI Assistant prompt formatting
    const promptText = `University: Bihar Engineering University (BEU), Patna
Branch: ${selectedBranchObj.name} (${selectedBranchObj.code})
Semester: Semester ${selectedSemester}
Subject: ${subj.name} (${subj.code})
Unit: ${unit.unitTitle}
Topic: ${topic.title}

Please provide a comprehensive academic explanation for this topic following the official BEU examination pattern. Include:
1. Core Engineering Concepts & Mathematical Formulations
2. Key Equations, Derivations & Diagrams where applicable
3. Previous Year Exam Questions (7-mark and 14-mark formats)
4. Model Answers with Step-by-Step Marking Points`;

    navigateTo('ai-assistant', {
      prompt: promptText,
      aiContext: {
        university: 'Bihar Engineering University (BEU), Patna',
        branch: selectedBranchObj.name,
        semester: selectedSemester,
        subject: subj.name,
        subjectCode: subj.code,
        unit: unit.unitTitle,
        topic: topic.title,
        prompt: promptText,
      },
    });
  };

  // Open YouTube search
  const handleOpenYouTube = (subj: Subject, topic: Topic) => {
    const url = AcademicService.getYouTubeSearchUrl(subj.name, topic.title, selectedBranch);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Selected Branch Object
  const selectedBranchObj = branches.find(b => b.code === selectedBranch) || {
    name: selectedBranch,
    code: selectedBranch,
    category: 'CORE',
    officialCode: '103',
  };

  // Filtered Branch List in Step 1
  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      const matchCat = branchCategoryFilter === 'ALL' || b.category === branchCategoryFilter;
      const matchSearch =
        b.name.toLowerCase().includes(branchSearch.toLowerCase()) ||
        b.code.toLowerCase().includes(branchSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [branches, branchCategoryFilter, branchSearch]);

  // Overall Subject Progress
  const activeSubjectProgress = useMemo(() => {
    if (!selectedSubject) return { totalTopics: 0, completedTopics: 0, overallPercentage: 0, unitProgressMap: {} };
    return AcademicService.computeHierarchyProgress(selectedSubject, localProgressMap);
  }, [selectedSubject, localProgressMap]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* 1. Master Header Banner & Official BEU Verification */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bihar Engineering University (BEU), Patna • Verified B.Tech Syllabus</span>
            </div>

            {/* BEU-COMMENT-9: Official university source URL verification and external curriculum citation handling */}
            <a
              href="https://beu-bih.ac.in/academics/Syllabus/B.Tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-300 font-medium transition-colors bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/15"
            >
              <span>Official BEU Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-2.5">
              <GraduationCap className="w-8 h-8 text-emerald-400 shrink-0" />
              <span>BEU Student Syllabus Master</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1.5 leading-relaxed">
              Official unit-wise syllabus hierarchy (Branch → Semester → Subject → Unit → Topic) with instant AI explanations, curated YouTube lectures, and topic-level progress tracking.
            </p>
          </div>

          {/* Top Session & Regulation Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs">
              <span className="text-slate-400 font-semibold">Regulation:</span>
              <select
                value={selectedRegulation}
                onChange={e => setSelectedRegulation(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {regulations.map(r => (
                  <option key={r.id} value={r.code} className="bg-slate-900 text-white">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs">
              <span className="text-slate-400 font-semibold">Academic Session:</span>
              <select
                value={selectedSession}
                onChange={e => setSelectedSession(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
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

      {/* 2. Top Nav Mode Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 rounded-2xl shadow-sm overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'hierarchy'
                ? 'bg-navy-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Student Syllabus Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-navy-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Study Progress</span>
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
            <span>Universal Search</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'recommendations'
                ? 'bg-navy-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Recommendations</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active: {selectedBranchObj.code} • Sem {selectedSemester}</span>
        </div>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: COMPLETE HIERARCHY (BRANCH -> SEMESTER -> SUBJECT -> UNIT -> TOPIC) */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          {/* Hierarchy Progress Breadcrumb Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-semibold">
              <button
                onClick={() => setHierarchyStep(1)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  hierarchyStep === 1
                    ? 'bg-navy-950 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>1. Branch:</span>
                <span className="font-bold text-emerald-600">{selectedBranchObj.code}</span>
              </button>

              <ChevronRight className="w-4 h-4 text-slate-400" />

              <button
                onClick={() => setHierarchyStep(2)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  hierarchyStep === 2
                    ? 'bg-navy-950 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>2. Semester:</span>
                <span className="font-bold text-emerald-600">Sem {selectedSemester}</span>
              </button>

              <ChevronRight className="w-4 h-4 text-slate-400" />

              <button
                onClick={() => setHierarchyStep(3)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  hierarchyStep === 3
                    ? 'bg-navy-950 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>3. Subject:</span>
                <span className="font-bold text-emerald-600 truncate max-w-[150px]">
                  {selectedSubject?.shortName || selectedSubject?.code || 'Select'}
                </span>
              </button>

              <ChevronRight className="w-4 h-4 text-slate-400" />

              <span
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  hierarchyStep === 4
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                4. Unit & Topics
              </span>
            </div>

            {hierarchyStep === 4 && (
              <button
                onClick={() => setHierarchyStep(3)}
                className="text-xs font-bold text-slate-600 hover:text-navy-950 flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Subjects</span>
              </button>
            )}
          </div>

          {/* STEP 1: BRANCH SELECTION */}
          {hierarchyStep === 1 && (
            <div className="space-y-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 text-navy-900 text-xs font-bold">
                  <span>Step 1 of 4</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Select Engineering Branch / Programme
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Choose from all 34 verified BEU B.Tech disciplines (Core, Emerging Tech & Interdisciplinary).
                </p>
              </div>

              {/* Category Filter Pills & Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'ALL', label: `All (${branches.length})` },
                    { id: 'CORE', label: 'Core Engineering' },
                    { id: 'EMERGING_TECH', label: 'Emerging Technologies (AI/ML/VLSI/IoT)' },
                    { id: 'INTERDISCIPLINARY', label: 'Interdisciplinary' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setBranchCategoryFilter(tab.id as any)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        branchCategoryFilter === tab.id
                          ? 'bg-navy-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={branchSearch}
                    onChange={e => setBranchSearch(e.target.value)}
                    placeholder="Search branch name or code..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900"
                  />
                </div>
              </div>

              {/* Branch Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {filteredBranches.map(branch => {
                  const isSelected = selectedBranch === branch.code;
                  return (
                    <div
                      key={branch.id}
                      onClick={() => {
                        setSelectedBranch(branch.code);
                        setHierarchyStep(2);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                          : 'bg-slate-50/50 hover:bg-slate-100/80 border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-navy-950 text-white">
                            {branch.code}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Code: {branch.officialCode || '10X'}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {branch.name}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {branch.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                          {branch.category.replace('_', ' ')}
                        </span>

                        <span className="font-bold text-emerald-700 flex items-center gap-1 group">
                          <span>Select Branch</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SEMESTER SELECTION */}
          {hierarchyStep === 2 && (
            <div className="space-y-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 text-navy-900 text-xs font-bold">
                    <span>Step 2 of 4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Select Semester for {selectedBranchObj.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Showing official curriculum semesters (1st to 8th) for {selectedBranchObj.code}.
                  </p>
                </div>

                <button
                  onClick={() => setHierarchyStep(1)}
                  className="text-xs font-bold text-slate-600 hover:text-navy-950 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50"
                >
                  Change Branch
                </button>
              </div>

              {/* Semesters Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
                  const isSelected = selectedSemester === sem;
                  const semGroup =
                    sem <= 2
                      ? 'Group A / Group B Common Engineering'
                      : sem <= 4
                      ? 'Core Discipline Engineering'
                      : sem <= 6
                      ? 'Advanced Core & Professional Electives'
                      : 'Specialization Electives & Capstone Projects';

                  return (
                    <div
                      key={sem}
                      onClick={() => {
                        setSelectedSemester(sem);
                        setHierarchyStep(3);
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                          : 'bg-slate-50/50 hover:bg-slate-100/80 border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="w-9 h-9 rounded-xl bg-navy-950 text-white font-black text-sm flex items-center justify-center">
                            S{sem}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                            Semester {sem}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900">
                          {sem === 1 ? '1st' : sem === 2 ? '2nd' : sem === 3 ? '3rd' : `${sem}th`} Semester
                        </h4>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          {semGroup}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">{selectedBranchObj.code}</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <span>View Subjects</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: SUBJECT SELECTION */}
          {hierarchyStep === 3 && (
            <div className="space-y-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 text-navy-900 text-xs font-bold">
                    <span>Step 3 of 4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Subjects for {selectedBranchObj.code} — Semester {selectedSemester}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Select any subject to open its verified unit-wise syllabus breakdown and topic study tools.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHierarchyStep(2)}
                    className="text-xs font-bold text-slate-600 hover:text-navy-950 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    Change Semester
                  </button>
                  <button
                    onClick={() => setHierarchyStep(1)}
                    className="text-xs font-bold text-slate-600 hover:text-navy-950 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    Change Branch
                  </button>
                </div>
              </div>

              {/* Subjects List */}
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">Loading verified BEU subjects...</p>
                </div>
              ) : subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {subjects.map(subj => {
                    const prog = AcademicService.computeHierarchyProgress(subj, localProgressMap);
                    return (
                      <div
                        key={subj.id}
                        className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold bg-navy-950 text-white px-2.5 py-0.5 rounded-lg">
                              {subj.code}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                {subj.credits} Credits
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {subj.category || 'PCC'}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {subj.name}
                          </h3>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {subj.description}
                          </p>

                          <div className="text-[11px] text-slate-500 font-medium">
                            <span>L-T-P: {subj.ltp || '3-1-0'} • Internal: {subj.internalMarks || 30} | End-Sem: {subj.endSemMarks || 70}</span>
                          </div>
                        </div>

                        {/* Progress Bar & Actions */}
                        <div className="space-y-3 pt-3 border-t border-slate-100">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 font-medium">Progress</span>
                              <span className="font-bold text-slate-900">
                                {prog.completedTopics} / {prog.totalTopics} Topics ({prog.overallPercentage}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${prog.overallPercentage}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={() => {
                                setSelectedSubject(subj);
                                if (subj.units && subj.units.length > 0) {
                                  setExpandedUnits({ [subj.units[0].id]: true });
                                }
                                setHierarchyStep(4);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                            >
                              <span>Explore Syllabus</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href="https://beu-bih.ac.in/academics/Syllabus/B.Tech"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                              title="Official BEU Syllabus PDF"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <Book className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">No subjects available for this semester</p>
                  <p className="text-xs text-slate-500 mt-1">Please select another semester or branch above.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: UNIT-WISE SYLLABUS & TOPIC ACTIONS (Ask AI, YouTube, Mark as Done) */}
          {hierarchyStep === 4 && selectedSubject && (
            <div className="space-y-6">
              {/* Active Subject Overview Card */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold bg-navy-950 text-white px-2.5 py-0.5 rounded-lg">
                        {selectedSubject.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {selectedSubject.credits} Credits
                      </span>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        L-T-P: {selectedSubject.ltp || '3-1-0'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Marks: {selectedSubject.internalMarks || 30} Internal + {selectedSubject.endSemMarks || 70} End-Sem = 100 Total
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {selectedSubject.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                      {selectedSubject.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                    <a
                      href={selectedSubject.sourceUrl || "https://beu-bih.ac.in/academics/Syllabus/B.Tech"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Official BEU Source</span>
                    </a>

                    <button
                      onClick={() => navigateTo('subject-detail', { subjectId: selectedSubject.id })}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-navy-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Notes & PYQs</span>
                    </button>
                  </div>
                </div>

                {/* Overall Subject Progress Card */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <BarChart2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Subject Completion: {activeSubjectProgress.completedTopics} / {activeSubjectProgress.totalTopics} Topics Completed
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Progress: {activeSubjectProgress.overallPercentage}% Complete • Click "Mark as Done" on any topic to track
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-48 space-y-1">
                    <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${activeSubjectProgress.overallPercentage}%` }}
                      />
                    </div>
                    <div className="text-right text-[10px] font-bold text-emerald-700">
                      {activeSubjectProgress.overallPercentage}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Units & Topics Section Header */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Official Syllabus Structure (Unit 1.0 to 5.0)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Complete unit outlines and individual topic study tools
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const allExp: Record<string, boolean> = {};
                      selectedSubject.units?.forEach(u => (allExp[u.id] = true));
                      setExpandedUnits(allExp);
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-navy-950 px-2.5 py-1 rounded-lg border border-slate-200"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={() => setExpandedUnits({})}
                    className="text-xs font-bold text-slate-600 hover:text-navy-950 px-2.5 py-1 rounded-lg border border-slate-200"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Units Accordion List */}
              <div className="space-y-4">
                {selectedSubject.units && selectedSubject.units.length > 0 ? (
                  selectedSubject.units.map(unit => {
                    const isExpanded = !!expandedUnits[unit.id];
                    const unitProg = activeSubjectProgress.unitProgressMap[unit.id] || {
                      total: unit.topics.length,
                      completed: 0,
                      percentage: 0,
                    };

                    return (
                      <div
                        key={unit.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
                      >
                        {/* Unit Heading Bar */}
                        <div
                          onClick={() => toggleUnit(unit.id)}
                          className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="w-8 h-8 rounded-xl bg-navy-950 text-white font-black text-xs flex items-center justify-center shrink-0">
                              U{unit.unitNumber}
                            </span>
                            <div className="space-y-0.5">
                              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                {unit.unitTitle}
                              </h4>
                              <p className="text-xs text-slate-500 font-medium">
                                {unit.hours} Hours • Exam Frequency: <span className="font-bold text-slate-700">{unit.examFrequency}</span> • {unit.topics.length} Official Topics
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Unit-Level Progress Badge */}
                            <div className="hidden sm:flex items-center gap-2 text-xs">
                              <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                  style={{ width: `${unitProg.percentage}%` }}
                                />
                              </div>
                              <span className="font-bold text-slate-700">
                                {unitProg.completed}/{unitProg.total} ({unitProg.percentage}%)
                              </span>
                            </div>

                            <ChevronDown
                              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-navy-950' : ''
                              }`}
                            />
                          </div>
                        </div>

                        {/* Topics Dropdown Content */}
                        {isExpanded && (
                          <div className="px-5 sm:px-7 pb-6 pt-2 space-y-4 bg-slate-50/40 border-t border-slate-100">
                            {unit.description && (
                              <p className="text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
                                <span className="font-bold text-slate-800">Unit Summary: </span>
                                {unit.description}
                              </p>
                            )}

                            {/* Topics List with Action Buttons */}
                            <div className="space-y-2.5">
                              {unit.topics.map((topic, tIdx) => {
                                const currentStatus =
                                  localProgressMap[topic.id]?.status || topic.progress?.[0]?.status || 'NOT_STARTED';
                                const isDone = currentStatus === 'COMPLETED';

                                return (
                                  <div
                                    key={topic.id}
                                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                                      isDone
                                        ? 'bg-emerald-50/40 border-emerald-200'
                                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                                    }`}
                                  >
                                    {/* Topic Title & Subtopics */}
                                    <div className="space-y-1.5 flex-1 pr-2">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs font-black ${isDone ? 'text-emerald-700' : 'text-slate-900'}`}>
                                          ○ {topic.orderIndex || tIdx + 1}. {topic.title}
                                        </span>
                                      </div>

                                      {/* Subtopic Tags */}
                                      {topic.subTopics && topic.subTopics.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                          {topic.subTopics.map(st => (
                                            <span
                                              key={st.id}
                                              className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                                            >
                                              • {st.title}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* Topic Action Buttons: [Ask AI] [YouTube] [Mark as Done] */}
                                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto pt-1 md:pt-0">
                                      {/* 1. Ask AI Button */}
                                      <button
                                        onClick={() => handleAskAI(selectedSubject, unit, topic)}
                                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1.5"
                                        title="Generate detailed explanation and 14-mark question outline with AI"
                                      >
                                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                        <span>Ask AI</span>
                                      </button>

                                      {/* 2. YouTube Button */}
                                      <button
                                        onClick={() => handleOpenYouTube(selectedSubject, topic)}
                                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1.5"
                                        title="Find video lectures for this topic on YouTube"
                                      >
                                        <Video className="w-3.5 h-3.5 text-red-600" />
                                        <span>YouTube</span>
                                      </button>

                                      {/* 3. Mark as Done Toggle Button */}
                                      <button
                                        onClick={() => handleToggleTopicDone(topic.id, currentStatus)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                                          isDone
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                                        }`}
                                      >
                                        {isDone ? (
                                          <>
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            <span>Completed</span>
                                          </>
                                        ) : (
                                          <>
                                            <Square className="w-3.5 h-3.5 text-slate-400" />
                                            <span>Mark as Done</span>
                                          </>
                                        )}
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
                  <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500">
                      Syllabus units loading. Click Official BEU Source above for complete PDF.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY STUDY DASHBOARD */}
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
                  <span className="text-2xl font-black text-slate-900">{activeSubjectProgress.overallPercentage}%</span>
                  <span className="text-xs font-semibold text-emerald-600">({activeSubjectProgress.completedTopics} topics)</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Tracked</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-slate-900">{activeSubjectProgress.totalTopics}</span>
                  <span className="text-xs text-slate-500 font-medium">syllabus topics</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Active Subject</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-base font-black text-slate-900 truncate max-w-[150px]">
                    {selectedSubject?.shortName || selectedSubject?.code || 'BEU'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Regulation</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-slate-900">2026</span>
                  <span className="text-xs text-emerald-600 font-medium">UG R26</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects Progress Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              {selectedBranchObj.code} — Semester {selectedSemester} Subjects Progress
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(subj => {
                const p = AcademicService.computeHierarchyProgress(subj, localProgressMap);
                return (
                  <div
                    key={subj.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-navy-950 text-white px-2 py-0.5 rounded">
                        {subj.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        {p.completedTopics}/{p.totalTopics} ({p.overallPercentage}%)
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{subj.name}</h4>

                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${p.overallPercentage}%` }}
                      />
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSubject(subj);
                        setActiveTab('hierarchy');
                        setHierarchyStep(4);
                      }}
                      className="w-full text-center py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-navy-950 hover:bg-navy-950 hover:text-white transition-colors"
                    >
                      Open Syllabus
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: UNIVERSAL SEARCH */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Universal BEU Academic Search</h3>
              <p className="text-xs text-slate-500">
                Search across any topic, unit, subject code, or keyword with full hierarchy trail.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search 'Harmonic Oscillator', 'Non-Inertial', 'Taylor series', 'AVL Tree', 'PCC-CS301'..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white transition-all"
                autoFocus
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Popular searches:</span>
              {['Harmonic Oscillator', 'Non-Inertial frame', 'Coriolis acceleration', 'Youngs Double Slit', 'Michelson Interferometer', 'AVL Rotations', 'BCNF'].map(kw => (
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

          {searchQuery.trim() ? (
            <div className="space-y-4">
              {/* Topic Search Results */}
              {searchResults.topics.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-navy-900">
                    Topic Results ({searchResults.topics.length})
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.topics.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5"
                      >
                        {/* Breadcrumb Trail */}
                        <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 flex-wrap">
                          <span>{t.branchCode || selectedBranch}</span>
                          <span>→</span>
                          <span>Sem {t.semesterNumber || selectedSemester}</span>
                          <span>→</span>
                          <span>{t.subjectCode || 'BEU'}</span>
                          <span>→</span>
                          <span>Unit {t.unitNumber || 1}</span>
                        </div>

                        <h5 className="text-sm font-bold text-slate-900">{t.title}</h5>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              const matchSubj = subjects.find(s => s.code === t.subjectCode) || selectedSubject;
                              if (matchSubj) {
                                setSelectedSubject(matchSubj);
                                setActiveTab('hierarchy');
                                setHierarchyStep(4);
                              }
                            }}
                            className="text-xs font-bold text-navy-900 hover:text-navy-700 px-3 py-1 rounded-lg bg-slate-100"
                          >
                            Open in Syllabus
                          </button>

                          <button
                            onClick={() => {
                              navigateTo('ai-assistant', {
                                prompt: `University: Bihar Engineering University\nSubject: ${t.subjectName || ''}\nTopic: ${t.title}\n\nPlease explain this BEU syllabus topic with derivations and formulas in Hinglish.`,
                              });
                            }}
                            className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ask AI</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject Search Results */}
              {searchResults.subjects.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-navy-900">
                    Subject Results ({searchResults.subjects.length})
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchResults.subjects.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedSubject(s);
                          setActiveTab('hierarchy');
                          setHierarchyStep(4);
                        }}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-navy-900 cursor-pointer transition-colors space-y-2"
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
                  <p className="text-sm font-bold text-slate-800">No exact syllabus match found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching general concepts like "Oscillations", "Interference", or "Recursion".
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">Type any topic or subject name above to query the complete BEU syllabus.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AI RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-purple-950 via-navy-950 to-slate-900 text-white rounded-3xl shadow-md space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Academic Engine</span>
            </div>
            <h3 className="text-xl font-extrabold">Smart Academic Study Path</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Dynamically generated revision tasks and PYQ practice recommendations aligned with your enrolled semester ({selectedBranchObj.code} Sem {selectedSemester}).
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
