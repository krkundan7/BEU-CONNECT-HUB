import React, { useState } from 'react';
import { useNavigation, PageId } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, Bot, Users, User,
  Menu, X, Sparkles, FileSpreadsheet, Calendar,
  Compass, Radio, Handshake, Briefcase, Building2,
  TrendingUp, ShieldCheck, Settings
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, navigateTo } = useNavigation();
  const { currentUser, isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (!isAuthenticated) return null;

  const mainTabs = [
    { id: 'dashboard' as PageId, label: 'Home', icon: LayoutDashboard },
    { id: 'goalmap' as PageId, label: 'GoalMap', icon: Compass },
    { id: 'ai-assistant' as PageId, label: 'BEU AI', icon: Bot, isHighlighted: true },
    { id: 'communities' as PageId, label: 'Community', icon: Users },
    { id: 'profile' as PageId, label: 'Profile', icon: User }
  ];

  const moreItems = [
    { id: 'study-hub' as PageId, label: 'Study Hub (Syllabus)', icon: BookOpen },
    { id: 'pyq-analyzer' as PageId, label: 'PYQ Pattern Analyzer', icon: FileSpreadsheet },
    { id: 'study-planner' as PageId, label: 'Study Planner', icon: Calendar },
    { id: 'social' as PageId, label: 'Campus Social Feed', icon: Radio },
    { id: 'projects' as PageId, label: 'Project Partner Finder', icon: Handshake },
    { id: 'mentorship' as PageId, label: 'Senior-Junior Mentorship', icon: Sparkles },
    { id: 'career-hub' as PageId, label: 'Career & Opportunities', icon: Briefcase },
    { id: 'beu-hub' as PageId, label: 'BEU Hub (Official Notices)', icon: Building2 },
    { id: 'study-progress' as PageId, label: 'My Progress Tracker', icon: TrendingUp },
    { id: 'settings' as PageId, label: 'Settings & Privacy', icon: Settings }
  ];

  if (currentUser?.role === 'admin') {
    moreItems.unshift({ id: 'admin-dashboard' as PageId, label: 'Admin Dashboard', icon: ShieldCheck });
  }

  const handleSelect = (page: PageId) => {
    setIsDrawerOpen(false);
    navigateTo(page);
  };

  return (
    <>
      {/* Mobile Drawer / Full Menu Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-beu-dark">Campus Features Menu</h3>
                <p className="text-xs text-beu-muted">All BEU Connect Hub digital tools</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl text-left border transition-all ${
                      isActive
                        ? 'bg-navy-900 border-navy-900 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-navy-800 text-emerald-400' : 'bg-white text-navy-900 shadow-xs'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold leading-tight line-clamp-2">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;

          if (tab.isHighlighted) {
            return (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                className="flex flex-col items-center justify-center -mt-5 relative group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${
                  isActive ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-navy-900 text-white'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
                isActive ? 'text-navy-900 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* More Drawer Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};
