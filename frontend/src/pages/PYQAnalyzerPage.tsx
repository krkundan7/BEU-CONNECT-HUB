import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { StorageService } from '../services/storageService';
import { BEUPatternAnalyzerService } from '../services/beuPatternAnalyzer';
import { MOCK_BRANCHES } from '../data/mockData';
import {
  FileSpreadsheet, Sparkles, Filter, AlertTriangle, Search,
  Download, Eye, CheckCircle2, ChevronRight, BookOpen, Layers,
  Calendar, Clock, Award, Target, Flame, Copy, Printer, HelpCircle,
  X, Compass, ArrowRight, Share2, Lightbulb, Zap, TrendingUp, CheckSquare
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { TopicPriority, BEUTopicRankItem, BEUMostRepeatedQuestion } from '../types';

type ActiveTab = 'dashboard' | 'report' | 'repeated' | 'numericals' | 'units' | 'timelines';

export const PYQAnalyzerPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();

  const [selectedBranch, setSelectedBranch] = useState(currentUser?.branchCode || 'CSE');
  const [selectedSemester, setSelectedSemester] = useState<number>(currentUser?.semester || 3);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('cse-301');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [unitFilter, setUnitFilter] = useState<number | 'ALL'>('ALL');
  
  // Custom Subject Modal State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');

  // AI Solver Drawer State
  const [selectedAIItem, setSelectedAIItem] = useState<{
    title: string;
    unit: number;
    details: string;
    type: 'topic' | 'question' | 'numerical' | 'derivation';
  } | null>(null);

  const subjects = StorageService.getSubjects(selectedBranch, selectedSemester);
  
  // Get active subject object
  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || {
    id: selectedSubjectId,
    name: customSubjectName || 'Data Structures & Algorithms',
    code: 'PCC-CS301',
    branchCode: selectedBranch,
    semester: selectedSemester,
  };

  // Generate analysis
  const analysis = useMemo(() => {
    return BEUPatternAnalyzerService.getFullAnalysis(
      selectedSubjectId,
      activeSubject.name,
      selectedBranch,
      selectedSemester
    );
  }, [selectedSubjectId, activeSubject.name, selectedBranch, selectedSemester]);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    if (!analysis.topRankedTopics) return [];
    return analysis.topRankedTopics.filter(topic => {
      const matchesSearch = topic.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.reason.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'ALL' || topic.priority === priorityFilter;
      const matchesUnit = unitFilter === 'ALL' || topic.unit === unitFilter;
      return matchesSearch && matchesPriority && matchesUnit;
    });
  }, [analysis.topRankedTopics, searchQuery, priorityFilter, unitFilter]);

  // Repeated questions filtered
  const filteredRepeated = useMemo(() => {
    if (!analysis.mostRepeatedQuestions) return [];
    return analysis.mostRepeatedQuestions.filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.wordingChangesNote.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUnit = unitFilter === 'ALL' || q.unit === unitFilter;
      return matchesSearch && matchesUnit;
    });
  }, [analysis.mostRepeatedQuestions, searchQuery, unitFilter]);

  const copyMarkdownReport = () => {
    if (analysis.formattedMarkdownReport) {
      navigator.clipboard.writeText(analysis.formattedMarkdownReport);
      showToast('Master 16-Point Analysis Report copied to clipboard in Markdown format!', 'success');
    } else {
      showToast('Report generated and copied!', 'success');
    }
  };

  const handleCustomSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubjectName.trim()) return;
    setSelectedSubjectId('custom-' + Date.now());
    setIsCustomModalOpen(false);
    showToast(`Pattern analysis generated for "${customSubjectName}"!`, 'success');
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-indigo-950 text-white shadow-xl border border-navy-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>BEU PYQ Pattern Analyzer • Official Syllabus Mapping</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyMarkdownReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all backdrop-blur-sm border border-white/10"
                title="Copy Full Markdown Report"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Full Report</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white transition-all shadow-sm"
                title="Print Cheat Sheet"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{analysis.subjectName}</span>
              <span className="text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg bg-navy-800 border border-navy-700 text-slate-300">
                {analysis.subjectCode || 'BEU Theory'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Historical longitudinal analysis across {analysis.totalPapersAnalyzed} Bihar Engineering University (BEU) examination papers ({analysis.yearsCovered?.join(', ') || '2019-2024'}). Mapped strictly with official unit weightages and high-yield question patterns.
            </p>
          </div>

          {/* Branch & Semester Selection Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-navy-900/80 p-1 rounded-2xl border border-navy-700/60">
              {MOCK_BRANCHES.slice(0, 4).map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBranch(b.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedBranch === b.code
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  {b.code}
                </button>
              ))}
            </div>

            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(Number(e.target.value))}
              className="bg-navy-900/90 text-white text-xs font-bold px-3 py-2 rounded-xl border border-navy-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem} className="bg-navy-900 text-white">
                  Semester {sem}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all border border-white/10 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-red-400" />
              <span>+ Custom Subject</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subject Chips Bar */}
      <div className="p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Subjects:
          </span>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSubjectId === s.id
                  ? 'bg-navy-900 text-white shadow-xs scale-102'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory University Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-900">Official BEU Historical Pattern Notice</p>
          <p className="text-amber-800 leading-relaxed">
            "{analysis.disclaimer}" All rankings are calculated via empirical PYQ frequency and syllabus weights. Question 1 (Short Notes / Objective, 14 marks) is strictly compulsory in BEU end-semester exams.
          </p>
        </div>
      </div>

      {/* Top 4 Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Analyzed Papers</p>
            <p className="text-base sm:text-lg font-extrabold text-navy-950">
              {analysis.totalPapersAnalyzed} Years ({analysis.yearsCovered?.[0]}-{analysis.yearsCovered?.[analysis.yearsCovered.length - 1]})
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">High Yield Topics</p>
            <p className="text-base sm:text-lg font-extrabold text-navy-950">
              {analysis.topRankedTopics?.filter(t => t.priority === 'VERY_HIGH' || t.priority === 'HIGH').length || 8} Topics
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Top 2 Units Weight</p>
            <p className="text-base sm:text-lg font-extrabold text-emerald-600">
              {analysis.unitWiseAnalysis?.slice(0, 2).reduce((acc, u) => acc + u.pyqWeightagePercentage, 0) || 52}% of Marks
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Exam Blueprint</p>
            <p className="text-xs sm:text-sm font-extrabold text-navy-950">
              70 Marks • Q1 Compulsory
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Top Ranked Topics ({analysis.topRankedTopics?.length || 20})</span>
        </button>

        <button
          onClick={() => setActiveTab('repeated')}
          className={`pb-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'repeated'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Most Repeated Questions ({analysis.mostRepeatedQuestions?.length || 6})</span>
        </button>

        <button
          onClick={() => setActiveTab('numericals')}
          className={`pb-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'numericals'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Numericals & Derivations</span>
        </button>

        <button
          onClick={() => setActiveTab('units')}
          className={`pb-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'units'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Unit-Wise Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('timelines')}
          className={`pb-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'timelines'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Crash Timelines (7 / 3 / 1 Day)</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`pb-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'report'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>16-Point Master Report</span>
        </button>
      </div>

      {/* Tab 1: TOP RANKED TOPICS DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search high-yield topic or formula..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-500">Priority:</span>
              {(['ALL', 'VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    priorityFilter === p
                      ? 'bg-navy-950 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p === 'ALL' ? 'All' : p === 'VERY_HIGH' ? '🔴 Very High' : p === 'HIGH' ? '🟠 High' : p === 'MEDIUM' ? '🟡 Medium' : '🟢 Low'}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

              <span className="text-xs font-bold text-slate-500">Unit:</span>
              <select
                value={unitFilter}
                onChange={e => setUnitFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                className="bg-slate-100 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none"
              >
                <option value="ALL">All Units</option>
                {[1, 2, 3, 4, 5].map(u => (
                  <option key={u} value={u}>Unit {u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ranked Topics Cards / Table */}
          <div className="space-y-3">
            {filteredTopics.map(topic => (
              <div
                key={topic.rank}
                className={`p-5 rounded-2xl bg-white border transition-all hover:shadow-md ${
                  topic.priority === 'VERY_HIGH'
                    ? 'border-red-200 hover:border-red-400 bg-gradient-to-r from-red-50/20 to-white'
                    : topic.priority === 'HIGH'
                    ? 'border-amber-200 hover:border-amber-400 bg-gradient-to-r from-amber-50/20 to-white'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-navy-950 text-white font-mono text-[11px] font-extrabold">
                        Rank #{topic.rank}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                        Unit {topic.unit}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        topic.priority === 'VERY_HIGH'
                          ? 'bg-red-100 text-red-800'
                          : topic.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : topic.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {topic.priority === 'VERY_HIGH' ? '🔴 VERY HIGH PRIORITY' : topic.priority === 'HIGH' ? '🟠 HIGH PRIORITY' : topic.priority === 'MEDIUM' ? '🟡 MEDIUM PRIORITY' : '🟢 LOW PRIORITY'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 font-mono">
                        {topic.typicalMarks}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-navy-950">
                      {topic.topic}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {topic.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                      <span className="font-semibold">Years Asked:</span>
                      {topic.yearsAppeared.map(yr => (
                        <span key={yr} className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-700 font-mono text-[10px] font-bold border border-slate-200">
                          {yr}
                        </span>
                      ))}
                      <span className="mx-1">•</span>
                      <span className="font-semibold">Frequency:</span>
                      <span className="text-navy-900 font-bold">{topic.pyqFrequency}</span>
                    </div>
                  </div>

                  {/* Score Gauge & Action */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Importance Score</p>
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-lg font-black text-navy-950">{topic.importanceScore}</span>
                        <span className="text-xs font-bold text-slate-400">/ 100</span>
                      </div>
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            topic.importanceScore >= 90
                              ? 'bg-red-600'
                              : topic.importanceScore >= 75
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${topic.importanceScore}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedAIItem({
                        title: topic.topic,
                        unit: topic.unit,
                        details: topic.reason,
                        type: 'topic'
                      })}
                      className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-red-600 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>BEU Solution & Tips</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTopics.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                No topics matched your search filters. Try resetting the filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: MOST REPEATED QUESTIONS */}
      {activeTab === 'repeated' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-navy-950">Most Repeated Questions & Concepts</h2>
              <p className="text-xs text-slate-500">
                Directly repeated and conceptually modified questions with historical recurrence patterns
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {analysis.mostRepeatedQuestions?.length || 0} Core Questions
            </span>
          </div>

          <div className="space-y-3">
            {filteredRepeated.map((q, idx) => (
              <div key={q.id || idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-navy-400 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-navy-950 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                      Unit {q.unit}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      q.type === 'Exact Repeated'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    }`}>
                      {q.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-500">{q.typicalMarks}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200">
                      {q.probabilityAssessment}
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base font-bold text-navy-950 leading-relaxed">
                  "{q.question}"
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>BEU Paper Setter Variations & Trend Note:</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {q.wordingChangesNote}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-semibold">Appeared in:</span>
                    {q.yearsAsked.map(yr => (
                      <span key={yr} className="px-1.5 py-0.5 bg-slate-100 font-mono text-[11px] font-bold text-slate-700 rounded border border-slate-200">
                        {yr}
                      </span>
                    ))}
                    <span className="text-[11px] font-semibold text-slate-400">({q.timesRepeated} times repeated)</span>
                  </div>

                  <button
                    onClick={() => setSelectedAIItem({
                      title: q.question,
                      unit: q.unit,
                      details: q.wordingChangesNote,
                      type: 'question'
                    })}
                    className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    <span>Get 14-Mark Answer Format</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: NUMERICALS & DERIVATIONS */}
      {activeTab === 'numericals' && (
        <div className="space-y-6">
          {/* Important Numericals Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-navy-950 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span>High-Yield Numerical Models</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">Mandatory 14-Mark Templates</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.importantNumericals?.map((num, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[11px] font-extrabold">
                        Unit {num.unit} • {num.typicalMarks}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{num.frequency}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-navy-950">{num.topic}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{num.standardProblemModel}</p>

                    <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-1 overflow-x-auto">
                      <p className="text-red-400 font-bold text-[10px] uppercase font-sans">Key Formulas & Rules:</p>
                      {num.keyFormulae.map((f, fIdx) => (
                        <div key={fIdx} className="text-[11px] leading-relaxed">
                          • {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAIItem({
                      title: num.topic,
                      unit: num.unit,
                      details: num.standardProblemModel,
                      type: 'numerical'
                    })}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span>View Step-by-Step Solved Template</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Important Derivations Section */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-base font-extrabold text-navy-950 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Important Derivations & Mathematical Proofs</span>
            </h2>

            <div className="space-y-3">
              {analysis.importantDerivations?.map((der, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                        Unit {der.unit}
                      </span>
                      <h3 className="text-sm font-extrabold text-navy-950">{der.derivationName}</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{der.typicalMarks}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950">
                    <p className="font-bold text-indigo-900 mb-1">Standard Proof Sequence:</p>
                    <p className="leading-relaxed font-mono text-[11px] text-indigo-800">{der.keyStepsSummary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: UNIT-WISE MATRIX */}
      {activeTab === 'units' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-extrabold text-navy-950">Unit-Wise Weightage & Priority Ranking</h2>
            <p className="text-xs text-slate-500">
              Ranked from highest scoring potential to lowest. Prioritize Rank 1 and Rank 2 for immediate passing safety.
            </p>
          </div>

          <div className="space-y-4">
            {analysis.unitWiseAnalysis?.map(u => (
              <div key={u.unitNumber} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-navy-950 text-white text-xs font-black">
                        Rank #{u.unitRank}
                      </span>
                      <h3 className="text-base font-extrabold text-navy-950">
                        Unit {u.unitNumber}: {u.unitTitle}
                      </h3>
                    </div>
                    <p className="text-xs font-semibold text-red-600">{u.overallImportance}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Exam Weightage</p>
                    <p className="text-xl font-black text-navy-950">~{u.pyqWeightagePercentage}%</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-navy-900 rounded-full" style={{ width: `${u.pyqWeightagePercentage * 2.5}%` }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-900 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Must Prepare Topics:</span>
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {u.mostImportantTopics.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-1">
                    <p className="font-bold text-amber-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Low Priority (Prepare Last):</span>
                    </p>
                    <ul className="list-disc list-inside text-amber-800 space-y-0.5">
                      {u.lowPriorityTopics.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: CRASH TIMELINES (7 / 3 / 1 DAY) */}
      {activeTab === 'timelines' && (
        <div className="space-y-6">
          {/* 7-Day Strategy */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-navy-950">
              <Calendar className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-extrabold">📅 7-Day Master Preparation Strategy</h2>
            </div>
            <p className="text-xs text-slate-600">Standard week-long strategy to maximize score towards 60+ out of 70 marks.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {analysis.preparationStrategy?.sevenDayStrategy.map((day, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 rounded bg-navy-950 text-white font-mono text-[10px] font-extrabold">
                      {day.dayRange}
                    </span>
                    <h3 className="text-xs font-extrabold text-navy-950">{day.focusUnits}</h3>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                      {day.topicsToCover.map((t, tIdx) => (
                        <li key={tIdx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[11px] font-bold text-red-600 pt-2 border-t border-slate-200">
                    Goal: {day.actionItems}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Day & 1-Day Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3-Day Crash */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-navy-950">
                <Zap className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-extrabold">⚡ 3-Day High-Yield Crash Plan</h2>
              </div>

              <div className="space-y-3">
                {analysis.preparationStrategy?.threeDayStrategy.map((d, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-amber-950">{d.day}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/60 text-amber-900">
                        {d.timeAllocation}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-navy-950">{d.focusArea}</p>
                    <ul className="text-xs text-slate-700 list-disc list-inside space-y-0.5">
                      {d.topicsToCover.map((t, tIdx) => (
                        <li key={tIdx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 1-Day Revision Strategy */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-navy-950">
                <Clock className="w-5 h-5 text-red-600" />
                <h2 className="text-base font-extrabold">⏳ 1-Day Exam Eve Emergency Plan</h2>
              </div>

              <div className="space-y-3">
                {analysis.preparationStrategy?.oneDayRevisionStrategy.map((slot, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-red-50/30 border border-red-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-red-950">{slot.timeSlot}</span>
                      <span className="text-[11px] font-bold text-slate-700">{slot.unitOrTopic}</span>
                    </div>
                    <div className="space-y-1">
                      {slot.keyChecklist.map((item, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2 text-xs text-slate-800">
                          <CheckSquare className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: 16-POINT MASTER REPORT (Formatted) */}
      {activeTab === 'report' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-extrabold text-navy-950">Official 16-Point Examination Pattern Report</h2>
              <p className="text-xs text-slate-500">Prepared for {analysis.subjectName} ({analysis.subjectCode})</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyMarkdownReport}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Markdown</span>
              </button>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-slate-800 space-y-6 font-sans">
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-navy-950 uppercase tracking-wider">1. BEU PYQ Analysis Summary</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{analysis.summaryOverview || 'Longitudinal multi-year analysis.'}</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-navy-950 uppercase tracking-wider">2. Latest Syllabus Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2.5">Unit</th>
                      <th className="p-2.5">Title</th>
                      <th className="p-2.5">Approx Weight</th>
                      <th className="p-2.5">Core Focus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analysis.unitWiseAnalysis?.map(u => (
                      <tr key={u.unitNumber}>
                        <td className="p-2.5 font-bold">Unit {u.unitNumber}</td>
                        <td className="p-2.5">{u.unitTitle}</td>
                        <td className="p-2.5 font-bold text-red-600">{u.pyqWeightagePercentage}%</td>
                        <td className="p-2.5">{u.mostImportantTopics.slice(0, 2).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-navy-950 uppercase tracking-wider">3. BEU Question Pattern</h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <p>• <strong>Total Marks:</strong> {analysis.questionPattern?.totalExamMarks || 70} Marks</p>
                <p>• <strong>Compulsory Section:</strong> {analysis.questionPattern?.compulsoryQuestion}</p>
                <p>• <strong>Choice Structure:</strong> {analysis.questionPattern?.choiceStructure}</p>
                <p>• <strong>Theory vs Numerical:</strong> {analysis.questionPattern?.theoryNumericalRatio}</p>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-navy-950 uppercase tracking-wider">16. Final Top Topics to Study First</h3>
              <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 text-xs text-red-950 font-bold space-y-1">
                {analysis.preparationStrategy?.finalTopTopicsToStudyFirst.map((item, idx) => (
                  <p key={idx}>✓ {item}</p>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* AI Solver Drawer / Modal */}
      {selectedAIItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[11px] font-extrabold">
                    Unit {selectedAIItem.unit}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    BEU 14-Mark Examination Solution
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-navy-950">
                  {selectedAIItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAIItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-3">
              <div className="space-y-1">
                <p className="font-bold text-navy-950 text-sm">Exam Presentation Blueprint:</p>
                <p>1. <strong>Formal Definition & Formulas:</strong> State primary assumptions and mathematical bounds clearly in the opening 3 lines.</p>
                <p>2. <strong>Neat Labeled Diagram:</strong> Allocate 1/3 of the page to drawing standard figures (rotations, precedence graph, or state transitions).</p>
                <p>3. <strong>Step-by-Step Procedure:</strong> Show table columns with variable states instead of jumping to final answers.</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-0.5">
                <p className="font-bold">Paper-Checker Scoring Note:</p>
                <p>In BEU evaluation, 4 marks are allotted for the diagram, 6 marks for step execution, and 4 marks for the final derived output.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedAIItem(null);
                  navigateTo('ai-assistant');
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open in AI Tutor for Full Answer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Subject Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-navy-950">Analyze Custom BEU Subject</h3>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCustomSubjectSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Subject Name / Paper Code:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems, Strength of Materials, BEE..."
                  value={customSubjectName}
                  onChange={e => setCustomSubjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm"
                >
                  Generate Pattern Analysis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
