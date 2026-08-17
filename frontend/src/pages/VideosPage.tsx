import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { Video, Search, Play, ExternalLink, ThumbsUp, Sparkles, Filter } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const VideosPage: React.FC = () => {
  const { showToast } = useNotification();
  const [videos, setVideos] = useState(StorageService.getVideos());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const filteredVideos = videos.filter(v => {
    const matchesSearch = !searchQuery || v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.channelName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || v.subjectName.toLowerCase().includes(selectedSubject.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3">
        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
          <Video className="w-4 h-4" />
          <span>Curated Video Lectures</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Engineering Video Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          High-yield visual walkthroughs and solved numericals from top educators mapped directly to your BEU semester curriculum.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic or educator channel..."
            className="w-full pl-10 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
        >
          <option value="all">All Subjects</option>
          <option value="Data Structures">Data Structures & Algorithms</option>
          <option value="Database">Database Management Systems</option>
        </select>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map(v => (
          <div
            key={v.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded">
                  {v.subjectName} • Unit {v.unit}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{v.duration}</span>
              </div>

              <h3 className="text-sm font-bold text-beu-dark leading-snug">{v.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{v.description}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">{v.channelName}</span>
                <span>{v.views} views</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {v.tags.map(t => (
                  <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>

              <a
                href={v.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch Full Lecture</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
