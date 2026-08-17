import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useNotification } from '../../context/NotificationContext';
import { StorageService } from '../../services/storageService';
import { AlertOctagon, ArrowLeft, Check, Trash2, ShieldAlert } from 'lucide-react';
import { Report } from '../../types';

export const ContentModerationPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();
  const [reports, setReports] = useState<Report[]>(StorageService.getReports());

  const pendingReports = reports.filter(r => r.status === 'pending');

  const handleDismiss = (id: string) => {
    StorageService.updateReportStatus(id, 'dismissed');
    setReports(StorageService.getReports());
    showToast('Report dismissed as non-violating.', 'info');
  };

  const handleTakeDown = (id: string) => {
    StorageService.updateReportStatus(id, 'removed');
    setReports(StorageService.getReports());
    showToast('Content taken down and author warned.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTo('admin-dashboard')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-beu-dark">Content Moderation Queue</h1>
          <p className="text-xs text-beu-muted">Review reported student posts, notes, and comments</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-beu-dark">Open Reports ({pendingReports.length})</h3>
          <span className="text-xs font-semibold bg-red-50 text-red-800 px-2.5 py-0.5 rounded-full">
            Review Required
          </span>
        </div>

        {pendingReports.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No flagged content currently in the moderation queue. Platform is clean!
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReports.map(rep => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-red-50/30 border border-red-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                      Reason: {rep.reason}
                    </span>
                    <span className="text-slate-500">Reported by <strong>{rep.reporterName}</strong></span>
                  </div>
                  <span className="text-[10px] text-slate-400">{rep.createdAt}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                  <p className="font-semibold text-beu-dark mb-0.5">Reported Snippet:</p>
                  <p className="italic">"{rep.contentPreview}"</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleDismiss(rep.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => handleTakeDown(rep.id)}
                    className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Take Down Content</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
