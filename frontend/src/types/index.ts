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

export type TopicPriority = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'high' | 'medium' | 'low';

export interface PYQPatternItem {
  topic: string;
  unit: number;
  frequency: number;
  priority: 'high' | 'medium' | 'low';
  recurringYears: number[];
  examOccurrence: string;
}

export interface BEUTopicRankItem {
  rank: number;
  unit: number;
  topic: string;
  pyqFrequency: string;
  yearsAppeared: number[];
  typicalMarks: string;
  importanceScore: number;
  priority: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
}

export interface BEUMostRepeatedQuestion {
  id: string;
  question: string;
  type: 'Exact Repeated' | 'Conceptually Modified';
  unit: number;
  timesRepeated: number;
  yearsAsked: number[];
  typicalMarks: string;
  wordingChangesNote: string;
  probabilityAssessment: 'Very High Probability' | 'High Probability' | 'Moderate Probability' | 'Low Probability';
}

export interface BEUNumericalProblem {
  unit: number;
  topic: string;
  frequency: string;
  typicalMarks: string;
  standardProblemModel: string;
  keyFormulae: string[];
}

export interface BEUDerivationProblem {
  unit: number;
  derivationName: string;
  yearsAsked: number[];
  typicalMarks: string;
  keyStepsSummary: string;
}

export interface BEUTheoryQuestion {
  unit: number;
  topic: string;
  yearsAsked: number[];
  typicalMarks: string;
  mustIncludeDiagramsOrPoints: string[];
}

export interface BEUUnitAnalysis {
  unitNumber: number;
  unitTitle: string;
  overallImportance: string;
  unitRank: number;
  pyqWeightagePercentage: number;
  mostImportantTopics: string[];
  mostRepeatedQuestions: string[];
  numericalTopics: string[];
  derivationTopics: string[];
  theoryTopics: string[];
  lowPriorityTopics: string[];
}

export interface BEUPrepStrategies {
  sevenDayStrategy: {
    dayRange: string;
    focusUnits: string;
    topicsToCover: string[];
    actionItems: string;
  }[];
  threeDayStrategy: {
    day: string;
    focusArea: string;
    topicsToCover: string[];
    timeAllocation: string;
  }[];
  oneDayRevisionStrategy: {
    timeSlot: string;
    unitOrTopic: string;
    keyChecklist: string[];
  }[];
  finalTopTopicsToStudyFirst: string[];
}

export interface BEUQuestionPatternMeta {
  totalExamMarks: number;
  totalQuestions: number;
  compulsoryQuestion: string;
  choiceStructure: string;
  theoryNumericalRatio: string;
  marksPerQuestion: string;
  recentTrends: string[];
}

export interface PYQAnalysis {
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
  branch?: string;
  semester?: number;
  totalPapersAnalyzed: number;
  yearsCovered?: number[];
  patterns: PYQPatternItem[];
  unitWeightage: { unit: number; unitTitle: string; percentage: number }[];
  highYieldTips: string[];
  disclaimer: string;
  // Full 16-point extensions:
  questionPattern?: BEUQuestionPatternMeta;
  unitWiseAnalysis?: BEUUnitAnalysis[];
  topRankedTopics?: BEUTopicRankItem[];
  mostRepeatedQuestions?: BEUMostRepeatedQuestion[];
  importantNumericals?: BEUNumericalProblem[];
  importantDerivations?: BEUDerivationProblem[];
  importantTheoryQuestions?: BEUTheoryQuestion[];
  preparationStrategy?: BEUPrepStrategies;
  summaryOverview?: string;
  formattedMarkdownReport?: string;
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
  thumbnailUrl?: string;
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
  videoType?: 'youtube' | 'upload';
  youtubeId?: string;
  thumbnailUrl?: string;
  duration: string;
  channelName: string;
  authorName?: string;
  authorCollege?: string;
  likes: number;
  views: string;
  tags: string[];
  createdAt?: string;
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
  hourlyRate: number;
  sessionDuration?: string;
  companyOrExam?: string;
  totalSessionsGiven?: number;
  rating: number;
  reviewsCount: number;
  availableSlots: number;
  linkedinUrl?: string;
  isVerified: boolean;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  mentorName?: string;
  mentorAvatar?: string;
  mentorCollege?: string;
  studentId: string;
  studentName: string;
  studentCollege: string;
  topic: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  amountPaid?: number;
  paymentMethod?: 'UPI' | 'CARD' | 'NET_BANKING' | 'POINTS';
  paymentStatus?: 'PAID' | 'PENDING' | 'REFUNDED';
  transactionId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  meetLink?: string;
  createdAt: string;
}

export interface OpportunitySource {
  name: string;
  url: string;
  isOfficial?: boolean;
  type?: 'primary' | 'application' | 'reference' | 'circular';
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: 'internship' | 'hackathon' | 'workshop' | 'competition' | 'scholarship' | 'job' | 'gate' | 'career_event';
  description: string;
  sourceName: string;
  sourceUrl: string;
  applicationUrl?: string;
  publishedDate?: string;
  deadline: string;
  lastVerified?: string;
  isOfficialSource: boolean;
  sources?: OpportunitySource[];
  location?: string;
  isOnline?: boolean;
  stipendOrPrize?: string;
  verifiedSource?: string; // Backward compatibility alias
  branchRelevance?: string[];
  tags?: string[];
}

export interface Notice {
  id: string;
  title: string;
  category: 'exam' | 'result' | 'scholarship' | 'admission' | 'career' | 'general';
  isOfficial: boolean;
  source: string; // Backward compatible alias for sourceName
  sourceName?: string;
  sourceUrl?: string;
  applicationUrl?: string;
  publishedAt: string;
  publishedDate?: string;
  deadline?: string;
  lastVerified?: string;
  isOfficialSource?: boolean;
  sources?: OpportunitySource[];
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

export interface GoalTask {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
  category: 'learn' | 'practice' | 'project' | 'beu_prep';
}

export interface GoalResource {
  id: string;
  title: string;
  type: 'doc' | 'video' | 'practice' | 'project' | 'beu_pyq';
  url: string;
  whyUseful: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
}

export interface GoalMilestone {
  id: string;
  phaseNumber: number;
  title: string;
  timeframe: string;
  whyThisStep: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  tasks: GoalTask[];
  recommendedResources: GoalResource[];
  projectIdea?: {
    title: string;
    description: string;
    techStack: string[];
  };
}

export interface GoalMap {
  id: string;
  userId: string;
  goalTitle: string;
  category: 'career' | 'academic' | 'skill' | 'project' | 'custom';
  targetOutcome: string;
  targetDeadline: string;
  createdAt: string;
  progressPercent: number;
  streakDays: number;
  studentProfile: {
    branch: string;
    semester: number;
    currentLevel: 'beginner' | 'intermediate' | 'advanced';
    existingSkills: string[];
    hoursDaily: number;
    learningPreference: string[];
  };
  gapAnalysis: {
    alreadyLearned: string[];
    inProgress: string[];
    skillGap: string[];
    highPriority: string[];
    mediumPriority: string[];
  };
  beuAcademicContext?: {
    relevantSubjects: string[];
    highYieldUnits: string[];
    examPatternFocus: string;
  };
  milestones: GoalMilestone[];
  healthCheck: {
    status: 'ON_TRACK' | 'SLIGHTLY_BEHIND' | 'NEEDS_ADJUSTMENT';
    summary: string;
    suggestions: string[];
  };
}
