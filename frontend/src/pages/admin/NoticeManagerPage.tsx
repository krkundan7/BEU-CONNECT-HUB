import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useNotification } from '../../context/NotificationContext';
import { StorageService } from '../../services/storageService';
import { BellRing, ArrowLeft, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { Notice } from '../../types';

export const NoticeManagerPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Notice['category']>('exam');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [source, setSource] = useState('Examination Controller, Bihar Engineering University, Patna');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newNotice: Notice = {
      id: `not-${Date.now()}`,
      title,
      category,
      isOfficial: true,
      source,
      publishedAt: 'August 17, 2025',
      summary: summary || title,
      content,
      isUrgent,
      fileUrl: 'https://example.com/official-notice.pdf'
    };

    StorageService.createNotice(newNotice);
    showToast('Official university notice published across the platform!', 'success');
    navigateTo('beu-hub');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTo('admin-dashboard')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-beu-dark">Publish Official University Notice</h1>
          <p className="text-xs text-beu-muted">Broadcast verified examination notices and circulars</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-card">
        <form onSubmit={handlePublish} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-beu-dark mb-1">Notice Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Schedule for B.Tech 3rd Semester Practical Examinations 2025"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-beu-dark mb-1">Notice Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
              >
                <option value="exam">🔴 Examination & Datesheet</option>
                <option value="result">🔵 Result & Scrutiny</option>
                <option value="scholarship">🟢 Scholarship (PMS)</option>
                <option value="admission">🟡 Admission / Registration</option>
                <option value="career">🟣 Career / Placement</option>
                <option value="general">⚪ Academic Calendar & General</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-beu-dark mb-1">Issuing Authority</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-beu-dark mb-1">Short Summary (Visible on Dashboard Ticker)</label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="1-2 sentences summarizing key dates or instructions..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-beu-dark mb-1">Complete Circular Text</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Enter the full official circular content and instructions..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none text-xs leading-relaxed"
            />
          </div>

          <label className="flex items-center gap-2 p-3 bg-red-50/60 border border-red-200 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 rounded accent-red-600"
            />
            <div>
              <span className="font-bold text-red-950">Mark as Urgent High-Priority Alert</span>
              <p className="text-[11px] text-red-800">Places a red urgent banner across student dashboards</p>
            </div>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigateTo('admin-dashboard')}
              className="px-4 py-2.5 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Official Notice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
