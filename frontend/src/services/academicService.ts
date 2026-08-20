import {
  AcademicSession,
  RegulationVersion,
  Subject,
  Topic,
  TopicProgress,
} from '../types';

const API_BASE = 'http://localhost:5000/api';

// Comprehensive local fallback for instant response and offline support
export const FALLBACK_BRANCHES = [
  { id: 'branch-cse', name: 'Computer Science & Engineering', code: 'CSE', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-ce', name: 'Civil Engineering', code: 'CE', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-me', name: 'Mechanical Engineering', code: 'ME', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-ee', name: 'Electrical Engineering', code: 'EE', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-ece', name: 'Electronics & Communication Engineering', code: 'ECE', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-it', name: 'Information Technology', code: 'IT', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-eee', name: 'Electrical & Electronics Engineering', code: 'EEE', category: 'INTERDISCIPLINARY', hasOfficialSyllabus: true },
  { id: 'branch-cse-aiml', name: 'Computer Science & Engineering (AI & ML)', code: 'CSE_AIML', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-cse-ds', name: 'Computer Science & Engineering (Data Science)', code: 'CSE_DS', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-cse-cyber', name: 'Computer Science & Engineering (Cyber Security)', code: 'CSE_CYBER', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-cse-iot', name: 'Computer Science & Engineering (IoT)', code: 'CSE_IOT', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-cse-ai', name: 'Computer Science & Engineering (AI)', code: 'CSE_AI', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-cse-iot-bc', name: 'Computer Science & Engineering (IoT & Cyber Security including Block Chain)', code: 'CSE_IOT_BC', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-cse-net', name: 'Computer Science & Engineering (Networks)', code: 'CSE_NET', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-vlsi', name: 'Electronics Engineering (VLSI Design & Technology)', code: 'EE_VLSI', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-ece-act', name: 'ECE (Advance Communication Technology)', code: 'ECE_ACT', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-ra', name: 'Robotics & Automation', code: 'RA', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-mechatronics', name: 'Mechatronics Engineering', code: 'MTE', category: 'INTERDISCIPLINARY', hasOfficialSyllabus: true },
  { id: 'branch-msm', name: 'Mechanical & Smart Manufacturing', code: 'MSM', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-biomedical', name: 'Biomedical & Robotic Engineering', code: 'BMRE', category: 'INTERDISCIPLINARY', hasOfficialSyllabus: true },
  { id: 'branch-ce-ca', name: 'Civil Engineering with Computer Application', code: 'CE_CA', category: 'INTERDISCIPLINARY', hasOfficialSyllabus: true },
  { id: 'branch-che', name: 'Chemical Engineering', code: 'CHE', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-leather', name: 'Chemical Technology (Leather Technology)', code: 'CT_LT', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-mining', name: 'Mining Engineering', code: 'MINE', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-ie', name: 'Instrumentation Engineering', code: 'IE', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-fts', name: 'Fire Technology & Safety', code: 'FTS', category: 'INTERDISCIPLINARY', hasOfficialSyllabus: true },
  { id: 'branch-aero', name: 'Aeronautical Engineering', code: 'AERO', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-fpp', name: 'Food Processing & Preservation', code: 'FPP', category: 'INTERDISCIPLINARY', hasOfficialSyllabus: true },
  { id: 'branch-3d', name: '3-D Animation & Graphics', code: 'AG_3D', category: 'EMERGING_TECH', hasOfficialSyllabus: true },
  { id: 'branch-agri', name: 'Agricultural Engineering', code: 'AGE', category: 'INTERDISCIPLINARY', hasOfficialSyllabus: true },
  { id: 'branch-waste', name: 'Waste Management', code: 'WM', category: 'INTERDISCIPLINARY', hasOfficialSyllabus: true },
  { id: 'branch-petro', name: 'Petrochemical Engineering', code: 'PCE', category: 'CORE', hasOfficialSyllabus: true },
  { id: 'branch-plastic', name: 'Chemical Engineering (Plastic & Polymer)', code: 'CE_PP', category: 'INTERDISCIPLINARY', hasOfficialSyllabus: true },
  { id: 'branch-marine', name: 'Marine Engineering', code: 'MRE', category: 'CORE', hasOfficialSyllabus: true },
];

export const FALLBACK_REGULATIONS: RegulationVersion[] = [
  {
    id: 'reg-2026',
    code: 'REG_2026',
    name: 'BEU UG Regulation 2026',
    effectiveFromYear: 2026,
    officialDocumentUrl: 'https://beu-bih.ac.in/backend/1778027052729-UG%20Regulation_05.04.2026.pdf',
    description: 'Effective for all students admitted in Academic Session 2026-27 and onwards.',
    status: 'ACTIVE',
  },
  {
    id: 'reg-2018',
    code: 'REG_2018',
    name: 'BEU AICTE Model Curriculum 2018-2025',
    effectiveFromYear: 2018,
    officialDocumentUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Effective for student batches admitted between 2018-19 to 2025-26.',
    status: 'ACTIVE',
  },
];

export const FALLBACK_SESSIONS: AcademicSession[] = [
  { id: 'session-2026-27', name: '2026-2027', isActive: true },
  { id: 'session-2025-26', name: '2025-2026', isActive: true },
  { id: 'session-2024-25', name: '2024-2025', isActive: true },
  { id: 'session-2023-24', name: '2023-2024', isActive: false },
];

const LOCAL_PROGRESS_KEY = 'beu_topic_progress_map';

export const AcademicService = {
  async getSessions(): Promise<AcademicSession[]> {
    try {
      const res = await fetch(`${API_BASE}/academic/sessions`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) return data.data;
      }
    } catch {
      // Fallback
    }
    return FALLBACK_SESSIONS;
  },

  async getRegulations(): Promise<RegulationVersion[]> {
    try {
      const res = await fetch(`${API_BASE}/academic/regulations`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) return data.data;
      }
    } catch {
      // Fallback
    }
    return FALLBACK_REGULATIONS;
  },

  async getBranches(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/academic/branches`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) return data.data;
      }
    } catch {
      // Fallback
    }
    return FALLBACK_BRANCHES;
  },

  async getSemesters(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/academic/semesters`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) return data.data;
      }
    } catch {
      // Fallback
    }
    return [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({
      id: `sem-${n}`,
      number: n,
      name: `Semester ${n}`,
      group: n <= 2 ? 'Group A / Group B' : 'Core Discipline',
    }));
  },

  async getSubjects(params?: {
    branchCode?: string;
    semesterNumber?: number;
    regulationCode?: string;
    search?: string;
  }): Promise<Subject[]> {
    try {
      const query = new URLSearchParams();
      if (params?.branchCode) query.append('branchCode', params.branchCode);
      if (params?.semesterNumber) query.append('semesterNumber', String(params.semesterNumber));
      if (params?.regulationCode) query.append('regulationCode', params.regulationCode);
      if (params?.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE}/academic/subjects?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) return data.data;
      }
    } catch {
      // Fallback
    }

    // Default subject list if offline
    return [];
  },

  async getSubjectById(subjectIdOrCode: string): Promise<Subject | null> {
    try {
      const res = await fetch(`${API_BASE}/academic/subjects/${subjectIdOrCode}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async searchSyllabus(query: string, branchCode?: string, semesterNumber?: number): Promise<any> {
    try {
      const q = new URLSearchParams();
      q.append('q', query);
      if (branchCode) q.append('branchCode', branchCode);
      if (semesterNumber) q.append('semesterNumber', String(semesterNumber));

      const res = await fetch(`${API_BASE}/academic/search?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Fallback
    }
    return { subjects: [], units: [], topics: [] };
  },

  /**
   * Generates a targeted academic YouTube search URL for a syllabus topic.
   */
  getYouTubeSearchUrl(subjectName: string, topicTitle: string, branchCode?: string): string {
    // BEU-COMMENT-7: Normalized YouTube academic search query generation based on university, subject and topic
    const cleanSubj = subjectName.replace(/\(.*?\)/g, '').trim();
    const cleanTopic = topicTitle.replace(/^[0-9.]+\s*/, '').trim();
    const query = `BEU ${cleanSubj} ${cleanTopic}`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  },

  /**
   * Retrieves user topic progress records from local cache.
   */
  getLocalProgressMap(): Record<string, TopicProgress> {
    try {
      const stored = localStorage.getItem(LOCAL_PROGRESS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  /**
   * Computes multi-level progress metrics across Topic, Unit, and Subject levels.
   */
  computeHierarchyProgress(subject: Subject, progressMap: Record<string, TopicProgress>) {
    // BEU-COMMENT-8: Multi-tier progress calculation aggregating topic completions to unit and subject percentages
    let totalTopics = 0;
    let completedTopics = 0;

    const unitProgressMap: Record<string, { total: number; completed: number; percentage: number }> = {};

    if (subject.units) {
      for (const unit of subject.units) {
        let uTotal = 0;
        let uCompleted = 0;

        for (const topic of unit.topics) {
          uTotal++;
          totalTopics++;
          const status = progressMap[topic.id]?.status || topic.progress?.[0]?.status;
          if (status === 'COMPLETED') {
            uCompleted++;
            completedTopics++;
          }
        }

        unitProgressMap[unit.id] = {
          total: uTotal,
          completed: uCompleted,
          percentage: uTotal > 0 ? Math.round((uCompleted / uTotal) * 100) : 0,
        };
      }
    }

    const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
      totalTopics,
      completedTopics,
      overallPercentage,
      unitProgressMap,
    };
  },

  async getUserProgress(branchCode?: string, semesterNumber?: number): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/academic/my-progress`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback to local storage
    }

    const map = this.getLocalProgressMap();
    const values: any[] = Object.values(map);
    const completed = values.filter(v => v.status === 'COMPLETED').length;
    const inProg = values.filter(v => v.status === 'IN_PROGRESS').length;
    const revision = values.filter(v => v.status === 'REVISION_REQUIRED').length;
    const total = values.length || 20;

    return {
      overallPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalTopicsTracked: total,
      completedTopics: completed,
      inProgressTopics: inProg,
      revisionRequiredTopics: revision,
      subjectProgress: {},
    };
  },

  async updateTopicProgress(
    topicId: string,
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVISION_REQUIRED',
    progressPercentage = 0,
    notes = ''
  ): Promise<TopicProgress> {
    // 1. Save to local storage for immediate offline reactivity
    try {
      const stored = localStorage.getItem(LOCAL_PROGRESS_KEY);
      const map = stored ? JSON.parse(stored) : {};
      map[topicId] = {
        topicId,
        status,
        progressPercentage: status === 'COMPLETED' ? 100 : progressPercentage,
        notes,
        lastStudiedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(map));
    } catch (e) {
      console.warn('Local storage write failed', e);
    }

    // 2. Sync to Backend API
    try {
      const res = await fetch(`${API_BASE}/academic/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, status, progressPercentage, notes }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Network offline
    }

    return {
      topicId,
      status,
      progressPercentage,
      lastStudiedAt: new Date().toISOString(),
    };
  },

  async getRecommendations(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/academic/recommendations`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    return {
      continueLearning: [
        {
          subjectName: 'Data Structures and Algorithms',
          subjectCode: 'PCC-CS301',
          unitTitle: 'Unit 3: Trees & Binary Search Trees',
          topicTitle: 'Balanced Search Trees (AVL Rotations & B-Trees)',
          estimatedMinutes: 45,
          priority: 'HIGH',
        },
        {
          subjectName: 'Database Management Systems',
          subjectCode: 'PCC-CS401',
          unitTitle: 'Unit 3: Relational Database Design',
          topicTitle: 'Normal Forms: 1NF, 2NF, 3NF, BCNF & Decomposition',
          estimatedMinutes: 30,
          priority: 'HIGH',
        },
      ],
      revisionAlerts: [
        {
          subjectName: 'Mathematics - I',
          subjectCode: 'BSC-101',
          topicTitle: 'Eigenvalues, Eigenvectors & Cayley-Hamilton',
          reason: 'Marked for revision 3 days ago',
        },
      ],
      recommendedPYQs: [
        {
          subjectCode: 'PCC-CS301',
          subjectName: 'DSA',
          year: 2024,
          topic: 'AVL Rotations & Balance Factor Proof',
          marks: 7,
        },
      ],
      officialNotice: {
        title: 'BEU 2026 UG Regulation Effective',
        sourceUrl: 'https://beu-bih.ac.in/backend/1778027052729-UG%20Regulation_05.04.2026.pdf',
        text: 'All course structures comply with the official Bihar Engineering University curriculum.',
      },
    };
  },

  async syncOfficialSyllabus(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/syllabus/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  async getSyllabusVersions(): Promise<RegulationVersion[]> {
    try {
      const res = await fetch(`${API_BASE}/admin/syllabus/versions`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }
    return FALLBACK_REGULATIONS;
  },
};
