import React, { useState } from 'react';
import { Opportunity } from '../types';
import {
  ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle,
  Clock, MapPin, Sparkles, Trophy, Briefcase, GraduationCap,
  Layers, Globe, Calendar, Building, ChevronRight, Info
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onOpenSourceModal?: (opportunity: Opportunity) => void;
  compact?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onOpenSourceModal,
  compact = false
}) => {
  const [showSourcesDropdown, setShowSourcesDropdown] = useState(false);

  // Determine primary destination URL: prefer applicationUrl if present, otherwise sourceUrl
  const primaryActionUrl = opportunity.applicationUrl || opportunity.sourceUrl;
  const isSourceAvailable = Boolean(opportunity.sourceUrl && opportunity.sourceUrl.trim().length > 0);

  // Dynamic button label & icon based on category
  const getActionConfig = () => {
    switch (opportunity.category) {
      case 'hackathon':
        return {
          label: 'Official Details',
          icon: <Trophy className="w-3.5 h-3.5" />,
          btnClass: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'job':
        return {
          label: 'Apply Now',
          icon: <Briefcase className="w-3.5 h-3.5" />,
          btnClass: 'bg-gradient-to-r from-navy-900 to-indigo-900 hover:from-navy-800 hover:to-indigo-800 text-white',
          badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'internship':
        return {
          label: 'Apply Now',
          icon: <Sparkles className="w-3.5 h-3.5" />,
          btnClass: 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white',
          badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      case 'scholarship':
        return {
          label: 'Official Application',
          icon: <GraduationCap className="w-3.5 h-3.5" />,
          btnClass: 'bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'workshop':
      case 'career_event':
        return {
          label: 'Official Event Page',
          icon: <Calendar className="w-3.5 h-3.5" />,
          btnClass: 'bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-600 hover:to-cyan-600 text-white',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      default:
        return {
          label: 'View Original Source',
          icon: <ExternalLink className="w-3.5 h-3.5" />,
          btnClass: 'bg-navy-900 hover:bg-navy-800 text-white',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const config = getActionConfig();
  const multipleSources = opportunity.sources && opportunity.sources.length > 1;

  const handleCardClick = () => {
    if (isSourceAvailable && primaryActionUrl) {
      window.open(primaryActionUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (compact) {
    return (
      <div
        onClick={handleCardClick}
        className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-card hover:border-emerald-300 transition-all cursor-pointer group space-y-2"
      >
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${config.badgeClass}`}>
            {opportunity.category}
          </span>
          {opportunity.stipendOrPrize && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 truncate">
              {opportunity.stipendOrPrize}
            </span>
          )}
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-snug">
            {opportunity.title}
          </h4>
          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
            {opportunity.organization}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-100">
          <span className="flex items-center gap-1 text-red-600 font-semibold truncate">
            <Clock className="w-3 h-3" /> {opportunity.deadline}
          </span>
          <span className="flex items-center gap-1 font-bold text-navy-800 group-hover:translate-x-0.5 transition-transform">
            Source <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card-hover hover:border-emerald-300/80 transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer relative"
    >
      {/* Top Header Row */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${config.badgeClass}`}>
                {opportunity.category}
              </span>

              {opportunity.isOfficialSource ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Official Portal
                </span>
              ) : isSourceAvailable ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                  <Globe className="w-3 h-3 text-slate-400" />
                  Verified Web Source
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  Source Unavailable
                </span>
              )}

              {opportunity.isOnline && (
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                  Remote / Online
                </span>
              )}
            </div>

            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-navy-950 transition-colors leading-snug pt-1">
              {opportunity.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{opportunity.organization}</span>
            </div>
          </div>

          {opportunity.stipendOrPrize && (
            <div className="sm:self-start flex-shrink-0">
              <span className="inline-block text-xs font-extrabold text-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 shadow-2xs whitespace-nowrap">
                {opportunity.stipendOrPrize}
              </span>
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
          {opportunity.description}
        </p>

        {/* Location & Deadline Pill Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
          {opportunity.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {opportunity.location}
            </span>
          )}
          <span className="flex items-center gap-1 font-semibold text-rose-600 bg-rose-50/60 px-2.5 py-0.5 rounded-lg border border-rose-100">
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            Deadline: {opportunity.deadline}
          </span>
          {opportunity.lastVerified && (
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Verified: {opportunity.lastVerified}
            </span>
          )}
        </div>

        {/* Tags */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {opportunity.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Source Transparency & Action Footer */}
      <div className="pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Source metadata label */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 truncate max-w-xs">
            {opportunity.isOfficialSource ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            ) : (
              <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            )}
            <span className="truncate font-medium text-slate-600">
              Source: <strong className="text-slate-800 font-semibold">{opportunity.sourceName || opportunity.verifiedSource || 'Official Portal'}</strong>
            </span>
          </div>

          {/* Multiple Sources trigger */}
          {multipleSources && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenSourceModal) {
                  onOpenSourceModal(opportunity);
                } else {
                  setShowSourcesDropdown(!showSourcesDropdown);
                }
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-navy-900 bg-navy-50 hover:bg-navy-100 rounded-md border border-navy-200 transition-colors"
            >
              <Layers className="w-3 h-3 text-navy-700" />
              <span>{opportunity.sources?.length} Sources</span>
            </button>
          )}

          {/* Source Transparency Info Button */}
          {onOpenSourceModal && !multipleSources && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenSourceModal(opportunity);
              }}
              title="Inspect Source Verification"
              className="p-1 text-slate-400 hover:text-navy-900 rounded transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Buttons Action Group */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Secondary Link if Application & Source are different */}
          {opportunity.applicationUrl && opportunity.sourceUrl && opportunity.applicationUrl !== opportunity.sourceUrl && (
            <a
              href={opportunity.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-navy-950 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1 transition-all"
            >
              <span>View Source</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}

          {/* Primary CTA Button */}
          {isSourceAvailable && primaryActionUrl ? (
            <a
              href={primaryActionUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all ${config.btnClass}`}
            >
              {config.icon}
              <span>{config.label}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-not-allowed"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
              <span>Source Unavailable</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Sources Dropdown (if modal callback not provided) */}
      {showSourcesDropdown && opportunity.sources && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in text-xs"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span>Verified Source Links ({opportunity.sources.length}):</span>
            <span className="text-[10px] text-slate-400">All links open in new tab</span>
          </div>
          <div className="space-y-1.5">
            {opportunity.sources.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 transition-colors group/item"
              >
                <div className="flex items-center gap-2 truncate">
                  {s.isOfficial ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  )}
                  <span className="font-semibold text-slate-800 truncate">{s.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 group-hover/item:translate-x-0.5 transition-transform flex-shrink-0 ml-2">
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
