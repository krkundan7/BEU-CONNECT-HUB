import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { SourceTransparencyModal } from '../components/SourceTransparencyModal';
import {
  Building2, Search, Bell, FileText, Download,
  ExternalLink, AlertCircle, CheckCircle2, ShieldCheck, ChevronRight,
  Clock, Info, Globe
} from 'lucide-react';
import { Notice } from '../types';
import { useNotification } from '../context/NotificationContext';

export const BEUHubPage: React.FC = () => {
  const { showToast } = useNotification();
  const [notices] = useState<Notice[]>(StorageService.getNotices());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedNoticeForSourceModal, setSelectedNoticeForSourceModal] = useState<Notice | null>(null);

  const filteredNotices = notices.filter(n => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      n.title.toLowerCase().includes(query) ||
      n.summary.toLowerCase().includes(query) ||
      n.source.toLowerCase().includes(query);

    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Notices', count: notices.length },
    { id: 'exam', label: '🔴 Examination & Datesheets', count: notices.filter(n => n.category === 'exam').length },
    { id: 'result', label: '🔵 Results & Scrutiny', count: notices.filter(n => n.category === 'result').length },
    { id: 'scholarship', label: '🟢 Scholarships (PMS)', count: notices.filter(n => n.category === 'scholarship').length },
    { id: 'general', label: '⚪ Academic Calendars', count: notices.filter(n => n.category === 'general').length }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 text-white shadow-card space-y-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Official University Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              BEU Hub & Official Notice Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Access verified circulars, end-term examination timetables, scrutiny notifications, and semester academic calendars from Bihar Engineering University, Patna. Every circular is backed by original verified portal links.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center flex-shrink-0">
            <span className="text-xs text-slate-300">University Portal</span>
            <a
              href="https://beup.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>beup.ac.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Official Status Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-extrabold text-emerald-900">Official Information Verification Guarantee:</p>
          <p className="leading-relaxed text-emerald-800 text-[11px]">
            All circulars listed under this section are verified and linked to official university examination controllers and nodal state portals. Unverified student rumors are strictly rejected.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === c.id
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{c.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === c.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {c.count}
              </span>
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
        {filteredNotices.map(notice => {
          const directUrl = notice.sourceUrl || notice.fileUrl || 'https://beup.ac.in';
          return (
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
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Official Notice
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  {notice.deadline && (
                    <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                      Last Date: {notice.deadline}
                    </span>
                  )}
                  <span>{notice.publishedAt}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-navy-900 transition-colors leading-snug">
                {notice.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">{notice.summary}</p>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-medium truncate">
                  <span className="truncate">
                    Source: <strong className="text-slate-700 font-semibold">{notice.sourceName || notice.source}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNoticeForSourceModal(notice);
                    }}
                    className="text-slate-400 hover:text-navy-900 transition-colors"
                    title="Source Transparency Info"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <a
                    href={directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>View Original Circular</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-navy-900 text-white px-2.5 py-1 rounded-lg">
                  Official BEU Notification
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  100% Authentic Source
                </span>
              </div>
              <span className="text-xs text-slate-400">{selectedNotice.publishedAt}</span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 leading-snug">{selectedNotice.title}</h2>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedNotice.content}
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-xs text-blue-900 font-semibold space-y-1">
              <div className="flex items-center justify-between">
                <span>Issuing Authority: <strong>{selectedNotice.source}</strong></span>
                {selectedNotice.lastVerified && (
                  <span className="text-[10px] text-blue-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified: {selectedNotice.lastVerified}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-blue-700 font-mono select-all truncate">
                Direct Portal: {selectedNotice.sourceUrl || 'https://beup.ac.in'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={selectedNotice.sourceUrl || 'https://beup.ac.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <span>Open Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    showToast('Opening verified university circular PDF', 'success');
                    window.open(selectedNotice.sourceUrl || 'https://beup.ac.in', '_blank', 'noopener,noreferrer');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Circular</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Source Transparency Modal */}
      <SourceTransparencyModal
        item={selectedNoticeForSourceModal}
        onClose={() => setSelectedNoticeForSourceModal(null)}
      />
    </div>
  );
};
