import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import {
  BookOpen, Bot, FileSpreadsheet, Calendar, Compass, FileText,
  Video, Radio, Users, MessageSquare, Sparkles, Handshake,
  Briefcase, Building2, TrendingUp, ShieldCheck, ArrowLeft
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  const featureGroups = [
    {
      category: '1. Academic & Intelligent Learning',
      items: [
        { title: 'BEU GoalMap GPS', desc: 'AI-driven career and semester goal planner generating phased milestones, daily study tasks, and BEU exam high-yield targets.', icon: Compass },
        { title: 'Interactive Syllabus Navigator', desc: 'Branch → Semester → Subject → Unit hierarchy with real-time syllabus tracking.', icon: BookOpen },
        { title: 'BEU AI Academic Assistant', desc: 'Step-by-step problem solver in English, Hindi & Hinglish with academic safety guardrails.', icon: Bot },
        { title: 'AI PYQ Pattern Analyzer', desc: 'Historical frequency identification (🔴 High, 🟡 Medium, 🟢 Low Priority) for smarter exam preparation.', icon: FileSpreadsheet },
        { title: 'Personal Study Planner', desc: 'Automated daily revision timetables based on exam deadlines and daily hours.', icon: Calendar },
      ]
    },
    {
      category: '2. Social & Collaborative Campus',
      items: [
        { title: 'Campus Social Feed', desc: 'Share educational posts, project milestones, and tech achievements without noise.', icon: Radio },
        { title: 'College & Branch Communities', desc: 'Dedicated clubs for MIT Muzaffarpur, BCE Bhagalpur, GCE Gaya, AI/ML, and GATE.', icon: Users },
        { title: 'Direct Messaging', desc: 'One-to-one peer chat for project discussions, study help, and resource sharing.', icon: MessageSquare },
        { title: 'Student Skill Passport', desc: 'A shareable digital engineering portfolio highlighting verified skills and projects.', icon: Sparkles }
      ]
    },
    {
      category: '3. Career & University Ecosystem',
      items: [
        { title: 'Project Partner Finder', desc: 'Algorithm-driven matchmaking to build multi-skilled hackathon teams (SIH, etc.).', icon: Handshake },
        { title: 'Senior-Junior Mentorship', desc: 'Get direct guidance from verified 4th-year seniors placed at top tech companies.', icon: ShieldCheck },
        { title: 'Career & Opportunities Hub', desc: 'Centralized alerts for Bihar State Innovation Fellowship, SIH, internships, and GATE.', icon: Briefcase },
        { title: 'BEU Hub & Smart Notices', desc: 'Categorized official notices (🔴 Exam, 🔵 Result, 🟢 Scholarship, 🟣 Career).', icon: Building2 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-beu-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <button
          onClick={() => navigateTo('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-navy-900 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl font-extrabold text-beu-dark">Comprehensive Platform Features</h1>
          <p className="text-xs text-beu-muted">A modern, integrated suite built specifically for Bihar Engineering University students</p>
        </div>

        <div className="space-y-8">
          {featureGroups.map((group, gIdx) => (
            <div key={gIdx} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-6">
              <h2 className="text-lg font-bold text-navy-900 border-b border-slate-100 pb-3">{group.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-white text-navy-900 shadow-xs flex-shrink-0">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-beu-dark">{item.title}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
