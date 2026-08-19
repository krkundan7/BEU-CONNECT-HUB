import {
  User, Subject, SyllabusTopic, PYQ, Note, StudyVideo,
  Post, Community, Conversation, Message, Project,
  MentorProfile, MentorshipRequest, Opportunity, Notice,
  AppNotification, Report, KnowledgeNode, StudyPlanTask, GoalMap, GoalTask
} from '../types';
import {
  MOCK_USERS, MOCK_SUBJECTS, MOCK_SYLLABUS_TOPICS, MOCK_PYQS,
  MOCK_NOTES, MOCK_VIDEOS, MOCK_POSTS, MOCK_COMMUNITIES,
  MOCK_PROJECTS, MOCK_MENTORS, MOCK_OPPORTUNITIES, MOCK_NOTICES,
  MOCK_NOTIFICATIONS, MOCK_KNOWLEDGE_NODES, MOCK_STUDY_PLAN_TASKS,
  MOCK_REPORTS, MOCK_GOALMAPS
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'beu_users',
  POSTS: 'beu_posts',
  NOTES: 'beu_notes',
  VIDEOS: 'beu_videos',
  COMMUNITIES: 'beu_communities',
  MESSAGES: 'beu_messages',
  PROJECTS: 'beu_projects',
  OPPORTUNITIES: 'beu_opportunities',
  NOTICES: 'beu_notices',
  NOTIFICATIONS: 'beu_notifications',
  STUDY_TASKS: 'beu_study_tasks',
  REPORTS: 'beu_reports',
  MENTOR_REQUESTS: 'beu_mentor_requests',
  GOALMAPS: 'beu_goalmaps'
};

// Helper to initialize local storage
function initStorage<T>(key: string, initialData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(item);
  } catch {
    return initialData;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error', err);
  }
}

export const StorageService = {
  // Users
  getUsers: (): User[] => initStorage(STORAGE_KEYS.USERS, MOCK_USERS),
  getUserById: (id: string): User | undefined => {
    const users = StorageService.getUsers();
    return users.find(u => u.id === id);
  },
  updateUser: (updatedUser: User): void => {
    const users = StorageService.getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
    setStorage(STORAGE_KEYS.USERS, users);
  },
  addUser: (newUser: User): void => {
    const users = [newUser, ...StorageService.getUsers()];
    setStorage(STORAGE_KEYS.USERS, users);
  },
  verifyUser: (userId: string, status: 'verified' | 'pending' | 'unverified'): void => {
    const users = StorageService.getUsers().map(u => u.id === userId ? { ...u, verificationStatus: status } : u);
    setStorage(STORAGE_KEYS.USERS, users);
  },

  // Subjects & Topics
  getSubjects: (branchCode?: string, semester?: number): Subject[] => {
    let list = MOCK_SUBJECTS;
    if (branchCode) list = list.filter(s => s.branchCode.toLowerCase() === branchCode.toLowerCase());
    if (semester) list = list.filter(s => s.semester === Number(semester));
    return list;
  },
  getSubjectById: (id: string): Subject | undefined => {
    return MOCK_SUBJECTS.find(s => s.id === id);
  },
  getSyllabusTopics: (subjectId: string): SyllabusTopic[] => {
    return MOCK_SYLLABUS_TOPICS.filter(t => t.subjectId === subjectId);
  },

  // PYQs
  getPYQs: (branchCode?: string, semester?: number, subjectId?: string): PYQ[] => {
    let list = MOCK_PYQS;
    if (branchCode) list = list.filter(p => p.branchCode.toLowerCase() === branchCode.toLowerCase());
    if (semester) list = list.filter(p => p.semester === Number(semester));
    if (subjectId) list = list.filter(p => p.subjectId === subjectId);
    return list;
  },

  // Notes
  getNotes: (subjectId?: string): Note[] => {
    const notes: Note[] = initStorage(STORAGE_KEYS.NOTES, MOCK_NOTES);
    if (subjectId) return notes.filter(n => n.subjectId === subjectId);
    return notes;
  },
  addNote: (newNote: Note): void => {
    const notes = [newNote, ...StorageService.getNotes()];
    setStorage(STORAGE_KEYS.NOTES, notes);
  },
  likeNote: (noteId: string): void => {
    const notes = StorageService.getNotes().map(n => n.id === noteId ? { ...n, likes: n.likes + 1 } : n);
    setStorage(STORAGE_KEYS.NOTES, notes);
  },

  // Videos
  getVideos: (subjectId?: string): StudyVideo[] => {
    const videos: StudyVideo[] = initStorage(STORAGE_KEYS.VIDEOS, MOCK_VIDEOS);
    if (subjectId) return videos.filter(v => v.subjectId === subjectId);
    return videos;
  },
  addVideo: (newVideo: StudyVideo): void => {
    const videos = [newVideo, ...StorageService.getVideos()];
    setStorage(STORAGE_KEYS.VIDEOS, videos);
  },
  likeVideo: (videoId: string): void => {
    const videos = StorageService.getVideos().map(v => v.id === videoId ? { ...v, likes: v.likes + 1 } : v);
    setStorage(STORAGE_KEYS.VIDEOS, videos);
  },

  // Posts
  getPosts: (category?: string): Post[] => {
    const posts: Post[] = initStorage(STORAGE_KEYS.POSTS, MOCK_POSTS);
    if (category && category !== 'all') {
      return posts.filter(p => p.category === category);
    }
    return posts;
  },
  addPost: (newPost: Post): void => {
    const posts = [newPost, ...StorageService.getPosts()];
    setStorage(STORAGE_KEYS.POSTS, posts);
  },
  toggleLikePost: (postId: string, userId: string): Post[] => {
    const posts = StorageService.getPosts().map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(userId);
        return {
          ...post,
          likes: hasLiked ? post.likes.filter(id => id !== userId) : [...post.likes, userId]
        };
      }
      return post;
    });
    setStorage(STORAGE_KEYS.POSTS, posts);
    return posts;
  },
  addComment: (postId: string, comment: { userId: string; userName: string; userAvatar: string; userCollege: string; content: string }): Post[] => {
    const posts = StorageService.getPosts().map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `c-${Date.now()}`,
              postId,
              ...comment,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return post;
    });
    setStorage(STORAGE_KEYS.POSTS, posts);
    return posts;
  },
  deletePost: (postId: string): void => {
    const posts = StorageService.getPosts().filter(p => p.id !== postId);
    setStorage(STORAGE_KEYS.POSTS, posts);
  },

  // Communities
  getCommunities: (): Community[] => initStorage(STORAGE_KEYS.COMMUNITIES, MOCK_COMMUNITIES),
  getCommunityById: (id: string): Community | undefined => {
    return StorageService.getCommunities().find(c => c.id === id);
  },
  createCommunity: (newComm: Community): void => {
    const comms = [newComm, ...StorageService.getCommunities()];
    setStorage(STORAGE_KEYS.COMMUNITIES, comms);
  },
  toggleJoinCommunity: (communityId: string, userId: string): Community[] => {
    const comms = StorageService.getCommunities().map(c => {
      if (c.id === communityId) {
        const isMember = c.members.includes(userId);
        return {
          ...c,
          members: isMember ? c.members.filter(id => id !== userId) : [...c.members, userId]
        };
      }
      return c;
    });
    setStorage(STORAGE_KEYS.COMMUNITIES, comms);
    return comms;
  },

  // Messages & Direct Chat
  getMessages: (conversationId: string): Message[] => {
    const allMsgs: Record<string, Message[]> = initStorage(STORAGE_KEYS.MESSAGES, {
      'conv-priya': [
        {
          id: 'm-1',
          conversationId: 'conv-priya',
          senderId: 'usr-priya-102',
          receiverId: 'usr-aman-101',
          content: 'Hi Aman! Saw your SIH finalist project post. Amazing job on the Agri AI assistant!',
          timestamp: '10:30 AM',
          read: true
        },
        {
          id: 'm-2',
          conversationId: 'conv-priya',
          senderId: 'usr-aman-101',
          receiverId: 'usr-priya-102',
          content: 'Thank you Priya di! Your advice on system design and clean API architecture really helped us during the internal evaluation round 🙏',
          timestamp: '10:34 AM',
          read: true
        },
        {
          id: 'm-3',
          conversationId: 'conv-priya',
          senderId: 'usr-priya-102',
          receiverId: 'usr-aman-101',
          content: 'Keep it up! Let me know if you need help polishing the slide deck before the Grand Finale.',
          timestamp: '11:15 AM',
          read: true
        }
      ]
    });
    return allMsgs[conversationId] || [];
  },
  sendMessage: (conversationId: string, message: Message): void => {
    const allMsgs: Record<string, Message[]> = initStorage(STORAGE_KEYS.MESSAGES, {});
    if (!allMsgs[conversationId]) allMsgs[conversationId] = [];
    allMsgs[conversationId].push(message);
    setStorage(STORAGE_KEYS.MESSAGES, allMsgs);
  },

  // Projects
  getProjects: (): Project[] => initStorage(STORAGE_KEYS.PROJECTS, MOCK_PROJECTS),
  createProject: (newProj: Project): void => {
    const projs = [newProj, ...StorageService.getProjects()];
    setStorage(STORAGE_KEYS.PROJECTS, projs);
  },
  updateProjectTask: (projectId: string, taskId: string, newStatus: 'todo' | 'in_progress' | 'done'): void => {
    const projs = StorageService.getProjects().map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          tasks: proj.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
        };
      }
      return proj;
    });
    setStorage(STORAGE_KEYS.PROJECTS, projs);
  },

  // Mentorship
  getMentors: (): MentorProfile[] => MOCK_MENTORS,
  requestMentorship: (request: MentorshipRequest): void => {
    const reqs: MentorshipRequest[] = initStorage(STORAGE_KEYS.MENTOR_REQUESTS, []);
    setStorage(STORAGE_KEYS.MENTOR_REQUESTS, [request, ...reqs]);
  },
  getMentorshipRequests: (mentorUserId: string): MentorshipRequest[] => {
    const reqs: MentorshipRequest[] = initStorage(STORAGE_KEYS.MENTOR_REQUESTS, []);
    return reqs.filter(r => r.mentorId === mentorUserId);
  },
  getMyBookedSessions: (studentId: string): MentorshipRequest[] => {
    const reqs: MentorshipRequest[] = initStorage(STORAGE_KEYS.MENTOR_REQUESTS, []);
    return reqs.filter(r => r.studentId === studentId);
  },

  // Opportunities
  getOpportunities: (): Opportunity[] => initStorage(STORAGE_KEYS.OPPORTUNITIES, MOCK_OPPORTUNITIES),
  getOpportunityById: (id: string): Opportunity | undefined => {
    return StorageService.getOpportunities().find(o => o.id === id);
  },
  addOpportunity: (opportunity: Opportunity): void => {
    const opportunities = [opportunity, ...StorageService.getOpportunities()];
    setStorage(STORAGE_KEYS.OPPORTUNITIES, opportunities);
  },

  // Notices
  getNotices: (): Notice[] => initStorage(STORAGE_KEYS.NOTICES, MOCK_NOTICES),
  createNotice: (notice: Notice): void => {
    const notices = [notice, ...StorageService.getNotices()];
    setStorage(STORAGE_KEYS.NOTICES, notices);
  },

  // Notifications
  getNotifications: (userId: string): AppNotification[] => {
    const notifs: AppNotification[] = initStorage(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    return notifs.filter(n => n.userId === userId || n.userId === 'all');
  },
  markAllNotificationsRead: (userId: string): void => {
    const notifs: AppNotification[] = initStorage(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    const updated = notifs.map(n => (n.userId === userId || n.userId === 'all') ? { ...n, read: true } : n);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // Study Plan Tasks
  getStudyTasks: (userId: string): StudyPlanTask[] => {
    const tasks: StudyPlanTask[] = initStorage(STORAGE_KEYS.STUDY_TASKS, MOCK_STUDY_PLAN_TASKS);
    return tasks.filter(t => t.userId === userId);
  },
  toggleStudyTask: (taskId: string): StudyPlanTask[] => {
    const allTasks: StudyPlanTask[] = initStorage(STORAGE_KEYS.STUDY_TASKS, MOCK_STUDY_PLAN_TASKS);
    const updated = allTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setStorage(STORAGE_KEYS.STUDY_TASKS, updated);
    return updated;
  },
  addStudyTasks: (newTasks: StudyPlanTask[]): void => {
    const allTasks: StudyPlanTask[] = initStorage(STORAGE_KEYS.STUDY_TASKS, MOCK_STUDY_PLAN_TASKS);
    setStorage(STORAGE_KEYS.STUDY_TASKS, [...newTasks, ...allTasks]);
  },

  // Knowledge Nodes
  getKnowledgeNodes: (): KnowledgeNode[] => MOCK_KNOWLEDGE_NODES,

  // Reports (Admin & Moderation)
  getReports: (): Report[] => initStorage(STORAGE_KEYS.REPORTS, MOCK_REPORTS),
  createReport: (report: Report): void => {
    const reports = [report, ...StorageService.getReports()];
    setStorage(STORAGE_KEYS.REPORTS, reports);
  },
  updateReportStatus: (reportId: string, status: 'reviewed' | 'dismissed' | 'removed'): void => {
    const reports = StorageService.getReports().map(r => r.id === reportId ? { ...r, status } : r);
    setStorage(STORAGE_KEYS.REPORTS, reports);
  },

  // BEU GoalMap Persistence
  getGoalMaps: (userId?: string): GoalMap[] => {
    const goalMaps: GoalMap[] = initStorage(STORAGE_KEYS.GOALMAPS, MOCK_GOALMAPS);
    if (userId) return goalMaps.filter(g => g.userId === userId);
    return goalMaps;
  },
  saveGoalMap: (goalMap: GoalMap): void => {
    const existing = StorageService.getGoalMaps();
    const index = existing.findIndex(g => g.id === goalMap.id);
    let updated: GoalMap[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = goalMap;
    } else {
      updated = [goalMap, ...existing];
    }
    setStorage(STORAGE_KEYS.GOALMAPS, updated);
  },
  deleteGoalMap: (goalMapId: string): void => {
    const existing = StorageService.getGoalMaps();
    const updated = existing.filter(g => g.id !== goalMapId);
    setStorage(STORAGE_KEYS.GOALMAPS, updated);
  },
  toggleGoalTask: (goalMapId: string, taskId: string): GoalMap | null => {
    const existing = StorageService.getGoalMaps();
    const targetMap = existing.find(g => g.id === goalMapId);
    if (!targetMap) return null;

    let totalTasks = 0;
    let completedTasks = 0;

    const updatedMilestones = targetMap.milestones.map(m => {
      const updatedTasks = m.tasks.map(t => {
        const isCompleted = t.id === taskId ? !t.completed : t.completed;
        if (isCompleted) completedTasks++;
        totalTasks++;
        return { ...t, completed: isCompleted };
      });

      const allMilestoneTasksDone = updatedTasks.length > 0 && updatedTasks.every(t => t.completed);
      const someMilestoneTasksDone = updatedTasks.some(t => t.completed);

      return {
        ...m,
        tasks: updatedTasks,
        status: allMilestoneTasksDone
          ? ('completed' as const)
          : someMilestoneTasksDone
          ? ('in_progress' as const)
          : ('upcoming' as const)
      };
    });

    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const updatedMap: GoalMap = {
      ...targetMap,
      milestones: updatedMilestones,
      progressPercent
    };

    StorageService.saveGoalMap(updatedMap);
    return updatedMap;
  },
  addGoalTask: (goalMapId: string, milestoneId: string, taskData: Omit<GoalTask, 'id'>): GoalMap | null => {
    const existing = StorageService.getGoalMaps();
    const targetMap = existing.find(g => g.id === goalMapId);
    if (!targetMap) return null;

    const newTask: GoalTask = {
      ...taskData,
      id: `t-cust-${Date.now()}`
    };

    let totalTasks = 0;
    let completedTasks = 0;

    const updatedMilestones = targetMap.milestones.map(m => {
      let tasks = m.tasks;
      if (m.id === milestoneId) {
        tasks = [...m.tasks, newTask];
      }
      tasks.forEach(t => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
      return {
        ...m,
        tasks
      };
    });

    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const updatedMap: GoalMap = {
      ...targetMap,
      milestones: updatedMilestones,
      progressPercent
    };

    StorageService.saveGoalMap(updatedMap);
    return updatedMap;
  },
  deleteGoalTask: (goalMapId: string, taskId: string): GoalMap | null => {
    const existing = StorageService.getGoalMaps();
    const targetMap = existing.find(g => g.id === goalMapId);
    if (!targetMap) return null;

    let totalTasks = 0;
    let completedTasks = 0;

    const updatedMilestones = targetMap.milestones.map(m => {
      const filteredTasks = m.tasks.filter(t => t.id !== taskId);
      filteredTasks.forEach(t => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
      return {
        ...m,
        tasks: filteredTasks
      };
    });

    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const updatedMap: GoalMap = {
      ...targetMap,
      milestones: updatedMilestones,
      progressPercent
    };

    StorageService.saveGoalMap(updatedMap);
    return updatedMap;
  },
  updateGoalMapSchedule: (goalMapId: string, hoursDaily: number, targetDeadline: string): GoalMap | null => {
    const existing = StorageService.getGoalMaps();
    const targetMap = existing.find(g => g.id === goalMapId);
    if (!targetMap) return null;

    const updatedMap: GoalMap = {
      ...targetMap,
      targetDeadline,
      studentProfile: {
        ...targetMap.studentProfile,
        hoursDaily
      },
      healthCheck: {
        ...targetMap.healthCheck,
        summary: `Your GoalMap is calibrated for ${hoursDaily} hours/day over ${targetDeadline}. Pacing is updated.`
      }
    };

    StorageService.saveGoalMap(updatedMap);
    return updatedMap;
  }
};
