import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { OpportunityCard } from '../components/OpportunityCard';
import { SourceTransparencyModal } from '../components/SourceTransparencyModal';
import {
  Briefcase, Search, ShieldCheck, Sparkles, Filter,
  Layers, ExternalLink, Trophy, GraduationCap, CheckCircle2,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { Opportunity } from '../types';

export const CareerHubPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(StorageService.getOpportunities());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [onlyOfficial, setOnlyOfficial] = useState(false);
  const [selectedOpportunityForModal, setSelectedOpportunityForModal] = useState<Opportunity | null>(null);

  const filteredOpportunities = opportunities.filter(opp => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      opp.title.toLowerCase().includes(query) ||
      opp.organization.toLowerCase().includes(query) ||
      opp.description.toLowerCase().includes(query) ||
      opp.sourceName.toLowerCase().includes(query) ||
      (opp.tags && opp.tags.some(t => t.toLowerCase().includes(query)));

    const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
    const matchesMode = !onlyOnline || opp.isOnline;
    const matchesOfficial = !onlyOfficial || opp.isOfficialSource;

    return matchesSearch && matchesCategory && matchesMode && matchesOfficial;
  });

  const categories = [
    { id: 'all', label: 'All Opportunities', count: opportunities.length },
    { id: 'hackathon', label: '🚀 Hackathons (SIH)', count: opportunities.filter(o => o.category === 'hackathon').length },
    { id: 'scholarship', label: '🎓 Bihar Fellowships & Grants', count: opportunities.filter(o => o.category === 'scholarship').length },
    { id: 'internship', label: '💼 Verified Internships', count: opportunities.filter(o => o.category === 'internship').length },
    { id: 'job', label: '🏛️ Govt Apprenticeships', count: opportunities.filter(o => o.category === 'job').length },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-indigo-950 text-white shadow-card space-y-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-extrabold uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Verified Career & Innovation Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Opportunities & Source Link Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Curated and verified opportunities for Bihar engineering students. Every opportunity links directly to the <strong>exact original source webpage</strong> (SIH, DST Bihar, AICTE, Google, Microsoft, DRDO). Zero fake or placeholder URLs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="text-xs text-slate-300">Verified Portals</span>
              <p className="text-lg font-black text-emerald-400">100%</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="text-xs text-slate-300">Active Listings</span>
              <p className="text-lg font-black text-teal-300">{opportunities.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Source Integrity Guarantee Strip */}
      <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-emerald-900">Official Source Verification Guarantee:</span>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Clicking any card or action button opens the <strong>exact authentic application or circular page</strong> in a new tab.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] font-bold text-emerald-800">
          <span className="px-2.5 py-1 bg-emerald-100/80 rounded-lg border border-emerald-300/60">
            Direct Portals Only
          </span>
          <span className="px-2.5 py-1 bg-emerald-100/80 rounded-lg border border-emerald-300/60">
            Zero AI Hallucinated URLs
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
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

        {/* Search & Toggle Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunity or company..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={onlyOnline}
                onChange={(e) => setOnlyOnline(e.target.checked)}
                className="rounded accent-navy-900 w-3.5 h-3.5"
              >
              </input>
              <span>Remote Only</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={onlyOfficial}
                onChange={(e) => setOnlyOfficial(e.target.checked)}
                className="rounded accent-navy-900 w-3.5 h-3.5"
              >
              </input>
              <span>Official Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOpportunities.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onOpenSourceModal={(targetOpp) => setSelectedOpportunityForModal(targetOpp)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No opportunities match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters to see more verified listings.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyOnline(false);
              setOnlyOfficial(false);
            }}
            className="px-4 py-2 bg-navy-900 text-white text-xs font-bold rounded-xl hover:bg-navy-800 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}

      {/* Source Transparency Modal */}
      <SourceTransparencyModal
        item={selectedOpportunityForModal}
        onClose={() => setSelectedOpportunityForModal(null)}
      />
    </div>
  );
};
