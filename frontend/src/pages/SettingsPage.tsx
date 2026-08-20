import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';
import { AvatarUploadModal } from '../components/AvatarUploadModal';
import { MOCK_COLLEGES } from '../data/mockData';
import { BEU_BRANCHES_LIST } from './BEUHubPage';
import {
  Settings, User, Lock, Bell, Shield, LogOut,
  Trash2, CheckCircle2, EyeOff, Save, Camera, UploadCloud,
  Building2, GraduationCap
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'security'>('account');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Account State
  const [name, setName] = useState(currentUser?.name || '');
  const [college, setCollege] = useState(currentUser?.college || 'Government Engineering College');
  const [branch, setBranch] = useState(currentUser?.branch || 'Computer Science & Engineering');
  const [branchCode, setBranchCode] = useState(currentUser?.branchCode || 'CSE');
  const [semester, setSemester] = useState(currentUser?.semester || 3);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [github, setGithub] = useState(currentUser?.github || '');
  const [linkedin, setLinkedin] = useState(currentUser?.linkedin || '');

  // Privacy State
  const [profileVisible, setProfileVisible] = useState(true);
  const [allowDirectMessages, setAllowDirectMessages] = useState(true);

  // Notification State
  const [academicAlerts, setAcademicAlerts] = useState(true);
  const [socialAlerts, setSocialAlerts] = useState(true);
  const [careerAlerts, setCareerAlerts] = useState(true);

  if (!currentUser) return null;

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      college,
      branch,
      branchCode,
      semester: Number(semester),
      bio,
      github,
      linkedin
    });
    showToast('Profile details updated successfully!', 'success');
  };

  const handleBranchChange = (code: string) => {
    setBranchCode(code);
    const found = BEU_BRANCHES_LIST.find(b => b.code === code);
    if (found) {
      setBranch(found.name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-extrabold text-beu-dark">Platform Settings & Privacy</h1>
        <p className="text-xs text-beu-muted">Manage your student profile, privacy controls, and security</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
        {/* Left Navigation */}
        <div className="p-4 border-r border-slate-200 space-y-1 bg-slate-50/50">
          {[
            { id: 'account', label: 'Account Profile', icon: User },
            { id: 'privacy', label: 'Privacy Controls', icon: Shield },
            { id: 'notifications', label: 'Notification Settings', icon: Bell },
            { id: 'security', label: 'Security & Sessions', icon: Lock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-200">
            <button
              onClick={() => {
                logout();
                navigateTo('landing');
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Right Settings Pane */}
        <div className="md:col-span-3 p-6 sm:p-8">
          {/* TAB 1: ACCOUNT */}
          {activeTab === 'account' && (
            <form onSubmit={handleSaveAccount} className="space-y-5 text-xs">
              <h3 className="text-base font-bold text-beu-dark">Public Profile Information</h3>

              {/* Profile Photo Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-transform hover:scale-105"
                    title="Change Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-slate-900">Profile Photo</h4>
                  <p className="text-xs text-slate-500">
                    Upload a custom JPG, PNG or choose from student 3D avatars.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAvatarModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload New Photo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-beu-dark mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-beu-dark mb-1">Engineering College</label>
                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                >
                  {MOCK_COLLEGES.map(col => (
                    <option key={col.id} value={col.name}>
                      {col.name} ({col.location})
                    </option>
                  ))}
                  <option value="Other Bihar Engineering College">Other BEU Affiliated College</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-beu-dark mb-1">Branch</label>
                  <select
                    value={branchCode}
                    onChange={(e) => handleBranchChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  >
                    {BEU_BRANCHES_LIST.filter(b => b.code !== 'ALL').map(b => (
                      <option key={b.code} value={b.code}>
                        {b.code} - {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-beu-dark mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
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
                <label className="block font-semibold text-beu-dark mb-1">Bio / Student Pitch</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-beu-dark mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-beu-dark mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </form>
          )}

          {/* TAB 2: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 text-xs">
              <h3 className="text-base font-bold text-beu-dark">Privacy & Visibility Preferences</h3>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p>
                  Your BEU Registration Number (<strong>{currentUser.beuRegNo}</strong>) is strictly encrypted and never visible to any student or external visitor.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-beu-dark">Show Profile in Global Peer Search</p>
                    <p className="text-slate-500">Allow students from other BEU colleges to find you for projects</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileVisible}
                    onChange={(e) => setProfileVisible(e.target.checked)}
                    className="w-4 h-4 rounded accent-navy-900"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-beu-dark">Allow 1-on-1 Direct Messaging</p>
                    <p className="text-slate-500">Permit verified peers and mentors to message you</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowDirectMessages}
                    onChange={(e) => setAllowDirectMessages(e.target.checked)}
                    className="w-4 h-4 rounded accent-navy-900"
                  />
                </label>
              </div>

              <button
                onClick={() => showToast('Privacy preferences updated', 'success')}
                className="px-4 py-2 bg-navy-900 text-white font-bold rounded-xl"
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-beu-dark">Notification Preferences</h3>

              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-beu-dark">🔴 Official BEU Exam Notices</p>
                    <p className="text-slate-500">Datesheet releases and examination schedule updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={academicAlerts}
                    onChange={(e) => setAcademicAlerts(e.target.checked)}
                    className="w-4 h-4 rounded accent-navy-900"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-beu-dark">🚀 Hackathon & Fellowship Opportunities</p>
                    <p className="text-slate-500">Alerts for Bihar Innovation Grants and internships</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={careerAlerts}
                    onChange={(e) => setCareerAlerts(e.target.checked)}
                    className="w-4 h-4 rounded accent-navy-900"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-beu-dark">💬 Social Feed & Mentorship Messages</p>
                    <p className="text-slate-500">Likes, replies and incoming mentorship requests</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={socialAlerts}
                    onChange={(e) => setSocialAlerts(e.target.checked)}
                    className="w-4 h-4 rounded accent-navy-900"
                  />
                </label>
              </div>

              <button
                onClick={() => showToast('Notification settings saved', 'success')}
                className="px-4 py-2 bg-navy-900 text-white font-bold rounded-xl"
              >
                Save Settings
              </button>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-beu-dark">Security & Password</h3>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-beu-dark mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-beu-dark mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  />
                </div>
              </div>

              <button
                onClick={() => showToast('Password updated successfully', 'success')}
                className="px-4 py-2 bg-navy-900 text-white font-bold rounded-xl"
              >
                Update Password
              </button>

              <div className="pt-6 border-t border-slate-200">
                <h4 className="font-bold text-red-600 mb-1">Danger Zone</h4>
                <p className="text-slate-500 mb-3">Permanently remove your student account and portfolio data.</p>
                <button
                  onClick={() => showToast('Account deletion protection enabled in demo mode.', 'info')}
                  className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl font-semibold"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Photo Upload Modal */}
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />
    </div>
  );
};
