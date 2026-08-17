export type UserRole = 'student' | 'moderator' | 'admin';
export type VerificationStatus = 'verified' | 'pending' | 'unverified';
export type BadgeType = 'top_contributor' | 'helpful_student' | 'contributor';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  college: string;
  collegeCode: string;
  branch: string;
  branchCode: string;
  semester: number;
  beuRegNo?: string;
  verificationStatus: VerificationStatus;
  bio: string;
  avatar: string;
  skills: string[];
  interests: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  followers: string[];
  following: string[];
  contributionPoints: number;
  badge?: BadgeType;
  joinedDate: string;
  savedPostIds: string[];
  bookmarkedResourceIds: string[];
}

export interface College {
  id: string;
  name: string;
  code: string;
  location: string;
  established: number;
  type: 'Government' | 'Affiliated';
  branches: string[];
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  semesters: number[];
}

export interface Subject {
  id: string;
  branchCode: string;
  semester: number;
  name: string;
  code: string;
  credits: number;
  description: string;
  unitsCount: number;
  icon?: string;
}

export interface SyllabusTopic {
  id: string;
  subjectId: string;
  unit: number;
  unitTitle: string;
  topic: string;
  description: string;
  hours: number;
  important: boolean;
  pyqFrequency: 'High' | 'Medium' | 'Low';
}

export interface PYQ {
  id: string;
  subjectId: string;
  subjectName: string;
  branchCode: string;
  semester: number;
  year: number;
  title: string;
  examType: 'End Sem' | 'Mid Sem' | 'Supplementary';
  fileUrl: string;
  fileSize: string;
  downloadCount: number;
  patternPriority: 'high' | 'medium' | 'low';
}

export interface PYQPatternItem {
  topic: string;
  unit: number;
  frequency: number;
  priority: 'high' | 'medium' | 'low';
  recurringYears: number[];
  examOccurrence: string;
}

export interface PYQAnalysis {
  subjectId: string;
  subjectName: string;
  totalPapersAnalyzed: number;
  patterns: PYQPatternItem[];
  unitWeightage: { unit: number; unitTitle: string; percentage: number }[];
  highYieldTips: string[];
  disclaimer: string;
}

export interface Note {
  id: string;
  subjectId: string;
  subjectName: string;
  branchCode: string;
  semester: number;
  unit: number;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'image';
  fileSize: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorCollege: string;
  likes: number;
  bookmarks: number;
  createdAt: string;
  verified: boolean;
}

export interface StudyVideo {
  id: string;
  subjectId: string;
  subjectName: string;
  branchCode: string;
  semester: number;
  unit: number;
  title: string;
  description: string;
  videoUrl: string;
  youtubeId: string;
  duration: string;
  channelName: string;
  likes: number;
  views: string;
  tags: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCollege: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCollege: string;
  userBranch: string;
  userSemester: number;
  isVerified: boolean;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'pdf';
  category: 'general' | 'educational' | 'project' | 'achievement' | 'study_video';
  likes: string[]; // array of userIds
  comments: Comment[];
  saves: string[]; // array of userIds
  tags: string[];
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: 'college' | 'branch' | 'semester' | 'interest';
  coverImage: string;
  icon: string;
  creatorId: string;
  creatorName: string;
  members: string[]; // userIds
  isPrivate: boolean;
  rules: string[];
  createdAt: string;
  postCount: number;
  announcements?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  replyToId?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  otherUser: {
    id: string;
    name: string;
    avatar: string;
    college: string;
    branch: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ProjectMember {
  userId: string;
  name: string;
  role: string;
  avatar: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  assigneeName?: string;
}

export interface Project {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorCollege: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  teamSize: number;
  members: ProjectMember[];
  status: 'recruiting' | 'in_progress' | 'completed';
  tasks: ProjectTask[];
  createdAt: string;
  githubUrl?: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  college: string;
  branch: string;
  year: string;
  bio: string;
  skills: string[];
  domain: string;
  rating: number;
  reviewsCount: number;
  availableSlots: number;
  linkedinUrl?: string;
  isVerified: boolean;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  studentId: string;
  studentName: string;
  studentCollege: string;
  topic: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: 'internship' | 'hackathon' | 'workshop' | 'competition' | 'scholarship' | 'job' | 'gate';
  description: string;
  location: string;
  isOnline: boolean;
  deadline: string;
  stipendOrPrize?: string;
  sourceUrl: string;
  verifiedSource: string;
  branchRelevance: string[];
  tags: string[];
}

export interface Notice {
  id: string;
  title: string;
  category: 'exam' | 'result' | 'scholarship' | 'admission' | 'career' | 'general';
  isOfficial: boolean;
  source: string;
  publishedAt: string;
  summary: string;
  content: string;
  fileUrl?: string;
  isUrgent?: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'academic' | 'social' | 'community' | 'career' | 'official';
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  contentType: 'post' | 'comment' | 'note' | 'video' | 'community' | 'user';
  contentId: string;
  contentPreview: string;
  reason: 'Spam' | 'Harassment' | 'Misinformation' | 'Copyright issue' | 'Inappropriate content' | 'Other';
  status: 'pending' | 'reviewed' | 'dismissed' | 'removed';
  createdAt: string;
}

export interface StudyPlanTask {
  id: string;
  userId: string;
  dayNumber: number;
  title: string;
  subjectName: string;
  durationMinutes: number;
  taskType: 'topic' | 'pyq' | 'revision' | 'practice';
  completed: boolean;
  date: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  subject: string;
  unit: number;
  level: number;
  description: string;
  parentId?: string;
  keyPoints: string[];
  pyqWeight: 'High' | 'Medium' | 'Low';
  relatedTopics: string[];
  aiSummary: string;
}
