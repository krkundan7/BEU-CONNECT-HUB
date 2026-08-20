import React, { createContext, useContext, useState } from 'react';

export type PageId =
  | 'landing'
  | 'about'
  | 'features'
  | 'how-it-works'
  | 'privacy'
  | 'terms'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'goalmap'
  | 'study-hub'
  | 'subject-detail'
  | 'pyq-analyzer'
  | 'ai-assistant'
  | 'study-planner'
  | 'knowledge-map'
  | 'notes'
  | 'videos'
  | 'social'
  | 'profile'
  | 'skill-passport'
  | 'communities'
  | 'community-detail'
  | 'messages'
  | 'projects'
  | 'mentorship'
  | 'career-hub'
  | 'beu-hub'
  | 'study-progress'
  | 'notifications'
  | 'settings'
  | 'admin-dashboard'
  | 'admin-verification'
  | 'admin-moderation'
  | 'admin-notices'
  | 'admin-resources'
  | 'admin-syllabus';

interface NavigationContextType {
  currentPage: PageId;
  navigateTo: (page: PageId, params?: Record<string, any>) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  selectedCommunityId: string | null;
  setSelectedCommunityId: (id: string | null) => void;
  viewedUserId: string | null;
  setViewedUserId: (id: string | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  reportModalData: { isOpen: boolean; contentType: string; contentId: string; title: string } | null;
  openReportModal: (contentType: string, contentId: string, title: string) => void;
  closeReportModal: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>('cse-301');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [viewedUserId, setViewedUserId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [reportModalData, setReportModalData] = useState<{ isOpen: boolean; contentType: string; contentId: string; title: string } | null>(null);

  const navigateTo = (page: PageId, params?: Record<string, any>) => {
    if (params) {
      if (params.subjectId) setSelectedSubjectId(params.subjectId);
      if (params.communityId) setSelectedCommunityId(params.communityId);
      if (params.userId) setViewedUserId(params.userId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openReportModal = (contentType: string, contentId: string, title: string) => {
    setReportModalData({ isOpen: true, contentType, contentId, title });
  };

  const closeReportModal = () => {
    setReportModalData(null);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedSubjectId,
        setSelectedSubjectId,
        selectedCommunityId,
        setSelectedCommunityId,
        viewedUserId,
        setViewedUserId,
        isSearchOpen,
        setIsSearchOpen,
        reportModalData,
        openReportModal,
        closeReportModal
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
};
