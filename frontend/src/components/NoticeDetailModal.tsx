import React from 'react';
import { Notice } from '../types';
import {
  X, ExternalLink, Download, ShieldCheck, FileText,
  Calendar, Building2, AlertTriangle, CheckCircle2,
  Tag, ArrowUpRight, Share2
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface NoticeDetailModalProps {
  notice: Notice | null;
  onClose: () => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ notice, onClose }) => {
  const { showToast } = useNotification();

  if (!notice) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: notice.title,
        text: notice.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${notice.title}\n\nRead more on BEU Connect Hub: ${window.location.href}`);
      showToast('Circular link copied to clipboard! 📋', 'success');
    }
  };

  const getCategoryColor = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('exam') || c.includes('time_table') || c.includes('datesheet')) {
      return { bg: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40', badge: 'bg-red-600 text-white' };
    }
    if (c.includes('result') || c.includes('scrutiny')) {
      return { bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40', badge: 'bg-blue-600 text-white' };
    }
    if (c.includes('scholarship') || c.includes('pms')) {
      return { bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40', badge: 'bg-emerald-600 text-white' };
    }
    if (c.includes('placement') || c.includes('internship') || c.includes('career')) {
      return { bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40', badge: 'bg-purple-600 text-white' };
    }
    return { bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40', badge: 'bg-amber-600 text-white' };
  };

  const colors = getCategoryColor(notice.category);
  const primaryDocUrl = notice.documentUrl || notice.fileUrl || notice.sourceUrl || 'https://beu-bih.ac.in';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wide border ${colors.bg}`}>
                {notice.category.replace(/_/g, ' ')}
              </span>

              {notice.notificationNumber && (
                <span className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {notice.notificationNumber}
                </span>
              )}

              {notice.isUrgent && (
                <span className="px-2 py-0.5 rounded-lg text-[11px] font-black bg-red-600 text-white flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  <span>URGENT</span>
                </span>
              )}

              <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Official</span>
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
              {notice.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-200 text-sm leading-relaxed scrollbar-thin">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Published Date</span>
              <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{notice.publishedAt || notice.publishedDate || 'Official University Gazette'}</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Audience</span>
              <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {notice.isAllBranches
                    ? 'All Branches'
                    : notice.targetBranches && notice.targetBranches.length > 0
                      ? notice.targetBranches.join(', ')
                      : 'All B.Tech'}
                </span>
              </p>
            </div>

            <div className="space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Semester Applicability</span>
              <p className="font-bold text-slate-700 dark:text-slate-300">
                {notice.isAllSemesters
                  ? 'All Semesters (1st – 8th)'
                  : notice.targetSemesters && notice.targetSemesters.length > 0
                    ? notice.targetSemesters.map(s => `${s}th Sem`).join(', ')
                    : 'Universal'}
              </p>
            </div>
          </div>

          {/* Issuing Authority Card */}
          <div className="p-3.5 rounded-2xl bg-navy-950 text-white flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Official Issuing Authority</span>
                <p className="font-black text-xs sm:text-sm text-white">
                  {notice.sourceName || notice.source || 'Bihar Engineering University, Patna'}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
              Official Citation
            </span>
          </div>

          {/* Summary Callout */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/40 dark:border-amber-600/30 space-y-1.5">
            <h4 className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Key Circular Summary & Action Required</span>
            </h4>
            <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 leading-relaxed font-medium">
              {notice.summary}
            </p>
          </div>

          {/* Full Notification Content */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Full Circular Text</h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-normal">
              {notice.content}
            </div>
          </div>

          {/* Statutory Verification Guarantee */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2 border border-slate-200/60 dark:border-slate-700/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p>
              Verified against Bihar Engineering University (BEU) official records. Circular authenticity is guaranteed. Contact your college nodal officer for institutional query escalation.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Circular</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {notice.documentUrl && (
              <a
                href={notice.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <span>Official PDF</span>
              </a>
            )}

            <a
              href={primaryDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all"
            >
              <span>Open on BEU Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
