import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { StorageService } from '../services/storageService';
import { PersonaSwitcherPill } from './PersonaSwitcherPill';
import {
  GraduationCap, Search, Bell, Menu, X, User as UserIcon,
  LogOut, Shield, Award, Sparkles, BookOpen, Compass, CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { currentPage, navigateTo, setIsSearchOpen } = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = currentUser ? StorageService.getNotifications(currentUser.id) : [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const isPublicPage = ['landing', 'about', 'features', 'how-it-works', 'privacy', 'terms', 'login', 'register'].includes(currentPage);

  return (
    <header className="sticky top-0 z-40 bg-navy-900 text-white border-b border-navy-800 backdrop-blur-md shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated && !isPublicPage && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => navigateTo(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  BEU CONNECT
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  HUB
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-1 hidden sm:block tracking-wide">
                Digital Campus Ecosystem
              </p>
            </div>
          </button>
        </div>

        {/* Middle: Global Search Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-navy-950/60 hover:bg-navy-950 border border-navy-700/80 text-slate-400 hover:text-slate-200 transition-all text-xs group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Search subjects, PYQs, communities, mentors...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-navy-800 border border-navy-700 rounded group-hover:text-slate-200">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Persona Switcher Pill */}
          <PersonaSwitcherPill />

          {/* Search Trigger for Mobile */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-800 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-navy-950 text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-navy-900">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-beu-dark rounded-2xl shadow-dropdown border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-beu-dark">Notifications</h4>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (currentUser) StorageService.markAllNotificationsRead(currentUser.id);
                          setShowNotifications(false);
                          navigateTo('notifications');
                        }}
                        className="text-xs text-emerald-600 hover:underline font-medium"
                      >
                        View all
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-1">
                      {notifications.length === 0 ? (
                        <p className="py-6 text-center text-xs text-beu-muted">No notifications right now.</p>
                      ) : (
                        notifications.slice(0, 4).map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              setShowNotifications(false);
                              navigateTo('notifications');
                            }}
                            className={`p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-navy-50/50' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-beu-dark">{n.title}</p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.createdAt}</span>
                            </div>
                            <p className="text-xs text-beu-muted line-clamp-2 mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-navy-800/80 hover:bg-navy-800 border border-navy-700 transition-all"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-7 h-7 rounded-lg object-cover border border-emerald-500/40"
                  />
                  <span className="hidden sm:inline text-xs font-semibold text-slate-200">
                    {currentUser?.name.split(' ')[0]}
                  </span>
                  {currentUser?.verificationStatus === 'verified' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 hidden sm:inline" />
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-beu-dark rounded-2xl shadow-dropdown border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 border-b border-slate-100 mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-beu-dark truncate">{currentUser?.name}</p>
                        {currentUser?.verificationStatus === 'verified' && (
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-beu-muted truncate">{currentUser?.college}</p>
                      <p className="text-[11px] text-slate-400">{currentUser?.branchCode} • Sem {currentUser?.semester}</p>
                    </div>

                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigateTo('profile', { userId: currentUser?.id });
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        My Profile & Skill Passport
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigateTo('study-progress');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <Award className="w-4 h-4 text-slate-400" />
                        My Study Progress
                      </button>

                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigateTo('admin-dashboard');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100/70 rounded-xl transition-colors"
                        >
                          <Shield className="w-4 h-4 text-amber-600" />
                          Admin Console
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigateTo('settings');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        Settings & Privacy
                      </button>
                    </div>

                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          navigateTo('landing');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigateTo('register')}
                className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-colors"
              >
                Join Hub
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
