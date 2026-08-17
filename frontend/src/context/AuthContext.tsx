import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, VerificationStatus } from '../types';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  register: (userData: Partial<User>) => User;
  logout: () => void;
  switchPersona: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  toggleFollow: (targetUserId: string) => void;
  toggleBookmarkResource: (resourceId: string) => void;
  toggleSavePost: (postId: string) => void;
  allUsers: User[];
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const refreshUsers = () => {
    const users = StorageService.getUsers();
    setAllUsers(users);
    if (currentUser) {
      const updated = users.find(u => u.id === currentUser.id);
      if (updated) setCurrentUser(updated);
    }
  };

  useEffect(() => {
    const users = StorageService.getUsers();
    setAllUsers(users);
    // Default to Aman Kumar (Student Persona)
    const defaultUser = users.find(u => u.id === 'usr-aman-101') || users[0];
    setCurrentUser(defaultUser);
  }, []);

  const login = (email: string, _password?: string): boolean => {
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (userData: Partial<User>): User => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'New Student',
      email: userData.email || '',
      mobile: userData.mobile || '',
      role: (userData.role as UserRole) || 'student',
      college: userData.college || 'Muzaffarpur Institute of Technology (MIT)',
      collegeCode: userData.collegeCode || '101',
      branch: userData.branch || 'Computer Science & Engineering',
      branchCode: userData.branchCode || 'CSE',
      semester: userData.semester || 1,
      beuRegNo: userData.beuRegNo,
      verificationStatus: (userData.verificationStatus as VerificationStatus) || 'pending',
      bio: userData.bio || `Engineering student at ${userData.college || 'BEU'}.`,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name || 'Student')}`,
      skills: userData.skills || ['Engineering', 'Problem Solving'],
      interests: userData.interests || ['Tech', 'Academics'],
      followers: [],
      following: [],
      contributionPoints: 50,
      badge: 'contributor',
      joinedDate: 'August 2025',
      savedPostIds: [],
      bookmarkedResourceIds: []
    };

    StorageService.addUser(newUser);
    refreshUsers();
    setCurrentUser(newUser);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchPersona = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    StorageService.updateUser(updated);
    setCurrentUser(updated);
    refreshUsers();
  };

  const toggleFollow = (targetUserId: string) => {
    if (!currentUser || currentUser.id === targetUserId) return;
    const isFollowing = currentUser.following.includes(targetUserId);

    const updatedFollowing = isFollowing
      ? currentUser.following.filter(id => id !== targetUserId)
      : [...currentUser.following, targetUserId];

    const updatedCurrentUser = { ...currentUser, following: updatedFollowing };
    StorageService.updateUser(updatedCurrentUser);
    setCurrentUser(updatedCurrentUser);

    // Update target user's followers
    const targetUser = allUsers.find(u => u.id === targetUserId);
    if (targetUser) {
      const updatedFollowers = isFollowing
        ? targetUser.followers.filter(id => id !== currentUser.id)
        : [...targetUser.followers, currentUser.id];
      StorageService.updateUser({ ...targetUser, followers: updatedFollowers });
    }

    refreshUsers();
  };

  const toggleBookmarkResource = (resourceId: string) => {
    if (!currentUser) return;
    const isBookmarked = currentUser.bookmarkedResourceIds.includes(resourceId);
    const updatedBookmarks = isBookmarked
      ? currentUser.bookmarkedResourceIds.filter(id => id !== resourceId)
      : [...currentUser.bookmarkedResourceIds, resourceId];

    const updated = { ...currentUser, bookmarkedResourceIds: updatedBookmarks };
    StorageService.updateUser(updated);
    setCurrentUser(updated);
  };

  const toggleSavePost = (postId: string) => {
    if (!currentUser) return;
    const isSaved = currentUser.savedPostIds.includes(postId);
    const updatedSaves = isSaved
      ? currentUser.savedPostIds.filter(id => id !== postId)
      : [...currentUser.savedPostIds, postId];

    const updated = { ...currentUser, savedPostIds: updatedSaves };
    StorageService.updateUser(updated);
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchPersona,
        updateProfile,
        toggleFollow,
        toggleBookmarkResource,
        toggleSavePost,
        allUsers,
        refreshUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
