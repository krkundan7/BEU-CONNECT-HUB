import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { StorageService } from '../services/storageService';
import { Bell, CheckCheck, BookOpen, Radio, Users, Briefcase, Building2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

/* NOV-LOGIC-103: Multi-Category Notification Feed Container
 * Renders real-time alerts spanning official circulars, mentorship invites, peer post reactions, and job deadlines. */
export const NotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();

  /* NOV-LOGIC-104: Local Storage Synced Notification State
   * Hydrates read/unread state from browser storage with fallback to reactive notifications. */
  const [notifications, setNotifications] = useState(
    currentUser ? StorageService.getNotifications(currentUser.id) : []
  );
  const [filterType, setFilterType] = useState<string>('all');

  /* NOV-LOGIC-105: Client-Side Faceted Filter Evaluator */
  const filtered = notifications.filter(n => filterType === 'all' || n.type === filterType);

  /* NOV-LOGIC-106: Bulk Read-State Committer */
  const handleMarkAllRead = () => {
    if (!currentUser) return;
    StorageService.markAllNotificationsRead(currentUser.id);
    setNotifications(StorageService.getNotifications(currentUser.id));
    showToast('All notifications marked as read', 'success');
  };

  /* NOV-LOGIC-107: Category-to-Lucide Visual Icon Resolver */
  const getIcon = (type: string) => {
    switch (type) {
      case 'academic': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'social': return <Radio className="w-4 h-4 text-red-600" />;
      case 'community': return <Users className="w-4 h-4 text-indigo-600" />;
      case 'career': return <Briefcase className="w-4 h-4 text-purple-600" />;
      default: return <Building2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-beu-dark">Campus Notification Center</h1>
          <p className="text-xs text-beu-muted">Real-time alerts for exams, peer discussions, and opportunities</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {['all', 'official', 'academic', 'social', 'career'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl font-bold capitalize transition-all ${
              filterType === t ? 'bg-navy-900 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-beu-dark">No notifications right now</p>
            <p className="text-xs text-beu-muted mt-1">You're all caught up with university and social updates.</p>
          </div>
        ) : (
          filtered.map(n => (
            /* NOV-LOGIC-108: Interactive Deep-Linking Navigation Target */
            <div
              key={n.id}
              onClick={() => navigateTo(n.link.replace('/', '') as any)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                !n.read ? 'bg-navy-50/60 border-navy-200 shadow-2xs' : 'bg-white border-slate-200'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-100 flex-shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-beu-dark">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{n.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
