import {
  User, College, Branch, Subject, SyllabusTopic, PYQ, PYQAnalysis,
  Note, StudyVideo, Post, Community, Conversation, Message,
  Project, MentorProfile, Opportunity, Notice, AppNotification,
  Report, KnowledgeNode, StudyPlanTask
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
  {
    id: 'pyq-dsa-2024',
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    branchCode: 'CSE',
    semester: 3,
    year: 2024,
    title: 'BEU 2024 End-Semester DSA Question Paper (Fully Solved)',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-dsa-2024.pdf',
    fileSize: '2.4 MB',
    downloadCount: 1420,
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
    downloadCount: 2180,
    patternPriority: 'high'
  },
  {
    id: 'pyq-dsa-2022',
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    branchCode: 'CSE',
    semester: 3,
    year: 2022,
    title: 'BEU 2022 End-Semester Examination Question Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-dsa-2022.pdf',
    fileSize: '1.5 MB',
    downloadCount: 1890,
    patternPriority: 'high'
  },
  {
    id: 'pyq-dsa-2021',
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    branchCode: 'CSE',
    semester: 3,
    year: 2021,
    title: 'BEU 2021 Supplementary & Regular Exam Paper',
    examType: 'Supplementary',
    fileUrl: 'https://example.com/beu-dsa-2021.pdf',
    fileSize: '1.2 MB',
    downloadCount: 950,
    patternPriority: 'medium'
  },
  {
    id: 'pyq-dbms-2024',
    subjectId: 'cse-401',
    subjectName: 'Database Management Systems',
    branchCode: 'CSE',
    semester: 4,
    year: 2024,
    title: 'BEU 2024 End-Semester DBMS Official Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-dbms-2024.pdf',
    fileSize: '2.1 MB',
    downloadCount: 1650,
    patternPriority: 'high'
  },
  {
    id: 'pyq-dbms-2023',
    subjectId: 'cse-401',
    subjectName: 'Database Management Systems',
    branchCode: 'CSE',
    semester: 4,
    year: 2023,
    title: 'BEU 2023 End-Semester DBMS Question Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-dbms-2023.pdf',
    fileSize: '1.9 MB',
    downloadCount: 1340,
    patternPriority: 'high'
  },
  {
    id: 'pyq-oop-2024',
    subjectId: 'cse-302',
    subjectName: 'Object Oriented Programming with C++',
    branchCode: 'CSE',
    semester: 3,
    year: 2024,
    title: 'BEU 2024 OOP with C++ End-Sem Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-oop-2024.pdf',
    fileSize: '1.7 MB',
    downloadCount: 1120,
    patternPriority: 'high'
  },
  {
    id: 'pyq-de-2024',
    subjectId: 'cse-303',
    subjectName: 'Digital Electronics',
    branchCode: 'CSE',
    semester: 3,
    year: 2024,
    title: 'BEU 2024 Digital Electronics Exam Paper',
    examType: 'End Sem',
    fileUrl: 'https://example.com/beu-de-2024.pdf',
    fileSize: '1.6 MB',
    downloadCount: 890,
    patternPriority: 'medium'
  }
];

export const MOCK_PYQ_ANALYSES: Record<string, PYQAnalysis> = {
  'cse-301': {
    subjectId: 'cse-301',
    subjectName: 'Data Structures & Algorithms',
    totalPapersAnalyzed: 6,
    patterns: [
      {
        topic: 'AVL Tree Rotations & Insertion Algorithm',
        unit: 3,
        frequency: 6,
        priority: 'high',
        recurringYears: [2024, 2023, 2022, 2021, 2020, 2019],
        examOccurrence: '100% (Appeared in all analyzed papers, 14 marks question)'
      },
      {
        topic: "Minimum Spanning Tree (Prim's vs Kruskal's with numerical)",
        unit: 4,
        frequency: 6,
        priority: 'high',
        recurringYears: [2024, 2023, 2022, 2021, 2020],
        examOccurrence: '100% (7 or 14 marks numerical question)'
      },
      {
        topic: 'Infix to Postfix Conversion & Stack Evaluation',
        unit: 2,
        frequency: 5,
        priority: 'high',
        recurringYears: [2024, 2023, 2022, 2021, 2019],
        examOccurrence: '83% (Repeated frequently in Section B)'
      },
      {
        topic: 'Quick Sort Best/Worst Case Analysis & Partitioning',
        unit: 5,
        frequency: 5,
        priority: 'high',
        recurringYears: [2024, 2023, 2022, 2020, 2019],
        examOccurrence: '83% (Theory derivation & step tracing)'
      },
      {
        topic: 'Hash Collision Resolution (Linear Probing vs Quadratic Probing)',
        unit: 5,
        frequency: 4,
        priority: 'medium',
        recurringYears: [2024, 2023, 2021, 2020],
        examOccurrence: '67% (Numerical with hash function h(k)=k mod 7)'
      },
      {
        topic: 'Binary Search Tree Deletion of 2-Child Node',
        unit: 3,
        frequency: 4,
        priority: 'medium',
        recurringYears: [2024, 2022, 2021, 2019],
        examOccurrence: '67% (Inorder successor method explanation)'
      },
      {
        topic: 'Sparse Matrix Representation & 3-Tuple Representation',
        unit: 1,
        frequency: 3,
        priority: 'low',
        recurringYears: [2023, 2021, 2019],
        examOccurrence: '50% (Short answer question in Section A)'
      },
      {
        topic: 'Topological Sort using Kahn’s Algorithm / DFS',
        unit: 4,
        frequency: 3,
        priority: 'low',
        recurringYears: [2024, 2022, 2020],
        examOccurrence: '50% (Directed Acyclic Graph example)'
      }
    ],
    unitWeightage: [
      { unit: 1, unitTitle: 'Arrays & Complexity', percentage: 12 },
      { unit: 2, unitTitle: 'Linked Lists & Stacks', percentage: 22 },
      { unit: 3, unitTitle: 'Trees & AVL', percentage: 28 },
      { unit: 4, unitTitle: 'Graphs & MST', percentage: 24 },
      { unit: 5, unitTitle: 'Sorting & Hashing', percentage: 14 }
    ],
    highYieldTips: [
      'Master AVL Tree rotation step-by-step drawing (LL, RR, LR, RL) — it carries 14 marks almost every year in BEU.',
      "Practice Kruskal's algorithm step-wise with edge weight tables to secure full marks in Graph theory.",
      'Always write the exact Recurrence Relation when solving QuickSort and MergeSort (T(n) = 2T(n/2) + O(n)).',
      'Remember that Section A contains compulsory short questions covering Big-O definitions and Sparse Matrices.'
    ],
    disclaimer: 'This is historical pattern analysis derived from past BEU question papers, not a guarantee of future exam questions. Always cover the complete syllabus.'
  },
  'cse-401': {
    subjectId: 'cse-401',
    subjectName: 'Database Management Systems',
    totalPapersAnalyzed: 5,
    patterns: [
      {
        topic: 'Normalization up to BCNF (Candidate key & Lossless decomposition)',
        unit: 3,
        frequency: 5,
        priority: 'high',
        recurringYears: [2024, 2023, 2022, 2021, 2020],
        examOccurrence: '100% (High yield 14-marks numerical every year)'
      },
      {
        topic: 'Conflict Serializability & Precedence Graph Method',
        unit: 4,
        frequency: 5,
        priority: 'high',
        recurringYears: [2024, 2023, 2022, 2021, 2020],
        examOccurrence: '100% (Testing schedules with swap rules)'
      },
      {
        topic: 'ER Diagram to Relational Schema Mapping Rules',
        unit: 1,
        frequency: 4,
        priority: 'high',
        recurringYears: [2024, 2023, 2022, 2020],
        examOccurrence: '80% (Hospital/University management case study)'
      },
      {
        topic: 'Two Phase Locking (2PL) vs Strict 2PL Protocol',
        unit: 4,
        frequency: 4,
        priority: 'medium',
        recurringYears: [2024, 2022, 2021, 2020],
        examOccurrence: '80% (Theory & cascading rollback prevention)'
      },
      {
        topic: 'Relational Algebra (Division Operator & Joins)',
        unit: 2,
        frequency: 3,
        priority: 'medium',
        recurringYears: [2023, 2022, 2021],
        examOccurrence: '60% (Query translation)'
      }
    ],
    unitWeightage: [
      { unit: 1, unitTitle: 'Introduction & ER Model', percentage: 18 },
      { unit: 2, unitTitle: 'Relational Algebra & SQL', percentage: 20 },
      { unit: 3, unitTitle: 'Normalization & Functional Dependencies', percentage: 32 },
      { unit: 4, unitTitle: 'Transactions & Concurrency', percentage: 22 },
      { unit: 5, unitTitle: 'Indexing & B/B+ Trees', percentage: 8 }
    ],
    highYieldTips: [
      'BCNF vs 3NF condition proofs and dependency preservation checking are the most repeated 14-mark questions.',
      'Always draw the precedence graph clearly when proving whether a schedule is conflict serializable.'
    ],
    disclaimer: 'This is historical pattern analysis derived from past BEU question papers, not a guarantee of future exam questions. Always cover the complete syllabus.'
  }
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
    fileUrl: 'https://example.com/dsa-unit3-notes.pdf',
    fileType: 'pdf',
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
    title: "Graph Algorithms: BFS, DFS, Prim's & Kruskal's Cheat Sheet",
    description: 'Concise summary with code snippets in C++ and dry-run tables for BEU mid-sem & end-sem revisions.',
    fileUrl: 'https://example.com/dsa-graphs-cheatsheet.pdf',
    fileType: 'pdf',
    fileSize: '2.1 MB',
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
    id: 'note-dbms-norm',
    subjectId: 'cse-401',
    subjectName: 'Database Management Systems',
    branchCode: 'CSE',
    semester: 4,
    unit: 3,
    title: 'Normalization Formulae & BCNF Decomposition Master Guide',
    description: 'Contains 15 solved numericals from 2018 to 2024 BEU end-sem question papers.',
    fileUrl: 'https://example.com/dbms-norm-guide.pdf',
    fileType: 'pdf',
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
    id: 'note-oop-cpp',
    subjectId: 'cse-302',
    subjectName: 'Object Oriented Programming with C++',
    branchCode: 'CSE',
    semester: 3,
    unit: 2,
    title: 'Virtual Functions, Polymorphism & vtable Memory Architecture',
    description: 'Clear explanation with memory layout diagrams and common viva questions.',
    fileUrl: 'https://example.com/cpp-polymorphism.pdf',
    fileType: 'pdf',
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
    youtubeId: '1QZDe_J_e4E',
    duration: '28:45',
    channelName: 'Jenny’s Lectures CS/IT',
    likes: 340,
    views: '18.4K',
    tags: ['AVL Tree', 'BST', 'Rotations', 'Data Structures']
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
    youtubeId: '4ZlRH0ebzV4',
    duration: '32:10',
    channelName: 'Abdul Bari',
    likes: 520,
    views: '34.2K',
    tags: ['Graph Algorithms', 'MST', 'Greedy', 'Algorithms']
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
    youtubeId: 'UrYLYV7WSHM',
    duration: '35:20',
    channelName: 'Gate Smashers',
    likes: 680,
    views: '48.9K',
    tags: ['DBMS', 'Normalization', 'BCNF', 'GATE CSE']
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
    rating: 4.8,
    reviewsCount: 19,
    availableSlots: 2,
    isVerified: true
  }
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Bihar State Innovation Fellowship 2025',
    organization: 'Department of Science & Technology, Govt. of Bihar',
    category: 'scholarship',
    description: 'Monthly fellowship of ₹25,000 + ₹2,00,000 prototype grant for engineering students working on Bihar-focused challenges (Flood mitigation, Agriculture, Solar energy).',
    location: 'Patna, Bihar (Hybrid)',
    isOnline: false,
    deadline: 'October 30, 2025',
    stipendOrPrize: '₹25,000 / month + ₹2L Grant',
    sourceUrl: 'https://dst.bihar.gov.in',
    verifiedSource: 'Official Govt. of Bihar Portal',
    branchRelevance: ['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT'],
    tags: ['Govt Grant', 'Innovation', 'Bihar DST', 'Fellowship']
  },
  {
    id: 'opp-2',
    title: 'Smart India Hackathon (SIH 2025)',
    organization: 'Ministry of Education & AICTE',
    category: 'hackathon',
    description: "World's biggest open innovation hackathon for engineering undergraduate students. Grand prizes of ₹1,00,000 per problem statement.",
    location: 'National / Nodal Centers',
    isOnline: true,
    deadline: 'September 15, 2025',
    stipendOrPrize: '₹1,00,000 per win',
    sourceUrl: 'https://sih.gov.in',
    verifiedSource: 'AICTE Official Portal',
    branchRelevance: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
    tags: ['AICTE', 'SIH2025', 'Hackathon', 'National']
  },
  {
    id: 'opp-3',
    title: 'Frontend Engineering Internship (Remote)',
    organization: 'Cognizant NextGen Tech',
    category: 'internship',
    description: '3-month summer internship for 3rd and 4th year B.Tech students. Work on React, TypeScript, and cloud-native dashboard systems.',
    location: 'Remote',
    isOnline: true,
    deadline: 'November 10, 2025',
    stipendOrPrize: '₹35,000 / month',
    sourceUrl: 'https://careers.cognizant.com',
    verifiedSource: 'Cognizant Careers Portal',
    branchRelevance: ['CSE', 'IT', 'ECE'],
    tags: ['React', 'TypeScript', 'Paid Internship', 'Remote']
  },
  {
    id: 'opp-4',
    title: 'DRDO Research Apprentice Trainee 2025-26',
    organization: 'Defence Research and Development Organisation (DRDO)',
    category: 'job',
    description: '1-year Graduate Apprenticeship Training for B.Tech CSE, ECE, Mechanical, and Electrical graduates with monthly stipend under NATS scheme.',
    location: 'Chandipur / Bangalore / Delhi',
    isOnline: false,
    deadline: 'December 05, 2025',
    stipendOrPrize: '₹18,000 / month',
    sourceUrl: 'https://drdo.gov.in',
    verifiedSource: 'DRDO Recruitment Cell',
    branchRelevance: ['CSE', 'ECE', 'EE', 'ME'],
    tags: ['Govt Apprentice', 'DRDO', 'NATS', 'Defence Tech']
  }
];

export const MOCK_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Notice regarding BEU B.Tech 3rd & 5th Semester End-Term Examination Schedule (Session 2023-27)',
    category: 'exam',
    isOfficial: true,
    source: 'Examination Controller, Bihar Engineering University, Patna',
    publishedAt: 'August 14, 2025',
    summary: 'The theory examination for B.Tech 3rd and 5th Semester will commence from 18th September 2025. Admit cards will be available on the portal from 10th September.',
    content: 'It is hereby notified for information to all concerned that the B.Tech 3rd and 5th Semester End-Term Examinations (Session 2023-27 & 2022-26) are scheduled to commence from 18th September 2025 across all designated examination centers in Bihar. All students are directed to verify their examination forms through their respective college nodal offices before 28th August 2025.',
    fileUrl: 'https://example.com/beu-exam-schedule-sep2025.pdf',
    isUrgent: true
  },
  {
    id: 'not-2',
    title: 'Declaration of B.Tech 2nd & 4th Semester Examination Results (Even Semester 2024-25)',
    category: 'result',
    isOfficial: true,
    source: 'BEU Evaluation Center, Mithapur, Patna',
    publishedAt: 'August 10, 2025',
    summary: 'Results for B.Tech 2nd & 4th Semester Even-Term Examination 2024-25 have been officially declared. Students can check their digital marksheet on the BEU portal.',
    content: 'The results of B.Tech 2nd & 4th Semester Regular & Carry-over Examinations have been published today. Scrutiny applications can be submitted through college principals within 15 days of this notice.',
    fileUrl: 'https://example.com/beu-results-notice.pdf'
  },
  {
    id: 'not-3',
    title: 'Post-Matric Scholarship (PMS) Verification Guidelines for Engineering Students 2025-26',
    category: 'scholarship',
    isOfficial: true,
    source: 'Education Department, Govt. of Bihar',
    publishedAt: 'August 02, 2025',
    summary: 'All SC/ST/BC/EBC engineering students are advised to upload bonafide certificates and fee receipts on the PMS portal before 30th September 2025.',
    content: 'Institutes are requested to complete physical verification of registered students promptly to avoid disbursement delays.',
    fileUrl: 'https://example.com/pms-guidelines.pdf'
  },
  {
    id: 'not-4',
    title: 'Academic Calendar for B.Tech Odd Semester (Academic Year 2025-26)',
    category: 'general',
    isOfficial: true,
    source: 'Registrar, Bihar Engineering University',
    publishedAt: 'July 25, 2025',
    summary: 'Official notification regarding mid-semester examinations, technical fest schedules, and winter vacation timeline.',
    content: 'Mid-semester tests will be conducted internally between 20th October and 28th October 2025. End semester practical exams will be held prior to theory papers.',
    fileUrl: 'https://example.com/academic-calendar-2025.pdf'
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
