import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { Report } from '../types';

export const ReportModal: React.FC = () => {
  const { reportModalData, closeReportModal } = useNavigation();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [reason, setReason] = useState<Report['reason']>('Spam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!reportModalData || !reportModalData.isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please login to report content', 'error');
      return;
    }

    setIsSubmitting(true);

    const newReport: Report = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      contentType: reportModalData.contentType as any,
      contentId: reportModalData.contentId,
      contentPreview: `${reportModalData.title}: ${details.slice(0, 100)}`,
      reason,
      status: 'pending',
      createdAt: 'Just now'
    };

    StorageService.createReport(newReport);

    setTimeout(() => {
      setIsSubmitting(false);
      closeReportModal();
      showToast('Report submitted for admin review. Thank you for keeping BEU Connect Hub safe!', 'success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-dropdown border border-slate-200 p-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={closeReportModal}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-beu-dark">Report Content</h3>
            <p className="text-xs text-beu-muted">Help maintain academic integrity and safety</p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
          <span className="font-semibold text-beu-dark">Reporting:</span> {reportModalData.title}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-beu-dark mb-1.5">Reason for reporting</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
            >
              <option value="Spam">Spam / Unsolicited Promotion</option>
              <option value="Misinformation">Misinformation / Outdated Syllabus</option>
              <option value="Copyright issue">Copyright Issue / Unauthorized Upload</option>
              <option value="Harassment">Harassment or Hate Speech</option>
              <option value="Inappropriate content">Inappropriate Academic Content</option>
              <option value="Other">Other Issues</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-beu-dark mb-1.5">Additional Details (Optional)</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please describe why this violates platform guidelines..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={closeReportModal}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
