import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import {
  Briefcase, Search, ExternalLink, Calendar, MapPin,
  Sparkles, CheckCircle2, DollarSign, Award, Clock
} from 'lucide-react';
import { Opportunity } from '../types';

export const CareerHubPage: React.FC = () => {
  const [opportunities] = useState<Opportunity[]>(StorageService.getOpportunities());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOnline, setOnlyOnline] = useState(false);

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = !searchQuery || opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || opp.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
    const matchesMode = !onlyOnline || opp.isOnline;
    return matchesSearch && matchesCategory && matchesMode;
  });

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'hackathon', label: '🚀 Hackathons (SIH)' },
    { id: 'scholarship', label: '🎓 Bihar Fellowships' },
    { id: 'internship', label: '💼 Paid Internships' },
    { id: 'job', label: '🏛️ Govt Apprentices' }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Briefcase className="w-4 h-4" />
          <span>Verified Career & Innovation Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Opportunities & Career Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Curated opportunities for Bihar engineering students: Bihar State Innovation Grants (₹2.25L), Smart India Hackathon, paid remote internships, and DRDO apprenticeships.
        </p>
      </div>

      {/* Filter Bar */}
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

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunity or company..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
            />
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={onlyOnline}
              onChange={(e) => setOnlyOnline(e.target.checked)}
              className="rounded accent-navy-900"
            />
            <span>Remote Only</span>
          </label>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOpportunities.map(opp => (
          <div
            key={opp.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {opp.category}
                  </span>
                  <h3 className="text-base font-bold text-beu-dark mt-1 leading-snug">{opp.title}</h3>
                  <p className="text-xs text-beu-muted font-medium">{opp.organization}</p>
                </div>

                {opp.stipendOrPrize && (
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 whitespace-nowrap">
                    {opp.stipendOrPrize}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{opp.description}</p>

              {/* Tags & Location */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location}
                </span>
                <span className="flex items-center gap-1 font-semibold text-red-600">
                  <Clock className="w-3.5 h-3.5" /> Deadline: {opp.deadline}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {opp.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Source & CTA Button */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="truncate">Source: {opp.verifiedSource}</span>
              </div>

              <a
                href={opp.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
