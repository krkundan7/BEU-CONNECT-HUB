import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import {
  Users, Plus, Search, Shield, ChevronRight,
  ArrowRight, Radio, Bell, BookOpen, Layers, CheckCircle2
} from 'lucide-react';
import { Community } from '../types';

export const CommunitiesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();

  const [communities, setCommunities] = useState<Community[]>(StorageService.getCommunities());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [commName, setCommName] = useState('');
  const [commDesc, setCommDesc] = useState('');
  const [commCategory, setCommCategory] = useState<Community['category']>('interest');
  const [commIcon, setCommIcon] = useState('🚀');
  const [commRules, setCommRules] = useState('Be respectful and share verified academic resources.');

  const filteredCommunities = communities.filter(c => {
    const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleJoin = (commId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    const updated = StorageService.toggleJoinCommunity(commId, currentUser.id);
    setCommunities(updated);
    showToast('Community membership updated!', 'success');
  };

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commName) return;

    const newComm: Community = {
      id: `comm-${Date.now()}`,
      name: commName,
      description: commDesc,
      category: commCategory,
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      icon: commIcon,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      members: [currentUser.id],
      isPrivate: false,
      rules: [commRules],
      createdAt: 'Just now',
      postCount: 0
    };

    StorageService.createCommunity(newComm);
    setCommunities(StorageService.getCommunities());
    setShowCreateModal(false);
    setCommName('');
    setCommDesc('');
    showToast('Community created successfully! You are the moderator.', 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>BEU Student Chapters & Clubs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Communities
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Join official college chapters, branch forums, and interest groups in AI/ML, Web Dev, GATE prep, and Open Source.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Community</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Chapters' },
            { id: 'college', label: '🏛️ Colleges' },
            { id: 'branch', label: '💻 Branches' },
            { id: 'interest', label: '🎯 Tech & Clubs' }
          ].map(c => (
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

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities..."
            className="w-full pl-10 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
          />
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCommunities.map(comm => {
          const isMember = currentUser ? comm.members.includes(currentUser.id) : false;
          return (
            <div
              key={comm.id}
              onClick={() => navigateTo('community-detail', { communityId: comm.id })}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-subtle hover:shadow-card-hover hover:border-navy-300 cursor-pointer transition-all duration-200 flex flex-col justify-between group space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-navy-50 text-2xl flex items-center justify-center border border-navy-100 flex-shrink-0">
                    {comm.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-beu-dark group-hover:text-navy-900 transition-colors">
                      {comm.name}
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-semibold capitalize">
                      {comm.category} Community • {comm.members.length} Members
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleToggleJoin(comm.id, e)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    isMember
                      ? 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700'
                      : 'bg-navy-900 hover:bg-navy-800 text-white shadow-xs'
                  }`}
                >
                  {isMember ? 'Joined' : '+ Join'}
                </button>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {comm.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-navy-900">
                <span className="text-slate-400 font-normal">{comm.postCount} Discussions</span>
                <div className="flex items-center gap-1 text-emerald-600 group-hover:translate-x-1 transition-transform">
                  <span>Enter Chapter</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-beu-dark">Create New Student Community</h3>

            <form onSubmit={handleCreateCommunity} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-beu-dark mb-1">Community Name</label>
                <input
                  type="text"
                  value={commName}
                  onChange={(e) => setCommName(e.target.value)}
                  required
                  placeholder="e.g. BEU Web3 & Open Source Club"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-beu-dark mb-1">Category</label>
                  <select
                    value={commCategory}
                    onChange={(e) => setCommCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  >
                    <option value="interest">Interest / Club</option>
                    <option value="branch">Branch Specific</option>
                    <option value="college">College Chapter</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-beu-dark mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    value={commIcon}
                    onChange={(e) => setCommIcon(e.target.value)}
                    maxLength={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white text-center text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-beu-dark mb-1">Description & Objective</label>
                <textarea
                  rows={3}
                  value={commDesc}
                  onChange={(e) => setCommDesc(e.target.value)}
                  required
                  placeholder="Explain who should join and what discussions are welcomed..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-beu-dark mb-1">Community Rule</label>
                <input
                  type="text"
                  value={commRules}
                  onChange={(e) => setCommRules(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm"
                >
                  Create Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const CommunityDetailPage: React.FC = () => {
  const { selectedCommunityId, navigateTo } = useNavigation();
  const { currentUser, allUsers } = useAuth();
  const { showToast } = useNotification();

  const [community, setCommunity] = useState<Community | undefined>(
    StorageService.getCommunityById(selectedCommunityId || 'comm-cse-beu')
  );

  if (!community) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-bold text-beu-dark">Community not found</p>
        <button onClick={() => navigateTo('communities')} className="mt-3 px-4 py-2 bg-navy-900 text-white text-xs font-semibold rounded-xl">
          Back to Communities
        </button>
      </div>
    );
  }

  const isMember = currentUser ? community.members.includes(currentUser.id) : false;

  const handleToggleJoin = () => {
    if (!currentUser) return;
    const updated = StorageService.toggleJoinCommunity(community.id, currentUser.id);
    const curr = updated.find(c => c.id === community.id);
    setCommunity(curr);
    showToast(isMember ? 'Left community' : 'Joined community!', 'success');
  };

  const memberUsers = allUsers.filter(u => community.members.includes(u.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <button
        onClick={() => navigateTo('communities')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 hover:text-emerald-600"
      >
        ← Back to all communities
      </button>

      {/* Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-navy-950 via-navy-900 to-emerald-900 flex items-end p-6">
          <div className="text-4xl">{community.icon}</div>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-beu-dark">{community.name}</h1>
              <p className="text-xs text-emerald-600 font-semibold capitalize mt-0.5">
                {community.category} Chapter • {community.members.length} Registered Members
              </p>
            </div>

            <button
              onClick={handleToggleJoin}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isMember ? 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600' : 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500'
              }`}
            >
              {isMember ? 'Joined (Leave)' : '+ Join Community'}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{community.description}</p>

          {/* Announcements */}
          {community.announcements && community.announcements.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-600" />
                Moderator Announcement
              </p>
              <p>{community.announcements[0]}</p>
            </div>
          )}

          {/* Rules */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
            <p className="font-bold text-beu-dark flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-navy-900" />
              Community Code of Conduct
            </p>
            <ul className="list-disc list-inside space-y-1">
              {community.rules.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Members Showcase */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-beu-dark mb-3">Community Members ({memberUsers.length})</h3>
            <div className="flex flex-wrap gap-2">
              {memberUsers.map(u => (
                <div
                  key={u.id}
                  onClick={() => navigateTo('profile', { userId: u.id })}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors"
                >
                  <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-xs font-semibold text-beu-dark">{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
