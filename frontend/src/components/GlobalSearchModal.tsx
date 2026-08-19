import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import {
  Search, X, BookOpen, Users, FileText, Briefcase,
  Bell, Award, ArrowRight, Sparkles, GraduationCap
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigateTo } = useNavigation();
  const { allUsers } = useAuth();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  // Search categories
  const subjects = StorageService.getSubjects().filter(s =>
    !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.branchCode.toLowerCase().includes(q)
  ).slice(0, 4);

  const notes = StorageService.getNotes().filter(n =>
    !q || n.title.toLowerCase().includes(q) || n.subjectName.toLowerCase().includes(q)
  ).slice(0, 3);

  const pyqs = StorageService.getPYQs().filter(p =>
    !q || p.title.toLowerCase().includes(q) || p.subjectName.toLowerCase().includes(q)
  ).slice(0, 3);

  const communities = StorageService.getCommunities().filter(c =>
    !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  ).slice(0, 3);

  const students = allUsers.filter(u =>
    !q || u.name.toLowerCase().includes(q) || u.college.toLowerCase().includes(q) || u.skills.some(sk => sk.toLowerCase().includes(q))
  ).slice(0, 3);

  const opportunities = StorageService.getOpportunities().filter(o =>
    !q || o.title.toLowerCase().includes(q) || o.organization.toLowerCase().includes(q) || o.category.toLowerCase().includes(q) || (o.tags && o.tags.some(t => t.toLowerCase().includes(q)))
  ).slice(0, 3);

  const notices = StorageService.getNotices().filter(n =>
    !q || n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.source.toLowerCase().includes(q)
  ).slice(0, 3);

  const hasResults = subjects.length > 0 || notes.length > 0 || pyqs.length > 0 || communities.length > 0 || students.length > 0 || opportunities.length > 0 || notices.length > 0;

  const handleSelect = (action: () => void) => {
    setIsSearchOpen(false);
    action();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-beu-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search syllabus, PYQs, students, communities, opportunities..."
            className="w-full text-base bg-transparent text-beu-dark placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-300 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 flex-1">
          {!q && (
            <div className="p-3 bg-navy-50/60 rounded-xl border border-navy-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-navy-900 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quick Discovery Suggestions</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['Data Structures', 'AVL Rotations', 'DBMS Normalization', 'MIT Muzaffarpur', 'SIH 2025 Hackathon', 'PYQ 2024'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 text-xs bg-white text-navy-800 hover:bg-navy-100/70 border border-navy-200/60 rounded-lg transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!hasResults && q && (
            <div className="py-12 text-center text-beu-muted">
              <p className="text-sm">No results found for <span className="font-semibold text-beu-dark">"{query}"</span></p>
              <p className="text-xs mt-1">Try searching for subject names like "DBMS", "DSA", or college names.</p>
            </div>
          )}

          {/* Subjects */}
          {subjects.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-beu-muted mb-1.5">Academic Subjects</p>
              <div className="space-y-1">
                {subjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(() => navigateTo('subject-detail', { subjectId: s.id }))}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-navy-50/70 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-navy-100 text-navy-900">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-beu-dark group-hover:text-navy-900">{s.name}</p>
                        <p className="text-xs text-beu-muted">{s.branchCode} • Sem {s.semester} • {s.code}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-navy-900 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PYQs & Notes */}
          {(pyqs.length > 0 || notes.length > 0) && (
            <div>
              <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-beu-muted mb-1.5">Study Resources & PYQs</p>
              <div className="space-y-1">
                {pyqs.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(() => navigateTo('pyq-analyzer'))}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-beu-dark truncate">{p.title}</p>
                        <p className="text-[11px] text-beu-muted">{p.subjectName} • {p.year} Paper</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">PYQ</span>
                  </button>
                ))}
                {notes.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleSelect(() => navigateTo('notes'))}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-beu-dark truncate">{n.title}</p>
                        <p className="text-[11px] text-beu-muted">{n.authorName} ({n.authorCollege})</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Note</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Students & Mentors */}
          {students.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-beu-muted mb-1.5">Students & Peers</p>
              <div className="space-y-1">
                {students.map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleSelect(() => navigateTo('profile', { userId: u.id }))}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-beu-dark">{u.name}</p>
                          {u.verificationStatus === 'verified' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Verified BEU Student" />
                          )}
                        </div>
                        <p className="text-[11px] text-beu-muted truncate">{u.college} • {u.branchCode}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-beu-muted">{u.skills.slice(0, 2).join(', ')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities with Verified Sources */}
          {opportunities.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-beu-muted mb-1.5 flex items-center justify-between">
                <span>Verified Career Opportunities</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Direct Source Links</span>
              </p>
              <div className="space-y-1.5">
                {opportunities.map(opp => {
                  const targetUrl = opp.applicationUrl || opp.sourceUrl;
                  return (
                    <div
                      key={opp.id}
                      onClick={() => handleSelect(() => {
                        if (targetUrl) {
                          window.open(targetUrl, '_blank', 'noopener,noreferrer');
                        } else {
                          navigateTo('career-hub');
                        }
                      })}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/60 border border-slate-100 hover:border-purple-200 transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 flex-shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded">
                              {opp.category}
                            </span>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-purple-900 truncate">{opp.title}</p>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{opp.organization} • Source: <strong>{opp.sourceName || opp.verifiedSource}</strong></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        {opp.stipendOrPrize && (
                          <span className="hidden sm:inline text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {opp.stipendOrPrize}
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-purple-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Apply <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Official Notices */}
          {notices.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-beu-muted mb-1.5 flex items-center justify-between">
                <span>Official BEU Circulars</span>
                <span className="text-[10px] text-emerald-600 font-semibold">100% Authentic</span>
              </p>
              <div className="space-y-1.5">
                {notices.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleSelect(() => navigateTo('beu-hub'))}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-red-50/40 border border-slate-100 hover:border-red-200 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="p-1.5 rounded-lg bg-red-50 text-red-600 flex-shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase text-red-700 bg-red-100/70 px-1.5 py-0.2 rounded">
                            {n.category}
                          </span>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-red-900 truncate">{n.title}</p>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Issuing Authority: {n.sourceName || n.source}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-red-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2">
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communities */}
          {communities.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-beu-muted mb-1.5">Student Communities</p>
              <div className="space-y-1">
                {communities.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(() => navigateTo('community-detail', { communityId: c.id }))}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{c.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-beu-dark">{c.name}</p>
                        <p className="text-[11px] text-beu-muted">{c.members.length} members • {c.category} category</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-navy-900" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-beu-muted flex items-center justify-between">
          <span>Search across 38+ BEU Colleges & Curriculums</span>
          <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Enter</kbd> to navigate</span>
        </div>
      </div>
    </div>
  );
};
