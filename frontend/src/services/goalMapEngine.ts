import {
  GoalMap, GoalMilestone, GoalTask, GoalResource,
  GoalCategoryType, SkillLevelType, DailyActionWeek, DailyActionTask
} from '../types';

export interface GoalPreset {
  id: string;
  category: GoalCategoryType;
  title: string;
  icon: string;
  tagline: string;
  defaultDeadline: string;
  targetOutcome: string;
  defaultSkillsNeeded: string[];
  benchmarkSkills: Record<string, SkillLevelType>;
  beuContextNote: string;
}

export interface GoalSpecificQuestion {
  id: string;
  question: string;
  type: 'select' | 'multiselect' | 'text';
  options?: string[];
  placeholder?: string;
  helperText?: string;
}

export const GOAL_PRESETS: GoalPreset[] = [
  {
    id: 'software_dev',
    category: 'software_dev',
    title: 'Software Development Engineer (SDE)',
    icon: '💻',
    tagline: 'MERN / Next.js / Java, DSA (LeetCode 150+), System Design & Tier-1 SDE Roles',
    defaultDeadline: '6 Months',
    targetOutcome: 'Crack Product & Core SDE roles with 2 production capstone projects and strong problem solving',
    defaultSkillsNeeded: ['JavaScript / TypeScript', 'React / Next.js', 'Node.js & Express', 'PostgreSQL & MongoDB', 'DSA in C++ or Java', 'Git & CI/CD', 'REST & GraphQL APIs'],
    benchmarkSkills: {
      'Programming': 'advanced',
      'DSA': 'advanced',
      'Web Development': 'intermediate',
      'Databases': 'intermediate',
      'Git & GitHub': 'intermediate',
      'System Design': 'basic',
    },
    beuContextNote: 'Directly reinforces BEU CS301 (Data Structures), CS401 (DBMS), and CS501 (Operating Systems & Web Technologies).'
  },
  {
    id: 'ai_ml',
    category: 'ai_ml',
    title: 'AI / ML & Data Science Engineer',
    icon: '🤖',
    tagline: 'Deep Learning, PyTorch, LLM RAG Systems, Computer Vision & Kaggle Competitions',
    defaultDeadline: '6 Months',
    targetOutcome: 'Build a portfolio of deployed AI microservices, fine-tuned LLMs, and computer vision pipelines',
    defaultSkillsNeeded: ['Python & NumPy / Pandas', 'Linear Algebra & Statistics', 'Scikit-Learn', 'PyTorch / TensorFlow', 'Vector DBs (Pinecone/Chroma) & LangChain', 'FastAPI & Docker Deployment'],
    benchmarkSkills: {
      'Python': 'advanced',
      'Mathematics & Stats': 'intermediate',
      'Machine Learning': 'advanced',
      'Deep Learning & LLMs': 'intermediate',
      'APIs & Deployment': 'intermediate',
    },
    beuContextNote: 'Builds upon BEU PCC-AIML courses, discrete mathematics, and numerical optimization.'
  },
  {
    id: 'placement',
    category: 'placement',
    title: 'On-Campus Placement & Dream Offer',
    icon: '🏢',
    tagline: 'Aptitude, Core Technical Subjects, 150+ DSA LeetCode & Mock HR/Technical Interviews',
    defaultDeadline: '3 Months',
    targetOutcome: 'Clear on-campus placement tests (TCS Digital, Infosys SP, Cognizant, Wipro) & Day-1 Dream companies',
    defaultSkillsNeeded: ['Quantitative Aptitude & Logical Reasoning', 'C / C++ / Java Fundamentals', 'DSA (Arrays, Strings, Trees, Graphs)', 'OS, DBMS & CN Core Theory', 'Resume & Interview Speaking'],
    benchmarkSkills: {
      'Aptitude & Reasoning': 'advanced',
      'Core Programming': 'intermediate',
      'DSA': 'intermediate',
      'Core CS Subjects': 'advanced',
      'Communication': 'intermediate',
    },
    beuContextNote: 'Aligns 100% with BEU core academic syllabus exams and mandatory college placement training modules.'
  },
  {
    id: 'gate',
    category: 'gate',
    title: 'GATE 2027 Top Ranker (AIR < 500)',
    icon: '📚',
    tagline: 'PSU Recruitment (IOCL, NTPC, ONGC, BARC) & Direct M.Tech Admission at IITs/IISc',
    defaultDeadline: '1 Year',
    targetOutcome: 'Master core engineering subjects, solve 15 years PYQs, and score 70+ marks in GATE',
    defaultSkillsNeeded: ['Engineering Mathematics & Calculus', 'Discrete Mathematics', 'Theory of Computation (TOC)', 'Computer Architecture (COA)', 'Operating Systems', 'Compiler Design', 'PYQ Speed Drills'],
    benchmarkSkills: {
      'Engineering Mathematics': 'advanced',
      'Core Subject Theory': 'advanced',
      'Formula Derivations': 'advanced',
      'PYQ Problem Solving': 'advanced',
    },
    beuContextNote: 'BEU End-Sem theoretical depth and university derivations cover 75% of GATE foundation topics.'
  },
  {
    id: 'web_dev',
    category: 'web_dev',
    title: 'Full-Stack Web Developer',
    icon: '🌐',
    tagline: 'Modern React, TypeScript, Node.js, Next.js 14, TailwindCSS & Real-time WebSockets',
    defaultDeadline: '6 Months',
    targetOutcome: 'Develop and deploy scalable SaaS applications with authentication, payment gateways, and databases',
    defaultSkillsNeeded: ['HTML5, CSS3, Modern JavaScript (ES6+)', 'TypeScript', 'React.js & State Management', 'Node.js, Express & REST APIs', 'PostgreSQL / Prisma ORM', 'Docker & Cloud Deployment'],
    benchmarkSkills: {
      'HTML/CSS/JS': 'advanced',
      'React/Frontend': 'advanced',
      'Backend/APIs': 'intermediate',
      'Databases': 'intermediate',
      'Git & CI/CD': 'intermediate',
    },
    beuContextNote: 'Complements BEU CS501 (Web Technologies & Software Engineering lab courses).'
  },
  {
    id: 'app_dev',
    category: 'app_dev',
    title: 'Cross-Platform Mobile App Developer',
    icon: '📱',
    tagline: 'Flutter / React Native, State Management, Firebase, Native APIs & Play Store Publishing',
    defaultDeadline: '6 Months',
    targetOutcome: 'Build and publish 2 production mobile apps with push notifications and local offline caching',
    defaultSkillsNeeded: ['Flutter & Dart / React Native', 'Mobile UI Components & Animations', 'State Management (Riverpod / Redux / Bloc)', 'Firebase & REST API Integration', 'Play Store Deployment'],
    benchmarkSkills: {
      'Mobile Framework': 'advanced',
      'Programming Logic': 'intermediate',
      'API Integration': 'intermediate',
      'App Architecture': 'intermediate',
    },
    beuContextNote: 'Useful for college mini-projects, final year Capstone projects, and mobile hackathon prototypes.'
  },
  {
    id: 'ui_ux',
    category: 'ui_ux',
    title: 'UI/UX & Product Designer',
    icon: '🎨',
    tagline: 'Figma Mastery, Design Systems, Wireframing, User Research & Dribbble/Behance Portfolio',
    defaultDeadline: '3 Months',
    targetOutcome: 'Craft 3 comprehensive case studies with user research, persona creation, and interactive Figma prototypes',
    defaultSkillsNeeded: ['Figma / Auto-layout / Components', 'Typography, Grids & Color Theory', 'User Research & Journey Mapping', 'Wireframing & High-Fidelity Prototyping', 'Design System Architecture'],
    benchmarkSkills: {
      'Figma & Tools': 'advanced',
      'UX Research': 'intermediate',
      'Visual Design': 'advanced',
      'Design Systems': 'intermediate',
    },
    beuContextNote: 'Directly boosts front-end development coursework, hackathon submissions, and freelance readiness.'
  },
  {
    id: 'data_science',
    category: 'data_science',
    title: 'Data Analyst & Business Intelligence',
    icon: '📊',
    tagline: 'Advanced SQL, Python, PowerBI / Tableau, Statistical Analysis & Executive Dashboards',
    defaultDeadline: '4 Months',
    targetOutcome: 'Analyze large-scale real-world datasets, generate actionable business insights, and build interactive dashboards',
    defaultSkillsNeeded: ['Advanced SQL (Window Functions, CTEs)', 'Python (Pandas, Seaborn, Matplotlib)', 'PowerBI / Tableau Dashboarding', 'Exploratory Data Analysis (EDA)', 'Business Metrics & Storytelling'],
    benchmarkSkills: {
      'SQL': 'advanced',
      'Python Data Analytics': 'intermediate',
      'PowerBI/Tableau': 'advanced',
      'Statistics': 'intermediate',
    },
    beuContextNote: 'Bridges BEU engineering data courses with corporate analytics and business problem solving.'
  },
  {
    id: 'cyber_security',
    category: 'cyber_security',
    title: 'Cybersecurity Analyst & Ethical Hacker',
    icon: '🔐',
    tagline: 'Network Security, Linux, OWASP Top 10, Bug Bounty, SOC Operations & CEH Prep',
    defaultDeadline: '6 Months',
    targetOutcome: 'Earn industry security certifications, solve TryHackMe/HackTheBox rooms, and secure junior SOC roles',
    defaultSkillsNeeded: ['Linux CLI & Bash Scripting', 'Networking (OSI, TCP/IP, Wireshark)', 'Web Application Pentesting (Burp Suite)', 'Vulnerability Assessment (Nessus/Nmap)', 'Security Operations (SIEM basics)'],
    benchmarkSkills: {
      'Linux & Networking': 'advanced',
      'Web Security / OWASP': 'intermediate',
      'Ethical Hacking Tools': 'intermediate',
      'Scripting (Python/Bash)': 'intermediate',
    },
    beuContextNote: 'Complements BEU Cyber Security electives and university networking lab assignments.'
  },
  {
    id: 'startup',
    category: 'startup',
    title: 'Tech Founder & Startup Builder',
    icon: '🚀',
    tagline: 'From Idea to MVP, Smart India Hackathon & Bihar Startup Grant (₹10 Lakhs)',
    defaultDeadline: '6 Months',
    targetOutcome: 'Launch a functional MVP, acquire first 100 users, and apply for Bihar Startup Policy seed funding',
    defaultSkillsNeeded: ['Rapid MVP Prototyping (Next.js/Supabase/Firebase)', 'Customer Discovery & Validation', 'Pitch Deck & Business Model Canvas', 'System Architecture & Scalability', 'Growth & Go-To-Market Strategy'],
    benchmarkSkills: {
      'Product Development': 'intermediate',
      'Problem Validation': 'advanced',
      'Pitch & Presentation': 'advanced',
      'Execution Speed': 'advanced',
    },
    beuContextNote: 'Qualifies for Department of Industries, Bihar Government startup seed grant support up to ₹10 Lakhs.'
  },
  {
    id: 'hackathon',
    category: 'hackathon',
    title: 'National Hackathon Champion (SIH / Tejas)',
    icon: '🏆',
    tagline: 'Rapid 36-Hr Prototyping, Idea Validation, Tech Stack Mastery & Winning Pitch Decks',
    defaultDeadline: '3 Months',
    targetOutcome: 'Qualify and win top-3 podium finishes in Smart India Hackathon (SIH) and state innovation contests',
    defaultSkillsNeeded: ['Rapid Full-Stack Prototyping', 'AI API Integration (OpenAI/Gemini/HuggingFace)', 'GitHub Collaboration & Branch Workflows', 'Cloud / Vercel Rapid Deployment', 'Pitch Deck & 3-Minute Demo Delivery'],
    benchmarkSkills: {
      'Rapid Prototyping': 'advanced',
      'AI & API Integrations': 'intermediate',
      'Team Git Workflow': 'intermediate',
      'Presentation & Pitching': 'advanced',
    },
    beuContextNote: 'Supported by BEU university innovation cells and Department of Science, Technology and Technical Education.'
  },
  {
    id: 'higher_studies',
    category: 'higher_studies',
    title: 'Higher Studies (M.Tech IITs / MS in Top Universities)',
    icon: '🎓',
    tagline: 'GATE High Percentile, Research Paper Publishing, SOP & IIT/IISc Admissions',
    defaultDeadline: '1 Year',
    targetOutcome: 'Gain admission to Premier IITs, NITs or top international graduate engineering programs with fellowship',
    defaultSkillsNeeded: ['Core Engineering Rigor', 'Research Methodology & Technical Writing', 'Statement of Purpose (SOP) & Letter of Recommendations', 'GATE / Entrance Examination Score', 'Academic CGPA Maintenance (8.0+)'],
    benchmarkSkills: {
      'Academic CGPA': 'advanced',
      'Core Technical Rigor': 'advanced',
      'Research & Paper Writing': 'intermediate',
      'Standardized Exam Prep': 'advanced',
    },
    beuContextNote: 'High BEU CGPA (8.0+) provides a competitive edge for direct interviews and MHRD stipends (₹12,400/mo).'
  },
  {
    id: 'freelancing',
    category: 'freelancing',
    title: 'Freelance Developer & Tech Consultant',
    icon: '💰',
    tagline: 'Upwork / Fiverr Client Acquisition, High-Ticket Web/Mobile Projects & Portfolio',
    defaultDeadline: '4 Months',
    targetOutcome: 'Earn steady freelance income ($500–$2000/mo) while studying through verified freelance contracts',
    defaultSkillsNeeded: ['Full-Stack Web or Mobile Development', 'Client Communication & English Fluency', 'Upwork Proposal Writing & Cold Outreach', 'Project Scoping & Contract Delivery', 'Stripe / PayPal Invoicing'],
    benchmarkSkills: {
      'Technical Delivery': 'intermediate',
      'English & Negotiation': 'advanced',
      'Proposal Writing': 'advanced',
      'Portfolio & Proof of Work': 'advanced',
    },
    beuContextNote: 'Allows students to become financially independent while maintaining high semester academic standing.'
  },
  {
    id: 'abroad',
    category: 'abroad',
    title: 'Abroad Studies & Global Tech Career',
    icon: '🌍',
    tagline: 'GRE / TOEFL / IELTS, Germany/US/UK Admissions, Global SDE Applications & Visa Guidance',
    defaultDeadline: '1 Year',
    targetOutcome: 'Receive master’s admit with scholarship or direct international software engineering job offer',
    defaultSkillsNeeded: ['GRE & TOEFL / IELTS Preparation', 'Global Resume Formatting', 'International Tech Problem Solving', 'Document Verification & WES Evaluation', 'Visa & Financial Sponsorship Planning'],
    benchmarkSkills: {
      'English Fluency (IELTS/TOEFL)': 'advanced',
      'Standardized Test Prep': 'advanced',
      'Technical Depth': 'intermediate',
      'Application Strategy': 'advanced',
    },
    beuContextNote: 'BEU degree verification and official transcripts are recognized globally via AICTE/UGC accreditation.'
  },
  {
    id: 'job',
    category: 'job',
    title: 'Core Industry Engineering Job',
    icon: '💼',
    tagline: 'Core Mechanical, Civil, Electrical, ECE & Automation Company Recruitment',
    defaultDeadline: '6 Months',
    targetOutcome: 'Secure core technical engineering roles in leading industrial manufacturing, energy, and infrastructure giants',
    defaultSkillsNeeded: ['Core Branch Fundamentals (Strength of Materials, Thermodynamics, Circuit Theory)', 'Industry Software (AutoCAD, MATLAB, SolidWorks, Revit, PLC/SCADA)', 'Technical Drawing & Standards', 'Site & Lab Practical Knowledge', 'Technical HR Interview Prep'],
    benchmarkSkills: {
      'Core Branch Theory': 'advanced',
      'Industry CAD/Simulation Tools': 'intermediate',
      'Practical Lab Concepts': 'intermediate',
      'Communication': 'intermediate',
    },
    beuContextNote: 'Reinforces mandatory 5th/7th semester BEU industrial summer training and PSU internship viva evaluations.'
  },
  {
    id: 'custom',
    category: 'custom',
    title: 'Custom Personalized Engineering Goal',
    icon: '🎯',
    tagline: 'Tailor-made roadmap for your unique interdisciplinary passion or specialized target',
    defaultDeadline: '6 Months',
    targetOutcome: 'Achieve your self-defined target through dynamic AI-grounded milestones and continuous tracking',
    defaultSkillsNeeded: ['Core Fundamentals', 'Domain-Specific Tools', 'Continuous Practice', 'Portfolio Demonstrations', 'Evaluation Benchmarks'],
    benchmarkSkills: {
      'Foundations': 'intermediate',
      'Specialization': 'intermediate',
      'Consistency': 'advanced',
    },
    beuContextNote: 'Customized in harmony with your current semester BEU course load.'
  }
];

export class GoalMapEngine {
  /* BEU-GOALMAP-1: 16-Category Dynamic Adaptive Questionnaire Engine
   * Generates context-aware multiple choice and input questions dynamically tailored to the student's chosen goal.
   * Ensures Software Dev, AI/ML, GATE, BPSC, Startup, and Hackathon paths receive custom targeted assessment prompts. */
  static getGoalSpecificQuestions(category: string, goalTitle?: string): GoalSpecificQuestion[] {
    const cat = (category || '').toLowerCase();

    if (cat.includes('software') || cat.includes('web') || cat.includes('app')) {
      return [
        {
          id: 'primary_lang',
          question: 'Kaunsi programming language me strong banna chahte ho?',
          type: 'select',
          options: ['JavaScript / TypeScript', 'C++ (DSA Heavy)', 'Java (Enterprise & DSA)', 'Python', 'Go / Rust', 'Flutter (Dart)'],
        },
        {
          id: 'dsa_level',
          question: 'DSA (Data Structures & Algorithms) me abhi aapka comfort level kya hai?',
          type: 'select',
          options: ['Beginner (Basics of Arrays/Loops)', 'Basic (Can solve Easy LeetCode)', 'Intermediate (Trees, Graphs, DP basics)', 'Advanced (150+ LeetCode solved)'],
        },
        {
          id: 'target_companies',
          question: 'Aapka target kis type ki companies me hai?',
          type: 'select',
          options: ['Top Product Companies (MAANG / Tier-1)', 'Fast-Growing Startups (Fintech/SaaS)', 'Service / Mass Recruiters (TCS/Infosys/Wipro)', 'Remote International Companies'],
        },
        {
          id: 'projects_done',
          question: 'Abhi tak kitne real-world projects bana kar GitHub par deploy kiye hain?',
          type: 'select',
          options: ['0 (Sirf tutorial dekhe hain)', '1-2 Mini Projects', '3-5 Good Projects', '5+ Deployed Full-Stack Apps'],
        }
      ];
    }

    if (cat.includes('ai') || cat.includes('data')) {
      return [
        {
          id: 'math_background',
          question: 'Mathematics & Statistics (Linear Algebra, Probability, Calculus) me kitna comfort hai?',
          type: 'select',
          options: ['Weak (Need simple step-by-step guidance)', 'Average (Passed college exams)', 'Strong (Comfortable with formulas & vectors)'],
        },
        {
          id: 'python_stack',
          question: 'Python Data ecosystem me kya kya aata hai?',
          type: 'multiselect',
          options: ['NumPy & Pandas', 'Matplotlib / Seaborn', 'Scikit-Learn (ML)', 'PyTorch / TensorFlow (Deep Learning)', 'LangChain / Vector DBs (LLMs)', 'None yet'],
        },
        {
          id: 'ai_focus',
          question: 'AI me aapka main interest kisme hai?',
          type: 'select',
          options: ['Generative AI & LLM Applications (RAG/Agents)', 'Computer Vision (CV/Image processing)', 'Data Analytics & Business Intelligence (SQL/PowerBI)', 'Research & Foundation Models'],
        },
        {
          id: 'kaggle_exp',
          question: 'Kaggle ya real datasets par hands-on kaam kiya hai?',
          type: 'select',
          options: ['Nahi, bilkul fresh start hai', 'Haan, basic datasets explore kiye hain', 'Competitions me participate kiya hai'],
        }
      ];
    }

    if (cat.includes('gate') || cat.includes('higher')) {
      return [
        {
          id: 'gate_attempt',
          question: 'GATE exam kab attempt karne ka target hai?',
          type: 'select',
          options: ['GATE 2027 (Pre-Final / Final Year)', 'GATE 2028', 'Direct Higher Studies (MS Abroad)'],
        },
        {
          id: 'coaching_status',
          question: 'Aapki preparation ka mode kya hai?',
          type: 'select',
          options: ['Self-Study with Standard Textbooks & NPTEL', 'Online Coaching (PW / Made Easy / Unacademy)', 'College Lectures + PYQ Solving'],
        },
        {
          id: 'pyq_status',
          question: 'Past 10 Years GATE PYQs solve kiye hain?',
          type: 'select',
          options: ['Not started yet', '1-2 Subjects completed', '5+ Subjects completed with short notes'],
        },
        {
          id: 'target_outcome',
          question: 'Primary Target kya hai?',
          type: 'select',
          options: ['PSU Job (IOCL, NTPC, ONGC, BARC)', 'M.Tech / MS at IIT Bombay / IISc / IIT Delhi', 'State Engineering Assistant Engineer'],
        }
      ];
    }

    if (cat.includes('hackathon')) {
      return [
        {
          id: 'team_status',
          question: 'Hackathon team ready hai ya solo part lena hai?',
          type: 'select',
          options: ['Team of 4-6 members ready', 'Looking for teammates in college', 'Solo developer'],
        },
        {
          id: 'idea_stage',
          question: 'Problem statement ya project idea ready hai?',
          type: 'select',
          options: ['Idea already finalized & validated', 'Brainstorming 2-3 unique concepts', 'Need AI idea recommendations'],
        },
        {
          id: 'speed_prototyping',
          question: '36 hours me working prototype build karne ka experience hai?',
          type: 'select',
          options: ['First time participating', '1-2 Hackathons attended', 'Won state/national level hackathon before'],
        },
        {
          id: 'presentation_skill',
          question: 'Jury ke samne 3-minute pitch & live demo presentation level:',
          type: 'select',
          options: ['Need training on pitch deck & speaking', 'Moderate (Can explain tech stack)', 'Confident & persuasive speaker'],
        }
      ];
    }

    if (cat.includes('startup')) {
      return [
        {
          id: 'startup_stage',
          question: 'Aapka startup idea abhi kis stage par hai?',
          type: 'select',
          options: ['Idea Stage (Validating problem)', 'MVP Built (Basic prototype working)', 'Early Traction (Have initial users/testing)', 'Looking for Co-founder'],
        },
        {
          id: 'bihar_startup_grant',
          question: 'Bihar Government Startup Policy (₹10 Lakhs Seed Grant) ke baare me jante hain?',
          type: 'select',
          options: ['Haan, apply karna chahte hain', 'Pata hai par documentation help chahiye', 'First time sun rahe hain'],
        },
        {
          id: 'domain_area',
          question: 'Target Sector kya hai?',
          type: 'select',
          options: ['Agritech & Rural Innovation', 'EdTech & Student Platforms', 'AI SaaS & B2B Software', 'Clean Energy / Drone Tech / Robotics'],
        }
      ];
    }

    // Default / Custom Questions
    return [
      {
        id: 'primary_challenge',
        question: 'Is goal ko achieve karne me sabse bada challenge kya lagta hai?',
        type: 'select',
        options: ['Lack of structured step-by-step guidance', 'Time management with college semester exams', 'Lack of practical project exposure', 'Doubt resolution & mentorship'],
      },
      {
        id: 'portfolio_status',
        question: 'Aapka current proof of work (GitHub / Portfolio / Resume) ready hai?',
        type: 'select',
        options: ['Nahi, bilkul start se banana hai', 'Basic resume hai par projects weak hain', 'Ready hai, optimize karna hai'],
      },
      {
        id: 'target_milestone',
        question: 'Agle 30 dino me sabse pehla major milestone kya hona chahiye?',
        type: 'text',
        placeholder: 'e.g. Master C++ DSA fundamentals, or build my first responsive web project',
      }
    ];
  }

  /* BEU-GOALMAP-2: Multi-Dimensional Student Skill Gap Analyzer
   * Compares student-assessed proficiency against target role benchmarks to pinpoint exact missing competencies.
   * Classifies skills into high priority, medium priority, and prerequisite engineering dependencies. */
  static analyzeSkillGaps(params: {
    category: string;
    existingSkills: string[];
    skillRatings?: Record<string, SkillLevelType>;
    currentLevel: SkillLevelType | string;
    hoursDaily: number;
  }) {
    const preset = GOAL_PRESETS.find(p => p.category === params.category) || GOAL_PRESETS[0];
    const userSkillsUpper = params.existingSkills.map(s => s.trim().toLowerCase());

    const alreadyLearned: string[] = [];
    const inProgress: string[] = [];
    const missingSkills: string[] = [];

    preset.defaultSkillsNeeded.forEach(skill => {
      const isKnown = userSkillsUpper.some(us => skill.toLowerCase().includes(us) || us.includes(skill.toLowerCase().split(' ')[0]));
      if (isKnown) {
        alreadyLearned.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // If missingSkills is empty, ensure high-yield skills are represented
    if (missingSkills.length === 0) {
      missingSkills.push(...preset.defaultSkillsNeeded.slice(2));
    }

    const highPriority = missingSkills.slice(0, 3);
    const mediumPriority = missingSkills.slice(3);

    const currentPositionSummary = alreadyLearned.length > 0
      ? `Aapke paas ${alreadyLearned.slice(0, 3).join(', ')} ki foundation hai (Level: ${params.currentLevel.toUpperCase()}).`
      : `Aap abhi bilkul fresh start par hain (Level: ${params.currentLevel.toUpperCase()}).`;

    const targetPositionSummary = `Goal "${preset.title}" achieve karne ke liye ${missingSkills.length} core competencies master karni hain.`;

    const prerequisitesNeeded = [
      'Git & GitHub Version Control',
      'Daily 1-2 hours dedicated practical coding habit',
      'Core problem decomposition logic'
    ];

    return {
      currentPositionSummary,
      targetPositionSummary,
      alreadyLearned,
      inProgress,
      skillGap: missingSkills,
      missingSkills,
      highPriority,
      mediumPriority,
      prerequisitesNeeded,
    };
  }

  /* BEU-GOALMAP-3: Calibrated Day-by-Day Daily Action Schedule Synthesizer
   * Produces a personalized Day 1 - Day 14 schedule answering 'Aaj Mujhe Kya Karna Hai?'.
   * Formats task durations strictly according to the student's daily available study slots (30m, 1h, 2h, 3h+). */
  static generateDailyActionSchedule(hoursDaily: number, category: string): DailyActionWeek[] {
    const durationMinutes = hoursDaily <= 0.5 ? 30 : hoursDaily <= 1 ? 60 : hoursDaily <= 2 ? 120 : 180;
    const cat = category.toLowerCase();

    let week1Theme = 'Foundation & Environment Setup';
    let week1Tasks = [
      { day: 1, label: 'Day 1 - Mon', title: 'Setup Development Environment & Git Repository', desc: 'Install VS Code, Git, Node.js or C++ compiler. Initialize first GitHub repository.', cat: 'learn' as const },
      { day: 2, label: 'Day 2 - Tue', title: 'Syntax Fundamentals & Variable Structures', desc: 'Practice basic syntax, data types, and standard input/output formatting.', cat: 'learn' as const },
      { day: 3, label: 'Day 3 - Wed', title: 'Conditionals, Loops & Control Flow Drill', desc: 'Solve 5 logic puzzles utilizing if-else statements and while/for loops.', cat: 'practice' as const },
      { day: 4, label: 'Day 4 - Thu', title: 'Functions, Modularity & Memory Models', desc: 'Understand pass-by-value vs pass-by-reference and modular code separation.', cat: 'learn' as const },
      { day: 5, label: 'Day 5 - Fri', title: 'Arrays, Strings & Basic Traversal', desc: 'Solve 4 array traversal and string manipulation problems on LeetCode/HackerRank.', cat: 'practice' as const },
      { day: 6, label: 'Day 6 - Sat', title: 'Mini Console Project Implementation', desc: 'Build a CLI-based interactive calculator, to-do tracker, or formula solver from scratch.', cat: 'project' as const },
      { day: 7, label: 'Day 7 - Sun', title: 'Week 1 Review, Git Commit & Revision', desc: 'Push code to GitHub with proper README.md and revise weak conceptual points.', cat: 'revision' as const },
    ];

    let week2Theme = 'Core Problem Solving & Architecture';
    let week2Tasks = [
      { day: 8, label: 'Day 8 - Mon', title: 'Data Structures Foundations (Time & Space Complexity)', desc: 'Calculate Big-O time and space complexity on loops and standard sorting.', cat: 'learn' as const },
      { day: 9, label: 'Day 9 - Tue', title: 'Two-Pointer & Sliding Window Technique', desc: 'Solve 3 medium difficulty subarray and string matching coding problems.', cat: 'practice' as const },
      { day: 10, label: 'Day 10 - Wed', title: 'Object-Oriented Design & Clean Code Principles', desc: 'Implement encapsulation, inheritance, and modular interfaces.', cat: 'learn' as const },
      { day: 11, label: 'Day 11 - Thu', title: 'Hashing, HashMaps & Frequency Counters', desc: 'Solve Two-Sum, Group Anagrams, and frequency count challenges.', cat: 'practice' as const },
      { day: 12, label: 'Day 12 - Fri', title: 'Connecting Front & Back Components', desc: 'Write your first API query or file I/O operations with error handling.', cat: 'learn' as const },
      { day: 13, label: 'Day 13 - Sat', title: 'Mini Application Milestone Build', desc: 'Combine data structures with a working UI or automated script demonstration.', cat: 'project' as const },
      { day: 14, label: 'Day 14 - Sun', title: 'Mock Test Drill & Progress Assessment', desc: 'Take a timed 60-minute coding assessment and update GoalMap progress.', cat: 'revision' as const },
    ];

    if (cat.includes('gate') || cat.includes('higher')) {
      week1Theme = 'Engineering Maths & Subject Foundations';
      week1Tasks = [
        { day: 1, label: 'Day 1 - Mon', title: 'Linear Algebra: Matrices, Determinants & Rank', desc: 'Study matrix properties and compute rank using row-echelon reduction.', cat: 'learn' as const },
        { day: 2, label: 'Day 2 - Tue', title: 'Eigenvalues & Eigenvectors Derivations', desc: 'Derive characteristic polynomials and solve 5 standard GATE PYQs.', cat: 'practice' as const },
        { day: 3, label: 'Day 3 - Wed', title: 'Calculus: Limits, Continuity & Differentiability', desc: 'Master L-Hopital rule, Mean Value Theorems, and directional derivatives.', cat: 'learn' as const },
        { day: 4, label: 'Day 4 - Thu', title: 'Integration & Maximum/Minimum Optimization', desc: 'Solve 6 optimization and definite integration previous GATE questions.', cat: 'practice' as const },
        { day: 5, label: 'Day 5 - Fri', title: 'Core Technical Subject Unit 1 Deep Dive', desc: 'Study core definitions, state transition diagrams, and architectural blocks.', cat: 'learn' as const },
        { day: 6, label: 'Day 6 - Sat', title: 'Unit 1 PYQ 10-Year Comprehensive Solver', desc: 'Solve 15 multiple choice and numerical answer type questions without calculator.', cat: 'practice' as const },
        { day: 7, label: 'Day 7 - Sun', title: 'Formula Handbook & Weekly Short Notes', desc: 'Compile 2-page concise revision sheet for quick weekly recall.', cat: 'revision' as const },
      ];
    }

    return [
      {
        weekNumber: 1,
        weekTheme: week1Theme,
        days: week1Tasks.map((t, idx) => ({
          id: `task-w1-d${t.day}`,
          dayNumber: t.day,
          dayLabel: t.label,
          title: t.title,
          description: t.desc,
          durationMinutes,
          category: t.cat,
          completed: false,
        })),
      },
      {
        weekNumber: 2,
        weekTheme: week2Theme,
        days: week2Tasks.map((t, idx) => ({
          id: `task-w2-d${t.day}`,
          dayNumber: t.day,
          dayLabel: t.label,
          title: t.title,
          description: t.desc,
          durationMinutes,
          category: t.cat,
          completed: false,
        })),
      }
    ];
  }

  /**
   * Generates a fully personalized, multi-phase GoalMap based on student profile.
   */
  static generatePersonalizedGoalMap(params: {
    userId: string;
    goalTitle: string;
    category: GoalCategoryType | string;
    targetOutcome?: string;
    targetDeadline?: string;
    branch: string;
    semester: number;
    college?: string;
    academicLevel?: string;
    cgpaRange?: string;
    backlogStatus?: string;
    favouriteSubjects?: string[];
    weakSubjects?: string[];
    currentLevel: SkillLevelType | string;
    existingSkills: string[];
    skillRatings?: Record<string, SkillLevelType>;
    hoursDaily: number;
    hoursWeekend?: number;
    learningPace?: 'Fast' | 'Balanced' | 'Flexible';
    learningPreference?: string[];
    goalSpecificAnswers?: Record<string, any>;
  }): GoalMap {
    const {
      userId, goalTitle, category, targetOutcome, targetDeadline,
      branch, semester, currentLevel, existingSkills, hoursDaily
    } = params;

    const preset = GOAL_PRESETS.find(p => p.category === category || p.title.toLowerCase() === goalTitle.toLowerCase()) || GOAL_PRESETS[0];

    const finalTitle = goalTitle.trim() || preset.title;
    const finalOutcome = targetOutcome?.trim() || preset.targetOutcome;
    const finalDeadline = targetDeadline?.trim() || preset.defaultDeadline;

    // 1. Skill Gap Analysis
    const gapAnalysis = this.analyzeSkillGaps({
      category: preset.category,
      existingSkills,
      skillRatings: params.skillRatings,
      currentLevel,
      hoursDaily,
    });

    // 2. BEU Academic Curriculum Synergy
    const beuAcademicContext = this.deriveBEUSynergy(branch, semester, finalTitle);

    // 3. Dependency-Ordered Milestones
    const milestones = this.generateMilestones(preset.category, finalTitle, hoursDaily, finalDeadline);

    // 4. Daily Action Schedule
    const dailySchedule = this.generateDailyActionSchedule(hoursDaily, preset.category);

    return {
      id: `goalmap-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      goalTitle: finalTitle,
      category: preset.category,
      targetOutcome: finalOutcome,
      targetDeadline: finalDeadline,
      createdAt: new Date().toISOString(),
      progressPercent: 0,
      streakDays: 1,
      studentProfile: {
        branch: branch || 'CSE',
        semester: semester || 3,
        college: params.college || 'Government Engineering College',
        academicLevel: params.academicLevel || 'B.Tech Undergrad',
        cgpaRange: params.cgpaRange || '7.5 - 8.5',
        backlogStatus: params.backlogStatus || '0 Backlogs',
        favouriteSubjects: params.favouriteSubjects || ['Data Structures', 'Operating Systems'],
        weakSubjects: params.weakSubjects || ['Engineering Mathematics'],
        currentLevel: currentLevel || 'basic',
        existingSkills: existingSkills || ['C/C++', 'HTML/CSS'],
        skillRatings: params.skillRatings || {},
        hoursDaily: hoursDaily || 2,
        hoursWeekend: params.hoursWeekend || 4,
        learningPace: params.learningPace || 'Balanced',
        learningPreference: params.learningPreference || ['Hands-on Projects', 'Video Tutorials', 'Practice Drills'],
        goalSpecificAnswers: params.goalSpecificAnswers || {},
      },
      gapAnalysis,
      beuAcademicContext,
      milestones,
      dailySchedule,
      healthCheck: {
        status: 'ON_TRACK',
        summary: `Personalized ${finalDeadline} timeline generated successfully. Calibrated for ${hoursDaily} hrs/day at ${params.learningPace || 'Balanced'} pace.`,
        suggestions: [
          'Complete Week 1 Day 1 setup task to begin your active study streak.',
          'Solve the recommended LeetCode/practice drills in Phase 1 before jumping to projects.',
          `Leverage your current Semester ${semester} subjects (${beuAcademicContext.relevantSubjects.slice(0, 2).join(', ')}) for mutual theory and career leverage.`
        ],
      },
    };
  }

  /* BEU-GOALMAP-4: Semester-Aware BEU Academic & Industry Curriculum Synergy Bridge
   * Maps student's enrolled semester university subjects directly to their professional goal.
   * Empowers students to balance end-term 14-mark derivations with real-world project portfolios. */
  private static deriveBEUSynergy(branch: string, semester: number, goalTitle: string) {
    const sem = Number(semester) || 3;
    let relevantSubjects = ['Data Structures & Algorithms (CS301)', 'Discrete Mathematics (MA301)', 'Digital Electronics (EC301)'];
    let highYieldUnits = ['Unit 2: Linear Data Structures', 'Unit 3: Non-Linear Trees & Graphs', 'Unit 4: Sorting & Dynamic Programming'];
    let examPatternFocus = 'BEU Compulsory 7-mark theoretical proofs & 14-mark algorithm implementations with complexity derivations.';

    if (sem === 1 || sem === 2) {
      relevantSubjects = ['Programming for Problem Solving (CS101)', 'Engineering Mathematics I & II', 'Basic Electrical Engineering'];
      highYieldUnits = ['Unit 3: Pointers & Dynamic Memory', 'Unit 4: Arrays & Structures in C', 'Unit 5: File Operations'];
      examPatternFocus = 'Fundamentals of C syntax, pointer arithmetic, and linear search/bubble sort flowcharts.';
    } else if (sem === 4) {
      relevantSubjects = ['Design & Analysis of Algorithms (CS401)', 'Database Management Systems (CS402)', 'Computer Organization (CS403)'];
      highYieldUnits = ['Unit 2: Greedy & Dynamic Programming', 'Unit 3: SQL Normalization (3NF/BCNF)', 'Unit 4: Transaction & Concurrency'];
      examPatternFocus = 'DBMS ER-to-Relational conversion, B-Trees index derivations, and recurrence relation solutions.';
    } else if (sem === 5 || sem === 6) {
      relevantSubjects = ['Operating Systems (CS501)', 'Computer Networks (CS502)', 'Web Technologies & Software Engineering'];
      highYieldUnits = ['Unit 2: Process Synchronization & Semaphores', 'Unit 3: Deadlock Detection & Avoidance', 'Unit 4: TCP/IP Subnetting & Routing'];
      examPatternFocus = 'Banker Algorithm, Paging memory translation numericals, and TCP handshake sequence diagrams.';
    } else if (sem >= 7) {
      relevantSubjects = ['Cloud Computing & AI Elective', 'Industrial Summer Training Viva', 'Final Year Major Capstone Project'];
      highYieldUnits = ['Unit 1: Microservices Architecture', 'Unit 3: Model Deployment & CI/CD', 'Unit 5: Capstone System Defense'];
      examPatternFocus = 'Industry project demonstration, viva-voce technical defense, and production architecture defense.';
    }

    return {
      relevantSubjects,
      highYieldUnits,
      examPatternFocus,
      curriculumBridgeNote: `BEU Semester ${sem} syllabus directly covers the foundations needed for ${goalTitle}. Master university derivations during the week to score high SGPA while building hands-on projects on weekends.`
    };
  }

  /* BEU-GOALMAP-5: Dependency-Ordered Milestone & Project Architecture Synthesizer
   * Constructs strict sequential phases (Foundation -> Specialization -> Full Stack/Core -> Scale -> Placement).
   * Bundles full what-to-learn, why-this-step, practice drills, capstone specifications, and verifiable criteria. */
  private static generateMilestones(category: string, goalTitle: string, hoursDaily: number, deadline: string): GoalMilestone[] {
    const cat = category.toLowerCase();

    if (cat.includes('gate') || cat.includes('higher')) {
      return [
        {
          id: 'ms-gate-1',
          phaseNumber: 1,
          title: 'Phase 1: Engineering Mathematics & Discrete Structures',
          timeframe: 'Month 1 - 2',
          whyThisStep: 'Mathematics carries a guaranteed 15 marks in GATE and forms the logical foundation for Algorithm complexity and TOC.',
          whatToLearn: ['Linear Algebra (Eigenvalues, Rank)', 'Calculus & Optimization', 'Probability & Distributions', 'Discrete Math (Set theory, Graphs, Logic)'],
          whatToDo: 'Study standard definitions, solve 100 past GATE math problems, and write short formula cards for daily morning recall.',
          status: 'in_progress',
          estimatedHours: 60,
          tasks: [
            { id: 't-g1-1', title: 'Complete Linear Algebra matrix ranks & eigenvalues', description: 'Solve standard characteristic equation derivations.', estimatedHours: 12, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-g1-2', title: 'Master Discrete Graph Theory & Propositional Logic', description: 'Truth tables, Euler graphs, and recurrence relations.', estimatedHours: 14, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-g1-3', title: 'Solve 15-Year GATE Math PYQs', description: 'Untimed accuracy drill followed by 30-min timed test.', estimatedHours: 16, priority: 'HIGH', completed: false, category: 'practice' },
          ],
          recommendedResources: [
            { id: 'r-g1', title: 'NPTEL Discrete Mathematics by Prof. Sudarshan', type: 'video', url: 'https://nptel.ac.in/courses/106106094', whyUseful: 'Most authoritative IIT video series for GATE logic concepts.', difficulty: 'Intermediate', estimatedTime: '20 Hours' },
            { id: 'r-g2', title: 'GATE Overflow Previous Year Solved Questions', type: 'practice', url: 'https://gateoverflow.in/', whyUseful: 'Community peer-reviewed answer keys for tricky ambiguous MCQs.', difficulty: 'Advanced', estimatedTime: '15 Hours' },
          ],
          practiceDrills: [
            { title: 'Probability Distributions & Bayes Theorem Drill', platform: 'GATE Overflow', url: 'https://gateoverflow.in' },
            { title: 'Graph Theory & Tree Properties Quiz', platform: 'GeeksforGeeks GATE', url: 'https://practice.geeksforgeeks.org' }
          ],
          completionCriteria: ['Score > 80% on 30-question Engineering Mathematics sectional test', 'All 15 years GATE Math questions solved with clear handwritten notes'],
        },
        {
          id: 'ms-gate-2',
          phaseNumber: 2,
          title: 'Phase 2: Core Data Structures, Algorithms & TOC',
          timeframe: 'Month 3 - 4',
          whyThisStep: 'Algorithms, Data Structures and Theory of Computation contribute ~25 marks of predictable, highly scoring questions.',
          whatToLearn: ['Asymptotic Analysis & Recurrences', 'Trees, Heaps & Graph Traversals', 'Dynamic Programming & Greedy Approaches', 'DFA/NFA, Regular Expressions & Turing Machines'],
          whatToDo: 'Derive space-time complexity bounds, draw finite automata for all language subsets, and practice edge cases.',
          status: 'upcoming',
          estimatedHours: 80,
          tasks: [
            { id: 't-g2-1', title: 'Master Regular Expressions & DFA Minimization', description: 'Myhill-Nerode theorem and pumping lemma applications.', estimatedHours: 18, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-g2-2', title: 'Solve 100 Algorithm & Tree Traversal PYQs', description: 'Binary Search Trees, AVL rotations, and Dijkstra shortest paths.', estimatedHours: 22, priority: 'HIGH', completed: false, category: 'practice' },
          ],
          recommendedResources: [
            { id: 'r-g3', title: 'Introduction to Algorithms (CLRS)', type: 'doc', url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/', whyUseful: 'Gold standard reference for formal complexity proofs.', difficulty: 'Advanced', estimatedTime: '30 Hours' }
          ],
          completionCriteria: ['Zero errors on DFA state minimization and closure property tables'],
        },
        {
          id: 'ms-gate-3',
          phaseNumber: 3,
          title: 'Phase 3: Full Syllabus Mock Tests & Speed Calibration',
          timeframe: 'Month 5 - 6',
          whyThisStep: 'Converting knowledge into top 500 AIR requires 3-hour exam endurance, accuracy under negative marking, and virtual calculator mastery.',
          whatToLearn: ['Virtual Calculator Speed', 'Negative Marking Avoidance', 'Multi-Subject Synthesis', 'Revision of 120 Formula Short Notes'],
          whatToDo: 'Take 10 full-length 65-question computer-based mock tests, analyze error logs, and eliminate weak topic clusters.',
          status: 'upcoming',
          estimatedHours: 70,
          tasks: [
            { id: 't-g3-1', title: 'Full Length CBT Mock Test 1 to 5', description: 'Simulate 09:30 AM to 12:30 PM real exam conditions.', estimatedHours: 25, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-g3-2', title: 'Error Log & Mistake Notebook Revision', description: 'Categorize silly calculation mistakes vs conceptual gaps.', estimatedHours: 15, priority: 'HIGH', completed: false, category: 'beu_prep' },
          ],
          recommendedResources: [
            { id: 'r-g4', title: 'Official GATE Test Series Simulator', type: 'practice', url: 'https://gate.iitk.ac.in', whyUseful: 'Exact UI and virtual calculator simulation.', difficulty: 'Advanced', estimatedTime: '20 Hours' }
          ],
          completionCriteria: ['Consistently scoring 65+ marks across 5 consecutive national mock tests'],
        }
      ];
    }

    if (cat.includes('ai') || cat.includes('data')) {
      return [
        {
          id: 'ms-ai-1',
          phaseNumber: 1,
          title: 'Phase 1: Python Data Science Foundations & Vector Math',
          timeframe: 'Month 1',
          whyThisStep: 'High-performance computing in PyTorch and Pandas depends on vectorization and matrix dot products rather than slow Python loops.',
          whatToLearn: ['Python 3 Modern Features & OOP', 'NumPy Multi-dimensional Arrays & Broadcasting', 'Pandas DataFrames, Merging & GroupBy', 'Matplotlib & Seaborn Visualizations'],
          whatToDo: 'Write clean vectorized numerical scripts and perform Exploratory Data Analysis (EDA) on real Kaggle datasets.',
          status: 'in_progress',
          estimatedHours: 50,
          tasks: [
            { id: 't-ai1-1', title: 'NumPy 100 Exercises & Vectorized Matrix Multiplications', description: 'Eliminate Python for-loops using array broadcasting.', estimatedHours: 10, priority: 'HIGH', completed: false, category: 'practice' },
            { id: 't-ai1-2', title: 'Kaggle Titanic / Housing EDA & Cleaning Pipeline', description: 'Handle missing values, categorical encoding, and feature correlation.', estimatedHours: 14, priority: 'HIGH', completed: false, category: 'project' },
          ],
          recommendedResources: [
            { id: 'r-ai1', title: 'Python Data Science Handbook by Jake VanderPlas', type: 'doc', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', whyUseful: 'Complete free handbook covering NumPy, Pandas, Matplotlib, and Scikit-Learn.', difficulty: 'Beginner', estimatedTime: '15 Hours' }
          ],
          projectIdea: {
            title: 'Automated Bihar Engineering Admission Trends EDA',
            description: 'Download historical BCECE cutoffs and generate interactive statistical charts comparing opening and closing ranks.',
            techStack: ['Python', 'Pandas', 'Seaborn', 'Jupyter Notebook'],
            acceptanceCriteria: 'Generates clean markdown summary report with 5 visual correlation heatmaps.'
          },
          completionCriteria: ['Successfully clean and transform a raw 50,000-row CSV dataset without memory bottlenecks'],
        },
        {
          id: 'ms-ai-2',
          phaseNumber: 2,
          title: 'Phase 2: Machine Learning & Scikit-Learn Deep Dive',
          timeframe: 'Month 2 - 3',
          whyThisStep: 'Classical ML provides the intuition for loss functions, bias-variance tradeoff, regularization, and model evaluation metrics.',
          whatToLearn: ['Linear & Logistic Regression', 'Decision Trees, Random Forests & XGBoost', 'Model Evaluation (Precision, Recall, ROC-AUC, F1-Score)', 'Cross-Validation & Hyperparameter Tuning (GridSearch)'],
          whatToDo: 'Implement algorithms from scratch, tune hyperparameter grids, and submit predictions to competitive benchmarks.',
          status: 'upcoming',
          estimatedHours: 65,
          tasks: [
            { id: 't-ai2-1', title: 'Implement Gradient Descent & Logistic Regression from scratch', description: 'Code the forward pass, cross-entropy loss, and gradient update.', estimatedHours: 12, priority: 'HIGH', completed: false, category: 'learn' },
            { id: 't-ai2-2', title: 'Train XGBoost Model on Structured Tabular Data', description: 'Feature engineering, target encoding, and Optuna tuning.', estimatedHours: 16, priority: 'HIGH', completed: false, category: 'project' },
          ],
          recommendedResources: [
            { id: 'r-ai2', title: 'Coursera Machine Learning Specialization by Andrew Ng', type: 'video', url: 'https://www.coursera.org/specializations/machine-learning-introduction', whyUseful: 'World-renowned intuitive explanations of machine learning mechanics.', difficulty: 'Intermediate', estimatedTime: '25 Hours' }
          ],
          completionCriteria: ['Achieve Top 20% validation score on a Kaggle tabular competition dataset'],
        },
        {
          id: 'ms-ai-3',
          phaseNumber: 3,
          title: 'Phase 3: Deep Learning, LLMs & Production AI Deployment',
          timeframe: 'Month 4 - 6',
          whyThisStep: 'Modern industry AI roles demand LLM integration, Vector DBs, Retrieval-Augmented Generation (RAG), and FastAPI microservices.',
          whatToLearn: ['PyTorch Neural Networks & Tensors', 'Transformers & Attention Mechanisms', 'LangChain / LlamaIndex & Vector Embeddings', 'FastAPI, Docker & HuggingFace Spaces Deployment'],
          whatToDo: 'Build a production RAG application that reads academic syllabus PDFs and answers queries with verified citations.',
          status: 'upcoming',
          estimatedHours: 85,
          tasks: [
            { id: 't-ai3-1', title: 'Build RAG Question-Answering Pipeline with Pinecone & LangChain', description: 'Chunk documents, embed with text-embedding-3-small, and retrieve top-k context.', estimatedHours: 20, priority: 'HIGH', completed: false, category: 'project' },
            { id: 't-ai3-2', title: 'Deploy FastAPI AI Microservice with Docker Container', description: 'Containerize backend and host live demo on Render or HuggingFace.', estimatedHours: 14, priority: 'HIGH', completed: false, category: 'project' },
          ],
          recommendedResources: [
            { id: 'r-ai3', title: 'Hugging Face Deep Learning & NLP Course', type: 'doc', url: 'https://huggingface.co/learn/nlp-course', whyUseful: 'Practical guide to modern Transformer models and tokenizers.', difficulty: 'Advanced', estimatedTime: '20 Hours' }
          ],
          projectIdea: {
            title: 'BEU Academic AI Assistant with Live PDF RAG',
            description: 'Upload BEU university regulations and syllabus PDFs to query exact course outcomes and exam credit rules.',
            techStack: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'OpenAI/Gemini', 'Docker'],
            acceptanceCriteria: 'Sub-2-second response latency with clickable PDF page source citations.'
          },
          completionCriteria: ['Live public demo URL deployed with automated API documentation Swagger UI'],
        }
      ];
    }

    // Default Full-Stack / Software Dev / Placement 6-Phase Roadmap
    return [
      {
        id: 'ms-1',
        phaseNumber: 1,
        title: 'Phase 1: Programming Fundamentals & Git Mastery',
        timeframe: 'Month 1',
        whyThisStep: 'Clean coding habits, Git branching, and algorithmic logic are the mandatory prerequisite for every engineering interview.',
        whatToLearn: ['C++ / Java / Modern JavaScript ES6+', 'Memory Model, Pointers/References & Scopes', 'Git CLI (Branching, Merging, Pull Requests)', 'Linux CLI Basics'],
        whatToDo: 'Solve 30 fundamental coding challenges, build a CLI project, and set up a polished GitHub profile with green contribution streaks.',
        status: 'in_progress',
        estimatedHours: 45,
        tasks: [
          { id: 't-1-1', title: 'Master Loops, Functions & Array Memory Layout', description: 'Understand contiguous memory allocation and passing references.', estimatedHours: 8, priority: 'HIGH', completed: false, category: 'learn' },
          { id: 't-1-2', title: 'Solve 30 Easy Array & String Problems on LeetCode', description: 'Two Sum, Valid Palindrome, Best Time to Buy and Sell Stock.', estimatedHours: 14, priority: 'HIGH', completed: false, category: 'practice' },
          { id: 't-1-3', title: 'Create GitHub Profile README & Push First Project', description: 'Showcase clean markdown, badges, and version control workflow.', estimatedHours: 4, priority: 'MEDIUM', completed: false, category: 'project' },
        ],
        recommendedResources: [
          { id: 'r-1', title: 'JavaScript.info — The Modern JavaScript Tutorial', type: 'doc', url: 'https://javascript.info/', whyUseful: 'In-depth, crystal clear guide to modern JavaScript fundamentals.', difficulty: 'Beginner', estimatedTime: '15 Hours' },
          { id: 'r-2', title: 'Git & GitHub Crash Course by freeCodeCamp', type: 'video', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', whyUseful: 'Step-by-step terminal commands for branch management and pull requests.', difficulty: 'Beginner', estimatedTime: '2 Hours' },
        ],
        practiceDrills: [
          { title: 'LeetCode 75 — Array & String Warmup', platform: 'LeetCode', url: 'https://leetcode.com/studyplan/leetcode-75/' },
          { title: 'HackerRank Problem Solving 30 Days of Code', platform: 'HackerRank', url: 'https://www.hackerrank.com' },
        ],
        projectIdea: {
          title: 'CLI Task Manager & Expense Tracker',
          description: 'A robust command-line application in Node.js or C++ with persistent JSON file storage, priority tags, and filter commands.',
          techStack: ['Node.js' , 'TypeScript', 'Git'],
          acceptanceCriteria: 'Supports add, delete, mark completed, and persistent disk file saving with zero crashes.'
        },
        completionCriteria: ['30 LeetCode Easy problems solved', 'Clean Git repo with 5+ atomic commits'],
      },
      {
        id: 'ms-2',
        phaseNumber: 2,
        title: 'Phase 2: Modern Frontend & React Architecture',
        timeframe: 'Month 2',
        whyThisStep: 'Interactive user interfaces, component state management, and API rendering power modern enterprise web applications.',
        whatToLearn: ['HTML5 Semantic Elements & Responsive CSS', 'TailwindCSS Utility Design & Flex/Grid', 'React Hooks (useState, useEffect, useMemo, useCallback)', 'State Management (Zustand / Redux Toolkit)', 'REST API Client Fetching (Axios / TanStack Query)'],
        whatToDo: 'Build 2 responsive web applications from scratch, implement clean component hierarchies, and integrate public REST APIs.',
        status: 'upcoming',
        estimatedHours: 60,
        tasks: [
          { id: 't-2-1', title: 'Build Responsive Landing Page with TailwindCSS', description: 'Mobile-first navigation, responsive grid, and dark mode toggle.', estimatedHours: 10, priority: 'HIGH', completed: false, category: 'project' },
          { id: 't-2-2', title: 'Master React State Management & Custom Hooks', description: 'Create reusable data-fetching and debounce custom hooks.', estimatedHours: 15, priority: 'HIGH', completed: false, category: 'learn' },
          { id: 't-2-3', title: 'Integrate Live REST API with TanStack Query', description: 'Handle loading skeletons, pagination, and error boundaries.', estimatedHours: 12, priority: 'HIGH', completed: false, category: 'practice' },
        ],
        recommendedResources: [
          { id: 'r-3', title: 'Official React Documentation (react.dev)', type: 'doc', url: 'https://react.dev/', whyUseful: 'Interactive code sandboxes teaching modern React component mental models.', difficulty: 'Intermediate', estimatedTime: '18 Hours' },
        ],
        projectIdea: {
          title: 'BEU Student Academic Dashboard & CGPA Calculator',
          description: 'Interactive single-page app calculating exact university SGPA with branch-wise credit weights, grade targets, and dark mode.',
          techStack: ['React 18', 'TypeScript', 'TailwindCSS', 'Lucide Icons', 'Vite'],
          acceptanceCriteria: 'Flawless responsive design on mobile and desktop with instant local storage persistence.'
        },
        completionCriteria: ['Working React application deployed to Vercel/Netlify with zero console errors'],
      },
      {
        id: 'ms-3',
        phaseNumber: 3,
        title: 'Phase 3: Backend API Engineering & Database Modeling',
        timeframe: 'Month 3 - 4',
        whyThisStep: 'Secure authentication, relational SQL queries, data validation, and REST API design form the backend backbone of scalable software.',
        whatToLearn: ['Node.js & Express Architecture', 'RESTful API Standards & HTTP Status Codes', 'PostgreSQL & Prisma ORM / MongoDB', 'JWT Authentication & Password Hashing (bcrypt)', 'Input Validation (Zod) & Error Middleware'],
        whatToDo: 'Design relational database schemas with foreign keys, write unit tests, and build an authenticated multi-resource backend server.',
        status: 'upcoming',
        estimatedHours: 70,
        tasks: [
          { id: 't-3-1', title: 'Build JWT Authentication & Role-Based Access Control', description: 'Register, login, refresh tokens, and protect route middleware.', estimatedHours: 16, priority: 'HIGH', completed: false, category: 'learn' },
          { id: 't-3-2', title: 'Design Normalized PostgreSQL Schema with Prisma ORM', description: 'Write one-to-many and many-to-many relations with cascade rules.', estimatedHours: 18, priority: 'HIGH', completed: false, category: 'project' },
          { id: 't-3-3', title: 'Implement Zod Validation & Global Error Handler', description: 'Prevent SQL injection and return standard JSend error responses.', estimatedHours: 10, priority: 'HIGH', completed: false, category: 'practice' },
        ],
        recommendedResources: [
          { id: 'r-4', title: 'Prisma ORM Official PostgreSQL Guide', type: 'doc', url: 'https://www.prisma.io/docs', whyUseful: 'Best-in-class TypeScript ORM documentation with interactive schema design.', difficulty: 'Intermediate', estimatedTime: '10 Hours' }
        ],
        projectIdea: {
          title: 'University Notes & Community Marketplace Backend',
          description: 'REST API featuring authentication, college branch filtering, rating system, and file upload metadata handling.',
          techStack: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Prisma', 'Zod', 'JWT'],
          acceptanceCriteria: 'All 8 endpoints documented with Postman/Swagger and verified with Supertest.'
        },
        completionCriteria: ['Passes 10+ automated Jest integration tests against a test database'],
      },
      {
        id: 'ms-4',
        phaseNumber: 4,
        title: 'Phase 4: Full-Stack Capstone & Real-Time WebSockets',
        timeframe: 'Month 5',
        whyThisStep: 'Recruiters evaluate candidate quality based on complex production architectures, real-time sync, and end-to-end polish.',
        whatToLearn: ['Full-Stack Integration (Vite / Next.js + Express)', 'Socket.IO Real-Time Messaging & Notifications', 'Cloud File Storage (Cloudinary / AWS S3)', 'Docker Containerization & Render/Railway Hosting'],
        whatToDo: 'Build a production-grade full-stack web platform with live chat, optimistic UI updates, and automated deployments.',
        status: 'upcoming',
        estimatedHours: 75,
        tasks: [
          { id: 't-4-1', title: 'Connect Full-Stack Monorepo with Shared Types', description: 'End-to-end type safety between frontend API client and backend.', estimatedHours: 14, priority: 'HIGH', completed: false, category: 'project' },
          { id: 't-4-2', title: 'Integrate Real-Time Socket.IO Channels', description: 'Broadcast live notifications, active presence, and chat rooms.', estimatedHours: 16, priority: 'HIGH', completed: false, category: 'learn' },
          { id: 't-4-3', title: 'Deploy Full-Stack App with SSL & Custom Domain', description: 'Configure environment variables and database connection pooling.', estimatedHours: 8, priority: 'HIGH', completed: false, category: 'project' },
        ],
        recommendedResources: [
          { id: 'r-5', title: 'Socket.IO Official Documentation & Chat Guide', type: 'doc', url: 'https://socket.io/docs/v4/', whyUseful: 'Step-by-step guide to WebSockets, rooms, and reconnection handlers.', difficulty: 'Intermediate', estimatedTime: '6 Hours' }
        ],
        projectIdea: {
          title: 'BEU Connect Peer Collaboration & Code Sandbox',
          description: 'A full-stack collaborative platform with real-time peer study rooms, live code snippet sharing, and instant college chat.',
          techStack: ['React', 'Node.js', 'PostgreSQL', 'Socket.IO', 'TailwindCSS', 'Docker'],
          acceptanceCriteria: 'Multi-user real-time room communication with sub-100ms sync latency.'
        },
        completionCriteria: ['Live public demo URL linked to GitHub repository with 100+ GitHub stars or peer testers'],
      },
      {
        id: 'ms-5',
        phaseNumber: 5,
        title: 'Phase 5: DSA Problem Solving & Placement Interview Prep',
        timeframe: 'Month 6',
        whyThisStep: 'Technical interview rounds at top software companies demand rapid data structure recall, clean whiteboard coding, and mock interview practice.',
        whatToLearn: ['NeetCode 150 / Striver SDE Sheet (Trees, Graphs, DP, Tries)', 'System Design Basics (Caching, Load Balancers, Sharding)', 'STAR Method for Behavioral / HR Questions', 'ATS-Optimized Tech Resume Construction'],
        whatToDo: 'Solve 150 LeetCode problems, conduct 5 peer mock interviews, and apply to 20 verified software openings.',
        status: 'upcoming',
        estimatedHours: 80,
        tasks: [
          { id: 't-5-1', title: 'Complete Blind 75 / NeetCode 150 Core Problems', description: 'Focus on Binary Trees, DFS/BFS Graph traversals, and 1D/2D DP.', estimatedHours: 35, priority: 'HIGH', completed: false, category: 'practice' },
          { id: 't-5-2', title: 'Construct ATS-Optimized Single-Page Tech Resume', description: 'Quantify project impact metrics (e.g. reduced latency by 40%).', estimatedHours: 8, priority: 'HIGH', completed: false, category: 'beu_prep' },
          { id: 't-5-3', title: 'Conduct 3 Live Peer Mock Technical Interviews', description: 'Practice speaking out loud while coding under a 45-minute timer.', estimatedHours: 12, priority: 'HIGH', completed: false, category: 'practice' },
        ],
        recommendedResources: [
          { id: 'r-6', title: 'NeetCode.io — Structured DSA Roadmap & Video Solutions', type: 'practice', url: 'https://neetcode.io/', whyUseful: 'Curated 150 essential coding interview patterns with video derivations.', difficulty: 'Advanced', estimatedTime: '40 Hours' },
          { id: 'r-7', title: 'Striver SDE Sheet & TakeUForward', type: 'doc', url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', whyUseful: 'Most popular placement preparation sheet among Indian engineering undergraduates.', difficulty: 'Advanced', estimatedTime: '35 Hours' }
        ],
        practiceDrills: [
          { title: 'Blind 75 Curated LeetCode Patterns', platform: 'LeetCode', url: 'https://leetcode.com' },
          { title: 'Pramp Free Peer Mock Interview', platform: 'Pramp', url: 'https://www.pramp.com' }
        ],
        completionCriteria: ['150+ LeetCode problems solved', 'Score 85%+ on ATS resume review scan'],
      }
    ];
  }
}
