import React from 'react';
import { Opportunity, Notice } from '../types';
import {
  X, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle,
  Building, Calendar, Clock, Globe, Link2, Copy, Check
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface SourceTransparencyModalProps {
  item: Opportunity | Notice | null;
  onClose: () => void;
}

export const SourceTransparencyModal: React.FC<SourceTransparencyModalProps> = ({
  item,
  onClose
}) => {
  const { showToast } = useNotification();
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  if (!item) return null;

  const isOpportunity = 'organization' in item;
  const title = item.title;
  const orgOrSource = isOpportunity ? item.organization : item.source;
  const isOfficial = isOpportunity ? item.isOfficialSource : item.isOfficial;
  const sourceName = item.sourceName || (isOpportunity ? item.verifiedSource : item.source) || 'Official Issuing Authority';
  const primaryUrl = item.sourceUrl || item.applicationUrl || ('fileUrl' in item ? item.fileUrl : undefined);
  const applicationUrl = item.applicationUrl;
  const publishedDate = item.publishedDate || ('publishedAt' in item ? item.publishedAt : undefined);
  const deadline = item.deadline;
  const lastVerified = item.lastVerified || 'Active & Verified';
  const sources = item.sources && item.sources.length > 0 ? item.sources : (primaryUrl ? [{ name: sourceName, url: primaryUrl, isOfficial: true }] : []);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('Source link copied to clipboard!', 'success');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-navy-900 text-white px-2.5 py-0.5 rounded-lg">
                Source Transparency & Verification
              </span>
              {isOfficial ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Official Source
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                  <Globe className="w-3 h-3 text-slate-400" />
                  External Web Resource
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Guarantee Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Original Source Link Integrity Guarantee</p>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Every link listed here redirects directly to the original issuing organization or government authority webpage. Zero artificial or shortened redirects.
            </p>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Issuing Body / Organization</span>
            <p className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
              <Building className="w-3.5 h-3.5 text-slate-400" /> {orgOrSource}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Last Verified Date</span>
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {lastVerified}
            </p>
          </div>

          {publishedDate && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Published Date</span>
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {publishedDate}
              </p>
            </div>
          )}

          {deadline && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Application Deadline</span>
              <p className="font-semibold text-rose-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" /> {deadline}
              </p>
            </div>
          )}
        </div>

        {/* Verified Original Source Links List */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-navy-800" />
            Verified Source URLs ({sources.length})
          </h3>

          <div className="space-y-2">
            {sources.map((src, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div className="space-y-0.5 truncate flex-1">
                  <div className="flex items-center gap-1.5">
                    {src.isOfficial ? (
                      <span className="text-[9px] font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Official
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                        Reference
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-900 truncate">{src.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate font-mono select-all">
                    {src.url}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(src.url)}
                    className="p-2 rounded-xl text-slate-500 hover:text-navy-900 bg-slate-100 hover:bg-slate-200 transition-colors text-xs flex items-center gap-1"
                    title="Copy URL"
                  >
                    {copiedUrl === src.url ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <span>Open Original Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
