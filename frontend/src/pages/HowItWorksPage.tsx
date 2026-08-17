import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { ArrowLeft, CheckCircle2, UserCheck, Layout, BookOpen, Rocket } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  const steps = [
    {
      num: 'Step 1',
      title: 'Verify Your Student Status',
      desc: 'Sign up with your college email or name, select your BEU engineering college, branch (CSE, ECE, ME, CE, EE) and semester. Enter your registration number to initiate verification.',
      icon: UserCheck
    },
    {
      num: 'Step 2',
      title: 'Create Your Skill Passport',
      desc: 'Add your programming languages, web/app frameworks, GitHub profile, and technical interests. Your passport acts as your shareable digital engineering profile.',
      icon: Layout
    },
    {
      num: 'Step 3',
      title: 'Access Personalized Academic Resources',
      desc: 'Your dashboard automatically presents the exact subjects and units relevant to your branch and semester. Explore high-priority PYQs, handwritten notes, and AI explanations.',
      icon: BookOpen
    },
    {
      num: 'Step 4',
      title: 'Engage with the Campus Community',
      desc: 'Join your college chapter community, ask academic doubts on the social feed, participate in discussions, and get help from 4th-year senior mentors.',
      icon: CheckCircle2
    },
    {
      num: 'Step 5',
      title: 'Build Teams & Accelerate Your Career',
      desc: 'Use the Project Partner Finder to form multi-skilled hackathon teams for SIH, apply to Bihar State Innovation Fellowships, and land internships.',
      icon: Rocket
    }
  ];

  return (
    <div className="min-h-screen bg-beu-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => navigateTo('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-navy-900 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl font-extrabold text-beu-dark">How BEU Connect Hub Works</h1>
          <p className="text-xs text-beu-muted">A clear, 5-step journey designed for every Bihar Engineering University student</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-navy-900 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {step.num}
                  </span>
                  <h3 className="text-base font-bold text-beu-dark">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => navigateTo('register')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            Create Your Account Now
          </button>
        </div>
      </div>
    </div>
  );
};
