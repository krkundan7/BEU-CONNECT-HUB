import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import { AvatarUploadModal } from '../components/AvatarUploadModal';
import { MOCK_COLLEGES } from '../data/mockData';
import { BEU_BRANCHES_LIST } from './BEUHubPage';
import {
  User as UserIcon, CheckCircle2, Award, ExternalLink,
  Globe, Sparkles, BookOpen, Layers, Plus, Share2, MessageSquare,
  Shield, Calendar, Briefcase, FileCode, Check, Camera, Edit3, X,
  GraduationCap, Building2, Save
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, allUsers, toggleFollow, updateProfile } = useAuth();
  const { viewedUserId, setViewedUserId, navigateTo } = useNavigation();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'passport' | 'projects' | 'posts' | 'badges'>('passport');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Identify target user: either viewedUserId or current logged in user
  const targetUser = (viewedUserId ? allUsers.find(u => u.id === viewedUserId) : currentUser) || currentUser;

  // Edit Modal State
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editCollege, setEditCollege] = useState(currentUser?.college || 'Government Engineering College');
  const [editBranch, setEditBranch] = useState(currentUser?.branch || 'Computer Science & Engineering');
  const [editBranchCode, setEditBranchCode] = useState(currentUser?.branchCode || 'CSE');
  const [editSemester, setEditSemester] = useState(currentUser?.semester || 3);
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editGithub, setEditGithub] = useState(currentUser?.github || '');
  const [editLinkedin, setEditLinkedin] = useState(currentUser?.linkedin || '');
  const [editPortfolio, setEditPortfolio] = useState(currentUser?.portfolio || '');

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

  const handleOpenEditModal = () => {
    if (!currentUser) return;
    setEditName(currentUser.name);
    setEditCollege(currentUser.college);
    setEditBranch(currentUser.branch);
    setEditBranchCode(currentUser.branchCode || 'CSE');
    setEditSemester(currentUser.semester);
    setEditBio(currentUser.bio || '');
    setEditGithub(currentUser.github || '');
    setEditLinkedin(currentUser.linkedin || '');
    setEditPortfolio(currentUser.portfolio || '');
    setShowEditModal(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    updateProfile({
      name: editName.trim() || currentUser.name,
      college: editCollege,
      branch: editBranch,
      branchCode: editBranchCode,
      semester: Number(editSemester),
      bio: editBio.trim(),
      github: editGithub.trim(),
      linkedin: editLinkedin.trim(),
      portfolio: editPortfolio.trim(),
    });

    showToast('Academic profile updated successfully!', 'success');
    setShowEditModal(false);
  };

  const handleBranchChange = (code: string) => {
    setEditBranchCode(code);
    const found = BEU_BRANCHES_LIST.find(b => b.code === code);
    if (found) {
      setEditBranch(found.name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        {/* Cover Gradient */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-navy-950 via-navy-900 to-emerald-900 relative">
          <div className="absolute right-4 top-4">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
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
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    {isFollowing ? 'Following' : '+ Follow Student'}
                  </button>
                  <button
                    onClick={() => navigateTo('messages')}
                    className="p-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload Photo</span>
                  </button>

                  <button
                    onClick={handleOpenEditModal}
                    className="px-4 py-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edit Profile</span>
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
                {isOwnProfile && (
                  <button
                    onClick={handleOpenEditModal}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-navy-900 transition-colors"
                    title="Edit Academic Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dynamic College, Branch, Semester Display */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-beu-muted font-medium mt-1">
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{targetUser.college}</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>{targetUser.branch} (Sem {targetUser.semester})</span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
              {targetUser.bio || 'Engineering student focused on practical projects and semester mastery.'}
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
              <span className="font-semibold text-navy-900">★ {targetUser.contributionPoints} Remarks Pts</span>
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
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
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
        </div>
      )}

      {/* TAB 2: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle text-center py-12 space-y-2">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No active projects showcased yet</h4>
            <p className="text-xs text-slate-400">Collaborate with peers in the Project Hub to build your engineering portfolio.</p>
          </div>
        </div>
      )}

      {/* TAB 3: POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <div key={post.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-3">
                <p className="text-xs text-slate-800 leading-relaxed">{post.content}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                  <span>{post.createdAt}</span>
                  <span>{post.likes} Likes • {post.comments.length} Comments</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle text-center py-12 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No campus updates posted yet</h4>
              <p className="text-xs text-slate-400">Share your academic notes and project milestones with the BEU community.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BADGES */}
      {activeTab === 'badges' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-4">
          <h3 className="text-base font-bold text-beu-dark flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Academic Recognition & Badges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <p className="text-xs font-bold text-amber-900">🥇 Active Knowledge Contributor</p>
              <p className="text-[11px] text-amber-700">Awarded for sharing handwritten study notes and solving peer academic questions.</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <p className="text-xs font-bold text-emerald-900">🎓 BEU Verified Student</p>
              <p className="text-[11px] text-emerald-700">Verified enrollment with Bihar Engineering University registration status.</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile & Academic Info Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-navy-50 text-navy-900 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Edit Academic Profile</h3>
                  <p className="text-xs text-slate-500">Update your college, branch, semester & bio</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                />
              </div>

              {/* College Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Engineering College</label>
                <select
                  value={editCollege}
                  onChange={e => setEditCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                >
                  {MOCK_COLLEGES.map(col => (
                    <option key={col.id} value={col.name}>
                      {col.name} ({col.location})
                    </option>
                  ))}
                  <option value="Other Bihar Engineering College">Other BEU Affiliated College</option>
                </select>
              </div>

              {/* Branch & Semester Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch</label>
                  <select
                    value={editBranchCode}
                    onChange={e => handleBranchChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                  >
                    {BEU_BRANCHES_LIST.filter(b => b.code !== 'ALL').map(b => (
                      <option key={b.code} value={b.code}>
                        {b.code} - {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={editSemester}
                    onChange={e => setEditSemester(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>
                        Semester {s} (B.Tech)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio / Student Pitch</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  placeholder="Describe your engineering focus, passion projects or career interests..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={editGithub}
                    onChange={e => setEditGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={editLinkedin}
                    onChange={e => setEditLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {showAvatarModal && (
        <AvatarUploadModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
        />
      )}
    </div>
  );
};
