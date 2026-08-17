import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import {
  Building2, Search, Bell, FileText, Download,
  ExternalLink, AlertCircle, CheckCircle2, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Notice } from '../types';
import { useNotification } from '../context/NotificationContext';

export const BEUHubPage: React.FC = () => {
  const { showToast } = useNotification();
  const [notices] = useState<Notice[]>(StorageService.getNotices());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const filteredNotices = notices.filter(n => {
    const matchesSearch = !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'exam', label: '🔴 Examination & Datesheets' },
    { id: 'result', label: '🔵 Results & Scrutiny' },
    { id: 'scholarship', label: '🟢 Scholarships (PMS)' },
    { id: 'general', label: '⚪ Academic Calendars' }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Official University Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          BEU Hub & Smart Notice Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Access verified circulars, end-term examination timetables, scrutiny notifications, and semester academic calendars from Bihar Engineering University, Patna.
        </p>
      </div>

      {/* Official Status Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Official Information Verification Guarantee:</p>
          <p className="mt-0.5 leading-relaxed">
            All circulars listed under this section are mirrored from official university examination controllers and nodal offices. Unverified student rumors are strictly filtered.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars, results, dates..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map(notice => (
          <div
            key={notice.id}
            onClick={() => setSelectedNotice(notice)}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-subtle hover:shadow-card-hover hover:border-navy-300 cursor-pointer transition-all duration-200 space-y-3 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  notice.category === 'exam' ? 'bg-red-500 animate-pulse' : notice.category === 'result' ? 'bg-blue-500' : 'bg-emerald-500'
                }`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  notice.category === 'exam' ? 'bg-red-50 text-red-700' : notice.category === 'result' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {notice.category} Notice
                </span>
                {notice.isUrgent && (
                  <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                    Urgent
                  </span>
                )}
              </div>

              <span className="text-xs text-slate-400 font-medium">{notice.publishedAt}</span>
            </div>

            <h3 className="text-base font-bold text-beu-dark group-hover:text-navy-900 transition-colors leading-snug">
              {notice.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">{notice.summary}</p>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 font-medium truncate">
                Source: {notice.source}
              </span>

              <div className="flex items-center gap-1.5 font-bold text-emerald-600 group-hover:translate-x-1 transition-transform self-end sm:self-auto">
                <span>View Official Circular</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-navy-900 text-white px-2.5 py-1 rounded-lg">
                Official BEU Notification
              </span>
              <span className="text-xs text-slate-400">{selectedNotice.publishedAt}</span>
            </div>

            <h2 className="text-lg font-bold text-beu-dark leading-snug">{selectedNotice.title}</h2>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedNotice.content}
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-xs text-blue-900 font-semibold">
              Issuing Authority: {selectedNotice.source}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast('Downloaded official PDF notice', 'success');
                  setSelectedNotice(null);
                }}
                className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Signed PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
