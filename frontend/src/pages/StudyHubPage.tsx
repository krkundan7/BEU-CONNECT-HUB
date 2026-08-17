import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { StorageService } from '../services/storageService';
import { MOCK_BRANCHES } from '../data/mockData';
import {
  BookOpen, Search, Filter, ChevronRight, FileText,
  FileSpreadsheet, Video, Sparkles, Layers, GraduationCap
} from 'lucide-react';

export const StudyHubPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigateTo } = useNavigation();

  const [selectedBranch, setSelectedBranch] = useState(currentUser?.branchCode || 'CSE');
  const [selectedSemester, setSelectedSemester] = useState(currentUser?.semester || 3);
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = StorageService.getSubjects(selectedBranch, selectedSemester).filter(s =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>BEU Curriculum & Resource Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Academic Study Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Navigate official syllabus units, handwritten notes, previous year question papers, and curated study videos across all 8 semesters.
        </p>

        {/* Quick Branch Switcher Bar */}
        <div className="flex flex-wrap gap-2 pt-2">
          {MOCK_BRANCHES.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.code)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedBranch === b.code
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-navy-800/90 text-slate-300 hover:text-white hover:bg-navy-700'
              }`}
            >
              {b.name} ({b.code})
            </button>
          ))}
        </div>
      </div>

      {/* Semester Selector & Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Semesters 1 to 8 tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSemester === sem
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>

        {/* Subject Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subject or code..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
          />
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-beu-dark">
            {selectedBranch} — {selectedSemester}{selectedSemester === 1 ? 'st' : selectedSemester === 2 ? 'nd' : selectedSemester === 3 ? 'rd' : 'th'} Semester Subjects ({subjects.length})
          </h2>
          <span className="text-xs text-beu-muted">Click any subject to open detailed Unit breakdown</span>
        </div>

        {subjects.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-beu-dark">No subjects found for this selection</p>
            <p className="text-xs text-beu-muted mt-1">Try selecting 3rd or 4th Semester for full syllabus depth.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(sub => (
              <div
                key={sub.id}
                onClick={() => navigateTo('subject-detail', { subjectId: sub.id })}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:shadow-card-hover hover:border-navy-300 cursor-pointer transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-navy-50 text-navy-900 border border-navy-200 px-2 py-0.5 rounded">
                      {sub.code}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {sub.credits} Credits
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-beu-dark group-hover:text-navy-900 transition-colors">
                    {sub.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-slate-500 font-semibold">
                    <span className="p-1 bg-slate-50 rounded">5 Units</span>
                    <span className="p-1 bg-slate-50 rounded">PYQs Available</span>
                    <span className="p-1 bg-slate-50 rounded">Solved Notes</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 pt-1">
                    <span>Explore Subject Hub</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
