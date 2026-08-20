import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation, PageId } from './context/NavigationContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ReportModal } from './components/ReportModal';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PrivacyPolicyPage, TermsPage } from './pages/PrivacyPolicyPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Authenticated Core Pages
import { DashboardPage } from './pages/DashboardPage';
import { GoalMapPage } from './pages/GoalMapPage';
import { StudyHubPage } from './pages/StudyHubPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { PYQAnalyzerPage } from './pages/PYQAnalyzerPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { NotesPage } from './pages/NotesPage';
import { VideosPage } from './pages/VideosPage';
import { SocialFeedPage } from './pages/SocialFeedPage';
import { ProfilePage } from './pages/ProfilePage';
import { CommunitiesPage, CommunityDetailPage } from './pages/CommunitiesPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProjectPartnerPage } from './pages/ProjectPartnerPage';
import { MentorshipPage } from './pages/MentorshipPage';
import { CareerHubPage } from './pages/CareerHubPage';
import { BEUHubPage } from './pages/BEUHubPage';
import { StudyProgressPage } from './pages/StudyProgressPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { UserVerificationPage } from './pages/admin/UserVerificationPage';
import { ContentModerationPage } from './pages/admin/ContentModerationPage';
import { NoticeManagerPage } from './pages/admin/NoticeManagerPage';
import { AdminSyllabusManagementPage } from './pages/admin/AdminSyllabusManagementPage';

const AppContent: React.FC = () => {
  const { currentPage } = useNavigation();
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const publicPages: PageId[] = [
    'landing',
    'about',
    'features',
    'how-it-works',
    'privacy',
    'terms',
    'login',
    'register'
  ];

  const isPublic = publicPages.includes(currentPage) || !isAuthenticated;

  const renderPage = () => {
    switch (currentPage) {
      // Public
      case 'landing': return <LandingPage />;
      case 'about': return <AboutPage />;
      case 'features': return <FeaturesPage />;
      case 'how-it-works': return <HowItWorksPage />;
      case 'privacy': return <PrivacyPolicyPage />;
      case 'terms': return <TermsPage />;
      case 'login': return <LoginPage />;
      case 'register': return <RegisterPage />;

      // Core Authenticated
      case 'dashboard': return <DashboardPage />;
      case 'goalmap':
      case 'knowledge-map': return <GoalMapPage />;
      case 'study-hub': return <StudyHubPage />;
      case 'subject-detail': return <SubjectDetailPage />;
      case 'pyq-analyzer': return <PYQAnalyzerPage />;
      case 'ai-assistant': return <AIAssistantPage />;
      case 'study-planner': return <StudyPlannerPage />;
      case 'notes': return <NotesPage />;
      case 'videos': return <VideosPage />;
      case 'social': return <SocialFeedPage />;
      case 'profile':
      case 'skill-passport': return <ProfilePage />;
      case 'communities': return <CommunitiesPage />;
      case 'community-detail': return <CommunityDetailPage />;
      case 'messages': return <MessagesPage />;
      case 'projects': return <ProjectPartnerPage />;
      case 'mentorship': return <MentorshipPage />;
      case 'career-hub': return <CareerHubPage />;
      case 'beu-hub': return <BEUHubPage />;
      case 'study-progress': return <StudyProgressPage />;
      case 'notifications': return <NotificationsPage />;
      case 'settings': return <SettingsPage />;

      // Admin
      case 'admin-dashboard': return <AdminDashboardPage />;
      case 'admin-verification': return <UserVerificationPage />;
      case 'admin-moderation': return <ContentModerationPage />;
      case 'admin-notices': return <NoticeManagerPage />;
      case 'admin-syllabus': return <AdminSyllabusManagementPage />;
      case 'admin-resources': return <NotesPage />;

      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-beu-light flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Layout Area */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar (only when logged in and not on public pages) */}
        {!isPublic && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Content Container */}
        <main
          className={`flex-1 transition-all duration-300 ${
            !isPublic ? 'lg:pl-64' : ''
          }`}
        >
          <div className={!isPublic ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16' : ''}>
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (only when logged in) */}
      {!isPublic && <MobileBottomNav />}

      {/* Global Modals */}
      <GlobalSearchModal />
      <ReportModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </NavigationProvider>
    </AuthProvider>
  );
};

export default App;
