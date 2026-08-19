import {
  User, College, Branch, Subject, SyllabusTopic, PYQ, PYQAnalysis,
  Note, StudyVideo, Post, Community, Conversation, Message,
  Project, MentorProfile, Opportunity, Notice, AppNotification,
  Report, KnowledgeNode, StudyPlanTask, GoalMap
} from '../types';

export const MOCK_COLLEGES: College[] = [
  {
    id: 'mit-muz',
    name: 'Muzaffarpur Institute of Technology (MIT)',
    code: '101',
    location: 'Muzaffarpur, Bihar',
    established: 1954,
    type: 'Government',
    branches: ['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT']
  },
  {
    id: 'bce-bhag',
    name: 'Bhagalpur College of Engineering (BCE)',
    code: '102',
    location: 'Bhagalpur, Bihar',
    established: 1960,
    type: 'Government',
    branches: ['CSE', 'ECE', 'EE', 'ME', 'CE']
  },
  {
    id: 'bce-bakh',
    name: 'Bakhtiyarpur College of Engineering (BCE)',
    code: '103',
    location: 'Patna, Bihar',
    established: 2016,
    type: 'Government',
    branches: ['CSE', 'ECE', 'EE', 'CE']
  },
  {
    id: 'gce-gaya',
    name: 'Gaya College of Engineering (GCE)',
    code: '104',
    location: 'Gaya, Bihar',
    established: 2008,
    type: 'Government',
    branches: ['CSE', 'ECE', 'EE', 'ME', 'CE']
  },
  {
    id: 'dce-darb',
    name: 'Darbhanga College of Engineering (DCE)',
    code: '105',
    location: 'Darbhanga, Bihar',
    established: 2008,
    type: 'Government',
    branches: ['CSE', 'ECE', 'EE', 'ME', 'CE']
  },
  {
    id: 'lnjpit-chhap',
    name: 'Loknayak Jai Prakash Institute of Technology (LNJPIT)',
    code: '106',
    location: 'Chhapra, Bihar',
    established: 2012,
    type: 'Government',
    branches: ['CSE', 'ECE', 'EE', 'ME', 'CE']
  },
  {
    id: 'mce-moti',
    name: 'Motihari College of Engineering (MCE)',
    code: '107',
    location: 'Motihari, Bihar',
    established: 1980,
    type: 'Government',
    branches: ['CSE', 'ECE', 'EE', 'ME', 'CE']
  },
  {
    id: 'nce-chandi',
    name: 'Nalanda College of Engineering (NCE)',
    code: '108',
    location: 'Chandi, Nalanda',
    established: 2008,
    type: 'Government',
    branches: ['CSE', 'ECE', 'EE', 'CE']
  }
];

export const MOCK_BRANCHES: Branch[] = [
  { id: 'cse', name: 'Computer Science & Engineering', code: 'CSE', semesters: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 'ece', name: 'Electronics & Communication Engineering', code: 'ECE', semesters: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 'ee', name: 'Electrical Engineering', code: 'EE', semesters: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 'me', name: 'Mechanical Engineering', code: 'ME', semesters: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 'ce', name: 'Civil Engineering', code: 'CE', semesters: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 'it', name: 'Information Technology', code: 'IT', semesters: [1, 2, 3, 4, 5, 6, 7, 8] }
];

export const MOCK_SUBJECTS: Subject[] = [
  // 3rd Sem CSE
  {
    id: 'cse-301',
    branchCode: 'CSE',
    semester: 3,
    name: 'Data Structures & Algorithms',
    code: 'PCC-CS301',
    credits: 4,
    description: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting, Searching, and Asymptotic Complexity.',
    unitsCount: 5
  },
  {
    id: 'cse-302',
    branchCode: 'CSE',
    semester: 3,
    name: 'Object Oriented Programming with C++',
    code: 'PCC-CS302',
    credits: 3,
    description: 'Classes, Objects, Inheritance, Polymorphism, Encapsulation, Templates, and Exception Handling.',
    unitsCount: 5
  },
  {
    id: 'cse-303',
    branchCode: 'CSE',
    semester: 3,
    name: 'Digital Electronics',
    code: 'ESC-301',
    credits: 3,
    description: 'Number systems, Boolean algebra, Combinational circuits, Sequential circuits, Flip-flops, Counters.',
    unitsCount: 5
  },
  {
    id: 'cse-304',
    branchCode: 'CSE',
    semester: 3,
    name: 'Discrete Mathematics',
    code: 'BSC-301',
    credits: 4,
    description: 'Set theory, Relations, Functions, Propositional logic, Graphs, Trees, Combinatorics.',
    unitsCount: 5
  },
  {
    id: 'cse-305',
    branchCode: 'CSE',
    semester: 3,
    name: 'Computer Organization & Architecture',
    code: 'PCC-CS303',
    credits: 3,
    description: 'Instruction set architecture, ALU design, Pipelining, Memory hierarchy, Cache, I/O interfacing.',
    unitsCount: 5
  },
  // 4th Sem CSE
  {
    id: 'cse-401',
    branchCode: 'CSE',
    semester: 4,
    name: 'Database Management Systems',
    code: 'PCC-CS401',
    credits: 4,
    description: 'Relational model, SQL, Normalization (1NF to BCNF), Transaction processing, Concurrency, Indexing.',
    unitsCount: 5
  },
  {
    id: 'cse-402',
    branchCode: 'CSE',
    semester: 4,
    name: 'Operating Systems',
    code: 'PCC-CS402',
    credits: 4,
    description: 'Process management, CPU scheduling, Synchronization, Deadlocks, Memory management, Paging, Virtual Memory.',
    unitsCount: 5
  },
  {
    id: 'cse-403',
    branchCode: 'CSE',
    semester: 4,
    name: 'Design & Analysis of Algorithms',
    code: 'PCC-CS403',
    credits: 4,
    description: 'Divide & Conquer, Greedy method, Dynamic Programming, Backtracking, Branch & Bound, NP-Completeness.',
    unitsCount: 5
  },
  {
    id: 'cse-404',
    branchCode: 'CSE',
    semester: 4,
    name: 'Formal Language & Automata Theory',
    code: 'PCC-CS404',
    credits: 3,
    description: 'DFA, NFA, Regular Expressions, Context-Free Grammars, Pushdown Automata, Turing Machines.',
    unitsCount: 5
  },
  // 5th Sem CSE
  {
    id: 'cse-501',
    branchCode: 'CSE',
    semester: 5,
    name: 'Computer Networks',
    code: 'PCC-CS501',
    credits: 4,
    description: 'OSI model, TCP/IP, Data link protocols, Routing algorithms, Congestion control, Application layer.',
    unitsCount: 5
  },
  {
    id: 'cse-502',
    branchCode: 'CSE',
    semester: 5,
    name: 'Compiler Design',
    code: 'PCC-CS502',
    credits: 3,
    description: 'Lexical analysis, Syntax analysis, LL/LR Parsing, Intermediate code generation, Code optimization.',
    unitsCount: 5
  },
  // ECE Subjects
  {
    id: 'ece-301',
    branchCode: 'ECE',
    semester: 3,
    name: 'Signals & Systems',
    code: 'PCC-EC301',
    credits: 4,
    description: 'Continuous & discrete time signals, LTI systems, Fourier transform, Laplace transform, Z-transform.',
    unitsCount: 5
  },
  {
    id: 'ece-302',
    branchCode: 'ECE',
    semester: 3,
    name: 'Analog Electronic Circuits',
    code: 'PCC-EC302',
    credits: 4,
    description: 'BJT and MOSFET amplifiers, Frequency response, Feedback amplifiers, Op-amps and oscillators.',
    unitsCount: 5
  }
];

export const MOCK_SYLLABUS_TOPICS: SyllabusTopic[] = [
  // DSA (cse-301)
  {
    id: 'dsa-1-1',
    subjectId: 'cse-301',
    unit: 1,
    unitTitle: 'Introduction & Arrays',
    topic: 'Asymptotic Notations (Big-O, Omega, Theta)',
    description: 'Formal definitions, time and space complexity calculation, best/worst/average case analysis.',
    hours: 4,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dsa-1-2',
    subjectId: 'cse-301',
    unit: 1,
    unitTitle: 'Introduction & Arrays',
    topic: 'Array Operations & Sparse Matrices',
    description: 'Row-major and column-major address calculation, representation of 2D/3D arrays and sparse matrix addition.',
    hours: 3,
    important: true,
    pyqFrequency: 'Medium'
  },
  {
    id: 'dsa-2-1',
    subjectId: 'cse-301',
    unit: 2,
    unitTitle: 'Linked Lists & Stacks',
    topic: 'Singly, Doubly & Circular Linked Lists',
    description: 'Insertion, deletion, traversal, and polynomial representation using linked list.',
    hours: 5,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dsa-2-2',
    subjectId: 'cse-301',
    unit: 2,
    unitTitle: 'Linked Lists & Stacks',
    topic: 'Stack Operations & Infix to Postfix Conversion',
    description: 'Push, pop, peek, evaluation of postfix expression, and parenthesis balance checker.',
    hours: 4,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dsa-3-1',
    subjectId: 'cse-301',
    unit: 3,
    unitTitle: 'Queues & Trees',
    topic: 'Circular Queue & Priority Queue',
    description: 'Array implementation of circular queue, overflow/underflow conditions, deque.',
    hours: 4,
    important: false,
    pyqFrequency: 'Medium'
  },
  {
    id: 'dsa-3-2',
    subjectId: 'cse-301',
    unit: 3,
    unitTitle: 'Queues & Trees',
    topic: 'Binary Search Tree (BST) Operations',
    description: 'Insertion, deletion of node with 0/1/2 children, in-order predecessor/successor, traversals.',
    hours: 6,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dsa-3-3',
    subjectId: 'cse-301',
    unit: 3,
    unitTitle: 'Queues & Trees',
    topic: 'AVL Tree & Balance Factor Rotations',
    description: 'LL, RR, LR, RL rotations, height balancing, insertion in AVL tree.',
    hours: 5,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dsa-4-1',
    subjectId: 'cse-301',
    unit: 4,
    unitTitle: 'Graphs',
    topic: 'Graph Representation (Adjacency Matrix & List)',
    description: 'Directed and undirected graphs, degree calculation, space complexity.',
    hours: 3,
    important: false,
    pyqFrequency: 'Medium'
  },
  {
    id: 'dsa-4-2',
    subjectId: 'cse-301',
    unit: 4,
    unitTitle: 'Graphs',
    topic: 'BFS & DFS Traversals & Topological Sort',
    description: 'Algorithms using queue and stack/recursion, cycle detection in graphs.',
    hours: 5,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dsa-4-3',
    subjectId: 'cse-301',
    unit: 4,
    unitTitle: 'Graphs',
    topic: "Minimum Spanning Tree (Prim's & Kruskal's Algorithm)",
    description: 'Greedy approach, cut property, disjoint set union (DSU), comparison of time complexity.',
    hours: 4,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dsa-5-1',
    subjectId: 'cse-301',
    unit: 5,
    unitTitle: 'Sorting & Hashing',
    topic: 'Quick Sort & Merge Sort Analysis',
    description: 'Partitioning strategies, recurrence relations, stability, in-place sorting.',
    hours: 4,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dsa-5-2',
    subjectId: 'cse-301',
    unit: 5,
    unitTitle: 'Sorting & Hashing',
    topic: 'Hash Tables, Collision Resolution (Chaining vs Open Addressing)',
    description: 'Linear probing, quadratic probing, double hashing, load factor, rehashing.',
    hours: 4,
    important: true,
    pyqFrequency: 'High'
  },

  // DBMS (cse-401)
  {
    id: 'dbms-1-1',
    subjectId: 'cse-401',
    unit: 1,
    unitTitle: 'Introduction & ER Modeling',
    topic: 'Three-Schema Architecture & Data Independence',
    description: 'Physical, conceptual, and external schema levels, logical vs physical data independence.',
    hours: 3,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dbms-1-2',
    subjectId: 'cse-401',
    unit: 1,
    unitTitle: 'Introduction & ER Modeling',
    topic: 'ER Diagram to Relational Schema Mapping',
    description: 'Entities, strong/weak entity sets, relationships, cardinality ratio, participation constraints.',
    hours: 4,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dbms-2-1',
    subjectId: 'cse-401',
    unit: 2,
    unitTitle: 'Relational Model & Relational Algebra',
    topic: 'Relational Algebra Operators (Select, Project, Join, Division)',
    description: 'Fundamental vs extended operators, theta join, natural join, outer joins.',
    hours: 5,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dbms-3-1',
    subjectId: 'cse-401',
    unit: 3,
    unitTitle: 'Normalization',
    topic: 'Functional Dependency & Attribute Closure',
    description: "Armstrong's axioms, canonical cover, candidate key computation algorithm.",
    hours: 4,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dbms-3-2',
    subjectId: 'cse-401',
    unit: 3,
    unitTitle: 'Normalization',
    topic: '1NF, 2NF, 3NF and BCNF Decompositions',
    description: 'Lossless join decomposition, dependency preservation, multi-valued dependencies and 4NF.',
    hours: 6,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dbms-4-1',
    subjectId: 'cse-401',
    unit: 4,
    unitTitle: 'Transactions & Concurrency Control',
    topic: 'ACID Properties & Serializability',
    description: 'Atomicity, Consistency, Isolation, Durability, conflict serializability, precedence graph.',
    hours: 5,
    important: true,
    pyqFrequency: 'High'
  },
  {
    id: 'dbms-4-2',
    subjectId: 'cse-401',
    unit: 4,
    unitTitle: 'Transactions & Concurrency Control',
    topic: 'Two-Phase Locking (2PL) Protocol & Deadlock Handling',
    description: 'Strict 2PL, Rigorous 2PL, wait-die and wound-wait deadlock prevention schemes.',
    hours: 4,
    important: true,
    pyqFrequency: 'High'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'usr-aman-101',
    name: 'Aman Kumar',
    email: 'aman.beu@gmail.com',
    mobile: '+91 9876543210',
    role: 'student',
    college: 'Muzaffarpur Institute of Technology (MIT)',
    collegeCode: '101',
    branch: 'Computer Science & Engineering',
    branchCode: 'CSE',
    semester: 3,
    beuRegNo: '23101108042',
    verificationStatus: 'verified',
    bio: 'CSE 3rd Sem Student @ MIT Muzaffarpur | Passionate about DSA, Web Dev & Open Source | BEU Contributor 🚀',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skills: ['React', 'TypeScript', 'C++', 'Data Structures', 'Tailwind CSS', 'Node.js'],
    interests: ['Web Development', 'Competitive Programming', 'AI/ML', 'Hackathons'],
    github: 'https://github.com/amankumar-beu',
    linkedin: 'https://linkedin.com/in/aman-kumar-beu',
    portfolio: 'https://amankumar.dev',
    followers: ['usr-priya-102', 'usr-rahul-104', 'usr-sneha-103'],
    following: ['usr-priya-102', 'usr-prof-admin'],
    contributionPoints: 780,
    badge: 'top_contributor',
    joinedDate: 'August 2024',
    savedPostIds: ['post-1', 'post-3'],
    bookmarkedResourceIds: ['pyq-dsa-2024', 'note-dsa-trees']
  },
  {
    id: 'usr-priya-102',
    name: 'Priya Sharma',
    email: 'priya.sharma@bcebhagalpur.ac.in',
    mobile: '+91 9876543211',
    role: 'student',
    college: 'Bhagalpur College of Engineering (BCE)',
    collegeCode: '102',
    branch: 'Computer Science & Engineering',
    branchCode: 'CSE',
    semester: 7,
    beuRegNo: '21102108019',
    verificationStatus: 'verified',
    bio: 'Final Year CSE @ BCE Bhagalpur | Senior Mentor | Placed @ ThoughtWorks | Mentoring 1st-3rd year juniors in DSA & System Design.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    skills: ['System Design', 'React', 'Java', 'Spring Boot', 'DSA in Java', 'Cloud AWS'],
    interests: ['Mentorship', 'Fullstack Development', 'GATE Prep', 'Career Guidance'],
    github: 'https://github.com/priyasharma-dev',
    linkedin: 'https://linkedin.com/in/priyasharma-bce',
    portfolio: 'https://priyasharma.tech',
    followers: ['usr-aman-101', 'usr-rahul-104', 'usr-sneha-103', 'usr-vikas-105'],
    following: ['usr-aman-101'],
    contributionPoints: 1450,
    badge: 'top_contributor',
    joinedDate: 'September 2022',
    savedPostIds: ['post-2'],
    bookmarkedResourceIds: ['pyq-dbms-2024']
  },
  {
    id: 'usr-prof-admin',
    name: 'Prof. R.K. Verma (Admin)',
    email: 'admin.coordinator@beu.bihar.gov.in',
    role: 'admin',
    college: 'Bihar Engineering University (BEU Head Office, Patna)',
    collegeCode: 'BEU-HQ',
    branch: 'Computer Science & Engineering',
    branchCode: 'CSE',
    semester: 8,
    verificationStatus: 'verified',
    bio: 'Academic Coordinator & Portal Administrator @ Bihar Engineering University.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    skills: ['Academic Administration', 'Curriculum Management', 'Examination'],
    interests: ['Engineering Education Policy', 'Accreditation', 'Student Research'],
    followers: ['usr-aman-101', 'usr-priya-102', 'usr-rahul-104'],
    following: [],
    contributionPoints: 3200,
    badge: 'top_contributor',
    joinedDate: 'January 2022',
    savedPostIds: [],
    bookmarkedResourceIds: []
  },
  {
    id: 'usr-rahul-104',
    name: 'Rahul Kumar Singh',
    email: 'rahul.gce@gmail.com',
    role: 'student',
    college: 'Gaya College of Engineering (GCE)',
    collegeCode: '104',
    branch: 'Electronics & Communication Engineering',
    branchCode: 'ECE',
    semester: 3,
    beuRegNo: '23104104015',
    verificationStatus: 'verified',
    bio: 'ECE 3rd Sem @ GCE Gaya | IoT enthusiast, Arduino tinkerer & Circuit Designer.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skills: ['Embedded C', 'IoT', 'MATLAB', 'Signals & Systems', 'PCB Design'],
    interests: ['Robotics', 'Hardware Hacking', 'GATE ECE'],
    followers: ['usr-aman-101'],
    following: ['usr-aman-101', 'usr-priya-102'],
    contributionPoints: 340,
    badge: 'helpful_student',
    joinedDate: 'October 2023',
    savedPostIds: [],
    bookmarkedResourceIds: []
  },
  {
    id: 'usr-sneha-103',
    name: 'Sneha Kumari',
    email: 'sneha.bceb@gmail.com',
    role: 'student',
    college: 'Bakhtiyarpur College of Engineering (BCE)',
    collegeCode: '103',
    branch: 'Computer Science & Engineering',
    branchCode: 'CSE',
    semester: 3,
    beuRegNo: '23103108031',
    verificationStatus: 'pending',
    bio: 'CSE 3rd Sem Student @ BCE Bakhtiyarpur | Exploring Python, Data Analytics & UI/UX.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    skills: ['Python', 'Figma', 'HTML/CSS', 'Data Visualization', 'SQL'],
    interests: ['UI/UX Design', 'Data Science', 'Tech Writing'],
    followers: ['usr-aman-101'],
    following: ['usr-aman-101', 'usr-priya-102'],
    contributionPoints: 120,
    badge: 'contributor',
    joinedDate: 'July 2024',
    savedPostIds: [],
    bookmarkedResourceIds: []
  }
];

export const MOCK_PYQS: PYQ[] = [
  // --- 1st Year: Basic Electrical Engineering ---
  {
    id: 'pyq-bee-2024',
    subjectId: 'ee-101',
    subjectName: 'Basic Electrical Engineering',
    branchCode: 'EE',
    semester: 1,
    year: 2024,
    title: 'BEU 2024 End-Semester Basic Electrical Engineering (100101/100201)',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-bee-2024.pdf',
    fileSize: '2.1 MB',
    downloadCount: 2890,
    patternPriority: 'high'
  },
  {
    id: 'pyq-bee-2023',
    subjectId: 'ee-101',
    subjectName: 'Basic Electrical Engineering',
    branchCode: 'EE',
    semester: 1,
    year: 2023,
    title: 'BEU 2023 End-Semester Basic Electrical Engineering Solved Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-bee-2023.pdf',
    fileSize: '1.9 MB',
    downloadCount: 3120,
    patternPriority: 'high'
  },
  {
    id: 'pyq-bee-2022',
    subjectId: 'ee-101',
    subjectName: 'Basic Electrical Engineering',
    branchCode: 'EE',
    semester: 1,
    year: 2022,
    title: 'BEU 2022 End-Semester Basic Electrical Engineering Exam Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-bee-2022.pdf',
    fileSize: '1.7 MB',
    downloadCount: 2450,
    patternPriority: 'high'
  },

  // --- 1st Year: Programming for Problem Solving (PPS - C) ---
  {
    id: 'pyq-pps-2024',
    subjectId: 'cs-101',
    subjectName: 'Programming for Problem Solving',
    branchCode: 'CSE',
    semester: 1,
    year: 2024,
    title: 'BEU 2024 End-Semester Programming for Problem Solving (100104)',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-pps-2024.pdf',
    fileSize: '2.0 MB',
    downloadCount: 3410,
    patternPriority: 'high'
  },
  {
    id: 'pyq-pps-2023',
    subjectId: 'cs-101',
    subjectName: 'Programming for Problem Solving',
    branchCode: 'CSE',
    semester: 1,
    year: 2023,
    title: 'BEU 2023 End-Semester PPS C-Programming Solved Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-pps-2023.pdf',
    fileSize: '1.8 MB',
    downloadCount: 2980,
    patternPriority: 'high'
  },

  // --- CSE Sem 3: Data Structures & Algorithms ---
  {
    id: 'pyq-dsa-2024',
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    branchCode: 'CSE',
    semester: 3,
    year: 2024,
    title: 'BEU 2024 End-Semester DSA Official Paper (PCC-CS301)',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-dsa-2024.pdf',
    fileSize: '2.4 MB',
    downloadCount: 4120,
    patternPriority: 'high'
  },
  {
    id: 'pyq-dsa-2023',
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    branchCode: 'CSE',
    semester: 3,
    year: 2023,
    title: 'BEU 2023 End-Semester DSA Question Paper with Solutions',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-dsa-2023.pdf',
    fileSize: '1.8 MB',
    downloadCount: 3890,
    patternPriority: 'high'
  },
  {
    id: 'pyq-dsa-2022',
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    branchCode: 'CSE',
    semester: 3,
    year: 2022,
    title: 'BEU 2022 End-Semester Examination DSA Question Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-dsa-2022.pdf',
    fileSize: '1.5 MB',
    downloadCount: 3210,
    patternPriority: 'high'
  },
  {
    id: 'pyq-dsa-2021',
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    branchCode: 'CSE',
    semester: 3,
    year: 2021,
    title: 'BEU 2021 Supplementary & Regular DSA Exam Paper',
    examType: 'Supplementary',
    fileUrl: 'https://example.com/beu-dsa-2021.pdf',
    fileSize: '1.2 MB',
    downloadCount: 1950,
    patternPriority: 'medium'
  },

  // --- CSE Sem 4: Operating Systems ---
  {
    id: 'pyq-os-2024',
    subjectId: 'cse-402',
    subjectName: 'Operating Systems',
    branchCode: 'CSE',
    semester: 4,
    year: 2024,
    title: 'BEU 2024 End-Semester Operating Systems (PCC-CS402)',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-os-2024.pdf',
    fileSize: '2.2 MB',
    downloadCount: 3560,
    patternPriority: 'high'
  },
  {
    id: 'pyq-os-2023',
    subjectId: 'cse-402',
    subjectName: 'Operating Systems',
    branchCode: 'CSE',
    semester: 4,
    year: 2023,
    title: 'BEU 2023 End-Semester Operating Systems Question Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-os-2023.pdf',
    fileSize: '1.9 MB',
    downloadCount: 2940,
    patternPriority: 'high'
  },

  // --- CSE Sem 4: DBMS ---
  {
    id: 'pyq-dbms-2024',
    subjectId: 'cse-401',
    subjectName: 'Database Management Systems',
    branchCode: 'CSE',
    semester: 4,
    year: 2024,
    title: 'BEU 2024 End-Semester DBMS Official Paper (PCC-CS401)',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-dbms-2024.pdf',
    fileSize: '2.1 MB',
    downloadCount: 3750,
    patternPriority: 'high'
  },
  {
    id: 'pyq-dbms-2023',
    subjectId: 'cse-401',
    subjectName: 'Database Management Systems',
    branchCode: 'CSE',
    semester: 4,
    year: 2023,
    title: 'BEU 2023 End-Semester DBMS Question Paper with Solutions',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-dbms-2023.pdf',
    fileSize: '1.9 MB',
    downloadCount: 3140,
    patternPriority: 'high'
  },

  // --- CSE Sem 5: Computer Networks ---
  {
    id: 'pyq-cn-2024',
    subjectId: 'cse-501',
    subjectName: 'Computer Networks',
    branchCode: 'CSE',
    semester: 5,
    year: 2024,
    title: 'BEU 2024 End-Semester Computer Networks (PCC-CS501)',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-cn-2024.pdf',
    fileSize: '2.3 MB',
    downloadCount: 2780,
    patternPriority: 'high'
  },
  {
    id: 'pyq-cn-2023',
    subjectId: 'cse-501',
    subjectName: 'Computer Networks',
    branchCode: 'CSE',
    semester: 5,
    year: 2023,
    title: 'BEU 2023 End-Semester Computer Networks Exam Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-cn-2023.pdf',
    fileSize: '1.8 MB',
    downloadCount: 2410,
    patternPriority: 'high'
  },

  // --- Civil Sem 3: Solid Mechanics (SOM) ---
  {
    id: 'pyq-som-2024',
    subjectId: 'ce-301',
    subjectName: 'Solid Mechanics',
    branchCode: 'CE',
    semester: 3,
    year: 2024,
    title: 'BEU 2024 End-Semester Solid Mechanics / SOM (PCC-CE301)',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-som-2024.pdf',
    fileSize: '2.5 MB',
    downloadCount: 3680,
    patternPriority: 'high'
  },
  {
    id: 'pyq-som-2023',
    subjectId: 'ce-301',
    subjectName: 'Solid Mechanics',
    branchCode: 'CE',
    semester: 3,
    year: 2023,
    title: 'BEU 2023 End-Semester Solid Mechanics Question Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-som-2023.pdf',
    fileSize: '2.0 MB',
    downloadCount: 3250,
    patternPriority: 'high'
  },

  // --- Civil Sem 3: Fluid Mechanics ---
  {
    id: 'pyq-fm-2024',
    subjectId: 'ce-302',
    subjectName: 'Fluid Mechanics',
    branchCode: 'CE',
    semester: 3,
    year: 2024,
    title: 'BEU 2024 End-Semester Fluid Mechanics & Hydraulics (PCC-CE302)',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-fm-2024.pdf',
    fileSize: '2.2 MB',
    downloadCount: 2890,
    patternPriority: 'high'
  },

  // --- Mechanical Sem 3: Thermodynamics ---
  {
    id: 'pyq-thermo-2024',
    subjectId: 'me-302',
    subjectName: 'Thermodynamics',
    branchCode: 'ME',
    semester: 3,
    year: 2024,
    title: 'BEU 2024 End-Semester Thermodynamics (PCC-ME301)',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-thermo-2024.pdf',
    fileSize: '2.4 MB',
    downloadCount: 3150,
    patternPriority: 'high'
  },

  // --- ECE / EE Sem 3: Digital Electronics ---
  {
    id: 'pyq-de-2024',
    subjectId: 'cse-303',
    subjectName: 'Digital Electronics',
    branchCode: 'ECE',
    semester: 3,
    year: 2024,
    title: 'BEU 2024 End-Semester Digital Electronics & Logic Design',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-de-2024.pdf',
    fileSize: '1.9 MB',
    downloadCount: 2210,
    patternPriority: 'high'
  }
];

import { BEUPatternAnalyzerService } from '../services/beuPatternAnalyzer';

export const MOCK_PYQ_ANALYSES: Record<string, PYQAnalysis> = {
  'cse-301': BEUPatternAnalyzerService.getFullAnalysis('cse-301', 'Data Structures & Algorithms', 'CSE', 3),
  'cse-401': BEUPatternAnalyzerService.getFullAnalysis('cse-401', 'Database Management Systems', 'CSE', 4),
  'cse-402': BEUPatternAnalyzerService.getFullAnalysis('cse-402', 'Operating Systems', 'CSE', 4),
  'cse-501': BEUPatternAnalyzerService.getFullAnalysis('cse-501', 'Computer Networks', 'CSE', 5),
  'ce-301': BEUPatternAnalyzerService.getFullAnalysis('ce-301', 'Strength of Materials', 'Civil Engineering', 3),
  'me-301': BEUPatternAnalyzerService.getFullAnalysis('me-301', 'Strength of Materials', 'Mechanical Engineering', 3),
  'ee-101': BEUPatternAnalyzerService.getFullAnalysis('ee-101', 'Basic Electrical Engineering', 'Electrical Engineering', 1),
};

export const MOCK_NOTES: Note[] = [
  {
    id: 'note-dsa-trees',
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    branchCode: 'CSE',
    semester: 3,
    unit: 3,
    title: 'Complete Trees & AVL Rotations Handwritten Notes (with Solved BEU Examples)',
    description: 'Detailed diagrams of all 4 AVL rotations (LL, RR, LR, RL) with step-by-step balance factor recalculations and BST operations.',
    fileUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    fileType: 'pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80',
    fileSize: '4.8 MB',
    authorId: 'usr-aman-101',
    authorName: 'Aman Kumar',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorCollege: 'MIT Muzaffarpur',
    likes: 86,
    bookmarks: 42,
    createdAt: '3 days ago',
    verified: true
  },
  {
    id: 'note-dsa-graphs',
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    branchCode: 'CSE',
    semester: 3,
    unit: 4,
    title: "Graph Algorithms: BFS, DFS, Prim's & Kruskal's Hand-drawn Cheat Sheet",
    description: 'High-res handwritten chart of Graph algorithms, DSU cycle detection, and MST dry-run matrices.',
    fileUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
    fileType: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80',
    fileSize: '2.4 MB',
    authorId: 'usr-priya-102',
    authorName: 'Priya Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    authorCollege: 'BCE Bhagalpur',
    likes: 124,
    bookmarks: 95,
    createdAt: '1 week ago',
    verified: true
  },
  {
    id: 'note-hall-effect-img',
    subjectId: 'ee-101',
    subjectName: 'Basic Electrical Engineering / Physics',
    branchCode: 'EE',
    semester: 1,
    unit: 2,
    title: 'Hall Effect Derivation & 3D Crystal Block Diagram (Handwritten Scan)',
    description: 'Clean handwritten derivation of Hall Voltage VH, Hall Coefficient RH, and carrier concentration calculation with marked Lorentz equilibrium vectors.',
    fileUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200&auto=format&fit=crop&q=80',
    fileType: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&auto=format&fit=crop&q=80',
    fileSize: '1.8 MB',
    authorId: 'usr-rohit-103',
    authorName: 'Rohit Verma',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    authorCollege: 'GEC Aurangabad',
    likes: 142,
    bookmarks: 88,
    createdAt: '2 days ago',
    verified: true
  },
  {
    id: 'note-dbms-norm',
    subjectId: 'cse-401',
    subjectName: 'Database Management Systems',
    branchCode: 'CSE',
    semester: 4,
    unit: 3,
    title: 'Normalization Formulae & BCNF Decomposition Master Guide',
    description: 'Contains 15 solved numericals from 2018 to 2024 BEU end-sem question papers with lossless join proofs.',
    fileUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    fileType: 'pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80',
    fileSize: '3.4 MB',
    authorId: 'usr-priya-102',
    authorName: 'Priya Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    authorCollege: 'BCE Bhagalpur',
    likes: 98,
    bookmarks: 67,
    createdAt: '2 weeks ago',
    verified: true
  },
  {
    id: 'note-os-paging-img',
    subjectId: 'cse-402',
    subjectName: 'Operating Systems',
    branchCode: 'CSE',
    semester: 4,
    unit: 3,
    title: 'Memory Management: Paging & Segmentation Architecture Flowchart',
    description: 'Visual diagram of Logical Address to Physical Address translation via Page Table & TLB cache hits.',
    fileUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    fileType: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    fileSize: '2.9 MB',
    authorId: 'usr-aman-101',
    authorName: 'Aman Kumar',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorCollege: 'MIT Muzaffarpur',
    likes: 115,
    bookmarks: 73,
    createdAt: '4 days ago',
    verified: true
  },
  {
    id: 'note-oop-cpp',
    subjectId: 'cse-302',
    subjectName: 'Object Oriented Programming with C++',
    branchCode: 'CSE',
    semester: 3,
    unit: 2,
    title: 'Virtual Functions, Polymorphism & vtable Memory Architecture',
    description: 'Clear explanation with memory layout diagrams and common viva questions for BEU practicals.',
    fileUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&auto=format&fit=crop&q=80',
    fileType: 'pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=80',
    fileSize: '1.9 MB',
    authorId: 'usr-aman-101',
    authorName: 'Aman Kumar',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorCollege: 'MIT Muzaffarpur',
    likes: 54,
    bookmarks: 31,
    createdAt: '5 days ago',
    verified: true
  }
];

export const MOCK_VIDEOS: StudyVideo[] = [
  {
    id: 'vid-avl-rotations',
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    branchCode: 'CSE',
    semester: 3,
    unit: 3,
    title: 'AVL Tree Insertions & All 4 Rotations Made Easy (Hinglish)',
    description: 'Comprehensive visual walkthrough of Left-Left, Right-Right, Left-Right, and Right-Left balance adjustments with BEU numericals.',
    videoUrl: 'https://www.youtube.com/watch?v=1QZDe_J_e4E',
    videoType: 'youtube',
    youtubeId: '1QZDe_J_e4E',
    thumbnailUrl: 'https://img.youtube.com/vi/1QZDe_J_e4E/hqdefault.jpg',
    duration: '28:45',
    channelName: 'Jenny’s Lectures CS/IT',
    likes: 340,
    views: '18.4K',
    tags: ['AVL Tree', 'BST', 'Rotations', 'Data Structures'],
    createdAt: '3 days ago'
  },
  {
    id: 'vid-mst-kruskal',
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    branchCode: 'CSE',
    semester: 3,
    unit: 4,
    title: "Kruskal's vs Prim's Algorithm for MST (Complete Explanation)",
    description: 'Greedy approach step-by-step example with cycle detection using Disjoint Set Union.',
    videoUrl: 'https://www.youtube.com/watch?v=4ZlRH0ebzV4',
    videoType: 'youtube',
    youtubeId: '4ZlRH0ebzV4',
    thumbnailUrl: 'https://img.youtube.com/vi/4ZlRH0ebzV4/hqdefault.jpg',
    duration: '32:10',
    channelName: 'Abdul Bari',
    likes: 520,
    views: '34.2K',
    tags: ['Graph Algorithms', 'MST', 'Greedy', 'Algorithms'],
    createdAt: '1 week ago'
  },
  {
    id: 'vid-hall-effect-demo',
    subjectId: 'ee-101',
    subjectName: 'Basic Electrical Engineering / Physics',
    branchCode: 'EE',
    semester: 1,
    unit: 2,
    title: 'Hall Effect Experiment Lab Demonstration & Apparatus Setup',
    description: 'Live student laboratory demo explaining electromagnet connection, digital gaussmeter readings, and Hall voltage probe measurements.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoType: 'upload',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    duration: '14:20',
    channelName: 'BEU Physics Lab Club',
    authorName: 'Aman Kumar',
    authorCollege: 'MIT Muzaffarpur',
    likes: 215,
    views: '8.7K',
    tags: ['Physics Lab', 'Hall Effect', 'Viva Prep', 'Experiment'],
    createdAt: '2 days ago'
  },
  {
    id: 'vid-dbms-normalization',
    subjectId: 'cse-401',
    subjectName: 'Database Management Systems',
    branchCode: 'CSE',
    semester: 4,
    unit: 3,
    title: '1NF, 2NF, 3NF & BCNF Normalization with Real Exam Examples',
    description: 'Learn how to find candidate keys, functional dependency closure and check 3NF/BCNF conditions in 30 minutes.',
    videoUrl: 'https://www.youtube.com/watch?v=UrYLYV7WSHM',
    videoType: 'youtube',
    youtubeId: 'UrYLYV7WSHM',
    thumbnailUrl: 'https://img.youtube.com/vi/UrYLYV7WSHM/hqdefault.jpg',
    duration: '35:20',
    channelName: 'Gate Smashers',
    likes: 680,
    views: '48.9K',
    tags: ['DBMS', 'Normalization', 'BCNF', 'GATE CSE'],
    createdAt: '2 weeks ago'
  },
  {
    id: 'vid-os-paging-demo',
    subjectId: 'cse-402',
    subjectName: 'Operating Systems',
    branchCode: 'CSE',
    semester: 4,
    unit: 3,
    title: 'Paging & TLB Hit/Miss Hardware Architecture Explained',
    description: 'Visual simulation and whiteboard calculation of effective memory access time (EMAT) with TLB lookup.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoType: 'upload',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    duration: '18:15',
    channelName: 'Priya Sharma (Ranker Walkthrough)',
    authorName: 'Priya Sharma',
    authorCollege: 'BCE Bhagalpur',
    likes: 310,
    views: '12.3K',
    tags: ['Operating Systems', 'Paging', 'TLB', 'Numericals'],
    createdAt: '4 days ago'
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    userId: 'usr-aman-101',
    userName: 'Aman Kumar',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userCollege: 'MIT Muzaffarpur',
    userBranch: 'CSE',
    userSemester: 3,
    isVerified: true,
    content: '🎉 Proud to share that our team from MIT Muzaffarpur qualified for the Grand Finale of Smart India Hackathon (SIH 2025)! We built an AI-powered Crop Disease Diagnostic System for Bihar farmers. Big thanks to the BEU Connect Hub community for helping us find great teammates! 🚜🌱',
    category: 'achievement',
    mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likes: ['usr-priya-102', 'usr-rahul-104', 'usr-sneha-103'],
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        userId: 'usr-priya-102',
        userName: 'Priya Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        userCollege: 'BCE Bhagalpur',
        content: 'Heartiest congratulations Aman & team! Best wishes for the grand finale round! 🏆',
        createdAt: '2 hours ago'
      },
      {
        id: 'c-2',
        postId: 'post-1',
        userId: 'usr-rahul-104',
        userName: 'Rahul Kumar Singh',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userCollege: 'GCE Gaya',
        content: 'Inspiring work bhai! Make BEU proud! 🔥',
        createdAt: '1 hour ago'
      }
    ],
    saves: ['usr-priya-102'],
    tags: ['#SIH2025', '#MITMuzaffarpur', '#AI', '#BEUAchievements'],
    createdAt: '3 hours ago'
  },
  {
    id: 'post-2',
    userId: 'usr-priya-102',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    userCollege: 'BCE Bhagalpur',
    userBranch: 'CSE',
    userSemester: 7,
    isVerified: true,
    content: '💡 **Important Tip for 3rd & 4th Sem CSE Students**: When preparing Data Structures & DBMS for BEU End-Sem exams, DO NOT skip: \n\n1. AVL Tree Rotations (14 Marks)\n2. BCNF Lossless Decomposition Proofs\n3. Precedence Graph Conflict Serializability\n\nI uploaded my handwritten summary notes to the Study Hub. Make sure to download and practice the past 4 years PYQs!',
    category: 'educational',
    likes: ['usr-aman-101', 'usr-rahul-104', 'usr-sneha-103', 'usr-vikas-105'],
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        userId: 'usr-sneha-103',
        userName: 'Sneha Kumari',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        userCollege: 'BCE Bakhtiyarpur',
        content: 'Thank you so much Priya di! The notes are super clean and easy to understand.',
        createdAt: '4 hours ago'
      }
    ],
    saves: ['usr-aman-101', 'usr-sneha-103'],
    tags: ['#ExamPrep', '#StudyHub', '#BEUNotes', '#CSE'],
    createdAt: '6 hours ago'
  },
  {
    id: 'post-3',
    userId: 'usr-rahul-104',
    userName: 'Rahul Kumar Singh',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    userCollege: 'GCE Gaya',
    userBranch: 'ECE',
    userSemester: 3,
    isVerified: true,
    content: '🚀 **Looking for Teammates**: Building an IoT-based Smart Flood Warning & Drainage Monitor for North Bihar districts using ESP32, LoRaWAN & React Dashboard. \n\nWe need:\n- 1 Frontend Developer (React/Tailwind)\n- 1 Backend/Cloud Developer (Node.js/Firebase)\n\nDrop a comment or DM me if you want to collaborate!',
    category: 'project',
    likes: ['usr-aman-101', 'usr-priya-102'],
    comments: [],
    saves: ['usr-aman-101'],
    tags: ['#ProjectPartner', '#IoT', '#React', '#OpenSource'],
    createdAt: '1 day ago'
  }
];

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'comm-cse-beu',
    name: 'BEU CSE Coders & Devs',
    description: 'The official and largest community for Computer Science & IT students across all 38+ engineering colleges under Bihar Engineering University.',
    category: 'branch',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    icon: '💻',
    creatorId: 'usr-aman-101',
    creatorName: 'Aman Kumar',
    members: ['usr-aman-101', 'usr-priya-102', 'usr-sneha-103'],
    isPrivate: false,
    rules: [
      'Be respectful and constructive in all discussions.',
      'Share verified academic notes, PYQs, and opportunities.',
      'No spamming or unauthorized promotional links.'
    ],
    createdAt: 'August 2024',
    postCount: 142,
    announcements: [
      '📢 BEU 3rd & 5th Sem Exam Schedule released! Check the BEU Hub tab for official datesheets.'
    ]
  },
  {
    id: 'comm-mit-muz',
    name: 'MIT Muzaffarpur Student Chapter',
    description: 'Official student networking and collaborative forum for Muzaffarpur Institute of Technology.',
    category: 'college',
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
    icon: '🏛️',
    creatorId: 'usr-aman-101',
    creatorName: 'Aman Kumar',
    members: ['usr-aman-101'],
    isPrivate: false,
    rules: ['Only for MIT Muzaffarpur students and alumni.'],
    createdAt: 'July 2024',
    postCount: 88
  },
  {
    id: 'comm-aiml-club',
    name: 'BEU AI & Machine Learning Guild',
    description: 'Collaborative club for learning PyTorch, LLMs, Computer Vision, and participating in Kaggle & AI Hackathons.',
    category: 'interest',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    icon: '🤖',
    creatorId: 'usr-priya-102',
    creatorName: 'Priya Sharma',
    members: ['usr-priya-102', 'usr-aman-101', 'usr-sneha-103'],
    isPrivate: false,
    rules: ['Share open-source AI projects, research papers, and tutorials.'],
    createdAt: 'September 2024',
    postCount: 65
  },
  {
    id: 'comm-gate-2026',
    name: 'BEU GATE 2026/2027 Aspirants',
    description: 'Dedicated peer-study group for GATE CSE, ECE, ME, CE & EE aspirants. Daily problem discussions and mock test strategies.',
    category: 'interest',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    icon: '🎯',
    creatorId: 'usr-priya-102',
    creatorName: 'Priya Sharma',
    members: ['usr-priya-102', 'usr-rahul-104'],
    isPrivate: false,
    rules: ['Post standard textbook questions and PYQ explanations.'],
    createdAt: 'June 2024',
    postCount: 110
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    creatorId: 'usr-aman-101',
    creatorName: 'Aman Kumar',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creatorCollege: 'MIT Muzaffarpur',
    title: 'AI Agriculture Assistant (SIH Finalist Project)',
    category: 'AI / Fullstack',
    description: 'A multilingual voice & visual disease diagnosis web application for farmers in Bihar, providing actionable treatment recommendations and mandi price forecasts.',
    requiredSkills: ['Python', 'PyTorch / FastAI', 'React', 'FastAPI', 'Tailwind CSS'],
    teamSize: 4,
    members: [
      { userId: 'usr-aman-101', name: 'Aman Kumar', role: 'Team Lead & Frontend', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { userId: 'usr-sneha-103', name: 'Sneha Kumari', role: 'UI/UX & Data Analyst', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }
    ],
    status: 'recruiting',
    tasks: [
      { id: 't-1', title: 'Complete FastAPI inference pipeline for plant pathology', status: 'in_progress', assigneeName: 'Aman' },
      { id: 't-2', title: 'Design mobile responsive disease symptom camera card', status: 'done', assigneeName: 'Sneha' },
      { id: 't-3', title: 'Integrate Hindi & Maithili TTS audio response', status: 'todo' }
    ],
    createdAt: '2 weeks ago',
    githubUrl: 'https://github.com/beu-sih-2025/ai-agri-bot'
  },
  {
    id: 'proj-2',
    creatorId: 'usr-rahul-104',
    creatorName: 'Rahul Kumar Singh',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creatorCollege: 'GCE Gaya',
    title: 'IoT Flood & River Level Early Warning Telemetry',
    category: 'IoT / Hardware',
    description: 'Solar-powered river sensor nodes placed across flood-prone embankments connected via LoRaWAN to a real-time web telemetry dashboard.',
    requiredSkills: ['ESP32', 'C++', 'Node.js', 'React', 'MQTT'],
    teamSize: 3,
    members: [
      { userId: 'usr-rahul-104', name: 'Rahul Kumar', role: 'Hardware & Firmware', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
    ],
    status: 'recruiting',
    tasks: [
      { id: 't-4', title: 'Calibrate ultrasonic water level sensors', status: 'in_progress' },
      { id: 't-5', title: 'Setup WebSocket server for telemetry broadcast', status: 'todo' }
    ],
    createdAt: '4 days ago'
  }
];

export const MOCK_MENTORS: MentorProfile[] = [
  {
    id: 'mentor-priya',
    userId: 'usr-priya-102',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    college: 'Bhagalpur College of Engineering (BCE)',
    branch: 'CSE',
    year: '4th Year (Senior)',
    bio: 'Software Engineer Intern @ ThoughtWorks. Cracked 3 on-campus & off-campus tech rounds. Happy to help juniors with DSA roadmap, resume reviews, and web development projects.',
    skills: ['Data Structures', 'System Design', 'React & Node.js', 'Resume Review', 'Interview Prep'],
    domain: 'Software Engineering & Web Dev',
    companyOrExam: 'SDE Intern @ ThoughtWorks',
    hourlyRate: 249,
    sessionDuration: '45 Mins 1-on-1 Call',
    totalSessionsGiven: 46,
    rating: 4.9,
    reviewsCount: 28,
    availableSlots: 3,
    linkedinUrl: 'https://linkedin.com/in/priyasharma-bce',
    isVerified: true
  },
  {
    id: 'mentor-vikas',
    userId: 'usr-vikas-105',
    name: 'Vikas Kumar Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    college: 'Muzaffarpur Institute of Technology (MIT)',
    branch: 'ECE',
    year: '4th Year (Senior)',
    bio: 'GATE ECE Ranker (AIR 412). Mentoring juniors in Signals & Systems, Analog Circuits, and Core ECE preparation strategy.',
    skills: ['Signals & Systems', 'GATE Strategy', 'Digital Circuits', 'MATLAB'],
    domain: 'GATE & Core Electronics',
    companyOrExam: 'GATE ECE AIR 412 (PSU Shortlisted)',
    hourlyRate: 199,
    sessionDuration: '45 Mins 1-on-1 Call',
    totalSessionsGiven: 32,
    rating: 4.8,
    reviewsCount: 19,
    availableSlots: 2,
    isVerified: true
  },
  {
    id: 'mentor-rahul',
    userId: 'usr-rahul-104',
    name: 'Rahul Anand',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    college: 'GEC Aurangabad',
    branch: 'CSE',
    year: 'Alumni (2024)',
    bio: 'Full-Stack AI Developer @ Cognizant. Built multiple open-source AI microservices and won 2 national hackathons.',
    skills: ['Python / PyTorch', 'Full-Stack Cloud', 'Hackathon Strategy', 'FastAPI'],
    domain: 'AI / ML & Cloud Systems',
    companyOrExam: 'Software Engineer @ Cognizant',
    hourlyRate: 299,
    sessionDuration: '45 Mins 1-on-1 Call',
    totalSessionsGiven: 58,
    rating: 5.0,
    reviewsCount: 39,
    availableSlots: 4,
    linkedinUrl: 'https://linkedin.com/in/rahulanand-ai',
    isVerified: true
  },
  {
    id: 'mentor-ananya',
    userId: 'usr-ananya-106',
    name: 'Ananya Roy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    college: 'BCE Patna / Bakhtiyarpur College of Engineering',
    branch: 'Mechanical Engineering',
    year: '4th Year (Senior)',
    bio: 'Placed in Tata Steel Graduate Trainee Program. Mentoring core mechanical students in Thermodynamics, CAD modeling, and technical interviews.',
    skills: ['Thermodynamics', 'AutoCAD / SolidWorks', 'Core Campus Prep', 'Fluid Mechanics'],
    domain: 'Core Mechanical & Manufacturing',
    companyOrExam: 'Graduate Trainee @ Tata Steel',
    hourlyRate: 189,
    sessionDuration: '45 Mins 1-on-1 Call',
    totalSessionsGiven: 24,
    rating: 4.9,
    reviewsCount: 16,
    availableSlots: 3,
    isVerified: true
  },
  {
    id: 'mentor-saurav',
    userId: 'usr-saurav-107',
    name: 'Saurav Singh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    college: 'Darbhanga College of Engineering (DCE)',
    branch: 'Civil Engineering',
    year: 'Alumni (2024)',
    bio: 'Assistant Engineer trainee (BPSC AE qualifier). Guiding students in Structural Analysis, Surveying, and Bihar Govt exam strategy.',
    skills: ['Structural Analysis', 'BPSC AE Strategy', 'STAAD Pro', 'Surveying'],
    domain: 'Civil Engineering & Govt Exams',
    companyOrExam: 'BPSC AE Qualifier & Project Engineer',
    hourlyRate: 149,
    sessionDuration: '45 Mins 1-on-1 Call',
    totalSessionsGiven: 41,
    rating: 4.8,
    reviewsCount: 22,
    availableSlots: 5,
    isVerified: true
  },
  {
    id: 'mentor-sneha',
    userId: 'usr-sneha-103',
    name: 'Sneha Kumari',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    college: 'GEC Vaishali',
    branch: 'AIML',
    year: '4th Year (Senior)',
    bio: 'Smart India Hackathon (SIH) winner & Google Developer Student Club Lead. Mentoring juniors in Machine Learning and Research Papers.',
    skills: ['Computer Vision', 'Deep Learning', 'Research Publications', 'SIH Mentoring'],
    domain: 'Artificial Intelligence & Research',
    companyOrExam: 'GDSC Lead & SIH Grand Winner',
    hourlyRate: 349,
    sessionDuration: '45 Mins 1-on-1 Call',
    totalSessionsGiven: 63,
    rating: 5.0,
    reviewsCount: 44,
    availableSlots: 2,
    linkedinUrl: 'https://linkedin.com/in/snehakumari-aiml',
    isVerified: true
  }
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Smart India Hackathon (SIH 2025 - Senior Edition)',
    organization: "Ministry of Education's Innovation Cell & AICTE",
    category: 'hackathon',
    description: "World's largest nationwide open innovation hackathon for engineering undergraduate innovators. Compete on real-world ministry & industry problem statements with prizes of ₹1,00,000 per problem statement.",
    location: 'National Nodal Centers / Hybrid',
    isOnline: true,
    deadline: 'September 30, 2025',
    stipendOrPrize: '₹1,00,000 / Winning Team',
    sourceName: 'AICTE / MoE Innovation Cell Official Portal',
    sourceUrl: 'https://www.sih.gov.in',
    applicationUrl: 'https://www.sih.gov.in/sih2024',
    publishedDate: '2025-08-01',
    lastVerified: '2025-08-18',
    isOfficialSource: true,
    sources: [
      { name: 'SIH 2025 Official Portal', url: 'https://www.sih.gov.in', isOfficial: true, type: 'primary' },
      { name: 'AICTE Innovation Cell Circular', url: 'https://mic.gov.in', isOfficial: true, type: 'reference' },
      { name: 'Official Problem Statements Directory', url: 'https://www.sih.gov.in/sih2024PS', isOfficial: true, type: 'application' }
    ],
    verifiedSource: 'AICTE / MoE Innovation Cell',
    branchRelevance: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
    tags: ['AICTE', 'SIH2025', 'Hackathon', 'National', 'Government']
  },
  {
    id: 'opp-2',
    title: 'Bihar State Innovation Grant & Tech Fellowship 2025',
    organization: 'Department of Science, Technology and Technical Education, Govt. of Bihar',
    category: 'scholarship',
    description: 'Special innovation initiative providing ₹25,000/month student fellowship and up to ₹2,00,000 prototype research grant for BEU engineering students solving state challenges in flood forecasting, solar pumping, and agritech.',
    location: 'Patna, Bihar (Hybrid)',
    isOnline: false,
    deadline: 'October 31, 2025',
    stipendOrPrize: '₹25,000 / month + ₹2L Grant',
    sourceName: 'DST Govt. of Bihar Official Portal',
    sourceUrl: 'https://state.bihar.gov.in/dst/',
    applicationUrl: 'https://state.bihar.gov.in/dst/CitizenHome.html',
    publishedDate: '2025-08-05',
    lastVerified: '2025-08-17',
    isOfficialSource: true,
    sources: [
      { name: 'DST Bihar Scheme Portal', url: 'https://state.bihar.gov.in/dst/', isOfficial: true, type: 'primary' },
      { name: 'Bihar Startup Nodal Mission', url: 'https://startup.bihar.gov.in', isOfficial: true, type: 'reference' }
    ],
    verifiedSource: 'Department of Science & Technology, Bihar',
    branchRelevance: ['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT'],
    tags: ['Govt Grant', 'Innovation', 'Bihar DST', 'Fellowship', 'Research']
  },
  {
    id: 'opp-3',
    title: 'Google Summer of Code (GSoC 2025 / Student Programs)',
    organization: 'Google Open Source Programs Office',
    category: 'internship',
    description: 'Prestigious global remote programming program introducing students to real-world open-source software engineering. Receive dedicated mentorship from industry architects and competitive project stipends.',
    location: 'Remote',
    isOnline: true,
    deadline: 'November 15, 2025',
    stipendOrPrize: 'Up to $3,000 USD Stipend',
    sourceName: 'Google Summer of Code Official Portal',
    sourceUrl: 'https://summerofcode.withgoogle.com',
    applicationUrl: 'https://summerofcode.withgoogle.com/get-started',
    publishedDate: '2025-07-20',
    lastVerified: '2025-08-16',
    isOfficialSource: true,
    sources: [
      { name: 'Google Summer of Code Portal', url: 'https://summerofcode.withgoogle.com', isOfficial: true, type: 'primary' },
      { name: 'Google Developers Student Community Hub', url: 'https://developers.google.com/community/gdsc', isOfficial: true, type: 'reference' }
    ],
    verifiedSource: 'Google Open Source Team',
    branchRelevance: ['CSE', 'IT', 'ECE'],
    tags: ['Google', 'GSoC', 'Open Source', 'Remote Internship', 'Global']
  },
  {
    id: 'opp-4',
    title: 'Microsoft Student Software Engineering Apprenticeship',
    organization: 'Microsoft University Recruiting India',
    category: 'internship',
    description: 'Summer software engineering internship for 3rd and 4th year engineering undergraduates. Develop scalable distributed systems, cloud microservices, and AI integrations on Microsoft Azure.',
    location: 'Bangalore / Hyderabad / Remote',
    isOnline: true,
    deadline: 'December 15, 2025',
    stipendOrPrize: '₹1,25,000 / month',
    sourceName: 'Microsoft University Careers Portal',
    sourceUrl: 'https://careers.microsoft.com/students/us/en',
    applicationUrl: 'https://careers.microsoft.com/students/us/en/job/1802931/Software-Engineer-Internship-Opportunities-for-Students',
    publishedDate: '2025-08-10',
    lastVerified: '2025-08-18',
    isOfficialSource: true,
    sources: [
      { name: 'Microsoft Careers Student Portal', url: 'https://careers.microsoft.com/students/us/en', isOfficial: true, type: 'primary' },
      { name: 'Microsoft Learn Student Ambassadors Hub', url: 'https://studentambassadors.microsoft.com', isOfficial: true, type: 'reference' }
    ],
    verifiedSource: 'Microsoft University Hiring Cell',
    branchRelevance: ['CSE', 'IT', 'ECE'],
    tags: ['Microsoft', 'Cloud', 'Azure', 'Paid Internship', 'Tech']
  },
  {
    id: 'opp-5',
    title: 'DRDO Graduate Engineering Apprenticeship (NATS Scheme 2025-26)',
    organization: 'Defence Research and Development Organisation (DRDO)',
    category: 'job',
    description: '1-year Graduate Apprenticeship Training for B.Tech CSE, ECE, Mechanical, and Electrical graduates with monthly stipend and official research project experience under Govt. of India NATS portal.',
    location: 'Chandipur / Bangalore / Delhi Labs',
    isOnline: false,
    deadline: 'November 20, 2025',
    stipendOrPrize: '₹18,000 / month',
    sourceName: 'DRDO Recruitment & Assessment Centre (RAC)',
    sourceUrl: 'https://drdo.gov.in/drdo/careers',
    applicationUrl: 'https://nats.education.gov.in',
    publishedDate: '2025-08-12',
    lastVerified: '2025-08-18',
    isOfficialSource: true,
    sources: [
      { name: 'DRDO Official Careers Portal', url: 'https://drdo.gov.in/drdo/careers', isOfficial: true, type: 'primary' },
      { name: 'National Apprenticeship Training Scheme (NATS)', url: 'https://nats.education.gov.in', isOfficial: true, type: 'application' }
    ],
    verifiedSource: 'DRDO RAC Recruitment Cell',
    branchRelevance: ['CSE', 'ECE', 'EE', 'ME'],
    tags: ['Govt Apprentice', 'DRDO', 'NATS', 'Defence Tech', 'Government']
  },
  {
    id: 'opp-6',
    title: 'AICTE - Cisco Virtual Cybersecurity Internship 2025',
    organization: 'AICTE & Cisco Networking Academy',
    category: 'internship',
    description: 'Virtual cybersecurity internship providing hands-on labs in network defense, ethical hacking, and threat intelligence. Eligible for credit transfer and industry certification vouchers.',
    location: 'Remote (Virtual)',
    isOnline: true,
    deadline: 'October 25, 2025',
    stipendOrPrize: 'Certificate + Cisco Badge + Placement Assistance',
    sourceName: 'AICTE National Internship Portal',
    sourceUrl: 'https://internship.aicte-india.org',
    applicationUrl: 'https://internship.aicte-india.org',
    publishedDate: '2025-08-08',
    lastVerified: '2025-08-18',
    isOfficialSource: true,
    sources: [
      { name: 'AICTE Internship Official Portal', url: 'https://internship.aicte-india.org', isOfficial: true, type: 'primary' },
      { name: 'Cisco NetAcad India Hub', url: 'https://www.netacad.com', isOfficial: true, type: 'reference' }
    ],
    verifiedSource: 'AICTE Internship Board',
    branchRelevance: ['CSE', 'IT', 'ECE', 'EE'],
    tags: ['AICTE', 'Cisco', 'Cybersecurity', 'Virtual Internship']
  },
  {
    id: 'opp-7',
    title: 'Bihar Post-Matric Scholarship (PMS Online Scheme 2025-26)',
    organization: 'Education Department & Welfare Dept, Govt. of Bihar',
    category: 'scholarship',
    description: 'State government fee reimbursement and maintenance allowance for engineering undergraduates of SC, ST, BC, and EBC categories enrolled in recognized Bihar engineering institutions.',
    location: 'Bihar',
    isOnline: true,
    deadline: 'November 30, 2025',
    stipendOrPrize: 'Full Tuition Fee + ₹10,000/yr Allowance',
    sourceName: 'PMS Online Bihar Portal',
    sourceUrl: 'https://pmsonline.bih.nic.in',
    applicationUrl: 'https://pmsonline.bih.nic.in',
    publishedDate: '2025-08-01',
    lastVerified: '2025-08-18',
    isOfficialSource: true,
    sources: [
      { name: 'PMS Online Bihar Portal', url: 'https://pmsonline.bih.nic.in', isOfficial: true, type: 'primary' },
      { name: 'National Scholarship Portal (NSP)', url: 'https://scholarships.gov.in', isOfficial: true, type: 'reference' }
    ],
    verifiedSource: 'Govt. of Bihar Education Dept',
    branchRelevance: ['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT'],
    tags: ['Scholarship', 'PMS Bihar', 'Govt Scheme', 'Tuition Fee Waiver']
  }
];

export const MOCK_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Notice regarding BEU B.Tech 3rd & 5th Semester End-Term Examination Schedule (Session 2023-27)',
    category: 'exam',
    isOfficial: true,
    source: 'Examination Controller, Bihar Engineering University, Patna',
    sourceName: 'BEU Patna Official Notice Board',
    sourceUrl: 'https://beup.ac.in',
    applicationUrl: 'https://beup.ac.in',
    publishedAt: 'August 14, 2025',
    publishedDate: '2025-08-14',
    deadline: 'September 10, 2025',
    lastVerified: '2025-08-18',
    isOfficialSource: true,
    sources: [
      { name: 'BEU Official Examination Portal', url: 'https://beup.ac.in', isOfficial: true, type: 'circular' }
    ],
    summary: 'The theory examination for B.Tech 3rd and 5th Semester will commence from 18th September 2025. Admit cards will be available on the portal from 10th September.',
    content: 'It is hereby notified for information to all concerned that the B.Tech 3rd and 5th Semester End-Term Examinations (Session 2023-27 & 2022-26) are scheduled to commence from 18th September 2025 across all designated examination centers in Bihar. All students are directed to verify their examination forms through their respective college nodal offices before 28th August 2025.',
    fileUrl: 'https://beup.ac.in',
    isUrgent: true
  },
  {
    id: 'not-2',
    title: 'Declaration of B.Tech 2nd & 4th Semester Examination Results (Even Semester 2024-25)',
    category: 'result',
    isOfficial: true,
    source: 'BEU Evaluation Center, Mithapur, Patna',
    sourceName: 'BEU Result & Scrutiny Portal',
    sourceUrl: 'https://beup.ac.in',
    applicationUrl: 'https://beup.ac.in',
    publishedAt: 'August 10, 2025',
    publishedDate: '2025-08-10',
    deadline: 'August 25, 2025',
    lastVerified: '2025-08-18',
    isOfficialSource: true,
    sources: [
      { name: 'BEU Evaluation Portal', url: 'https://beup.ac.in', isOfficial: true, type: 'circular' }
    ],
    summary: 'Results for B.Tech 2nd & 4th Semester Even-Term Examination 2024-25 have been officially declared. Students can check their digital marksheet on the BEU portal.',
    content: 'The results of B.Tech 2nd & 4th Semester Regular & Carry-over Examinations have been published today. Scrutiny applications can be submitted through college principals within 15 days of this notice.',
    fileUrl: 'https://beup.ac.in'
  },
  {
    id: 'not-3',
    title: 'Post-Matric Scholarship (PMS) Verification Guidelines for Engineering Students 2025-26',
    category: 'scholarship',
    isOfficial: true,
    source: 'Education Department, Govt. of Bihar',
    sourceName: 'PMS Bihar Nodal Portal',
    sourceUrl: 'https://pmsonline.bih.nic.in',
    applicationUrl: 'https://pmsonline.bih.nic.in',
    publishedAt: 'August 02, 2025',
    publishedDate: '2025-08-02',
    deadline: 'September 30, 2025',
    lastVerified: '2025-08-18',
    isOfficialSource: true,
    sources: [
      { name: 'PMS Online Bihar Portal', url: 'https://pmsonline.bih.nic.in', isOfficial: true, type: 'circular' }
    ],
    summary: 'All SC/ST/BC/EBC engineering students are advised to upload bonafide certificates and fee receipts on the PMS portal before 30th September 2025.',
    content: 'Institutes are requested to complete physical verification of registered students promptly to avoid disbursement delays.',
    fileUrl: 'https://pmsonline.bih.nic.in'
  },
  {
    id: 'not-4',
    title: 'Academic Calendar for B.Tech Odd Semester (Academic Year 2025-26)',
    category: 'general',
    isOfficial: true,
    source: 'Registrar, Bihar Engineering University',
    sourceName: 'BEU Registrar Circular Board',
    sourceUrl: 'https://beup.ac.in',
    applicationUrl: 'https://beup.ac.in',
    publishedAt: 'July 25, 2025',
    publishedDate: '2025-07-25',
    lastVerified: '2025-08-18',
    isOfficialSource: true,
    sources: [
      { name: 'BEU Academic Calendar Board', url: 'https://beup.ac.in', isOfficial: true, type: 'circular' }
    ],
    summary: 'Official notification regarding mid-semester examinations, technical fest schedules, and winter vacation timeline.',
    content: 'Mid-semester tests will be conducted internally between 20th October and 28th October 2025. End semester practical exams will be held prior to theory papers.',
    fileUrl: 'https://beup.ac.in'
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-aman-101',
    type: 'official',
    title: '🔴 BEU Exam Datesheet Released',
    message: 'B.Tech 3rd Semester End-Term exam commences from Sept 18. Check official schedule.',
    link: '/beu-hub',
    read: false,
    createdAt: '1 hour ago'
  },
  {
    id: 'notif-2',
    userId: 'usr-aman-101',
    type: 'social',
    title: 'Priya Sharma commented on your post',
    message: '"Heartiest congratulations Aman & team! Best wishes for the grand finale round!"',
    link: '/social',
    read: false,
    createdAt: '2 hours ago'
  },
  {
    id: 'notif-3',
    userId: 'usr-aman-101',
    type: 'academic',
    title: 'New High Priority PYQ Added',
    message: 'BEU 2024 End-Semester DSA fully solved question paper is now available.',
    link: '/study-hub',
    read: true,
    createdAt: '1 day ago'
  },
  {
    id: 'notif-4',
    userId: 'usr-aman-101',
    type: 'career',
    title: 'New Fellowship Opportunity',
    message: 'Bihar State Innovation Fellowship 2025 (₹25,000/mo) is accepting applications.',
    link: '/career-hub',
    read: true,
    createdAt: '2 days ago'
  }
];

export const MOCK_KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: 'kn-dbms-root',
    label: 'Database Systems',
    subject: 'DBMS',
    unit: 1,
    level: 1,
    description: 'Foundations of database architecture, storage structures, and relational algebra.',
    keyPoints: ['Three-Schema Architecture', 'Data Independence (Physical vs Logical)', 'ACID principles'],
    pyqWeight: 'High',
    relatedTopics: ['Relational Model', 'SQL', 'Normalization'],
    aiSummary: 'Understanding the separation between physical storage and conceptual view is critical for both university exams and system design interviews.'
  },
  {
    id: 'kn-dbms-rel',
    label: 'Relational Model',
    subject: 'DBMS',
    unit: 2,
    level: 2,
    parentId: 'kn-dbms-root',
    description: 'Mathematical foundation based on relations, tuples, primary keys, and relational algebra operations.',
    keyPoints: ['Candidate Keys vs Super Keys', 'Integrity Constraints', 'Relational Algebra Operators'],
    pyqWeight: 'High',
    relatedTopics: ['Normalization', 'SQL Queries'],
    aiSummary: 'Relational algebra is a procedural query language where operators (Select, Project, Join) form the backbone of query optimization.'
  },
  {
    id: 'kn-dbms-norm',
    label: 'Normalization',
    subject: 'DBMS',
    unit: 3,
    level: 2,
    parentId: 'kn-dbms-root',
    description: 'Systematic approach of decomposing relations to minimize data redundancy and update anomalies.',
    keyPoints: ['Functional Dependencies', 'Canonical Cover', '1NF to BCNF Conditions'],
    pyqWeight: 'High',
    relatedTopics: ['1NF', '2NF', '3NF', 'BCNF'],
    aiSummary: 'BCNF requires every determinant to be a superkey. Normalization prevents insertion, deletion, and update anomalies.'
  },
  {
    id: 'kn-dbms-1nf',
    label: '1NF (First Normal Form)',
    subject: 'DBMS',
    unit: 3,
    level: 3,
    parentId: 'kn-dbms-norm',
    description: 'A relation is in 1NF if and only if each attribute contains only atomic (indivisible) values.',
    keyPoints: ['No multi-valued attributes', 'No composite attributes', 'Unique column names'],
    pyqWeight: 'Medium',
    relatedTopics: ['2NF', 'Atomic Values'],
    aiSummary: 'Eliminates repeating groups by ensuring each cell contains a single scalar value.'
  },
  {
    id: 'kn-dbms-2nf',
    label: '2NF (Second Normal Form)',
    subject: 'DBMS',
    unit: 3,
    level: 3,
    parentId: 'kn-dbms-norm',
    description: 'Must be in 1NF and no non-prime attribute should be partially dependent on any candidate key.',
    keyPoints: ['No Partial Dependency', 'Applies when candidate key is composite'],
    pyqWeight: 'High',
    relatedTopics: ['3NF', 'Partial Dependency'],
    aiSummary: 'Decomposes tables where non-prime attributes depend only on a proper subset of a composite candidate key.'
  },
  {
    id: 'kn-dbms-3nf',
    label: '3NF (Third Normal Form)',
    subject: 'DBMS',
    unit: 3,
    level: 3,
    parentId: 'kn-dbms-norm',
    description: 'Must be in 2NF and no non-prime attribute should be transitively dependent on candidate keys.',
    keyPoints: ['For every X -> Y, either X is Super Key or Y is Prime Attribute', 'Preserves dependencies'],
    pyqWeight: 'High',
    relatedTopics: ['BCNF', 'Transitive Dependency'],
    aiSummary: '3NF allows non-superkeys to determine prime attributes, ensuring dependency preservation with minimal redundancy.'
  },
  {
    id: 'kn-dbms-bcnf',
    label: 'BCNF (Boyce-Codd Normal Form)',
    subject: 'DBMS',
    unit: 3,
    level: 3,
    parentId: 'kn-dbms-norm',
    description: 'Stricter version of 3NF: For every non-trivial functional dependency X -> Y, X must strictly be a Super Key.',
    keyPoints: ['Strictly X is Super Key', 'May not always preserve functional dependencies', 'Lossless decomposition always possible'],
    pyqWeight: 'High',
    relatedTopics: ['3NF', 'Decomposition'],
    aiSummary: 'BCNF eliminates all redundancy from functional dependencies, though some dependencies may need checking via joins.'
  }
];

export const MOCK_STUDY_PLAN_TASKS: StudyPlanTask[] = [
  {
    id: 'task-1',
    userId: 'usr-aman-101',
    dayNumber: 1,
    title: 'Revise AVL Tree Rotations (LL, RR, LR, RL)',
    subjectName: 'Data Structures & Algorithms',
    durationMinutes: 45,
    taskType: 'topic',
    completed: true,
    date: 'Today'
  },
  {
    id: 'task-2',
    userId: 'usr-aman-101',
    dayNumber: 1,
    title: 'Solve 2024 End-Sem AVL Numerical (14 Marks)',
    subjectName: 'Data Structures & Algorithms',
    durationMinutes: 30,
    taskType: 'pyq',
    completed: true,
    date: 'Today'
  },
  {
    id: 'task-3',
    userId: 'usr-aman-101',
    dayNumber: 1,
    title: "Graph MST: Practice Kruskal's with DSU Table",
    subjectName: 'Data Structures & Algorithms',
    durationMinutes: 40,
    taskType: 'practice',
    completed: false,
    date: 'Today'
  },
  {
    id: 'task-4',
    userId: 'usr-aman-101',
    dayNumber: 2,
    title: 'Learn BCNF Lossless Decomposition Algorithm',
    subjectName: 'Database Management Systems',
    durationMinutes: 50,
    taskType: 'topic',
    completed: false,
    date: 'Tomorrow'
  },
  {
    id: 'task-5',
    userId: 'usr-aman-101',
    dayNumber: 2,
    title: 'Solve 2023 & 2022 DBMS Normalization PYQs',
    subjectName: 'Database Management Systems',
    durationMinutes: 45,
    taskType: 'pyq',
    completed: false,
    date: 'Tomorrow'
  }
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reporterId: 'usr-rahul-104',
    reporterName: 'Rahul Kumar',
    contentType: 'post',
    contentId: 'post-99',
    contentPreview: 'Spam telegram link for paid paper leaks...',
    reason: 'Spam',
    status: 'pending',
    createdAt: '2 hours ago'
  },
  {
    id: 'rep-2',
    reporterId: 'usr-sneha-103',
    reporterName: 'Sneha Kumari',
    contentType: 'note',
    contentId: 'note-invalid-chem',
    contentPreview: 'Old 2017 syllabus chemistry copy with wrong watermarks',
    reason: 'Misinformation',
    status: 'pending',
    createdAt: '5 hours ago'
  }
];

export const MOCK_GOALMAPS: GoalMap[] = [
  {
    id: 'gm-demo-fullstack',
    userId: 'usr-aman-101',
    goalTitle: 'Full-Stack Software Developer',
    category: 'career',
    targetOutcome: 'Crack off-campus/on-campus SDE roles with 2 production projects & strong DSA',
    targetDeadline: '6 Months',
    createdAt: '2 days ago',
    progressPercent: 35,
    streakDays: 5,
    studentProfile: {
      branch: 'CSE',
      semester: 3,
      currentLevel: 'intermediate',
      existingSkills: ['C/C++', 'HTML/CSS Basics', 'Basic JavaScript', 'Git Basics'],
      hoursDaily: 3,
      learningPreference: ['Videos', 'Projects', 'Practice']
    },
    gapAnalysis: {
      alreadyLearned: ['C/C++ Fundamentals', 'HTML5 & CSS3', 'Git Basics'],
      inProgress: ['JavaScript ES6+ & Async/Await', 'React.js & Hooks'],
      skillGap: ['React State Management', 'Node.js & Express REST APIs', 'PostgreSQL & Prisma', 'DSA (LeetCode 150+)', 'System Design Basics'],
      highPriority: ['React State Management', 'Node.js & Express REST APIs'],
      mediumPriority: ['PostgreSQL & Prisma', 'DSA (LeetCode 150+)', 'System Design Basics']
    },
    beuAcademicContext: {
      relevantSubjects: ['Data Structures & Algorithms (CS301)', 'DBMS (CS401)', 'Operating Systems (CS402)', 'Web Technologies (CS501)'],
      highYieldUnits: ['Unit 2 (Data Structures)', 'Unit 3 (Trees & Graphs)', 'Unit 4 (Algorithms)'],
      examPatternFocus: 'Balance daily practical coding with BEU 70-Mark Theory pattern to prevent backlogs while accelerating career skills.'
    },
    milestones: [
      {
        id: 'ms-fs-1',
        phaseNumber: 1,
        title: 'Phase 1: Core Programming, DSA Foundations & Git',
        timeframe: 'Month 1 (Weeks 1-4)',
        whyThisStep: 'Solid programming logic in JavaScript/C++ and version control are non-negotiable prerequisites before building full-stack systems.',
        status: 'completed',
        tasks: [
          { id: 't-fs-1-1', title: 'Master JavaScript ES6+ (Promises, Async/Await, Closures, Array methods)', description: 'Write 15 JS coding drills on closures, event loop, and DOM manipulation.', estimatedHours: 12, priority: 'HIGH', completed: true, category: 'learn' },
          { id: 't-fs-1-2', title: 'Master Git Branching, Pull Requests & GitHub Workflow', description: 'Create a GitHub profile, initialize repositories with clear README, license, and .gitignore.', estimatedHours: 6, priority: 'HIGH', completed: true, category: 'practice' },
          { id: 't-fs-1-3', title: 'Solve 30 Easy-Medium LeetCode Array & String Questions', description: 'Focus on Two-Pointer technique, Sliding Window, and HashMaps.', estimatedHours: 20, priority: 'HIGH', completed: true, category: 'practice' },
          { id: 't-fs-1-4', title: 'Build Project 1: Interactive Browser Dashboard / Task Manager', description: 'Pure Vanilla JS + LocalStorage with responsive CSS layout.', estimatedHours: 14, priority: 'MEDIUM', completed: true, category: 'project' }
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
        status: 'in_progress',
        tasks: [
          { id: 't-fs-2-1', title: 'Understand React Lifecycle, State, Props & Core Hooks (useState, useEffect, useMemo)', description: 'Build component tree with clean separation of concerns.', estimatedHours: 18, priority: 'HIGH', completed: true, category: 'learn' },
          { id: 't-fs-2-2', title: 'Master TailwindCSS / CSS Design System & Responsive Layouts', description: 'Design mobile-first interfaces with dark mode support.', estimatedHours: 10, priority: 'HIGH', completed: true, category: 'practice' },
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
    ],
    healthCheck: {
      status: 'ON_TRACK',
      summary: 'Your GoalMap is calibrated for 3 hours/day over 6 Months. Phase 1 is 100% complete, and Phase 2 is currently in progress.',
      suggestions: [
        'Maintain your 5-day active study streak.',
        'Complete Project 2 by the end of Month 2.',
        'Review BEU DBMS theory questions on weekends.'
      ]
    }
  }
];

