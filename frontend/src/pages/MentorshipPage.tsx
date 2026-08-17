import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import {
  Sparkles, Search, Star, ShieldCheck, CheckCircle2,
  Calendar, Send, MessageSquare, ArrowRight, ExternalLink
} from 'lucide-react';
import { MentorProfile, MentorshipRequest } from '../types';

export const MentorshipPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [mentors] = useState<MentorProfile[]>(StorageService.getMentors());
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);

  // Request Modal State
  const [topic, setTopic] = useState('DSA & Placement Roadmap');
  const [message, setMessage] = useState('');

  const filteredMentors = mentors.filter(m => {
    const matchesSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.college.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'all' || m.domain.toLowerCase().includes(selectedDomain.toLowerCase());
    return matchesSearch && matchesDomain;
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedMentor) return;

    const request: MentorshipRequest = {
      id: `req-${Date.now()}`,
      mentorId: selectedMentor.userId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentCollege: currentUser.college,
      topic,
      message,
      status: 'pending',
      createdAt: 'Just now'
    };

    StorageService.requestMentorship(request);
    setSelectedMentor(null);
    setMessage('');
    showToast(`Mentorship request submitted to ${selectedMentor.name}!`, 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Senior-Junior Guidance Ecosystem</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Find a Senior Mentor
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Connect 1-on-1 with verified 4th-year seniors and alumni from BEU colleges placed at top tech companies or cracked GATE examinations.
        </p>
      </div>

      {/* Domain Filters & Search */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Mentors' },
            { id: 'Software', label: '💻 Software & Web Dev' },
            { id: 'GATE', label: '🎯 GATE & Core' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDomain === d.id
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mentor or college..."
            className="w-full pl-10 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
          />
        </div>
      </div>

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMentors.map(mentor => (
          <div
            key={mentor.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-beu-dark">{mentor.name}</h3>
                      {mentor.isVerified && (
                        <span title="Verified Senior Mentor">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-beu-muted font-medium">{mentor.college} • {mentor.branch}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">{mentor.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-xl">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{mentor.rating} ({mentor.reviewsCount})</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{mentor.bio}</p>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mentoring In:</span>
                <div className="flex flex-wrap gap-1">
                  {mentor.skills.map(sk => (
                    <span key={sk} className="text-[10px] font-semibold bg-navy-50 text-navy-900 px-2 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                🟢 {mentor.availableSlots} mentorship slots open this month
              </span>

              <button
                onClick={() => setSelectedMentor(mentor)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Request Mentorship
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mentorship Request Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-beu-dark">Request 1-on-1 Mentorship</h3>
            <p className="text-xs text-beu-muted">With {selectedMentor.name} ({selectedMentor.college})</p>

            <form onSubmit={handleSendRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-beu-dark mb-1">Guidance Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                >
                  <option value="DSA & Placement Roadmap">DSA & Off-Campus Roadmap</option>
                  <option value="Resume & Project Review">Resume & Project Architecture Review</option>
                  <option value="GATE Preparation Strategy">GATE Preparation Strategy</option>
                  <option value="BEU Semester Revision Tips">BEU End-Sem Scoring Strategy</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-beu-dark mb-1">Your Questions & Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Introduce yourself and list specific doubts you want advice on..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl shadow-sm"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
