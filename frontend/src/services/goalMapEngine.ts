import { GoalMap, GoalMilestone, GoalTask, GoalResource } from '../types';

export interface GoalPreset {
  id: string;
  title: string;
  category: 'career' | 'academic' | 'skill' | 'project' | 'custom';
  icon: string;
  tagline: string;
  defaultDeadline: string;
  targetOutcome: string;
  defaultSkillsNeeded: string[];
  beuContextNote: string;
}

export const GOAL_PRESETS: GoalPreset[] = [
  {
    id: 'full-stack-dev',
    title: 'Full-Stack Software Developer',
    category: 'career',
    icon: '💻',
    tagline: 'MERN / Next.js, DSA, System Design & Paid Internship in 6-8 Months',
    defaultDeadline: '6 Months',
    targetOutcome: 'Crack off-campus/on-campus SDE roles with 2 production projects & strong DSA',
    defaultSkillsNeeded: ['JavaScript / TypeScript', 'React.js', 'Node.js & Express', 'MongoDB / PostgreSQL', 'DSA (LeetCode 150+)', 'Git & CI/CD', 'REST & GraphQL APIs'],
    beuContextNote: 'Aligns with BEU CS301 (Data Structures), CS401 (DBMS), and CS501 (Web Technologies)'
  },
  {
    id: 'gate-exam',
    title: 'GATE 2026 / 2027 Top Ranker (AIR < 500)',
    category: 'academic',
    icon: '🎯',
    tagline: 'PSU Recruitment & Direct M.Tech Admission at IITs/IISc',
    defaultDeadline: '1 Year',
    targetOutcome: 'Master core engineering subjects, solve 15 years PYQs, score 65+ marks in GATE',
    defaultSkillsNeeded: ['Engineering Mathematics', 'Discrete Mathematics', 'Theory of Computation', 'Computer Architecture', 'Operating Systems', 'Compiler Design', 'PYQ Solving Speed'],
    beuContextNote: 'BEU End-Sem standard theory covers 70% of GATE syllabus foundations'
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI / ML & Data Science Engineer',
    category: 'career',
    icon: '🤖',
    tagline: 'Deep Learning, LLMs, PyTorch, Computer Vision & Kaggle Competitions',
    defaultDeadline: '6 Months',
    targetOutcome: 'Build portfolio of deployed AI microservices, RAG pipelines, and ML models',
    defaultSkillsNeeded: ['Python / NumPy / Pandas', 'Scikit-Learn', 'PyTorch / TensorFlow', 'Vector DBs & RAG', 'Maths: Linear Algebra & Probability', 'FastAPI Deployment'],
    beuContextNote: 'Directly builds on BEU PCC-AIML courses and numerical statistics'
  },
  {
    id: 'beu-semester-cgpa',
    title: 'BEU Semester 8.5+ CGPA & 14-Mark Mastery',
    category: 'academic',
    icon: '📚',
    tagline: 'High-Yield Unit Strategy, 14-Mark Derivations & Repeat PYQs',
    defaultDeadline: '3 Months',
    targetOutcome: 'Score University Distinction (8.5+ SGPA) with zero backlogs',
    defaultSkillsNeeded: ['Compulsory Q1 Speed', '14-Mark Answer Presentation', 'Circuit & Block Diagrams', 'Past 5-Year PYQs (2020-2024)', 'Lab Practical Vivas'],
    beuContextNote: 'Focuses on 80%+ pattern repeat rate of BEU Units 2, 3, and 4'
  },
  {
    id: 'govt-bpsc-ae',
    title: 'BPSC AE & Govt Assistant Engineer Exam',
    category: 'career',
    icon: '🏛️',
    tagline: 'State Govt Engineering Services (WRD, RWD, BCD Bihar)',
    defaultDeadline: '1 Year',
    targetOutcome: 'Crack Prelims & Mains technical and General Studies for Bihar State Services',
    defaultSkillsNeeded: ['Core Branch Engineering Depth', 'General Studies & Bihar GK', 'Previous 10-Year BPSC AE Papers', 'Standard Engineering Codes (IS / IRC)'],
    beuContextNote: 'BEU syllabus matches 90% of BPSC Assistant Engineer syllabus requirements'
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst & Ethical Hacker',
    category: 'skill',
    icon: '🛡️',
    tagline: 'Network Security, Bug Bounty, SOC Operations & CEH Prep',
    defaultDeadline: '6 Months',
    targetOutcome: 'Earn security certifications, solve TryHackMe/HackTheBox, and secure junior SOC roles',
    defaultSkillsNeeded: ['Networking (OSI, TCP/IP, Wireshark)', 'Linux Administration', 'Web Application Pentesting (OWASP Top 10)', 'Burp Suite', 'Python Scripting for SecOps'],
    beuContextNote: 'Complements BEU Cyber Security elective and computer networks'
  },
  {
    id: 'tech-startup',
    title: 'Build a Tech Startup / AI Product',
    category: 'project',
    icon: '🚀',
    tagline: 'From Idea to MVP, Smart India Hackathon & Bihar Startup Grant (₹10L)',
    defaultDeadline: '6 Months',
    targetOutcome: 'Launch functional SaaS MVP, acquire first 100 users, and apply for Bihar Startup Policy seed fund',
    defaultSkillsNeeded: ['Rapid MVP Prototyping (Next.js/Supabase)', 'User Research & Problem Validation', 'Pitch Deck & Business Model Canvas', 'System Architecture', 'Product Analytics'],
    beuContextNote: 'Eligible for Department of Industries Bihar Startup seed funding up to ₹10 Lakhs'
  }
];

export const GoalMapEngine = {
  /**
   * Generates a fully personalized GoalMap based on student input
   */
  generateGoalMap: (params: {
    userId: string;
    goalTitle: string;
    category: 'career' | 'academic' | 'skill' | 'project' | 'custom';
    targetOutcome: string;
    targetDeadline: string;
    branch: string;
    semester: number;
    currentLevel: 'beginner' | 'intermediate' | 'advanced';
    existingSkills: string[];
    hoursDaily: number;
    learningPreference: string[];
  }): GoalMap => {
    const {
      userId, goalTitle, category, targetOutcome, targetDeadline,
      branch, semester, currentLevel, existingSkills, hoursDaily, learningPreference
    } = params;

    const lowerGoal = goalTitle.toLowerCase();
    const isFullStack = lowerGoal.includes('full') || lowerGoal.includes('web') || lowerGoal.includes('software') || lowerGoal.includes('frontend') || lowerGoal.includes('backend') || lowerGoal.includes('mern');
    const isGate = lowerGoal.includes('gate') || lowerGoal.includes('psu') || lowerGoal.includes('m.tech') || lowerGoal.includes('iit');
    const isAIML = lowerGoal.includes('ai') || lowerGoal.includes('ml') || lowerGoal.includes('data') || lowerGoal.includes('machine learning') || lowerGoal.includes('deep learning');
    const isBEUSem = lowerGoal.includes('cgpa') || lowerGoal.includes('semester') || lowerGoal.includes('exam') || lowerGoal.includes('sgpa') || lowerGoal.includes('university');
    const isGovt = lowerGoal.includes('bpsc') || lowerGoal.includes('ae') || lowerGoal.includes('govt') || lowerGoal.includes('assistant engineer') || lowerGoal.includes('ssc');
    const isCybersecurity = lowerGoal.includes('cyber') || lowerGoal.includes('security') || lowerGoal.includes('hack') || lowerGoal.includes('pentest') || lowerGoal.includes('soc');
    const isStartup = lowerGoal.includes('startup') || lowerGoal.includes('business') || lowerGoal.includes('product') || lowerGoal.includes('saas') || lowerGoal.includes('hackathon') || lowerGoal.includes('sih');

    // 1. GAP ANALYSIS
    const allRequiredSkills = isFullStack
      ? ['JavaScript Fundamentals', 'Git & GitHub', 'React.js & Hooks', 'Node.js & Express', 'MongoDB & SQL', 'Data Structures (Arrays/Trees/Graphs)', 'REST APIs & JWT Auth', 'Docker Basics', 'System Design Basics', 'Resume & Mock Interviews']
      : isGate
      ? ['Engg Mathematics', 'Discrete Maths', 'Digital Logic', 'Data Structures & Algorithms', 'Operating Systems', 'DBMS & SQL', 'Theory of Computation', 'Computer Networks', 'Compiler Design', '15 Years PYQ Solving']
      : isAIML
      ? ['Python & OOP', 'NumPy & Pandas Analysis', 'Linear Algebra & Calculus', 'Scikit-Learn ML Models', 'Deep Learning & PyTorch', 'NLP & Transformer Models', 'FastAPI Deployment', 'Vector DB & RAG Pipelines']
      : isGovt
      ? ['Core Branch Fundamentals', 'Strength of Materials / Circuits', 'Fluid Mechanics / Power Systems', 'Bihar Special GK & Current Affairs', 'BPSC AE Previous Papers', 'Standard Design Codes']
      : isBEUSem
      ? ['Unit 1 Concepts (2 Marks Compulsory)', 'Unit 2 Theoretical Models & Tables', 'Unit 3 High-Yield 14-Mark Derivations', 'Unit 4 High-Yield Algorithms/Circuits', 'Unit 5 Numerical Problem Sets', 'Past 5-Year PYQs Review']
      : isCybersecurity
      ? ['Linux Administration', 'Computer Networks (TCP/IP, OSI)', 'OWASP Top 10 Web Vulnerabilities', 'Burp Suite & Nmap', 'SOC Incident Analysis & Log Monitoring', 'TryHackMe Practice']
      : isStartup
      ? ['Problem Discovery & User Interviews', 'Full-Stack MVP Prototyping', 'Database Architecture & Auth', 'Pitch Deck & Business Model Canvas', 'Bihar Startup Grant ₹10L Application', 'Early User Onboarding']
      : ['Fundamental Theory & Terminology', 'Applied Technical Skills', 'Practical Implementation & Drills', 'Capstone Project & Documentation', 'Assessment & Final Outcome Delivery'];

    const alreadyLearned = existingSkills.filter(s =>
      allRequiredSkills.some(req => req.toLowerCase().includes(s.toLowerCase()))
    );

    const skillGap = allRequiredSkills.filter(req =>
      !alreadyLearned.some(al => al.toLowerCase() === req.toLowerCase())
    );

    const highPriority = skillGap.slice(0, Math.ceil(skillGap.length * 0.4));
    const mediumPriority = skillGap.slice(Math.ceil(skillGap.length * 0.4));

    // 2. MILESTONES & TIME-BASED ROADMAP GENERATION
    let milestones: GoalMilestone[] = [];

    if (isFullStack) {
      milestones = [
        {
          id: 'ms-fs-1',
          phaseNumber: 1,
          title: 'Phase 1: Core Programming, DSA Foundations & Git',
          timeframe: 'Month 1 (Weeks 1-4)',
          whyThisStep: 'Solid programming logic in JavaScript/C++ and version control are non-negotiable prerequisites before building full-stack systems.',
          status: 'in_progress',
          tasks: [
            { id: 't-fs-1-1', title: 'Master JavaScript ES6+ (Promises, Async/Await, Closures, Array methods)', description: 'Write 15 JS coding drills on closures, event loop, and DOM manipulation.', estimatedHours: 12, priority: 'HIGH', completed: true, category: 'learn' },
            { id: 't-fs-1-2', title: 'Master Git Branching, Pull Requests & GitHub Workflow', description: 'Create a GitHub profile, initialize repositories with clear README, license, and .gitignore.', estimatedHours: 6, priority: 'HIGH', completed: true, category: 'practice' },
            { id: 't-fs-1-3', title: 'Solve 30 Easy-Medium LeetCode Array & String Questions', description: 'Focus on Two-Pointer technique, Sliding Window, and HashMaps.', estimatedHours: 20, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-fs-1-4', title: 'Build Project 1: Interactive Browser Dashboard / Task Manager', description: 'Pure Vanilla JS + LocalStorage with responsive CSS layout.', estimatedHours: 14, priority: 'MEDIUM', completed: false, category: 'project' }
          ],
          recommendedResources: [
            { id: 'r-fs-1-1', title: 'JavaScript.info (Modern JavaScript Tutorial)', type: 'doc', url: 'https://javascript.info', whyUseful: 'The gold standard comprehensive JS deep dive.', difficulty: 'Beginner', estimatedTime: '2 weeks' },
            { id: 'r-fs-1-2', title: 'Namaste JavaScript by Akshay Saini (YouTube)', type: 'video', url: 'https://youtube.com', whyUseful: 'Best visual breakdown of JS execution context and event loops.', difficulty: 'Beginner', estimatedTime: '10 hours' },
            { id: 'r-fs-1-3', title: 'NeetCode 150 - Arrays & Hashing', type: 'practice', url: 'https://neetcode.io', whyUseful: 'Curated list of must-solve interview coding problems.', difficulty: 'Intermediate', estimatedTime: '15 hours' }
          ],
          projectIdea: {
            title: 'Personal Developer Dashboard with Weather & Task Sync',
            description: 'A modular productivity widget board built with vanilla TypeScript and OpenWeather API.',
            techStack: ['HTML5', 'Vanilla CSS', 'TypeScript', 'LocalStorage', 'REST API']
          }
        },
        {
          id: 'ms-fs-2',
          phaseNumber: 2,
          title: 'Phase 2: Modern Frontend Engineering with React & Tailwind',
          timeframe: 'Month 2 (Weeks 5-8)',
          whyThisStep: 'React powers 70%+ of modern tech companies in India. Mastering state management and component architecture creates job-ready UI skills.',
          status: 'upcoming',
          tasks: [
            { id: 't-fs-2-1', title: 'Understand React Lifecycle, State, Props & Core Hooks (useState, useEffect, useMemo)', description: 'Build component tree with clean separation of concerns.', estimatedHours: 18, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-fs-2-2', title: 'Master TailwindCSS / CSS Design System & Responsive Layouts', description: 'Design mobile-first interfaces with dark mode support.', estimatedHours: 10, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-fs-2-3', title: 'State Management with Zustand or Redux Toolkit', description: 'Manage global auth state, cart state, and notifications across pages.', estimatedHours: 12, priority: 'MEDIUM', completed: false, category: 'learn' },
            { id: 't-fs-2-4', title: 'Build Project 2: College Campus Marketplace / Community Forum', description: 'Fully responsive UI with filter bar, search, and dynamic mock data.', estimatedHours: 25, priority: 'HIGH', completed: false, category: 'project' }
          ],
          recommendedResources: [
            { id: 'r-fs-2-1', title: 'React Official Documentation (react.dev)', type: 'doc', url: 'https://react.dev', whyUseful: 'Interactive and hands-on modern functional component guidance.', difficulty: 'Intermediate', estimatedTime: '2 weeks' },
            { id: 'r-fs-2-2', title: 'Full Stack Open - Part 1 & 2 (University of Helsinki)', type: 'practice', url: 'https://fullstackopen.com', whyUseful: 'World-class academic full-stack curriculum.', difficulty: 'Intermediate', estimatedTime: '20 hours' }
          ],
          projectIdea: {
            title: 'BEU Student Peer Tutoring & Notes Exchange Platform',
            description: 'Responsive React app with subject filters, PDF note previewer, and mentor booking UI.',
            techStack: ['React 18', 'TailwindCSS', 'Lucide Icons', 'Zustand']
          }
        },
        {
          id: 'ms-fs-3',
          phaseNumber: 3,
          title: 'Phase 3: Backend Microservices, Node.js & Databases (SQL + NoSQL)',
          timeframe: 'Month 3 (Weeks 9-12)',
          whyThisStep: 'Real-world developers must architect reliable APIs, enforce authentication security, and optimize database queries.',
          status: 'upcoming',
          tasks: [
            { id: 't-fs-3-1', title: 'Build RESTful APIs with Node.js, Express & TypeScript', description: 'Implement MVC pattern with input validation (Zod) and error handling middleware.', estimatedHours: 18, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-fs-3-2', title: 'Implement JWT Authentication, Password Hashing (bcrypt) & Role-Based Access Control', description: 'Secure endpoints for student vs mentor vs admin.', estimatedHours: 14, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-fs-3-3', title: 'Database Design with PostgreSQL (Prisma ORM) & MongoDB', description: 'Write complex schema relations, foreign keys, indexing, and aggregation pipelines.', estimatedHours: 16, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-fs-3-4', title: 'BEU Syllabus Alignment Check: Revise DBMS (CS401) Normalization', description: 'Connect academic 1NF/2NF/3NF/BCNF principles directly to production DB design.', estimatedHours: 8, priority: 'MEDIUM', completed: false, category: 'beu_prep' }
          ],
          recommendedResources: [
            { id: 'r-fs-3-1', title: 'Prisma ORM Official Guides', type: 'doc', url: 'https://prisma.io/docs', whyUseful: 'Type-safe database modeling with automatic migrations.', difficulty: 'Intermediate', estimatedTime: '1 week' },
            { id: 'r-fs-3-2', title: 'Hussein Nasser Backend Engineering (YouTube)', type: 'video', url: 'https://youtube.com', whyUseful: 'Deep dive into database indexing, TCP, and connection pools.', difficulty: 'Advanced', estimatedTime: '12 hours' }
          ]
        },
        {
          id: 'ms-fs-4',
          phaseNumber: 4,
          title: 'Phase 4: Full-Stack Integration, WebSockets & Production Capstone',
          timeframe: 'Month 4 (Weeks 13-16)',
          whyThisStep: 'Recruiters look for end-to-end full-stack projects that solve real problems with real-time features like chat or live notifications.',
          status: 'upcoming',
          tasks: [
            { id: 't-fs-4-1', title: 'Connect Frontend & Backend with Axios Interceptors & TanStack Query', description: 'Handle loading spinners, error toasts, and cache invalidation.', estimatedHours: 15, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-fs-4-2', title: 'Implement Real-time Communication using Socket.io or WebSockets', description: 'Build direct 1-on-1 instant messaging and notifications.', estimatedHours: 14, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-fs-4-3', title: 'Build Major Capstone: Real-Time Collaborative Academic Workspace', description: 'Multi-user study group with real-time chat, shared whiteboard, and file sharing.', estimatedHours: 35, priority: 'HIGH', completed: false, category: 'project' },
            { id: 't-fs-4-4', title: 'Dockerize Frontend and Backend with docker-compose', description: 'Create production Dockerfile and deploy on Render / Vercel / Railway.', estimatedHours: 10, priority: 'MEDIUM', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-fs-4-1', title: 'Socket.io Official Chat Application Tutorial', type: 'doc', url: 'https://socket.io', whyUseful: 'Step-by-step WebSocket event handling.', difficulty: 'Intermediate', estimatedTime: '6 hours' },
            { id: 'r-fs-4-2', title: 'Docker for Beginners by Nana (YouTube)', type: 'video', url: 'https://youtube.com', whyUseful: 'Clear visual introduction to containers and compose files.', difficulty: 'Beginner', estimatedTime: '4 hours' }
          ],
          projectIdea: {
            title: 'BEU Live Study Room & Peer Doubt Solver',
            description: 'Full-stack platform with real-time whiteboard, Socket.io rooms, and AI doubt assistant.',
            techStack: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Prisma', 'Docker']
          }
        },
        {
          id: 'ms-fs-5',
          phaseNumber: 5,
          title: 'Phase 5: DSA Problem Solving & Off-Campus Internship Preparation',
          timeframe: 'Month 5 (Weeks 17-20)',
          whyThisStep: 'DSA clears coding rounds; system design and core CS fundamentals clear technical interview rounds.',
          status: 'upcoming',
          tasks: [
            { id: 't-fs-5-1', title: 'Solve 60+ Medium DSA Problems (Trees, Graphs, DSU, Dynamic Programming)', description: 'Master BFS, DFS, Dijkstra, Tree Traversals, and 0/1 Knapsack variations.', estimatedHours: 35, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-fs-5-2', title: 'Master Core CS Fundamentals for Interviews (OS, DBMS, CN)', description: 'Revise Paging, Virtual Memory, ACID properties, Indexing, and TCP Handshake.', estimatedHours: 15, priority: 'HIGH', completed: false, category: 'beu_prep' },
            { id: 't-fs-5-3', title: 'Format Single-Page ATS-Friendly Tech Resume (Overleaf / LaTeX)', description: 'Highlight GitHub live links, metrics (e.g. "reduced latency by 35%"), and tech stack.', estimatedHours: 6, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-fs-5-4', title: 'Optimize LinkedIn Profile & Connect with 50+ BEU Alumni in Tech', description: 'Reach out for referrals with customized polite message pitches.', estimatedHours: 8, priority: 'MEDIUM', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-fs-5-1', title: 'Striver SDE Sheet (Take U Forward)', type: 'practice', url: 'https://takeuforward.org', whyUseful: 'Most popular curated DSA sheet for product-based company rounds in India.', difficulty: 'Advanced', estimatedTime: '4 weeks' },
            { id: 'r-fs-5-2', title: 'Gate Smashers Operating Systems Playlist', type: 'video', url: 'https://youtube.com', whyUseful: 'Quickest way to ace OS interview questions.', difficulty: 'Intermediate', estimatedTime: '10 hours' }
          ]
        },
        {
          id: 'ms-fs-6',
          phaseNumber: 6,
          title: 'Phase 6: Mock Technical Interviews & Job Applications',
          timeframe: 'Month 6 (Weeks 21-24)',
          whyThisStep: 'Mock interview practice builds live communication confidence and eliminates exam anxiety.',
          status: 'upcoming',
          tasks: [
            { id: 't-fs-6-1', title: 'Conduct 3 Peer Mock Technical Interviews on BEU Senior Mentor Platform', description: 'Simulate live coding, explain approach before writing code, and handle edge cases.', estimatedHours: 10, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-fs-6-2', title: 'Apply to 15+ Target Startups & Tier-1 Tech Companies via Referrals', description: 'Apply via Wellfound (AngelList), Instahyre, CutShort, and LinkedIn Jobs.', estimatedHours: 15, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-fs-6-3', title: 'Prepare Behavioral & HR Questions (STAR Method)', description: 'Prepare 4 stories: Leadership, Conflict resolution, Greatest technical failure, Hackathon win.', estimatedHours: 8, priority: 'MEDIUM', completed: false, category: 'learn' }
          ],
          recommendedResources: [
            { id: 'r-fs-6-1', title: 'Pramp / Interviewing.io Free Peer Mock Interviews', type: 'practice', url: 'https://pramp.com', whyUseful: 'Real live video mock coding with peer engineering students.', difficulty: 'Advanced', estimatedTime: '1 week' }
          ]
        }
      ];
    } else if (isGate) {
      milestones = [
        {
          id: 'ms-gt-1',
          phaseNumber: 1,
          title: 'Phase 1: Engineering Mathematics & Discrete Structures (15 Marks)',
          timeframe: 'Months 1-2',
          whyThisStep: 'Mathematics has 100% scoring certainty in GATE and forms the foundation for algorithms and theoretical computer science.',
          status: 'in_progress',
          tasks: [
            { id: 't-gt-1-1', title: 'Linear Algebra: Matrices, Eigenvalues, Cayley-Hamilton Theorem', description: 'Solve 50 GATE standard problems on matrix rank and diagonalization.', estimatedHours: 20, priority: 'HIGH', completed: true, category: 'learn' },
            { id: 't-gt-1-2', title: 'Discrete Mathematics: Propositional Logic, Sets & Graph Theory', description: 'Master Planar graphs, Euler formula, and recurrence relations.', estimatedHours: 25, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-gt-1-3', title: 'Solve Past 10 Years GATE Math PYQs', description: 'Time each question under 2 minutes.', estimatedHours: 15, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-gt-1-1', title: 'NPTEL Discrete Mathematics by Prof. Sudarshan Iyengar', type: 'video', url: 'https://nptel.ac.in', whyUseful: 'Official IIT video series with mathematical rigor.', difficulty: 'Intermediate', estimatedTime: '3 weeks' }
          ]
        },
        {
          id: 'ms-gt-2',
          phaseNumber: 2,
          title: 'Phase 2: Core Data Structures, Algorithms & Theory of Computation',
          timeframe: 'Months 3-5',
          whyThisStep: 'Algorithms and TOC carry 20+ marks and are high-yield conceptual subjects with strict boundary conditions.',
          status: 'upcoming',
          tasks: [
            { id: 't-gt-2-1', title: 'Theory of Computation: DFA, NFA, Regular Expressions & Pumping Lemma', description: 'Design minimal state DFAs and solve closure property questions.', estimatedHours: 25, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-gt-2-2', title: 'Algorithms: Asymptotic Analysis, Greedy, DP & Graph Traversal', description: 'Master Bellman-Ford, Floyd-Warshall, and Master Theorem cases.', estimatedHours: 30, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-gt-2-1', title: 'Gate Overflow (Community Solved GATE Papers)', type: 'practice', url: 'https://gateoverflow.in', whyUseful: 'Verified step-by-step discussion on all previous GATE questions.', difficulty: 'Advanced', estimatedTime: 'Ongoing' }
          ]
        },
        {
          id: 'ms-gt-3',
          phaseNumber: 3,
          title: 'Phase 3: Operating Systems, DBMS & Computer Architecture',
          timeframe: 'Months 6-8',
          whyThisStep: 'System subjects require deep understanding of hardware memory hierarchies, virtual memory, and SQL transaction ACID properties.',
          status: 'upcoming',
          tasks: [
            { id: 't-gt-3-1', title: 'Operating Systems: Synchronization (Semaphores), Paging, Deadlocks', description: 'Solve classical dining philosopher and banker algorithm problems.', estimatedHours: 25, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-gt-3-2', title: 'DBMS: Transactions, Serializability, Normalization & SQL Queries', description: 'Master Conflict serializability and B+ Tree order calculations.', estimatedHours: 20, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-gt-3-1', title: 'Silberschatz Operating System Concepts Book', type: 'doc', url: 'https://os-book.com', whyUseful: 'Standard recommended text for GATE OS.', difficulty: 'Intermediate', estimatedTime: '2 weeks' }
          ]
        },
        {
          id: 'ms-gt-4',
          phaseNumber: 4,
          title: 'Phase 4: Full-Length Test Series & Subject Revision Cycles',
          timeframe: 'Months 9-12',
          whyThisStep: 'Virtual calculator practice, negative marking control, and timed mock tests determine the final AIR ranking.',
          status: 'upcoming',
          tasks: [
            { id: 't-gt-4-1', title: 'Attempt 20 Full-Length Mock Exams under Strict 3-Hour Exam Conditions', description: 'Target 70+ raw score and analyze mistakes on the same day.', estimatedHours: 60, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-gt-4-2', title: 'Create Formula Short Notes for Final 30-Day Revision', description: 'Consolidate 12 subjects into a 40-page high-yield cheat book.', estimatedHours: 20, priority: 'HIGH', completed: false, category: 'beu_prep' }
          ],
          recommendedResources: [
            { id: 'r-gt-4-1', title: 'Made Easy / ACE Online Test Series Portal', type: 'practice', url: 'https://onlinetestseriesmadeeasy.in', whyUseful: 'Real exam UI simulation with national percentiles.', difficulty: 'Advanced', estimatedTime: '2 months' }
          ]
        }
      ];
    } else if (isAIML) {
      milestones = [
        {
          id: 'ms-ai-1',
          phaseNumber: 1,
          title: 'Phase 1: Python Data Stack & Mathematical Foundations',
          timeframe: 'Month 1 (Weeks 1-4)',
          whyThisStep: 'Machine learning relies directly on Linear Algebra, Matrix transformations, Calculus gradients, and vector math.',
          status: 'in_progress',
          tasks: [
            { id: 't-ai-1-1', title: 'Master Python OOP, Generators, Decorators & Type Hinting', description: 'Build structured clean Python modules.', estimatedHours: 12, priority: 'HIGH', completed: true, category: 'learn' },
            { id: 't-ai-1-2', title: 'NumPy Vectorization, Broadcasting & Pandas Data Wrangling', description: 'Manipulate 100k+ row datasets, clean missing data and merge tables.', estimatedHours: 16, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-ai-1-3', title: 'Revise Linear Algebra (Eigenvalues, Dot Products) & Calculus Gradients', description: 'Understand cost functions and gradient descent derivation.', estimatedHours: 14, priority: 'HIGH', completed: false, category: 'learn' }
          ],
          recommendedResources: [
            { id: 'r-ai-1-1', title: '3Blue1Brown - Essence of Linear Algebra', type: 'video', url: 'https://3blue1brown.com', whyUseful: 'Best geometric intuition for matrices and vectors.', difficulty: 'Beginner', estimatedTime: '6 hours' },
            { id: 'r-ai-1-2', title: 'Kaggle Python & Pandas Micro-Courses', type: 'practice', url: 'https://kaggle.com/learn', whyUseful: 'Interactive browser coding exercises with instant grading.', difficulty: 'Beginner', estimatedTime: '8 hours' }
          ],
          projectIdea: {
            title: 'BEU Student Academic Performance & Exam Grade Predictor',
            description: 'Exploratory Data Analysis and statistical correlation tool predicting semester SGPA based on internal marks.',
            techStack: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Jupyter Notebook']
          }
        },
        {
          id: 'ms-ai-2',
          phaseNumber: 2,
          title: 'Phase 2: Classical Machine Learning & Scikit-Learn Pipelines',
          timeframe: 'Month 2 (Weeks 5-8)',
          whyThisStep: 'Before neural networks, 80% of corporate data science problems are solved with robust tabular models.',
          status: 'upcoming',
          tasks: [
            { id: 't-ai-2-1', title: 'Master Supervised Learning (Linear/Logistic Regression, Decision Trees, Random Forests, XGBoost)', description: 'Tune hyperparameters with GridSearch and cross-validation.', estimatedHours: 20, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-ai-2-2', title: 'Master Model Evaluation Metrics (Confusion Matrix, Precision/Recall, ROC-AUC, F1)', description: 'Understand trade-offs in imbalanced datasets.', estimatedHours: 12, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-ai-2-3', title: 'Build Project: End-to-End Bihar Crop Yield & Weather Risk Prediction', description: 'Train XGBoost model and save pickle pipeline.', estimatedHours: 18, priority: 'HIGH', completed: false, category: 'project' }
          ],
          recommendedResources: [
            { id: 'r-ai-2-1', title: 'Scikit-Learn Official User Guide', type: 'doc', url: 'https://scikit-learn.org', whyUseful: 'Clean API design patterns and mathematical background.', difficulty: 'Intermediate', estimatedTime: '2 weeks' }
          ]
        },
        {
          id: 'ms-ai-3',
          phaseNumber: 3,
          title: 'Phase 3: Deep Learning, Neural Networks & PyTorch',
          timeframe: 'Month 3 (Weeks 9-12)',
          whyThisStep: 'Deep learning is essential for computer vision, natural language understanding, and generative AI.',
          status: 'upcoming',
          tasks: [
            { id: 't-ai-3-1', title: 'Build Multi-Layer Perceptrons & Backpropagation from Scratch in PyTorch', description: 'Implement forward pass, loss calculation, and backward gradients.', estimatedHours: 18, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-ai-3-2', title: 'Convolutional Neural Networks (CNNs) & Transfer Learning (ResNet/EfficientNet)', description: 'Train image classifier on custom dataset with data augmentation.', estimatedHours: 20, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-ai-3-1', title: 'PyTorch Deep Learning Zero to Mastery (Daniel Bourke)', type: 'video', url: 'https://youtube.com', whyUseful: 'Most hands-on PyTorch coding course on the web.', difficulty: 'Intermediate', estimatedTime: '25 hours' }
          ]
        },
        {
          id: 'ms-ai-4',
          phaseNumber: 4,
          title: 'Phase 4: LLMs, RAG Pipelines, Vector DBs & FastAPI Production',
          timeframe: 'Months 4-6 (Weeks 13-24)',
          whyThisStep: 'Modern AI engineers deploy GenAI agents, semantic search RAG systems, and API endpoints.',
          status: 'upcoming',
          tasks: [
            { id: 't-ai-4-1', title: 'Build RAG System using LangChain / LlamaIndex & ChromaDB / Pinecone', description: 'Chunk documents, create embeddings, and query with LLM context grounding.', estimatedHours: 25, priority: 'HIGH', completed: false, category: 'project' },
            { id: 't-ai-4-2', title: 'Serve ML Models via High-Speed FastAPI with Docker Containerization', description: 'Create POST endpoints, async request handling, and Swagger docs.', estimatedHours: 15, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-ai-4-3', title: 'Deploy AI Portfolio on HuggingFace Spaces / Render / Vercel', description: 'Interactive Streamlit or Gradio demo for recruiters.', estimatedHours: 10, priority: 'MEDIUM', completed: false, category: 'project' }
          ],
          recommendedResources: [
            { id: 'r-ai-4-1', title: 'HuggingFace NLP Course (Free)', type: 'doc', url: 'https://huggingface.co/learn', whyUseful: 'World-leading Transformer and tokenization curriculum.', difficulty: 'Advanced', estimatedTime: '3 weeks' }
          ],
          projectIdea: {
            title: 'BEU Exam Syllabus & PYQ Semantic RAG Assistant',
            description: 'AI question answering system that indexes all BEU past papers and answers with exact unit references.',
            techStack: ['Python', 'FastAPI', 'LangChain', 'OpenAI/Gemini API', 'ChromaDB', 'Docker']
          }
        }
      ];
    } else if (isBEUSem) {
      milestones = [
        {
          id: 'ms-beu-1',
          phaseNumber: 1,
          title: 'Phase 1: Syllabus Decomposition & Compulsory Q1 Speed Mastery',
          timeframe: 'Month 1 (Weeks 1-4)',
          whyThisStep: 'Question 1 is compulsory (7 x 2 = 14 Marks). Scoring 14/14 in Q1 guarantees a passing baseline and builds immediate confidence.',
          status: 'in_progress',
          tasks: [
            { id: 't-beu-1-1', title: 'Download Official BEU Syllabus & Mark High-Weightage Units (Units 2, 3, 4)', description: 'Catalog all 5 subjects and identify recurring theoretical concepts.', estimatedHours: 6, priority: 'HIGH', completed: true, category: 'beu_prep' },
            { id: 't-beu-1-2', title: 'Create Compulsory Q1 2-Mark Flashcard Notebook for All 5 Subjects', description: 'Write crisp 3-line definitions with formula and standard SI units.', estimatedHours: 12, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-beu-1-3', title: 'Solve 2021, 2022, 2023, 2024 Q1 Collections from BEU PYQ Analyzer', description: 'Practice 2-minute timed speed drills.', estimatedHours: 10, priority: 'HIGH', completed: false, category: 'beu_prep' }
          ],
          recommendedResources: [
            { id: 'r-beu-1-1', title: 'BEU Connect Hub PYQ Pattern Analyzer', type: 'beu_pyq', url: '#', whyUseful: 'Instant topic frequency breakdown for your branch and semester.', difficulty: 'Beginner', estimatedTime: 'Ongoing' }
          ]
        },
        {
          id: 'ms-beu-2',
          phaseNumber: 2,
          title: 'Phase 2: High-Yield 14-Mark Derivations & Neat Diagram Architecture',
          timeframe: 'Month 2 (Weeks 5-8)',
          whyThisStep: 'BEU evaluators award 12-14 marks for structured answers with clean circuit/flow diagrams, step-by-step derivations, and neat tables.',
          status: 'upcoming',
          tasks: [
            { id: 't-beu-2-1', title: 'Master All Standard 14-Mark Derivations in Unit 2 & 3', description: 'Write derivations 3 times by hand without looking at notes.', estimatedHours: 20, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-beu-2-2', title: 'Practice Clean Pencil Diagrams, Block Charts & Timing Waveforms', description: 'Label all pinouts, axis variables, and state transitions clearly.', estimatedHours: 12, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-beu-2-3', title: 'Format 5-Page Standard Answer Blueprint (Intro → Diagram → Derivation → Numerical → Conclusion)', description: 'Adopt high-scoring topper presentation framework.', estimatedHours: 6, priority: 'MEDIUM', completed: false, category: 'learn' }
          ],
          recommendedResources: [
            { id: 'r-beu-2-1', title: 'BEU Verified Topper Notes (BEU Connect Hub)', type: 'doc', url: '#', whyUseful: 'Clean handwritten diagrams and university format answers.', difficulty: 'Intermediate', estimatedTime: '2 weeks' }
          ]
        },
        {
          id: 'ms-beu-3',
          phaseNumber: 3,
          title: 'Phase 3: 5-Year PYQ Full Simulation & Lab Practical Viva Prep',
          timeframe: 'Month 3 (Weeks 9-12)',
          whyThisStep: 'Full 3-hour mock exam simulations under timed conditions eliminate last-minute exam panic and ensure 8.5+ SGPA.',
          status: 'upcoming',
          tasks: [
            { id: 't-beu-3-1', title: 'Write 3 Full 70-Mark Mock Papers per Subject in Official 32-Page Booklet Format', description: 'Manage 3-hour time allocation (30 min Q1, 35 min each for 4 long questions).', estimatedHours: 25, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-beu-3-2', title: 'Prepare Lab Manuals & Master Practical Viva Questions with External Examiner Mindset', description: 'Revise apparatus specifications, error calculations, and safety rules.', estimatedHours: 10, priority: 'HIGH', completed: false, category: 'beu_prep' },
            { id: 't-beu-3-3', title: 'Final 48-Hour Ultra-High-Yield Formula & Theorem Revision Sheet', description: 'One 4-page laminated formula cheat sheet per subject.', estimatedHours: 8, priority: 'HIGH', completed: false, category: 'beu_prep' }
          ],
          recommendedResources: [
            { id: 'r-beu-3-1', title: 'BEU Connect Hub Senior Mentorship Viva Q&A Bank', type: 'practice', url: '#', whyUseful: 'Frequently asked viva questions by visiting external BEU examiners.', difficulty: 'Intermediate', estimatedTime: '1 week' }
          ]
        }
      ];
    } else if (isGovt) {
      milestones = [
        {
          id: 'ms-gov-1',
          phaseNumber: 1,
          title: 'Phase 1: Core Branch Technical Foundations & Formulas',
          timeframe: 'Months 1-3',
          whyThisStep: 'BPSC AE Paper 5 & 6 test fundamental engineering depth and standard formulas with negative marking.',
          status: 'in_progress',
          tasks: [
            { id: 't-gov-1-1', title: 'Master Core Engineering Concepts (Strength of Materials / Networks / Fluid Mechanics)', description: 'Solve 100 objective questions per chapter.', estimatedHours: 40, priority: 'HIGH', completed: true, category: 'learn' },
            { id: 't-gov-1-2', title: 'Memorize Standard IS Codes & IRC Guidelines (for Civil/Mech/EE)', description: 'Create formula sheets for concrete grades, steel limits, and circuit theorems.', estimatedHours: 20, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-gov-1-1', title: 'BPSC AE Previous 10-Year Solved Papers (Youth Competition)', type: 'practice', url: '#', whyUseful: 'Exact question repeat patterns for Bihar State Engineering Services.', difficulty: 'Intermediate', estimatedTime: '1 month' }
          ]
        },
        {
          id: 'ms-gov-2',
          phaseNumber: 2,
          title: 'Phase 2: General Studies, Bihar Special GK & Current Affairs',
          timeframe: 'Months 4-6',
          whyThisStep: 'General Studies paper determines the qualifying cut-off before technical papers are evaluated.',
          status: 'upcoming',
          tasks: [
            { id: 't-gov-2-1', title: 'Study Bihar History, Geography, River Systems, Economy & Budget', description: 'Read Imtiaz Ahmad Bihar Special GK or Crown Bihar GK.', estimatedHours: 30, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-gov-2-2', title: 'Solve 500 Modern Indian History & Indian Polity MCQs', description: 'Focus on Fundamental Rights, Articles, and Bihar Freedom Fighters.', estimatedHours: 20, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-gov-2-1', title: 'Bihar Special GK & Current Affairs Digest', type: 'doc', url: '#', whyUseful: 'Targeted state exam general studies compilation.', difficulty: 'Intermediate', estimatedTime: '3 weeks' }
          ]
        },
        {
          id: 'ms-gov-3',
          phaseNumber: 3,
          title: 'Phase 3: Conventional Subjective Mains Practice & Full Mock Series',
          timeframe: 'Months 7-12',
          whyThisStep: 'Writing speed and numerical precision in Mains determine merit list rank and department allotment (WRD vs RWD vs BCD).',
          status: 'upcoming',
          tasks: [
            { id: 't-gov-3-1', title: 'Practice 50 Conventional Mains Engineering Problems by Hand', description: 'Step-by-step units, assumptions, and calculation steps.', estimatedHours: 45, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-gov-3-2', title: 'Attempt 15 Full-Length BPSC AE Mock Tests with Negative Marking Analysis', description: 'Achieve 75%+ score consistently.', estimatedHours: 35, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-gov-3-1', title: 'BPSC AE Test Series Portal', type: 'practice', url: '#', whyUseful: 'Simulate exact BPSC AE examination pattern.', difficulty: 'Advanced', estimatedTime: '2 months' }
          ]
        }
      ];
    } else if (isCybersecurity) {
      milestones = [
        {
          id: 'ms-sec-1',
          phaseNumber: 1,
          title: 'Phase 1: Linux CLI, Networking Fundamentals & Protocol Analysis',
          timeframe: 'Month 1 (Weeks 1-4)',
          whyThisStep: 'You cannot defend or exploit what you do not understand. Networking and Linux are the bedrock of security engineering.',
          status: 'in_progress',
          tasks: [
            { id: 't-sec-1-1', title: 'Master Linux Terminal Commands, Permissions, Bash Scripting & SSH', description: 'Configure custom Debian/Kali environment and write automations.', estimatedHours: 15, priority: 'HIGH', completed: true, category: 'learn' },
            { id: 't-sec-1-2', title: 'Deep Dive into TCP/IP, DNS, DHCP, TLS Handshake & Packet Capture with Wireshark', description: 'Analyze PCAP files and filter HTTP/DNS payloads.', estimatedHours: 18, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-sec-1-1', title: 'OverTheWire: Bandit (Linux Security Wargame)', type: 'practice', url: 'https://overthewire.org', whyUseful: 'Interactive command-line hacking game for learning Linux security.', difficulty: 'Beginner', estimatedTime: '10 hours' }
          ]
        },
        {
          id: 'ms-sec-2',
          phaseNumber: 2,
          title: 'Phase 2: Web Application Security & OWASP Top 10 Exploits',
          timeframe: 'Months 2-3 (Weeks 5-12)',
          whyThisStep: 'Web vulnerabilities (SQLi, XSS, CSRF, IDOR, SSRF) form 90% of beginner bug bounties and application security roles.',
          status: 'upcoming',
          tasks: [
            { id: 't-sec-2-1', title: 'Master Burp Suite Proxy, Repeater, Intruder & Decoder', description: 'Intercept requests, modify headers, and fuzz parameters.', estimatedHours: 16, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-sec-2-2', title: 'Solve 30 PortSwigger Web Security Academy Labs (SQLi, XSS, Auth Bypass)', description: 'Complete practical vulnerable application labs.', estimatedHours: 25, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-sec-2-1', title: 'PortSwigger Web Security Academy (Free)', type: 'practice', url: 'https://portswigger.net/web-security', whyUseful: 'Industry-standard free training created by the makers of Burp Suite.', difficulty: 'Intermediate', estimatedTime: '4 weeks' }
          ],
          projectIdea: {
            title: 'Automated Web Vulnerability Scanner & Security Header Auditor',
            description: 'Python CLI tool that checks target domains for missing security headers, open ports, and common misconfigurations.',
            techStack: ['Python', 'Requests', 'BeautifulSoup', 'Nmap API', 'Docker']
          }
        },
        {
          id: 'ms-sec-3',
          phaseNumber: 3,
          title: 'Phase 3: SOC Operations, SIEM Analysis & Junior Security Cert Prep',
          timeframe: 'Months 4-6 (Weeks 13-24)',
          whyThisStep: 'Junior cyber jobs in India (SOC L1 Analyst) focus on log analysis (Splunk/ELK), alert triage, and incident response.',
          status: 'upcoming',
          tasks: [
            { id: 't-sec-3-1', title: 'Complete TryHackMe SOC Level 1 Learning Path (Splunk, Wireshark, Snort)', description: 'Investigate simulated ransomware and phishing attacks in virtual labs.', estimatedHours: 35, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-sec-3-2', title: 'Publish Security Writeups on Medium / GitHub & Prepare for CEH / Security+', description: 'Demonstrate methodology and responsible disclosure practices.', estimatedHours: 15, priority: 'HIGH', completed: false, category: 'project' }
          ],
          recommendedResources: [
            { id: 'r-sec-3-1', title: 'TryHackMe SOC Level 1 Path', type: 'practice', url: 'https://tryhackme.com', whyUseful: 'Hands-on guided cybersecurity labs in cloud browser.', difficulty: 'Intermediate', estimatedTime: '1 month' }
          ]
        }
      ];
    } else if (isStartup) {
      milestones = [
        {
          id: 'ms-stu-1',
          phaseNumber: 1,
          title: 'Phase 1: Problem Discovery, Student Interviews & Problem Validation',
          timeframe: 'Month 1 (Weeks 1-4)',
          whyThisStep: '90% of student startups fail because they build something nobody actually wants. Customer discovery comes before coding.',
          status: 'in_progress',
          tasks: [
            { id: 't-stu-1-1', title: 'Conduct 25 In-Person Problem Interviews with BEU Engineering Students', description: 'Ask open-ended questions about academic pain points without pitching the solution.', estimatedHours: 15, priority: 'HIGH', completed: true, category: 'learn' },
            { id: 't-stu-1-2', title: 'Fill 1-Page Lean Canvas & Competitive Landscape Map', description: 'Define Unique Value Proposition, Unfair Advantage, and Revenue Streams.', estimatedHours: 8, priority: 'HIGH', completed: false, category: 'learn' }
          ],
          recommendedResources: [
            { id: 'r-stu-1-1', title: 'The Mom Test by Rob Fitzpatrick (Book/Summary)', type: 'doc', url: 'http://momtestbook.com', whyUseful: 'How to talk to customers and learn if your business is a good idea.', difficulty: 'Beginner', estimatedTime: '4 hours' }
          ]
        },
        {
          id: 'ms-stu-2',
          phaseNumber: 2,
          title: 'Phase 2: Rapid MVP Prototype, System Architecture & User Testing',
          timeframe: 'Months 2-3 (Weeks 5-12)',
          whyThisStep: 'Launch an ultra-focused prototype with just 1 killer feature in under 4 weeks to test real usage behavior.',
          status: 'upcoming',
          tasks: [
            { id: 't-stu-2-1', title: 'Build and Deploy Functional SaaS MVP with React, Supabase & TailwindCSS', description: 'Focus exclusively on the primary core value proposition.', estimatedHours: 40, priority: 'HIGH', completed: false, category: 'project' },
            { id: 't-stu-2-2', title: 'Onboard First 50 Active Beta Users across 3 BEU Engineering Colleges', description: 'Observe user drop-off with PostHog or Google Analytics.', estimatedHours: 20, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-stu-2-1', title: 'Y Combinator Startup School (Free)', type: 'video', url: 'https://startupschool.org', whyUseful: 'World-class startup curriculum on how to launch and get users.', difficulty: 'Intermediate', estimatedTime: '15 hours' }
          ],
          projectIdea: {
            title: 'Campus Peer Micro-Services & Automated Study Note Exchange',
            description: 'Functional student marketplace with instant verification, UPI payment gateway, and campus leaderboard.',
            techStack: ['Next.js', 'TailwindCSS', 'Supabase', 'Razorpay API', 'Vercel']
          }
        },
        {
          id: 'ms-stu-3',
          phaseNumber: 3,
          title: 'Phase 3: Pitch Deck & Bihar Startup Policy ₹10 Lakh Grant Application',
          timeframe: 'Months 4-6 (Weeks 13-24)',
          whyThisStep: 'The Department of Industries Government of Bihar provides ₹10 Lakhs seed funding with zero equity for registered student startups.',
          status: 'upcoming',
          tasks: [
            { id: 't-stu-3-1', title: 'Prepare 10-Slide Pitch Deck (Problem, Solution, Market Size, Traction, Financials)', description: 'Highlight active student user metrics and retention rate.', estimatedHours: 15, priority: 'HIGH', completed: false, category: 'project' },
            { id: 't-stu-3-2', title: 'Apply for Bihar Startup Policy Grant on startup.bihar.gov.in', description: 'Submit DPIIT recognition, pitch video, and college incubator recommendation.', estimatedHours: 12, priority: 'HIGH', completed: false, category: 'beu_prep' }
          ],
          recommendedResources: [
            { id: 'r-stu-3-1', title: 'Bihar Startup Portal (startup.bihar.gov.in)', type: 'doc', url: 'https://startup.bihar.gov.in', whyUseful: 'Official Bihar Government Seed Grant application guidelines.', difficulty: 'Intermediate', estimatedTime: '1 week' }
          ]
        }
      ];
    } else {
      // Dynamic Adaptive Roadmap for Custom Goals
      milestones = [
        {
          id: `ms-dyn-1`,
          phaseNumber: 1,
          title: `Phase 1: Prerequisites & Foundation Theory for ${goalTitle}`,
          timeframe: 'Month 1 (Weeks 1-4)',
          whyThisStep: `Establish fundamental technical competencies and core principles required for ${goalTitle}.`,
          status: 'in_progress',
          tasks: [
            { id: 't-dyn-1-1', title: `Study Fundamental Concepts & Core Architecture of ${goalTitle}`, description: 'Read authoritative documentation and set up working environment.', estimatedHours: 14, priority: 'HIGH', completed: true, category: 'learn' },
            { id: 't-dyn-1-2', title: 'Complete 15 Guided Drills & Practical Exercises', description: 'Solve baseline hands-on exercises to build muscle memory.', estimatedHours: 18, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-dyn-1-3', title: `BEU Syllabus Connect: Align with ${branch} Semester ${semester} Curriculum`, description: 'Ensure university theoretical concepts are reinforced alongside practical learning.', estimatedHours: 8, priority: 'MEDIUM', completed: false, category: 'beu_prep' }
          ],
          recommendedResources: [
            { id: 'r-dyn-1-1', title: `${goalTitle} Official Documentation & Reference Manual`, type: 'doc', url: 'https://developer.mozilla.org', whyUseful: 'Authoritative reference and best practices.', difficulty: 'Beginner', estimatedTime: '2 weeks' }
          ]
        },
        {
          id: `ms-dyn-2`,
          phaseNumber: 2,
          title: `Phase 2: Applied Skills, Real Project Implementation & Drills`,
          timeframe: 'Months 2-3 (Weeks 5-12)',
          whyThisStep: `Apply learned theory into a complete, standalone working system with real data.`,
          status: 'upcoming',
          tasks: [
            { id: 't-dyn-2-1', title: `Build Intermediate Working Prototype for ${goalTitle}`, description: 'Implement end-to-end features with error handling and documentation.', estimatedHours: 25, priority: 'HIGH', completed: false, category: 'project' },
            { id: 't-dyn-2-2', title: 'Solve 25 High-Yield Practice Problems / Exam Questions', description: 'Deepen problem solving speed and edge-case handling.', estimatedHours: 20, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-dyn-2-1', title: 'BEU Connect Hub Verified Resource Bank', type: 'doc', url: '#', whyUseful: 'Curated university notes and exam pattern guides.', difficulty: 'Intermediate', estimatedTime: '1 week' }
          ],
          projectIdea: {
            title: `Practical Implementation Capstone for ${goalTitle}`,
            description: `A production-ready solution addressing core technical challenges in ${goalTitle} with clean documentation.`,
            techStack: [branch, 'Full Implementation', 'Clean Architecture', 'Testing']
          }
        },
        {
          id: `ms-dyn-3`,
          phaseNumber: 3,
          title: `Phase 3: Portfolio Deployment, Mock Evaluations & Final Target Achievement`,
          timeframe: 'Months 4-6 (Weeks 13-24)',
          whyThisStep: `Package your outcomes into a compelling showcase for recruiters, evaluators, or university boards.`,
          status: 'upcoming',
          tasks: [
            { id: 't-dyn-3-1', title: 'Deploy Live Project / Submit Final Technical Report', description: 'Host code repository on GitHub with interactive demo links and benchmarks.', estimatedHours: 15, priority: 'HIGH', completed: false, category: 'project' },
            { id: 't-dyn-3-2', title: 'Simulate Final Target Assessment (Mock Interview / Exam Series)', description: 'Evaluate weak areas and refine performance under real testing conditions.', estimatedHours: 18, priority: 'HIGH', completed: false, category: 'practice' }
          ],
          recommendedResources: [
            { id: 'r-dyn-3-1', title: 'BEU Senior Mentor 1-on-1 Review Session', type: 'practice', url: '#', whyUseful: 'Get feedback from placed seniors and university alumni.', difficulty: 'Advanced', estimatedTime: '45 mins' }
          ]
        }
      ];
    }

    // 3. BEU Academic Context Mapping
    const beuAcademicContext = {
      relevantSubjects: isFullStack
        ? ['Data Structures & Algorithms (CS301)', 'DBMS (CS401)', 'Operating Systems (CS402)', 'Web Technologies (CS501)']
        : isGate
        ? ['Engineering Maths', 'Theory of Computation', 'Computer Networks', 'Algorithms', 'COA']
        : isAIML
        ? ['AI & Machine Learning (CS601)', 'Probability & Statistics', 'Numerical Methods', 'Data Mining']
        : isBEUSem
        ? [`${branch} Semester ${semester} Core Subjects`, 'Compulsory Q1 Collections', 'Lab Practical Vivas']
        : isGovt
        ? [`${branch} Core Engineering Paper 5 & 6`, 'General Studies & Bihar GK', 'BPSC AE Previous Papers']
        : isCybersecurity
        ? ['Computer Networks (CS502)', 'Cyber Security & Cryptography', 'Linux Administration']
        : isStartup
        ? ['Entrepreneurship & IP Rights', 'Software Engineering (CS403)', 'Bihar Startup Policy']
        : [`${branch} Semester ${semester} Curriculum`, 'Departmental Labs & Engineering Practices'],
      highYieldUnits: ['Unit 2 (Core Models)', 'Unit 3 (14-Mark High-Yield Derivations)', 'Unit 4 (Algorithms/Circuits)'],
      examPatternFocus: 'Balanced daily practical drills with BEU 70-Mark Theory pattern so your SGPA stays distinction-grade while preparing for career milestones.'
    };

    // 4. Calculate Initial Progress
    let totalTasks = 0;
    let completedTasks = 0;
    milestones.forEach(m => {
      m.tasks.forEach(t => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });

    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const goalMap: GoalMap = {
      id: `gm-${Date.now()}`,
      userId,
      goalTitle,
      category,
      targetOutcome: targetOutcome || `Successfully achieve mastery in ${goalTitle} with high-yield milestones.`,
      targetDeadline: targetDeadline || '6 Months',
      createdAt: 'Just now',
      progressPercent,
      streakDays: 3,
      studentProfile: {
        branch: branch || 'CSE',
        semester: semester || 3,
        currentLevel,
        existingSkills: existingSkills.length > 0 ? existingSkills : ['Basic Programming'],
        hoursDaily: hoursDaily || 3,
        learningPreference: learningPreference.length > 0 ? learningPreference : ['Videos', 'Projects', 'Practice']
      },
      gapAnalysis: {
        alreadyLearned: alreadyLearned.length > 0 ? alreadyLearned : ['Basic Logic & C/C++'],
        inProgress: skillGap.slice(0, 2),
        skillGap,
        highPriority,
        mediumPriority
      },
      beuAcademicContext,
      milestones,
      healthCheck: {
        status: 'ON_TRACK',
        summary: `Your GoalMap is calibrated for ${hoursDaily || 3} hours/day over ${targetDeadline || '6 Months'}. You are on track for Phase 1.`,
        suggestions: [
          'Maintain a minimum 4-day active weekly study streak.',
          'Complete Phase 1 tasks before moving to complex advanced modules.',
          'Solve BEU compulsory Q1 questions on weekends to keep academic CGPA strong.'
        ]
      }
    };

    return goalMap;
  },

  /**
   * AI Goal Mentor: Answers questions grounded in the student's active GoalMap in English, Hindi, or Hinglish
   */
  askGoalMentor: (query: string, activeGoalMap: GoalMap): { answer: string; suggestedAction?: string } => {
    const lower = query.toLowerCase();

    // 1. Why should I learn this?
    if (lower.includes('why') || lower.includes('purpose') || lower.includes('reason') || lower.includes('kyu') || lower.includes('kyun')) {
      const currentMilestone = activeGoalMap.milestones.find(m => m.status === 'in_progress') || activeGoalMap.milestones[0];
      return {
        answer: `### 🎯 Why This Step in Your GoalMap?
For your goal of **"${activeGoalMap.goalTitle}"**, your current active phase is: **${currentMilestone?.title}**.

**Reasoning & Strategic Value**:
${currentMilestone?.whyThisStep || 'This milestone builds the foundational prerequisites required to solve complex problems and pass technical evaluations.'}

**Industry & BEU Insight**:
In tech interviews and BEU examinations, candidates who rush into advanced frameworks without mastering fundamentals struggle with debugging and fail to explain architectural trade-offs in technical vivas.`,
        suggestedAction: 'Focus on completing the action items in this phase first.'
      };
    }

    // 2. What should I study today? / Daily task
    if (lower.includes('today') || lower.includes('what should i do') || lower.includes('next') || lower.includes('aaj') || lower.includes('kya padhu') || lower.includes('kya karu')) {
      const currentMilestone = activeGoalMap.milestones.find(m => m.status === 'in_progress') || activeGoalMap.milestones[0];
      const nextTask = currentMilestone?.tasks.find(t => !t.completed) || currentMilestone?.tasks[0];

      return {
        answer: `### 📋 Your Immediate Action Plan for Today:
Based on your **${activeGoalMap.studentProfile.hoursDaily} hrs/day** schedule for **${activeGoalMap.goalTitle}**:

**Priority Task**: 📌 **${nextTask?.title || 'Review core concepts'}**
• **Estimated Time**: ${nextTask?.estimatedHours || 2} Hours
• **Priority**: 🔴 ${nextTask?.priority || 'HIGH'}
• **Action Details**: ${nextTask?.description || 'Follow recommended resources and practice coding drills.'}

💡 **BEU Mentor Tip**:
Spend the first 40% of your time (${Math.round((activeGoalMap.studentProfile.hoursDaily * 60) * 0.4)} mins) reviewing the theory/documentation, and the remaining 60% writing code or solving numerical problems.`,
        suggestedAction: `Complete task: "${nextTask?.title}"`
      };
    }

    // 3. I am stuck / Hard concept / Doubts
    if (lower.includes('stuck') || lower.includes('confused') || lower.includes('difficult') || lower.includes('hard') || lower.includes('fas gaya') || lower.includes('samajh nahi') || lower.includes('doubt')) {
      return {
        answer: `### 🛠️ Don't Panic — Step-by-Step Unblocking Protocol:
1. **Break it Down**: Isolate the exact sub-topic that feels confusing into a 15-minute chunk.
2. **Consult Recommended Resources**: Check the verified documentation link in your active milestone card.
3. **Write a Minimal Working Example**: Create a tiny 10-line test script or solve a simple base-case numerical rather than abstract theory.
4. **Connect with a BEU Senior Mentor**: Request a quick 1-on-1 session with a placed 4th-year senior from your college via the Mentorship tab.`,
        suggestedAction: 'Check the milestone curated resources or book a mentor session.'
      };
    }

    // 4. Semester exam is near / Academic clash
    if (lower.includes('exam') || lower.includes('semester') || lower.includes('backlog') || lower.includes('cgpa') || lower.includes('paper') || lower.includes('end sem')) {
      return {
        answer: `### 📚 BEU Academic Balancing Strategy:
Your BEU semester exams are vital — avoiding backlogs protects your eligibility for placement drives and GATE!

**Recommended 20-Day Time Split**:
• **70% Time (Academic)**: Focus on Unit 2, 3, and 4 (which carry ~52% of BEU theory weightage) and past 5-year PYQs.
• **30% Time (GoalMap)**: Maintain your career streak with just 1 problem or 30 minutes of revision daily.

We recommend solving previous year 14-mark derivations by hand on weekends to secure university distinction!`,
        suggestedAction: 'Prioritize BEU PYQ preparation for the upcoming weeks.'
      };
    }

    // 5. Suggest project / Portfolio
    if (lower.includes('project') || lower.includes('build') || lower.includes('idea') || lower.includes('portfolio') || lower.includes('resume')) {
      const currentMilestone = activeGoalMap.milestones.find(m => m.status === 'in_progress') || activeGoalMap.milestones[0];
      const idea = currentMilestone?.projectIdea;

      return {
        answer: `### 💡 Recommended Resume-Worthy Project for Phase ${currentMilestone?.phaseNumber || 1}:
**Project Title**: 🚀 **${idea?.title || 'BEU Collaborative Academic Workspace'}**

• **Description**: ${idea?.description || 'A full-stack web platform solving real university communication and academic resource sharing.'}
• **Tech Stack**: ${idea?.techStack?.join(', ') || 'React, Node.js, Express, PostgreSQL, TailwindCSS'}
• **Why Recruiters & Evaluators Love This**: Demonstrates practical problem-solving, clean database architecture, and authentication rather than a standard generic tutorial clone!`,
        suggestedAction: 'Start by wireframing the user flow and drafting the database schema.'
      };
    }

    // 6. Interview & Placement questions
    if (lower.includes('interview') || lower.includes('placement') || lower.includes('viva') || lower.includes('job') || lower.includes('internship') || lower.includes('off campus')) {
      return {
        answer: `### 💼 Placement & Viva Readiness Tips:
For **${activeGoalMap.goalTitle}**:
1. **Explain the "Why"**: Recruiters test if you understand the architectural trade-offs, not just memorized syntax.
2. **Project Deep Dive**: Be ready to answer: "What was the most challenging bug you encountered in this project, and how did you resolve it?"
3. **Core CS Fundamentals**: Revise DBMS ACID properties, Operating System virtual memory/deadlocks, and OOP principles.
4. **Behavioral STAR Technique**: Prepare concise examples of team collaboration, handling deadlines, and resolving technical disagreements.`,
        suggestedAction: 'Schedule a peer mock interview on BEU Connect Hub.'
      };
    }

    // Default intelligent mentor response
    return {
      answer: `### 🤖 BEU AI Goal Mentor Analysis
Regarding your question for **${activeGoalMap.goalTitle}** (${activeGoalMap.studentProfile.branch} Sem ${activeGoalMap.studentProfile.semester}):

• **Current Progress**: **${activeGoalMap.progressPercent}%** completed across **${activeGoalMap.milestones.length} Phases**.
• **Daily Commitment**: **${activeGoalMap.studentProfile.hoursDaily} hrs/day** targeting **${activeGoalMap.targetDeadline}**.
• **Immediate Focus**: Advancing through **${activeGoalMap.milestones.find(m => m.status === 'in_progress')?.title || 'Phase 1'}**.

**Quick Things You Can Ask Me**:
1. *"What should I study today?"* → Get immediate daily task drills.
2. *"Why should I learn this milestone?"* → Understand industry and exam relevance.
3. *"Semester exam is in 20 days"* → Get automated time-budget balancing advice.
4. *"Suggest a capstone project"* → Get full resume-ready project blueprints!`,
      suggestedAction: 'Pick the next pending task in your active phase and complete it today.'
    };
  }
};
