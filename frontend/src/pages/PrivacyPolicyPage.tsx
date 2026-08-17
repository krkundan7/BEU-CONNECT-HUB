import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { ArrowLeft, Shield, Lock, EyeOff } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
            <div className="w-12 h-12 rounded-2xl bg-navy-900 text-emerald-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-beu-dark">Privacy & Data Protection</h1>
              <p className="text-xs text-beu-muted">Last Updated: August 2025</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Confidentiality Guarantee:</p>
              <p className="mt-0.5">Your BEU Registration Number, private email address, and phone number are NEVER exposed publicly on your profile or search results.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h3 className="font-bold text-beu-dark text-base">1. Information We Collect</h3>
            <p>We collect basic profile information (Full Name, College, Branch, Semester, Technical Skills, Bio) and academic identifiers solely required for verifying genuine student enrollment under Bihar Engineering University.</p>

            <h3 className="font-bold text-beu-dark text-base">2. How Information Is Used</h3>
            <p>Your academic metadata (Branch and Semester) is used exclusively to customize your dashboard, prioritize relevant subject syllabus, and match you with relevant hackathon project partners and communities.</p>

            <h3 className="font-bold text-beu-dark text-base">3. AI Academic Assistant Privacy</h3>
            <p>Queries submitted to the BEU AI assistant are processed securely. We do not transmit any personally identifiable student information to third-party AI models.</p>

            <h3 className="font-bold text-beu-dark text-base">4. Content Moderation & Reporting</h3>
            <p>Users have the ability to report spam, copyright infringements, or inappropriate content. Reported items are reviewed by authorized platform moderators.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-beu-dark">Terms of Service</h1>
          <p className="text-xs text-beu-muted">Last Updated: August 2025</p>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h3 className="font-bold text-beu-dark text-base">1. Acceptance of Terms</h3>
            <p>By registering on BEU Connect Hub, you agree to maintain academic honesty, respect peer students and faculty, and utilize educational materials strictly for personal study and peer collaboration.</p>

            <h3 className="font-bold text-beu-dark text-base">2. Academic Disclaimer</h3>
            <p>BEU Connect Hub is an independent student platform. While we strive to maintain accurate syllabus guidelines, PYQ frequency analysis, and exam notices, students are advised to confirm formal notifications with their college administration and official BEU portals.</p>

            <h3 className="font-bold text-beu-dark text-base">3. Code of Conduct & Copyright</h3>
            <p>Users must not upload unauthorized copyrighted books, exam question leak rumors, or misleading notices. Violation of platform guidelines may result in badge revocation, temporary suspension, or permanent account termination.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
