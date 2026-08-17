import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { GraduationCap, ArrowLeft, Target, Award, Users, BookOpen, ShieldCheck, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-beu-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => navigateTo('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-navy-900 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-subtle space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-beu-dark">About BEU Connect Hub</h1>
              <p className="text-xs text-beu-muted">One Hub. Every BEU Student.</p>
            </div>
          </div>

          <div className="prose text-slate-600 text-sm leading-relaxed space-y-4">
            <p>
              <strong>BEU Connect Hub</strong> is an independent, student-first digital campus ecosystem built exclusively for students studying across the 38+ engineering colleges governed by <strong>Bihar Engineering University (BEU)</strong>, Patna.
            </p>
            <p>
              Engineering students in Bihar often face common challenges: fragmented notes across unofficial groups, difficulty finding authentic past exam papers, lack of inter-college project teams, and limited access to senior mentorship. BEU Connect Hub bridges these gaps by combining academic resources, AI tutoring, peer collaboration, and career guidance into a single trusted platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Target className="w-6 h-6 text-blue-600 mb-2" />
              <h4 className="text-sm font-bold text-beu-dark">Our Mission</h4>
              <p className="text-xs text-slate-500 mt-1">To democratize quality academic resources and connect every engineering student in Bihar.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Users className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="text-sm font-bold text-beu-dark">Community Driven</h4>
              <p className="text-xs text-slate-500 mt-1">Built by students, for students. Peer notes, senior mentorship, and verified hackathon teams.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <ShieldCheck className="w-6 h-6 text-amber-600 mb-2" />
              <h4 className="text-sm font-bold text-beu-dark">Academic Integrity</h4>
              <p className="text-xs text-slate-500 mt-1">Responsible AI guidance, clear disclaimers, and strict verification protecting student privacy.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-beu-muted">
            <span>Bihar Engineering University Digital Campus Ecosystem</span>
            <button
              onClick={() => navigateTo('register')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
