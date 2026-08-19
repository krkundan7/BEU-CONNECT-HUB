import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation, PageId } from '../context/NavigationContext';
import {
  LayoutDashboard, BookOpen, Bot, FileSpreadsheet, Calendar,
  FileText, Video, Radio, Users, MessageSquare,
  Sparkles, Handshake, Briefcase, Building2, TrendingUp,
  ShieldCheck, AlertOctagon, BellRing, Settings, CheckCircle2,
  Compass
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { currentPage, navigateTo } = useNavigation();

  const handleNav = (page: PageId) => {
    navigateTo(page);
    onClose();
  };

  const navSections = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'goalmap' as PageId, label: 'BEU GoalMap GPS', icon: Compass, badge: 'AI GPS' }
      ]
    },
    {
      title: 'Academic & AI Hub',
      items: [
        { id: 'study-hub' as PageId, label: 'Study Hub (Syllabus)', icon: BookOpen, badge: null },
        { id: 'ai-assistant' as PageId, label: 'BEU AI Assistant', icon: Bot, badge: 'AI' },
        { id: 'pyq-analyzer' as PageId, label: 'PYQ Pattern Analyzer', icon: FileSpreadsheet, badge: 'Hot' },
        { id: 'study-planner' as PageId, label: 'Personal Study Planner', icon: Calendar, badge: null },
        { id: 'notes' as PageId, label: 'Shared Notes', icon: FileText, badge: null },
        { id: 'videos' as PageId, label: 'Study Videos', icon: Video, badge: null }
      ]
    },
    {
      title: 'Community & Social',
      items: [
        { id: 'social' as PageId, label: 'Campus Social Feed', icon: Radio, badge: null },
        { id: 'communities' as PageId, label: 'Student Communities', icon: Users, badge: '4+' },
        { id: 'messages' as PageId, label: 'Direct Messages', icon: MessageSquare, badge: null },
        { id: 'profile' as PageId, label: 'Skill Passport & Profile', icon: Sparkles, badge: null }
      ]
    },
    {
      title: 'Collaboration & Career',
      items: [
        { id: 'projects' as PageId, label: 'Find Project Team', icon: Handshake, badge: 'Active' },
        { id: 'mentorship' as PageId, label: 'Senior-Junior Mentorship', icon: ShieldCheck, badge: null },
        { id: 'career-hub' as PageId, label: 'Career & Opportunities', icon: Briefcase, badge: 'New' }
      ]
    },
    {
      title: 'University & Progress',
      items: [
        { id: 'beu-hub' as PageId, label: 'BEU Official Hub', icon: Building2, badge: 'Notices' },
        { id: 'study-progress' as PageId, label: 'My Study Progress', icon: TrendingUp, badge: null }
      ]
    }
  ];

  if (currentUser?.role === 'admin') {
    navSections.push({
      title: 'Admin & Moderation',
      items: [
        { id: 'admin-dashboard' as PageId, label: 'Admin Metrics', icon: ShieldCheck, badge: 'Admin' },
        { id: 'admin-verification' as PageId, label: 'Student Verification', icon: CheckCircle2, badge: 'Queue' },
        { id: 'admin-moderation' as PageId, label: 'Content Moderation', icon: AlertOctagon, badge: 'Review' },
        { id: 'admin-notices' as PageId, label: 'Publish BEU Notice', icon: BellRing, badge: null }
      ]
    });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* User Mini Bar */}
        {currentUser && (
          <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 text-white shadow-subtle">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-400/50"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold truncate">{currentUser.name}</p>
                  {currentUser.verificationStatus === 'verified' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 truncate">{currentUser.branchCode} • Sem {currentUser.semester}</p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-navy-700/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-300">Karma Points:</span>
              <span className="font-bold text-amber-300">★ {currentUser.contributionPoints} pts</span>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="p-3 space-y-6 pb-20">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-navy-900 text-white font-semibold shadow-sm'
                          : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                            isActive
                              ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Settings Link */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNav('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                currentPage === 'settings'
                  ? 'bg-navy-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/80'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Platform Settings</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};
