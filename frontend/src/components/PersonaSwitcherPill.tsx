import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { Users, Shield, GraduationCap, ChevronDown, Check } from 'lucide-react';

export const PersonaSwitcherPill: React.FC = () => {
  const { currentUser, switchPersona, allUsers } = useAuth();
  const { navigateTo } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const personas = [
    {
      id: 'usr-aman-101',
      title: 'Aman Kumar (Student Persona)',
      subtitle: '3rd Sem CSE • MIT Muzaffarpur',
      icon: GraduationCap,
      badge: 'Verified Student',
      color: 'text-blue-500 bg-blue-50'
    },
    {
      id: 'usr-priya-102',
      title: 'Priya Sharma (Mentor Persona)',
      subtitle: '4th Year Senior • BCE Bhagalpur',
      icon: Users,
      badge: 'Senior Mentor',
      color: 'text-emerald-500 bg-emerald-50'
    },
    {
      id: 'usr-prof-admin',
      title: 'Prof. R.K. Verma (Admin Persona)',
      subtitle: 'BEU Academic Admin • Patna HQ',
      icon: Shield,
      badge: 'Platform Admin',
      color: 'text-amber-500 bg-amber-50'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 border border-navy-900/15 transition-all shadow-sm"
        title="Switch persona for testing different roles"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="hidden sm:inline text-beu-muted font-normal">Role:</span>
        <span className="font-semibold text-navy-900">
          {currentUser ? (currentUser.role === 'admin' ? 'Admin View' : currentUser.name.split(' ')[0]) : 'Guest'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-beu-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-dropdown border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-beu-muted">Quick Persona Switcher</p>
            <p className="text-xs text-slate-500">Test different user roles & perspectives</p>
          </div>

          <div className="space-y-1">
            {personas.map(p => {
              const Icon = p.icon;
              const isSelected = currentUser?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    switchPersona(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    isSelected ? 'bg-navy-50 border border-navy-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg ${p.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-beu-dark truncate">{p.title}</p>
                      <p className="text-[11px] text-beu-muted truncate">{p.subtitle}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setIsOpen(false);
                navigateTo('register');
              }}
              className="w-full text-center py-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              + Register New Student Flow
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
