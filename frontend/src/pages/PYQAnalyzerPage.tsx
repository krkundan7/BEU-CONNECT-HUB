import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { StorageService } from '../services/storageService';
import { MOCK_PYQ_ANALYSES, MOCK_BRANCHES } from '../data/mockData';
import {
  FileSpreadsheet, Sparkles, Filter, AlertTriangle,
  Download, Eye, CheckCircle2, ChevronRight, BookOpen, Layers
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const PYQAnalyzerPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();

  const [selectedBranch, setSelectedBranch] = useState(currentUser?.branchCode || 'CSE');
  const [selectedSemester, setSelectedSemester] = useState(currentUser?.semester || 3);
  const [selectedSubjectId, setSelectedSubjectId] = useState('cse-301');

  const subjects = StorageService.getSubjects(selectedBranch, selectedSemester);
  const analysis = MOCK_PYQ_ANALYSES[selectedSubjectId] || MOCK_PYQ_ANALYSES['cse-301'];
  const pyqs = StorageService.getPYQs(selectedBranch, selectedSemester, selectedSubjectId);

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3">
        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
          <FileSpreadsheet className="w-4 h-4" />
          <span>AI Examination Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          AI PYQ Pattern Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Historical analysis of past Bihar Engineering University question papers (2019-2024) to identify recurring question structures, unit weightages, and high-yield topics.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 pt-2">
          {MOCK_BRANCHES.slice(0, 3).map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedBranch === b.code
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-navy-800 text-slate-300 hover:text-white'
              }`}
            >
              {b.name} ({b.code})
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 mr-2">Select Subject to Analyze:</span>
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubjectId(s.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubjectId === s.id
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {s.name} ({s.code})
          </button>
        ))}
      </div>

      {/* Mandatory Disclaimer Alert */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Important University Disclaimer:</p>
          <p className="mt-0.5 leading-relaxed">
            "{analysis.disclaimer}"
          </p>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Question Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Topics List */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-beu-dark">
                  Recurring Topic Patterns ({analysis.patterns.length} Identified)
                </h3>
                <p className="text-xs text-beu-muted">
                  Derived from {analysis.totalPapersAnalyzed} analyzed end-sem examinations
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded">🔴 High Priority</span>
                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded">🟡 Medium</span>
              </div>
            </div>

            <div className="space-y-3">
              {analysis.patterns.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.priority === 'high'
                      ? 'bg-red-50/40 border-red-200/80 hover:bg-red-50/70'
                      : item.priority === 'medium'
                      ? 'bg-amber-50/40 border-amber-200/80 hover:bg-amber-50/70'
                      : 'bg-emerald-50/40 border-emerald-200/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <h4 className="text-xs sm:text-sm font-bold text-beu-dark">{item.topic}</h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded self-start sm:self-auto ${
                      item.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : item.priority === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Unit {item.unit} • {item.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    Exam Frequency: <span className="font-bold text-navy-900">{item.examOccurrence}</span>
                  </p>

                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                    <span>Appeared in Papers:</span>
                    <div className="flex gap-1">
                      {item.recurringYears.map(yr => (
                        <span key={yr} className="px-1.5 py-0.2 bg-white rounded border border-slate-200 font-mono text-[10px]">
                          {yr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Yield Tips */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-3">
            <h3 className="text-base font-bold text-beu-dark flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Strategic High-Yield Revision Tips for BEU Exams
            </h3>

            <div className="space-y-2">
              {analysis.highYieldTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Unit Weightages & PYQ Download */}
        <div className="space-y-6">
          {/* Unit-wise Weightage Breakdown */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-beu-dark flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Unit-Wise Marks Distribution
            </h3>

            <div className="space-y-3">
              {analysis.unitWeightage.map(uw => (
                <div key={uw.unit} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-beu-dark truncate">Unit {uw.unit}: {uw.unitTitle}</span>
                    <span className="text-navy-900 font-bold">{uw.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        uw.percentage >= 25 ? 'bg-red-500' : uw.percentage >= 20 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${uw.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download Original Question Papers */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-3">
            <h3 className="text-sm font-bold text-beu-dark flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              Verified BEU Question Papers
            </h3>

            <div className="space-y-2">
              {pyqs.map(p => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-xs font-bold text-beu-dark">{p.year} {p.examType}</p>
                    <p className="text-[10px] text-slate-500">{p.fileSize} • {p.downloadCount} downloads</p>
                  </div>
                  <button
                    onClick={() => showToast(`Downloaded ${p.title}`, 'success')}
                    className="p-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
