import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, ArrowRight, BookOpen, Bot, Users, Briefcase,
  Handshake, Building2, CheckCircle2, Shield, Sparkles, FileSpreadsheet,
  Calendar, Award, Lock, ChevronRight, HelpCircle, Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { isAuthenticated } = useAuth();

  const problems = [
    {
      title: 'Scattered Study Materials',
      desc: 'Notes and study links scattered across unorganized WhatsApp groups and broken Google Drive links.'
    },
    {
      title: 'Difficult PYQ Discovery',
      desc: 'Hunting for previous year question papers and accurate exam patterns days before end-sem exams.'
    },
    {
      title: 'Fragmented Communities',
      desc: 'No single unified platform connecting engineering students across all 38+ Bihar Engineering colleges.'
    },
    {
      title: 'Missed Opportunities',
      desc: 'Hackathons, Bihar State fellowships, and internship openings slip by unnoticed without centralized alerts.'
    },
    {
      title: 'Difficult Project Collaboration',
      desc: 'Hard to find skilled teammates with specific tech stacks (AI/ML, React, IoT) for national competitions like SIH.'
    }
  ];

  const solutions = [
    {
      title: 'Study Hub',
      subtitle: 'Syllabus, PYQs, notes and videos.',
      desc: 'Semester-wise curated curriculum covering CSE, ECE, EE, ME, CE with handwritten notes and lecture links.',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'AI Assistant',
      subtitle: 'Personal academic AI.',
      desc: 'Instant step-by-step engineering derivations, practice quizzes, and concepts explained in English, Hindi & Hinglish.',
      icon: Bot,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      title: 'Community',
      subtitle: 'Connect with BEU students.',
      desc: 'Active student clubs for college chapters, branch discussions, competitive coding, and GATE preparation.',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      title: 'Career Hub',
      subtitle: 'Internships, hackathons and opportunities.',
      desc: 'Verified listings for Bihar Innovation Fellowship, Smart India Hackathon, internships, and technical conferences.',
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      title: 'Projects',
      subtitle: 'Find teammates.',
      desc: 'Match with peers based on skill requirements for hackathons, final year projects, and open source initiatives.',
      icon: Handshake,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      title: 'BEU Hub',
      subtitle: 'Organized university information.',
      desc: 'Verified official exam timetables, result notices, academic calendars, and departmental circulars.',
      icon: Building2,
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    }
  ];

  const steps = [
    { step: '01', title: 'Verify Student', desc: 'Securely verify your BEU student registration with academic credentials.' },
    { step: '02', title: 'Create Profile', desc: 'Showcase your skills, GitHub, project portfolio, and branch details.' },
    { step: '03', title: 'Personalize Dashboard', desc: 'Automatically access high-priority syllabus, PYQs, and notes for your semester.' },
    { step: '04', title: 'Learn & Connect', desc: 'Use BEU AI, practice high-yield topics, and join college and branch communities.' },
    { step: '05', title: 'Collaborate & Grow', desc: 'Find hackathon teammates, receive senior mentorship, and land opportunities.' }
  ];

  const faqs = [
    {
      q: 'Is BEU Connect Hub free for all Bihar Engineering University students?',
      a: 'Yes, BEU Connect Hub is completely free and student-centric. It is built to empower engineering students across all constituent and affiliated colleges under BEU.'
    },
    {
      q: 'How does the AI PYQ Pattern Analyzer work?',
      a: 'Our pattern analyzer processes historical question papers from 2019-2024 to highlight high-priority topics (🔴 High, 🟡 Medium, 🟢 Low) and unit-wise weightage so you can optimize your revision.'
    },
    {
      q: 'Is my BEU registration number displayed publicly?',
      a: 'No. Academic registration numbers and sensitive details are strictly confidential and used solely for university verification. Only your public name, college, branch, and portfolio are visible.'
    },
    {
      q: 'Can I find teammates from other BEU colleges for SIH or hackathons?',
      a: 'Absolutely! Our Project Partner Finder allows you to discover students with matching skills (e.g. React, Python, IoT, UI/UX) across all 38+ engineering colleges in Bihar.'
    }
  ];

  return (
    <div className="min-h-screen bg-beu-light text-beu-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-900 text-white pt-12 sm:pt-20 pb-20 sm:pb-28">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f3d6812_1px,transparent_1px),linear-gradient(to_bottom,#1f3d6812_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide animate-pulse-subtle">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>One Hub. Every BEU Student.</span>
            </div>

            {/* Large Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              BEU CONNECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">HUB</span>
            </h1>

            {/* Secondary Tagline */}
            <p className="text-lg sm:text-xl font-medium text-slate-300">
              Connect. Learn. Collaborate. Grow.
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Study, connect, collaborate and grow with a verified digital ecosystem designed for BEU students. Access curated syllabus, AI academic guidance, PYQ pattern analysis, student communities, and career opportunities in one place.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigateTo(isAuthenticated ? 'dashboard' : 'register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{isAuthenticated ? 'Go to My Dashboard' : 'Join BEU Connect Hub'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('features-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-navy-800/80 hover:bg-navy-800 border border-navy-700 text-slate-200 hover:text-white font-semibold text-sm transition-all"
              >
                Explore Features
              </button>
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>38+ Engineering Colleges</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI PYQ Pattern Analyzer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Peer Network</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-14 sm:mt-18 max-w-5xl mx-auto rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-950/90 p-2 sm:p-4 border border-navy-700/80 shadow-2xl backdrop-blur-xl">
            <div className="rounded-xl overflow-hidden border border-navy-700/60 bg-beu-light text-beu-dark">
              {/* Browser/App Header Bar */}
              <div className="bg-navy-900 px-4 py-2.5 flex items-center justify-between border-b border-navy-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400 hidden sm:inline">beu-connect-hub.digital/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                    Live Digital Campus
                  </span>
                </div>
              </div>

              {/* Mockup Dashboard Grid */}
              <div className="p-4 sm:p-6 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Today Study & AI */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-beu-dark flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Today's Study Plan
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      64% Complete
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="line-through text-slate-400 truncate">AVL Tree 4 Rotations</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-slate-700">
                      <div className="w-3.5 h-3.5 rounded border border-slate-400 flex-shrink-0" />
                      <span className="truncate">DBMS BCNF 14-Mark Numerical</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: AI PYQ Pattern */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-beu-dark flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-red-600" />
                      AI PYQ Pattern Analyzer
                    </span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                      🔴 High Yield
                    </span>
                  </div>
                  <div className="p-2.5 bg-red-50/60 border border-red-200/60 rounded-xl text-xs space-y-1">
                    <p className="font-semibold text-red-950">Prim's & Kruskal's MST (Unit 4)</p>
                    <p className="text-[11px] text-red-800">Appeared in 100% of analyzed past papers (14 Marks).</p>
                  </div>
                </div>

                {/* Card 3: Communities & Opportunities */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-beu-dark flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Campus Highlight
                    </span>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      SIH 2025
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    MIT Muzaffarpur & BCE Bhagalpur teams formed via Partner Finder reached the SIH Grand Finale!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 — THE PROBLEM */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              The Reality
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-beu-dark mt-3">
              Why Engineering Students Need a Dedicated Digital Campus
            </h2>
            <p className="text-sm text-beu-muted mt-2">
              Bihar Engineering University students face unique hurdles that generic social media apps cannot solve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {problems.map((p, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 hover:shadow-card transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center mb-3">
                    0{idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-beu-dark mb-1.5">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — THE SOLUTION (6 Cards) */}
      <section id="features-section" className="py-16 sm:py-24 bg-beu-light border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              The Solution
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-beu-dark mt-3">
              Six Core Pillars of BEU Connect Hub
            </h2>
            <p className="text-sm text-beu-muted mt-2">
              Everything you need throughout your 4-year engineering journey in one integrated system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${s.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-beu-dark">{s.title}</h3>
                    <p className="text-xs font-semibold text-emerald-600 mb-2">{s.subtitle}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-navy-900 group">
                    <span className="group-hover:text-emerald-600 transition-colors">Explore Module</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW IT WORKS (5 Steps) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-800 bg-navy-50 border border-navy-200 px-3 py-1 rounded-full">
              Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-beu-dark mt-3">
              How BEU Connect Hub Works
            </h2>
            <p className="text-sm text-beu-muted mt-2">
              From day one of admission to final semester placement and mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="relative p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-navy-900 text-white font-extrabold text-xs flex items-center justify-center mb-3 shadow-sm">
                    {st.step}
                  </div>
                  <h3 className="text-sm font-bold text-beu-dark mb-1">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-8 text-slate-300 z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-beu-light border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-beu-dark">Frequently Asked Questions</h2>
            <p className="text-xs text-beu-muted mt-1">Everything you need to know about BEU Connect Hub</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-2">
                <h4 className="text-sm font-bold text-beu-dark flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-navy-950 to-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Supercharge Your Engineering Journey?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of BEU engineering students studying smarter, building real-world projects, and winning hackathons together.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo(isAuthenticated ? 'dashboard' : 'register')}
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-900/40 transition-all inline-flex items-center gap-2"
            >
              <span>{isAuthenticated ? 'Open Campus Dashboard' : 'Create Free Student Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-slate-400 py-10 border-t border-navy-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span>BEU CONNECT HUB</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">About</button>
            <button onClick={() => navigateTo('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => navigateTo('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
            <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors">Terms of Service</button>
          </div>

          <p className="text-slate-400">
            © 2025 BEU Connect Hub. Designed for Bihar Engineering University Students.
          </p>
        </div>
      </footer>
    </div>
  );
};
