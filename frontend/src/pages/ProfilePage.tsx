import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import { AvatarUploadModal } from '../components/AvatarUploadModal';
import {
  User as UserIcon, CheckCircle2, Award, ExternalLink,
  Globe, Sparkles, BookOpen, Layers, Plus, Share2, MessageSquare,
  Shield, Calendar, Briefcase, FileCode, Check, Camera
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, allUsers, toggleFollow } = useAuth();
  const { viewedUserId, setViewedUserId, navigateTo } = useNavigation();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'passport' | 'projects' | 'posts' | 'badges'>('passport');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Identify target user: either viewedUserId or current logged in user
  const targetUser = (viewedUserId ? allUsers.find(u => u.id === viewedUserId) : currentUser) || currentUser;

  if (!targetUser) return null;

  const isOwnProfile = currentUser?.id === targetUser.id;
  const isFollowing = currentUser?.following.includes(targetUser.id);
  const userPosts = StorageService.getPosts().filter(p => p.userId === targetUser.id);

  const getBadgeInfo = (badge?: string) => {
    switch (badge) {
      case 'top_contributor':
        return { label: '🥇 Top BEU Contributor', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'helpful_student':
        return { label: '🥈 Helpful Student', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
      default:
        return { label: '🥉 Active Contributor', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
  };

  const badgeInfo = getBadgeInfo(targetUser.badge);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        {/* Cover Gradient */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-navy-950 via-navy-900 to-emerald-900 relative">
          <div className="absolute right-4 top-4">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Skill Passport</span>
            </button>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar with Upload Trigger */}
            <div className="relative group">
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-28 sm:w-32 h-28 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
              />

              {/* Camera Upload Button on Avatar */}
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute bottom-0 right-0 p-2 rounded-2xl bg-navy-950/85 hover:bg-navy-950 text-white shadow-lg border-2 border-white hover:scale-105 transition-all flex items-center justify-center cursor-pointer group-hover:ring-2 group-hover:ring-emerald-500/50"
                  title="Upload Profile Photo"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                </button>
              )}

              {targetUser.verificationStatus === 'verified' && !isOwnProfile && (
                <div className="absolute bottom-1 right-1 p-1.5 bg-emerald-500 text-navy-950 rounded-xl border-2 border-white shadow-sm" title="Verified BEU Student">
                  <CheckCircle2 className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {!isOwnProfile ? (
                <>
                  <button
                    onClick={() => toggleFollow(targetUser.id)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    {isFollowing ? 'Following' : '+ Follow Student'}
                  </button>
                  <button
                    onClick={() => navigateTo('messages')}
                    className="p-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload Photo</span>
                  </button>

                  <button
                    onClick={() => navigateTo('settings')}
                    className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-beu-dark">{targetUser.name}</h1>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${badgeInfo.bg}`}>
                  {badgeInfo.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-beu-muted font-medium mt-0.5">
                {targetUser.college} • {targetUser.branch} (Sem {targetUser.semester})
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
              {targetUser.bio}
            </p>

            {/* Social & Code Links */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600">
              {targetUser.github && (
                <a href={targetUser.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-navy-900 font-medium">
                  <FileCode className="w-4 h-4 text-slate-700" /> <span>GitHub</span>
                </a>
              )}
              {targetUser.linkedin && (
                <a href={targetUser.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-navy-900 font-medium">
                  <Share2 className="w-4 h-4 text-blue-600" /> <span>LinkedIn</span>
                </a>
              )}
              {targetUser.portfolio && (
                <a href={targetUser.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-navy-900 font-medium">
                  <Globe className="w-4 h-4 text-emerald-600" /> <span>Portfolio</span>
                </a>
              )}
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-navy-900">★ {targetUser.contributionPoints} Karma Pts</span>
              <span className="text-slate-400">•</span>
              <span><strong>{targetUser.followers.length}</strong> Followers</span>
              <span><strong>{targetUser.following.length}</strong> Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-3 scrollbar-none">
        {[
          { id: 'passport', label: 'Student Skill Passport', icon: Sparkles },
          { id: 'projects', label: 'Collaborative Projects', icon: Briefcase },
          { id: 'posts', label: `Campus Updates (${userPosts.length})`, icon: BookOpen },
          { id: 'badges', label: 'Badges & Contributions', icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-navy-900 text-navy-900 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SKILL PASSPORT */}
      {activeTab === 'passport' && (
        <div className="space-y-6">
          {/* Skills Grid */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-4">
            <h3 className="text-base font-bold text-beu-dark flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Verified Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {targetUser.skills.map(sk => (
                <span
                  key={sk}
                  className="px-3 py-1.5 rounded-xl bg-navy-50 text-navy-900 border border-navy-200 text-xs font-bold"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Academic Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-1 text-center">
              <p className="text-2xl font-extrabold text-emerald-600">8.42</p>
              <p className="text-xs font-bold text-beu-dark">BEU Cumulative CGPA</p>
              <p className="text-[10px] text-slate-400">Verified through Semester 3</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-1 text-center">
              <p className="text-2xl font-extrabold text-blue-600">12</p>
              <p className="text-xs font-bold text-beu-dark">Shared Study Notes</p>
              <p className="text-[10px] text-slate-400">180+ Peer Downloads</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-1 text-center">
              <p className="text-2xl font-extrabold text-purple-600">SIH 2025</p>
              <p className="text-xs font-bold text-beu-dark">Grand Finale Finalist</p>
              <p className="text-[10px] text-slate-400">Agri AI Project</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-beu-dark">AI Agriculture Assistant</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                SIH 2025 Finalist
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multilingual crop pathology diagnosis for farmers in Bihar built with FastAI, React, and FastAPI.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">React</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Python</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">FastAPI</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <p className="text-xs text-beu-muted py-8 text-center bg-white rounded-2xl border border-slate-200">
              No campus posts shared yet.
            </p>
          ) : (
            userPosts.map(p => (
              <div key={p.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-2">
                <p className="text-xs text-slate-700 whitespace-pre-line">{p.content}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>{p.createdAt}</span>
                  <span>❤️ {p.likes.length} Likes • 💬 {p.comments.length} Comments</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: BADGES */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle flex items-start gap-3">
            <span className="text-2xl">🥇</span>
            <div>
              <h4 className="text-sm font-bold text-beu-dark">Top Contributor Badge</h4>
              <p className="text-xs text-slate-600 mt-0.5">Awarded for uploading top-rated handwritten notes and answering peer doubts.</p>
            </div>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle flex items-start gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h4 className="text-sm font-bold text-beu-dark">Verified Student Status</h4>
              <p className="text-xs text-slate-600 mt-0.5">Authenticated against Bihar Engineering University college records.</p>
            </div>
          </div>
        </div>
      )}

      {/* Share Passport Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-beu-dark">Share Student Skill Passport</h3>
              <p className="text-xs text-beu-muted">Share your verified academic profile with recruiters and hackathon peers</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 select-all break-all">
              https://beu-connect-hub.digital/passport/{targetUser.id}
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Confidentiality Protected: Your BEU Registration # and private email are hidden.</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://beu-connect-hub.digital/passport/${targetUser.id}`);
                  showToast('Passport link copied to clipboard!', 'success');
                  setShowShareModal(false);
                }}
                className="flex-1 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Photo Upload Modal */}
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />
    </div>
  );
};
