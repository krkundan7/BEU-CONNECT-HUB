/**
 * BEU Official Curriculum & Academic Knowledge Base
 * Sourced directly from:
 * - BEU B.Tech Syllabus: https://beu-bih.ac.in/academics/Syllabus/B.Tech
 * - BEU B.Tech Programmes: https://beu-bih.ac.in/academics/Program/B.Tech
 * - BEU UG Regulation 2026-27: https://beu-bih.ac.in/backend/1778027052729-UG%20Regulation_05.04.2026.pdf
 */

export interface OfficialBranchData {
  id: string;
  name: string;
  code: string;
  officialCode: string;
  category: 'CORE' | 'EMERGING_TECH' | 'INTERDISCIPLINARY';
  hasOfficialSyllabus: boolean;
  syllabusStatus: 'AVAILABLE' | 'PARTIAL' | 'NOT_AVAILABLE';
  sourceUrl: string;
  description: string;
}

export interface OfficialRegulationData {
  id: string;
  code: string;
  name: string;
  effectiveFromYear: number;
  officialDocumentUrl: string;
  description: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'REVISED';
}

export interface OfficialSessionData {
  id: string;
  name: string;
  isActive: boolean;
}

export interface OfficialSubTopicData {
  id: string;
  orderIndex: number;
  title: string;
  contentSummary?: string;
}

export interface OfficialTopicData {
  id: string;
  orderIndex: number;
  title: string;
  description?: string;
  hours: number;
  isCore: boolean;
  learningOutcomes: string[];
  subTopics: OfficialSubTopicData[];
}

export interface OfficialUnitData {
  id: string;
  unitNumber: number;
  unitTitle: string;
  hours: number;
  description?: string;
  examFrequency: 'HIGH' | 'MEDIUM' | 'LOW';
  sourceUrl: string;
  topics: OfficialTopicData[];
}

export interface OfficialSubjectData {
  id: string;
  code: string;
  name: string;
  shortName: string;
  branchCode: string;
  semesterNumber: number;
  regulationCode: string;
  type: 'THEORY' | 'PRACTICAL' | 'TUTORIAL' | 'DESIGN' | 'PROJECT' | 'MANDATORY';
  category: 'PCC' | 'BSC' | 'ESC' | 'HSMC' | 'PEC' | 'OEC' | 'PROJ' | 'MC';
  credits: number;
  ltp: string;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  internalMarks: number;
  endSemMarks: number;
  totalMarks: number;
  description: string;
  prerequisites?: string;
  sourceUrl: string;
  sourceDocumentName: string;
  isOfficialSource: boolean;
  lastVerifiedAt: string;
  units: OfficialUnitData[];
}

// ------------------------------------------------------------------------------------------------
// 1. ALL 34 OFFICIAL BEU B.TECH PROGRAMMES
// ------------------------------------------------------------------------------------------------
export const BEU_OFFICIAL_BRANCHES: OfficialBranchData[] = [
  {
    id: 'branch-cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    officialCode: '103',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Comprehensive curriculum covering algorithms, computing systems, software development, data structures, AI and cloud infrastructure.',
  },
  {
    id: 'branch-ce',
    name: 'Civil Engineering',
    code: 'CE',
    officialCode: '101',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Structural mechanics, geotechnical engineering, environmental engineering, surveying, and smart transportation systems.',
  },
  {
    id: 'branch-me',
    name: 'Mechanical Engineering',
    code: 'ME',
    officialCode: '102',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Thermodynamics, fluid mechanics, machine design, CAD/CAM, robotics, manufacturing systems and thermal engineering.',
  },
  {
    id: 'branch-ee',
    name: 'Electrical Engineering',
    code: 'EE',
    officialCode: '104',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Power systems, electrical machines, control theory, power electronics, renewable energy grids and smart distribution.',
  },
  {
    id: 'branch-ece',
    name: 'Electronics & Communication Engineering',
    code: 'ECE',
    officialCode: '105',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Signal processing, digital communications, VLSI design, embedded systems, microprocessors and optical communications.',
  },
  {
    id: 'branch-it',
    name: 'Information Technology',
    code: 'IT',
    officialCode: '106',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Information systems, enterprise software, network architecture, cybersecurity and web distributed engineering.',
  },
  {
    id: 'branch-eee',
    name: 'Electrical & Electronics Engineering',
    code: 'EEE',
    officialCode: '107',
    category: 'INTERDISCIPLINARY',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Integrated power engineering, digital circuits, electric drives, and modern control instrumentation.',
  },
  {
    id: 'branch-cse-aiml',
    name: 'Computer Science & Engineering (AI & ML)',
    code: 'CSE_AIML',
    officialCode: '108',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Machine learning, deep learning, NLP, neural computation, computer vision and automated reasoning.',
  },
  {
    id: 'branch-cse-ds',
    name: 'Computer Science & Engineering (Data Science)',
    code: 'CSE_DS',
    officialCode: '109',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Statistical analytics, big data architecture, predictive modeling, data visualization and distributed processing.',
  },
  {
    id: 'branch-cse-cyber',
    name: 'Computer Science & Engineering (Cyber Security)',
    code: 'CSE_CYBER',
    officialCode: '110',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Network defense, applied cryptography, ethical hacking, digital forensics, cloud security and risk mitigation.',
  },
  {
    id: 'branch-cse-iot',
    name: 'Computer Science & Engineering (IoT)',
    code: 'CSE_IOT',
    officialCode: '111',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Sensor networks, edge computing, embedded IoT operating systems, industrial automation and wireless protocols.',
  },
  {
    id: 'branch-cse-ai',
    name: 'Computer Science & Engineering (AI)',
    code: 'CSE_AI',
    officialCode: '112',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Autonomous systems, knowledge graphs, cognitive AI algorithms, computer vision and intelligent agent architectures.',
  },
  {
    id: 'branch-cse-iot-bc',
    name: 'Computer Science & Engineering (IoT & Cyber Security including Block Chain Technology)',
    code: 'CSE_IOT_BC',
    officialCode: '113',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Decentralized systems, smart contracts, distributed consensus, IoT hardware security and blockchain architectures.',
  },
  {
    id: 'branch-cse-net',
    name: 'Computer Science & Engineering (Networks)',
    code: 'CSE_NET',
    officialCode: '114',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Software Defined Networking (SDN), 5G networks, network telemetry, routing protocols and distributed cloud routing.',
  },
  {
    id: 'branch-vlsi',
    name: 'Electronics Engineering (VLSI Design & Technology)',
    code: 'EE_VLSI',
    officialCode: '115',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Semiconductor physics, ASIC/FPGA design, CMOS circuitry, layout simulation and hardware verification.',
  },
  {
    id: 'branch-ece-act',
    name: 'Electronics & Communication Engineering (Advance Communication Technology)',
    code: 'ECE_ACT',
    officialCode: '116',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Next-generation wireless, satellite communications, photonics, MIMO antenna arrays and quantum communication.',
  },
  {
    id: 'branch-ra',
    name: 'Robotics & Automation',
    code: 'RA',
    officialCode: '117',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Kinematics, dynamics, industrial robotics, PLC/SCADA control, computer vision and ROS navigation.',
  },
  {
    id: 'branch-mechatronics',
    name: 'Mechatronics Engineering',
    code: 'MTE',
    officialCode: '118',
    category: 'INTERDISCIPLINARY',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Synergy of mechanics, electronics, control algorithms, microcontrollers and electromechanical systems.',
  },
  {
    id: 'branch-msm',
    name: 'Mechanical & Smart Manufacturing',
    code: 'MSM',
    officialCode: '119',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Industry 4.0, additive manufacturing, digital twin technology, CNC smart systems and automated quality inspection.',
  },
  {
    id: 'branch-biomedical',
    name: 'Biomedical & Robotic Engineering',
    code: 'BMRE',
    officialCode: '120',
    category: 'INTERDISCIPLINARY',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Biomedical signal processing, robotic surgical arms, biomechanics, medical imaging and prosthetics.',
  },
  {
    id: 'branch-ce-ca',
    name: 'Civil Engineering with Computer Application',
    code: 'CE_CA',
    officialCode: '121',
    category: 'INTERDISCIPLINARY',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Computational structural analysis, GIS mapping, BIM simulation, civil automation and hydraulic modeling.',
  },
  {
    id: 'branch-che',
    name: 'Chemical Engineering',
    code: 'CHE',
    officialCode: '122',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Fluid dynamics, mass transfer, reaction kinetics, process control, biochemical engineering and plant design.',
  },
  {
    id: 'branch-leather',
    name: 'Chemical Technology (Leather Technology)',
    code: 'CT_LT',
    officialCode: '123',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Leather processing chemistry, tannery effluent treatment, polymer finishing and sustainable material tech.',
  },
  {
    id: 'branch-mining',
    name: 'Mining Engineering',
    code: 'MINE',
    officialCode: '124',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Rock mechanics, mine surveying, underground ventilation, mineral processing and environmental mine safety.',
  },
  {
    id: 'branch-ie',
    name: 'Instrumentation Engineering',
    code: 'IE',
    officialCode: '125',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Process instrumentation, sensors & transducers, biomedical instruments, optical measurement and DCS systems.',
  },
  {
    id: 'branch-fts',
    name: 'Fire Technology & Safety',
    code: 'FTS',
    officialCode: '126',
    category: 'INTERDISCIPLINARY',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Industrial safety engineering, hazard identification, fire prevention systems, risk analysis and disaster management.',
  },
  {
    id: 'branch-aero',
    name: 'Aeronautical Engineering',
    code: 'AERO',
    officialCode: '127',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Aerodynamics, aircraft structures, propulsion systems, flight mechanics, avionics and aerospace materials.',
  },
  {
    id: 'branch-fpp',
    name: 'Food Processing & Preservation',
    code: 'FPP',
    officialCode: '128',
    category: 'INTERDISCIPLINARY',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Food chemistry, thermal preservation, dairy engineering, packaging tech, quality control and microbial safety.',
  },
  {
    id: 'branch-3d',
    name: '3-D Animation & Graphics',
    code: 'AG_3D',
    officialCode: '129',
    category: 'EMERGING_TECH',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: '3D rendering algorithms, CGI pipelines, game engine architecture, digital modeling, VFX and virtual reality.',
  },
  {
    id: 'branch-agri',
    name: 'Agricultural Engineering',
    code: 'AGE',
    officialCode: '130',
    category: 'INTERDISCIPLINARY',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Soil & water conservation, precision farming machinery, post-harvest engineering and renewable farm power.',
  },
  {
    id: 'branch-waste',
    name: 'Waste Management',
    code: 'WM',
    officialCode: '131',
    category: 'INTERDISCIPLINARY',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Solid waste treatment, bio-energy generation, hazardous material remediation, circular economy and recycling plants.',
  },
  {
    id: 'branch-petro',
    name: 'Petrochemical Engineering',
    code: 'PCE',
    officialCode: '132',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Petroleum refining, catalytic cracking, petrochemical synthesis, natural gas processing and reservoir safety.',
  },
  {
    id: 'branch-plastic',
    name: 'Chemical Engineering (Plastic & Polymer)',
    code: 'CE_PP',
    officialCode: '133',
    category: 'INTERDISCIPLINARY',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Polymer synthesis, injection molding, rheology, composite materials, biodegradable polymers and processing machinery.',
  },
  {
    id: 'branch-marine',
    name: 'Marine Engineering',
    code: 'MRE',
    officialCode: '134',
    category: 'CORE',
    hasOfficialSyllabus: true,
    syllabusStatus: 'AVAILABLE',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    description: 'Marine diesel propulsion, naval architecture, ship auxiliary systems, maritime safety and offshore structure engineering.',
  },
];

// BEU-COMMENT-1: Official BEU curriculum data mapping and regulation versioning structure
export const BEU_OFFICIAL_REGULATIONS: OfficialRegulationData[] = [
  {
    id: 'reg-2026',
    code: 'REG_2026',
    name: 'BEU UG Regulation 2026',
    effectiveFromYear: 2026,
    officialDocumentUrl: 'https://beu-bih.ac.in/backend/1778027052729-UG%20Regulation_05.04.2026.pdf',
    description: 'Effective for all undergraduate students admitted in Academic Session 2026-27 and onwards.',
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

export const BEU_OFFICIAL_SESSIONS: OfficialSessionData[] = [
  { id: 'session-2026-27', name: '2026-2027', isActive: true },
  { id: 'session-2025-26', name: '2025-2026', isActive: true },
  { id: 'session-2024-25', name: '2024-2025', isActive: true },
  { id: 'session-2023-24', name: '2023-2024', isActive: false },
];

// ------------------------------------------------------------------------------------------------
// 3. AUTHENTIC CURRICULUM SUBJECTS, UNITS, TOPICS & SUBTOPICS
// ------------------------------------------------------------------------------------------------
export const BEU_OFFICIAL_SUBJECTS: OfficialSubjectData[] = [
  // =========================================================================
  // SEMESTER 1 (GROUP A - COMMON FOR CSE, IT, ECE, EE)
  // =========================================================================
  {
    id: 'subj-maths-1',
    code: 'BSC-101',
    name: 'Mathematics - I (Calculus & Linear Algebra)',
    shortName: 'Maths-I',
    branchCode: 'CSE',
    semesterNumber: 1,
    regulationCode: 'REG_2026',
    type: 'THEORY',
    category: 'BSC',
    credits: 4.0,
    ltp: '3-1-0',
    lectureHours: 3,
    tutorialHours: 1,
    practicalHours: 0,
    internalMarks: 30,
    endSemMarks: 70,
    totalMarks: 100,
    description: 'Foundations of single & multivariable differential calculus, sequences, series, matrices, eigen values and Cayley-Hamilton theorem.',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    sourceDocumentName: 'BEU_BTech_1st_Year_GroupA_Syllabus.pdf',
    isOfficialSource: true,
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    units: [
      {
        id: 'unit-maths1-u1',
        unitNumber: 1,
        unitTitle: 'Unit 1: Calculus - Functions of Single Variable',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Rolle’s theorem, Mean value theorems, Taylor’s and Maclaurin’s theorems with remainders; Indeterminate forms and L’Hospital’s rule; Maxima and minima.',
        topics: [
          {
            id: 'topic-maths1-u1-t1',
            orderIndex: 1,
            title: 'Mean Value Theorems & Taylor Series',
            hours: 3.0,
            isCore: true,
            learningOutcomes: ['Apply Rolle’s theorem and Mean Value Theorems to engineering functions', 'Expand functions using Taylor and Maclaurin series'],
            subTopics: [
              { id: 'sub-m1-1', orderIndex: 1, title: 'Rolle’s Theorem & Cauchy Mean Value Theorem' },
              { id: 'sub-m1-2', orderIndex: 2, title: 'Taylor’s & Maclaurin’s Expansions with Lagrange Remainder' },
            ],
          },
          {
            id: 'topic-maths1-u1-t2',
            orderIndex: 2,
            title: 'Indeterminate Forms & L’Hospital’s Rule',
            hours: 3.0,
            isCore: true,
            learningOutcomes: ['Evaluate 0/0, infinity/infinity and exponential indeterminate forms'],
            subTopics: [
              { id: 'sub-m1-3', orderIndex: 1, title: 'L’Hospital’s Rule for Standard Forms' },
              { id: 'sub-m1-4', orderIndex: 2, title: 'Conversion of 0*infinity and 1^infinity forms' },
            ],
          },
          {
            id: 'topic-maths1-u1-t3',
            orderIndex: 3,
            title: 'Maxima & Minima of Single Variable Functions',
            hours: 3.0,
            isCore: true,
            learningOutcomes: ['Identify critical points, inflection points and curve concavity'],
            subTopics: [
              { id: 'sub-m1-5', orderIndex: 1, title: 'First & Second Derivative Tests' },
              { id: 'sub-m1-6', orderIndex: 2, title: 'Points of Inflection and Asymptotes' },
            ],
          },
        ],
      },
      {
        id: 'unit-maths1-u2',
        unitNumber: 2,
        unitTitle: 'Unit 2: Multivariable Calculus (Partial Differentiation)',
        hours: 10,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Limit, continuity and partial derivatives, directional derivatives, total derivative; Tangent plane and normal line; Maxima, minima and saddle points; Method of Lagrange multipliers.',
        topics: [
          {
            id: 'topic-maths1-u2-t1',
            orderIndex: 1,
            title: 'Partial Derivatives & Euler’s Theorem',
            hours: 3.5,
            isCore: true,
            learningOutcomes: ['Compute partial derivatives of homogeneous and composite functions'],
            subTopics: [
              { id: 'sub-m2-1', orderIndex: 1, title: 'Euler’s Theorem on Homogeneous Functions' },
              { id: 'sub-m2-2', orderIndex: 2, title: 'Total Differential and Chain Rule' },
            ],
          },
          {
            id: 'topic-maths1-u2-t2',
            orderIndex: 2,
            title: 'Jacobians & Extreme Values of Multivariable Functions',
            hours: 3.5,
            isCore: true,
            learningOutcomes: ['Calculate Jacobians for coordinate transforms', 'Find extreme values using Lagrange Multipliers'],
            subTopics: [
              { id: 'sub-m2-3', orderIndex: 1, title: 'Jacobian Transformation Matrices' },
              { id: 'sub-m2-4', orderIndex: 2, title: 'Lagrange’s Method of Undetermined Multipliers' },
            ],
          },
          {
            id: 'topic-maths1-u2-t3',
            orderIndex: 3,
            title: 'Directional Derivatives & Gradient Vectors',
            hours: 3.0,
            isCore: true,
            learningOutcomes: ['Calculate gradient, divergence, curl and directional rate of change'],
            subTopics: [
              { id: 'sub-m2-5', orderIndex: 1, title: 'Gradient, Divergence and Curl in Cartesian Coordinates' },
            ],
          },
        ],
      },
      {
        id: 'unit-maths1-u3',
        unitNumber: 3,
        unitTitle: 'Unit 3: Sequences and Infinite Series',
        hours: 8,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Convergence of sequence and series, tests for convergence of positive term series: Comparison test, D’Alembert’s ratio test, Raabe’s test, Cauchy root test; Alternating series, Leibniz’s test.',
        topics: [
          {
            id: 'topic-maths1-u3-t1',
            orderIndex: 1,
            title: 'Convergence Tests for Positive Term Series',
            hours: 4.0,
            isCore: true,
            learningOutcomes: ['Determine convergence using Ratio Test, Comparison Test and Root Test'],
            subTopics: [
              { id: 'sub-m3-1', orderIndex: 1, title: 'D’Alembert Ratio Test & Cauchy Root Test' },
              { id: 'sub-m3-2', orderIndex: 2, title: 'Raabe’s Test and Logarithmic Ratio Test' },
            ],
          },
          {
            id: 'topic-maths1-u3-t2',
            orderIndex: 2,
            title: 'Alternating Series & Power Series',
            hours: 4.0,
            isCore: true,
            learningOutcomes: ['Test alternating series convergence and find radius of convergence'],
            subTopics: [
              { id: 'sub-m3-3', orderIndex: 1, title: 'Leibniz Test for Alternating Series' },
              { id: 'sub-m3-4', orderIndex: 2, title: 'Absolute vs Conditional Convergence' },
            ],
          },
        ],
      },
      {
        id: 'unit-maths1-u4',
        unitNumber: 4,
        unitTitle: 'Unit 4: Matrices and Systems of Linear Equations',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Rank of a matrix, elementary transformations, Echelon form; Consistency of linear system of equations; Gauss elimination, Gauss-Jordan methods; Inverse of a matrix.',
        topics: [
          {
            id: 'topic-maths1-u4-t1',
            orderIndex: 1,
            title: 'Matrix Rank & Row Echelon Form',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Reduce matrices to Echelon and Normal canonical forms to find rank'],
            subTopics: [
              { id: 'sub-m4-1', orderIndex: 1, title: 'Elementary Row and Column Operations' },
              { id: 'sub-m4-2', orderIndex: 2, title: 'Row Reduced Echelon Form (RREF)' },
            ],
          },
          {
            id: 'topic-maths1-u4-t2',
            orderIndex: 2,
            title: 'Linear Systems (AX = B) & Consistency',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Solve consistent and inconsistent systems of equations'],
            subTopics: [
              { id: 'sub-m4-3', orderIndex: 1, title: 'Gauss Elimination & Gauss-Jordan Elimination' },
              { id: 'sub-m4-4', orderIndex: 2, title: 'Homogeneous & Non-Homogeneous Systems' },
            ],
          },
        ],
      },
      {
        id: 'unit-maths1-u5',
        unitNumber: 5,
        unitTitle: 'Unit 5: Eigenvalues, Eigenvectors & Diagonalization',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Eigen values and eigen vectors; Cayley-Hamilton Theorem and its applications; Diagonalization of matrices; Orthogonal transformation and quadratic forms.',
        topics: [
          {
            id: 'topic-maths1-u5-t1',
            orderIndex: 1,
            title: 'Eigenvalues, Eigenvectors & Cayley-Hamilton',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Find matrix inverse and higher powers using Cayley-Hamilton theorem'],
            subTopics: [
              { id: 'sub-m5-1', orderIndex: 1, title: 'Characteristic Polynomial & Spectral Values' },
              { id: 'sub-m5-2', orderIndex: 2, title: 'Cayley-Hamilton Theorem Applications (A^-1, A^n)' },
            ],
          },
          {
            id: 'topic-maths1-u5-t2',
            orderIndex: 2,
            title: 'Diagonalization & Quadratic Forms',
            hours: 4.0,
            isCore: true,
            learningOutcomes: ['Perform similarity transforms and canonical reduction of quadratic forms'],
            subTopics: [
              { id: 'sub-m5-3', orderIndex: 1, title: 'Modal Matrix and Diagonal Matrix P^-1 A P' },
              { id: 'sub-m5-4', orderIndex: 2, title: 'Definiteness and Index of Quadratic Forms' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'subj-physics-sem1',
    code: 'BSC-102',
    name: 'Engineering Physics (Semiconductor & Optics)',
    shortName: 'Engg Physics',
    branchCode: 'CSE',
    semesterNumber: 1,
    regulationCode: 'REG_2026',
    type: 'THEORY',
    category: 'BSC',
    credits: 4.0,
    ltp: '3-1-0',
    lectureHours: 3,
    tutorialHours: 1,
    practicalHours: 0,
    internalMarks: 30,
    endSemMarks: 70,
    totalMarks: 100,
    description: 'Interference, diffraction, lasers, fiber optics, quantum mechanics, and band theory of semiconductor solids.',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    sourceDocumentName: 'BEU_BTech_1st_Year_GroupA_Syllabus.pdf',
    isOfficialSource: true,
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    units: [
      {
        id: 'unit-phy-u1',
        unitNumber: 1,
        unitTitle: 'Unit 1.0: Frame of Reference and Oscillations',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Frames of reference, rotating coordinates, Coriolis acceleration and harmonic oscillations with damping and resonance.',
        topics: [
          {
            id: 'topic-phy-u1-t1',
            orderIndex: 1,
            title: 'Non-Inertial frame of reference',
            hours: 1.5,
            isCore: true,
            learningOutcomes: ['Understand fictitious forces and accelerated reference systems'],
            subTopics: [
              { id: 'sub-p1-1', orderIndex: 1, title: 'Inertial vs Non-Inertial Frames of Reference' },
              { id: 'sub-p1-2', orderIndex: 2, title: 'Pseudo Forces in Linearly Accelerated Systems' },
            ],
          },
          {
            id: 'topic-phy-u1-t2',
            orderIndex: 2,
            title: 'Rotating coordinate system',
            hours: 1.5,
            isCore: true,
            learningOutcomes: ['Formulate transformation of velocities and accelerations in rotating frames'],
            subTopics: [
              { id: 'sub-p1-3', orderIndex: 1, title: 'Angular Velocity Vector and Coordinate Transformation' },
              { id: 'sub-p1-4', orderIndex: 2, title: 'Time Derivatives of Vectors in Rotating Frames' },
            ],
          },
          {
            id: 'topic-phy-u1-t3',
            orderIndex: 3,
            title: 'Centripetal and Coriolis acceleration and its application in weather system',
            hours: 2.0,
            isCore: true,
            learningOutcomes: ['Derive Coriolis acceleration and analyze atmospheric cyclones/ocean currents'],
            subTopics: [
              { id: 'sub-p1-5', orderIndex: 1, title: 'Mathematical Derivation of Coriolis & Centrifugal Accelerations' },
              { id: 'sub-p1-6', orderIndex: 2, title: 'Coriolis Force Effects on Cyclones and Trade Winds' },
            ],
          },
          {
            id: 'topic-phy-u1-t4',
            orderIndex: 4,
            title: 'Harmonic Oscillator',
            hours: 1.5,
            isCore: true,
            learningOutcomes: ['Solve simple harmonic differential equations and calculate mechanical energy'],
            subTopics: [
              { id: 'sub-p1-7', orderIndex: 1, title: 'Simple Harmonic Motion Differential Equation & Phasor Solutions' },
              { id: 'sub-p1-8', orderIndex: 2, title: 'Kinetic and Potential Energy Conservation in SHM' },
            ],
          },
          {
            id: 'topic-phy-u1-t5',
            orderIndex: 5,
            title: 'Damped Harmonic Motion',
            hours: 1.5,
            isCore: true,
            learningOutcomes: ['Classify over-damped, critically damped, and under-damped oscillators'],
            subTopics: [
              { id: 'sub-p1-9', orderIndex: 1, title: 'Damping Coefficient, Logarithmic Decrement & Relaxation Time' },
              { id: 'sub-p1-10', orderIndex: 2, title: 'Transient Response in Under-damped and Critical Systems' },
            ],
          },
          {
            id: 'topic-phy-u1-t6',
            orderIndex: 6,
            title: 'Force Oscillators and Resonance',
            hours: 1.0,
            isCore: true,
            learningOutcomes: ['Derive amplitude resonance and sharpness of resonance (Quality Factor Q)'],
            subTopics: [
              { id: 'sub-p1-11', orderIndex: 1, title: 'Steady-State Response to Sinusoidal Driving Force' },
              { id: 'sub-p1-12', orderIndex: 2, title: 'Amplitude Resonance, Phase Lag & Quality Factor (Q)' },
            ],
          },
        ],
      },
      {
        id: 'unit-phy-u2',
        unitNumber: 2,
        unitTitle: 'Unit 2.0: Optics and LASER',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Wave optics, interference, interferometry, diffraction and laser physics.',
        topics: [
          {
            id: 'topic-phy-u2-t1',
            orderIndex: 1,
            title: "Huygens's Principle",
            hours: 2.0,
            isCore: true,
            learningOutcomes: ["Explain wavefront propagation and verify laws of reflection/refraction"],
            subTopics: [
              { id: 'sub-p2-1', orderIndex: 1, title: 'Primary & Secondary Wavelets Construction' },
              { id: 'sub-p2-2', orderIndex: 2, title: 'Verification of Snell’s Law using Wave Theory' },
            ],
          },
          {
            id: 'topic-phy-u2-t2',
            orderIndex: 2,
            title: 'Superposition of Waves and interference of Light',
            hours: 2.0,
            isCore: true,
            learningOutcomes: ['Determine conditions for constructive and destructive optical interference'],
            subTopics: [
              { id: 'sub-p2-3', orderIndex: 1, title: 'Coherent Sources and Path Difference Formulations' },
              { id: 'sub-p2-4', orderIndex: 2, title: 'Intensity Distribution in Two-Beam Interference' },
            ],
          },
          {
            id: 'topic-phy-u2-t3',
            orderIndex: 3,
            title: "Young's Double Slit Experiment",
            hours: 2.5,
            isCore: true,
            learningOutcomes: ['Calculate fringe width and wavelength of monochromatic light sources'],
            subTopics: [
              { id: 'sub-p2-5', orderIndex: 1, title: 'Fringe Width β = λD/d Analytical Derivation' },
              { id: 'sub-p2-6', orderIndex: 2, title: 'Displacement of Fringes by Introduction of Thin Transparent Sheet' },
            ],
          },
          {
            id: 'topic-phy-u2-t4',
            orderIndex: 4,
            title: 'Michelson Interferometer',
            hours: 2.5,
            isCore: true,
            learningOutcomes: ['Explain circular/localized fringes and measure small wavelength differences'],
            subTopics: [
              { id: 'sub-p2-7', orderIndex: 1, title: 'Beam Splitter Construction & Optical Path Difference' },
              { id: 'sub-p2-8', orderIndex: 2, title: 'Measurement of Wavelength (λ) and Wavelength Difference (Δλ)' },
            ],
          },
        ],
      },
      {
        id: 'unit-phy-u3',
        unitNumber: 3,
        unitTitle: 'Unit 3.0: Electromagnetic Waves & Maxwell Equations',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Maxwell’s equations in differential and integral forms, electromagnetic wave propagation in vacuum and dielectrics.',
        topics: [
          {
            id: 'topic-phy-u3-t1',
            orderIndex: 1,
            title: 'Maxwell’s Equations & Displacement Current',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Derive Ampere-Maxwell law and differential forms of Maxwell equations'],
            subTopics: [
              { id: 'sub-p3-1', orderIndex: 1, title: 'Displacement Current Density Formulation' },
              { id: 'sub-p3-2', orderIndex: 2, title: 'Integral and Differential Forms of 4 Maxwell Equations' },
            ],
          },
          {
            id: 'topic-phy-u3-t2',
            orderIndex: 2,
            title: 'Electromagnetic Wave Equations & Poynting Vector',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Compute electromagnetic energy transmission using Poynting vector'],
            subTopics: [
              { id: 'sub-p3-3', orderIndex: 1, title: 'EM Wave Equation in Free Space and Non-Conducting Media' },
              { id: 'sub-p3-4', orderIndex: 2, title: 'Poynting Theorem & Energy Flow Density S = E x H' },
            ],
          },
        ],
      },
      {
        id: 'unit-phy-u4',
        unitNumber: 4,
        unitTitle: 'Unit 4.0: Quantum Mechanics',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Matter waves, uncertainty principle, wave function, Schrödinger equation, and particle in a box.',
        topics: [
          {
            id: 'topic-phy-u4-t1',
            orderIndex: 1,
            title: 'Matter Waves & Heisenberg Uncertainty Principle',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Formulate de Broglie wavelength and apply Heisenberg uncertainty bounds'],
            subTopics: [
              { id: 'sub-p4-1', orderIndex: 1, title: 'De Broglie Hypothesis & Wave-Particle Duality' },
              { id: 'sub-p4-2', orderIndex: 2, title: 'Heisenberg Position-Momentum & Energy-Time Uncertainty' },
            ],
          },
          {
            id: 'topic-phy-u4-t2',
            orderIndex: 2,
            title: 'Schrödinger Equation & 1D Potential Box',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Solve 1D infinite square well boundary value problem for discrete energy states'],
            subTopics: [
              { id: 'sub-p4-3', orderIndex: 1, title: 'Time-Independent Schrödinger Wave Equation Derivation' },
              { id: 'sub-p4-4', orderIndex: 2, title: 'Eigenvalues En = n^2 h^2 / (8 m L^2) and Normalized Wavefunctions' },
            ],
          },
        ],
      },
      {
        id: 'unit-phy-u5',
        unitNumber: 5,
        unitTitle: 'Unit 5.0: Solid State Physics & Superconductivity',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Band theory of solids, Kronig-Penney model, semiconductors, Hall effect, and superconductivity.',
        topics: [
          {
            id: 'topic-phy-u5-t1',
            orderIndex: 1,
            title: 'Band Theory of Solids & Hall Effect',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Differentiate metals, semiconductors and insulators and calculate Hall coefficient'],
            subTopics: [
              { id: 'sub-p5-1', orderIndex: 1, title: 'Kronig-Penney Model and Energy Band Formation' },
              { id: 'sub-p5-2', orderIndex: 2, title: 'Hall Coefficient RH = 1/(n*e) and Majority Carrier Determination' },
            ],
          },
          {
            id: 'topic-phy-u5-t2',
            orderIndex: 2,
            title: 'Superconductivity & Meissner Effect',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Explain critical magnetic fields, Meissner flux expulsion and Type I/II superconductors'],
            subTopics: [
              { id: 'sub-p5-3', orderIndex: 1, title: 'Zero Electrical Resistance & Critical Temperature Tc' },
              { id: 'sub-p5-4', orderIndex: 2, title: 'Meissner Effect, London Equations & High-Tc Applications' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'subj-bee-sem1',
    code: 'ESC-101',
    name: 'Basic Electrical Engineering',
    shortName: 'BEE',
    branchCode: 'CSE',
    semesterNumber: 1,
    regulationCode: 'REG_2026',
    type: 'THEORY',
    category: 'ESC',
    credits: 4.0,
    ltp: '3-1-0',
    lectureHours: 3,
    tutorialHours: 1,
    practicalHours: 0,
    internalMarks: 30,
    endSemMarks: 70,
    totalMarks: 100,
    description: 'DC circuit theorems, AC fundamentals, single & three-phase systems, transformers, electrical machines, and electrical installations.',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    sourceDocumentName: 'BEU_BTech_1st_Year_GroupA_Syllabus.pdf',
    isOfficialSource: true,
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    units: [
      {
        id: 'unit-bee-u1',
        unitNumber: 1,
        unitTitle: 'Unit 1: DC Circuits & Network Theorems',
        hours: 10,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Electrical circuit elements (R, L, C), voltage and current sources, Kirchhoff’s current and voltage laws, node and mesh analysis; Superposition, Thevenin’s, Norton’s, Maximum Power Transfer theorems.',
        topics: [
          {
            id: 'topic-bee-u1-t1',
            orderIndex: 1,
            title: 'KCL, KVL, Mesh & Nodal Analysis',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Solve multi-loop planar networks using Mesh and Nodal equations'],
            subTopics: [
              { id: 'sub-b1-1', orderIndex: 1, title: 'Independent and Dependent Sources Representation' },
              { id: 'sub-b1-2', orderIndex: 2, title: 'Supernode and Supermesh Network Solving' },
            ],
          },
          {
            id: 'topic-bee-u1-t2',
            orderIndex: 2,
            title: 'Network Theorems (Thevenin, Norton, Max Power)',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Calculate equivalent Thevenin/Norton generators and impedance matching'],
            subTopics: [
              { id: 'sub-b1-3', orderIndex: 1, title: 'Thevenin and Norton Equivalent Circuits with DC Sources' },
              { id: 'sub-b1-4', orderIndex: 2, title: 'Maximum Power Transfer Theorem Proof and Computations' },
            ],
          },
        ],
      },
      {
        id: 'unit-bee-u2',
        unitNumber: 2,
        unitTitle: 'Unit 2: AC Circuits (Single-Phase & Three-Phase)',
        hours: 10,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Representation of sinusoidal waveforms, peak and RMS values, phasor representation; Real power, reactive power, apparent power, power factor; Series and parallel RLC circuits, resonance; Three-phase balanced systems, star-delta connections.',
        topics: [
          {
            id: 'topic-bee-u2-t1',
            orderIndex: 1,
            title: 'Sinusoidal AC Analysis & Power Triangle',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Analyze R-L-C series and parallel branch circuits and power factor'],
            subTopics: [
              { id: 'sub-b2-1', orderIndex: 1, title: 'RMS, Average Values and Form Factor' },
              { id: 'sub-b2-2', orderIndex: 2, title: 'Active, Reactive, Apparent Power and Q-Factor' },
            ],
          },
          {
            id: 'topic-bee-u2-t2',
            orderIndex: 2,
            title: 'Three-Phase Star & Delta Systems',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Calculate line and phase voltages/currents and power measurement via two-wattmeter method'],
            subTopics: [
              { id: 'sub-b2-3', orderIndex: 1, title: 'Star-Delta Line vs Phase Relationships' },
              { id: 'sub-b2-4', orderIndex: 2, title: 'Two-Wattmeter Power Measurement Method' },
            ],
          },
        ],
      },
      {
        id: 'unit-bee-u3',
        unitNumber: 3,
        unitTitle: 'Unit 3: Transformers (Single Phase)',
        hours: 8,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Magnetic materials, BH characteristics, ideal and practical transformer, equivalent circuit, losses in transformers, regulation and efficiency; Auto-transformer and three-phase transformer connections.',
        topics: [
          {
            id: 'topic-bee-u3-t1',
            orderIndex: 1,
            title: 'Transformer Equivalent Circuit & Efficiency',
            hours: 4.0,
            isCore: true,
            learningOutcomes: ['Construct phasor diagrams of loaded transformer and compute voltage regulation'],
            subTopics: [
              { id: 'sub-b3-1', orderIndex: 1, title: 'EMF Equation and Transformation Ratio' },
              { id: 'sub-b3-2', orderIndex: 2, title: 'OC & SC Tests for Equivalent Circuit Parameters' },
            ],
          },
          {
            id: 'topic-bee-u3-t2',
            orderIndex: 2,
            title: 'Voltage Regulation & Auto-Transformers',
            hours: 4.0,
            isCore: true,
            learningOutcomes: ['Calculate all-day efficiency and copper savings in autotransformers'],
            subTopics: [
              { id: 'sub-b3-3', orderIndex: 1, title: 'Voltage Regulation under Lagging/Leading Power Factors' },
              { id: 'sub-b3-4', orderIndex: 2, title: 'Principle of Auto-Transformer and Conduction/Induction Power' },
            ],
          },
        ],
      },
      {
        id: 'unit-bee-u4',
        unitNumber: 4,
        unitTitle: 'Unit 4: Electrical Machines (DC & AC Motors)',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Construction and working principle of DC generator & motor, characteristics, speed control of DC shunt motor; Principle of 3-phase induction motor, torque-speed characteristics; Synchronous generator principle.',
        topics: [
          {
            id: 'topic-bee-u4-t1',
            orderIndex: 1,
            title: 'DC Machines Principle & Speed Control',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Explain back EMF, torque equation and armature/field speed control methods'],
            subTopics: [
              { id: 'sub-b4-1', orderIndex: 1, title: 'Working Principle of DC Motor & Back EMF Significance' },
              { id: 'sub-b4-2', orderIndex: 2, title: 'Torque-Current & Speed-Torque Characteristics' },
            ],
          },
          {
            id: 'topic-bee-u4-t2',
            orderIndex: 2,
            title: 'Three-Phase Induction Motor & Alternators',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Analyze rotating magnetic field, slip calculation and starting methods'],
            subTopics: [
              { id: 'sub-b4-3', orderIndex: 1, title: 'Production of Rotating Magnetic Field (RMF)' },
              { id: 'sub-b4-4', orderIndex: 2, title: 'Slip, Rotor Frequency and Torque-Slip Curve' },
            ],
          },
        ],
      },
      {
        id: 'unit-bee-u5',
        unitNumber: 5,
        unitTitle: 'Unit 5: Electrical Installations & Safety',
        hours: 8,
        examFrequency: 'MEDIUM',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Components of LT switchgear: Switch Fuse Unit (SFU), MCB, ELCB, MCCB; Types of wires and cables, earthing; Elementary battery calculations, energy billing and power factor correction.',
        topics: [
          {
            id: 'topic-bee-u5-t1',
            orderIndex: 1,
            title: 'Switchgear, Earthing & Domestic Protection',
            hours: 4.0,
            isCore: true,
            learningOutcomes: ['Select appropriate MCB/ELCB ratings and design pipe/plate earthing systems'],
            subTopics: [
              { id: 'sub-b5-1', orderIndex: 1, title: 'Working Principle of MCB, ELCB and RCCB' },
              { id: 'sub-b5-2', orderIndex: 2, title: 'Plate and Pipe Earthing Methods for Electric Safety' },
            ],
          },
          {
            id: 'topic-bee-u5-t2',
            orderIndex: 2,
            title: 'Battery Systems, Tariff & Power Factor Improvement',
            hours: 4.0,
            isCore: true,
            learningOutcomes: ['Compute energy bills from wattage loads and size capacitor banks for power factor correction'],
            subTopics: [
              { id: 'sub-b5-3', orderIndex: 1, title: 'Battery Capacity (Ah rating) and Charging Cycles' },
              { id: 'sub-b5-4', orderIndex: 2, title: 'Power Factor Improvement using Shunt Capacitors' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SEMESTER 3 (CSE CORE PCC - DATA STRUCTURES & ALGORITHMS)
  // =========================================================================
  {
    id: 'subj-dsa-sem3',
    code: 'PCC-CS301',
    name: 'Data Structures and Algorithms',
    shortName: 'DSA',
    branchCode: 'CSE',
    semesterNumber: 3,
    regulationCode: 'REG_2026',
    type: 'THEORY',
    category: 'PCC',
    credits: 4.0,
    ltp: '3-1-0',
    lectureHours: 3,
    tutorialHours: 1,
    practicalHours: 0,
    internalMarks: 30,
    endSemMarks: 70,
    totalMarks: 100,
    description: 'Foundations of linear and non-linear data structures, asymptotic complexity, recursion, balanced trees, graph traversal, and advanced sorting/searching.',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    sourceDocumentName: 'BEU_BTech_CSE_3rd_Sem_Syllabus.pdf',
    isOfficialSource: true,
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    units: [
      {
        id: 'unit-dsa-u1',
        unitNumber: 1,
        unitTitle: 'Unit 1: Introduction, Complexity Analysis & Arrays',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Abstract Data Types (ADT), algorithm analysis, asymptotic notations (Big-O, Omega, Theta); Space and time tradeoffs; Arrays as ADT, row-major and column-major order, sparse matrices representation.',
        topics: [
          {
            id: 'topic-dsa-u1-t1',
            orderIndex: 1,
            title: 'Asymptotic Notations & Complexity Trade-offs',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Calculate time/space complexity of iterative and recursive algorithms', 'Apply Big-O, Omega and Theta notation mathematically'],
            subTopics: [
              { id: 'sub-d1-1', orderIndex: 1, title: 'Big-O, Big-Omega, Big-Theta Definitions and Bounds' },
              { id: 'sub-d1-2', orderIndex: 2, title: 'Master Theorem for Divide-and-Conquer Recurrences' },
            ],
          },
          {
            id: 'topic-dsa-u1-t2',
            orderIndex: 2,
            title: 'Array Memory Mapping & Sparse Matrices',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Implement 1D/2D row-major column-major address calculation', 'Represent 3-tuple sparse matrices and transpose algorithms'],
            subTopics: [
              { id: 'sub-d1-3', orderIndex: 1, title: 'Row-Major and Column-Major Address Calculation Formulas' },
              { id: 'sub-d1-4', orderIndex: 2, title: 'Sparse Matrix Representation (Triplet Format & Fast Transpose)' },
            ],
          },
        ],
      },
      {
        id: 'unit-dsa-u2',
        unitNumber: 2,
        unitTitle: 'Unit 2: Linear Data Structures: Stacks, Queues & Linked Lists',
        hours: 10,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Singly, doubly and circular linked lists; Stack ADT, array and linked implementation; Applications: Infix to Postfix conversion, Postfix evaluation; Queue ADT, circular queue, deque, priority queue implementation.',
        topics: [
          {
            id: 'topic-dsa-u2-t1',
            orderIndex: 1,
            title: 'Singly, Doubly & Circular Linked Lists',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Perform insertion, deletion, reversal and cycle detection in linked lists'],
            subTopics: [
              { id: 'sub-d2-1', orderIndex: 1, title: 'Insertion/Deletion at Head, Tail and Middle Nodes' },
              { id: 'sub-d2-2', orderIndex: 2, title: 'Floyd’s Cycle Finding Algorithm in Linked Lists' },
            ],
          },
          {
            id: 'topic-dsa-u2-t2',
            orderIndex: 2,
            title: 'Stack & Queue Applications (Infix to Postfix)',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Convert infix arithmetic expressions to postfix and evaluate with stack', 'Implement circular queue without memory wastage'],
            subTopics: [
              { id: 'sub-d2-3', orderIndex: 1, title: 'Infix to Postfix Algorithm using Operator Precedence Stack' },
              { id: 'sub-d2-4', orderIndex: 2, title: 'Circular Queue Wrap-Around Implementation via Modulo' },
            ],
          },
        ],
      },
      {
        id: 'unit-dsa-u3',
        unitNumber: 3,
        unitTitle: 'Unit 3: Non-Linear Structures: Trees & Binary Search Trees',
        hours: 10,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Tree terminology, binary trees, representation, traversals (Preorder, Inorder, Postorder, Level order); Binary Search Tree (BST) operations; Balanced Trees: AVL trees (rotations), Red-Black trees; B-Trees and B+ Trees.',
        topics: [
          {
            id: 'topic-dsa-u3-t1',
            orderIndex: 1,
            title: 'Binary Tree Traversals & BST Construction',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Reconstruct binary tree from Inorder + Preorder traversal arrays', 'Execute BST insert, search and delete (inorder successor/predecessor)'],
            subTopics: [
              { id: 'sub-d3-1', orderIndex: 1, title: 'Recursive & Iterative Inorder/Preorder/Postorder Traversals' },
              { id: 'sub-d3-2', orderIndex: 2, title: 'BST Node Deletion: 0, 1 and 2 Child Cases' },
            ],
          },
          {
            id: 'topic-dsa-u3-t2',
            orderIndex: 2,
            title: 'Balanced Search Trees (AVL Rotations & B-Trees)',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Calculate balance factor and perform LL, RR, LR, RL single/double rotations in AVL trees'],
            subTopics: [
              { id: 'sub-d3-3', orderIndex: 1, title: 'AVL Tree LL, RR, LR, RL Rotations' },
              { id: 'sub-d3-4', orderIndex: 2, title: 'B-Tree & B+ Tree Node Splitting and Multi-Way Search' },
            ],
          },
        ],
      },
      {
        id: 'unit-dsa-u4',
        unitNumber: 4,
        unitTitle: 'Unit 4: Graph Algorithms & Minimum Spanning Trees',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Graph representations (Adjacency Matrix, Adjacency List); Graph traversals: BFS, DFS; Minimum Spanning Tree: Prim’s and Kruskal’s algorithms; Shortest paths: Dijkstra’s algorithm, Bellman-Ford, Floyd-Warshall.',
        topics: [
          {
            id: 'topic-dsa-u4-t1',
            orderIndex: 1,
            title: 'Graph Traversals (BFS, DFS) & Topological Sort',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Implement BFS using queue and DFS using recursion/stack for connected components', 'Perform Kahn’s topological sort on DAGs'],
            subTopics: [
              { id: 'sub-d4-1', orderIndex: 1, title: 'Breadth First Search (BFS) & Depth First Search (DFS)' },
              { id: 'sub-d4-2', orderIndex: 2, title: 'Cycle Detection in Directed and Undirected Graphs' },
            ],
          },
          {
            id: 'topic-dsa-u4-t2',
            orderIndex: 2,
            title: 'MST (Prim, Kruskal) & Shortest Path (Dijkstra)',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Construct Minimum Spanning Tree using Disjoint Set Union (DSU)', 'Compute single-source shortest path using priority queue Dijkstra'],
            subTopics: [
              { id: 'sub-d4-3', orderIndex: 1, title: 'Kruskal Algorithm with Union-Find Disjoint Set' },
              { id: 'sub-d4-4', orderIndex: 2, title: 'Dijkstra Greedy Algorithm and Negative Weight Cycle Handling' },
            ],
          },
        ],
      },
      {
        id: 'unit-dsa-u5',
        unitNumber: 5,
        unitTitle: 'Unit 5: Searching, Sorting & Hashing Techniques',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Searching: Linear search, Binary search, Interpolation search; Sorting: Bubble, Insertion, Selection, Quick Sort, Merge Sort, Heap Sort, Radix Sort; Hashing: Hash functions, collision resolution (Chaining, Open Addressing).',
        topics: [
          {
            id: 'topic-dsa-u5-t1',
            orderIndex: 1,
            title: 'Advanced Sorting (Merge, Quick & Heap Sort)',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Analyze O(N log N) worst-case vs average-case sorting guarantees and in-place properties'],
            subTopics: [
              { id: 'sub-d5-1', orderIndex: 1, title: 'QuickSort Partitioning (Lomuto vs Hoare) & Best/Worst Cases' },
              { id: 'sub-d5-2', orderIndex: 2, title: 'Max-Heapify, Build-Heap and HeapSort in O(N log N)' },
            ],
          },
          {
            id: 'topic-dsa-u5-t2',
            orderIndex: 2,
            title: 'Hashing Functions & Collision Resolution',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Design collision-free hash functions and compare separate chaining vs open addressing'],
            subTopics: [
              { id: 'sub-d5-3', orderIndex: 1, title: 'Division, Multiplication and Universal Hash Functions' },
              { id: 'sub-d5-4', orderIndex: 2, title: 'Linear Probing, Quadratic Probing & Double Hashing' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SEMESTER 4 (CSE CORE PCC - DATABASE MANAGEMENT SYSTEMS)
  // =========================================================================
  {
    id: 'subj-dbms-sem4',
    code: 'PCC-CS401',
    name: 'Database Management Systems',
    shortName: 'DBMS',
    branchCode: 'CSE',
    semesterNumber: 4,
    regulationCode: 'REG_2026',
    type: 'THEORY',
    category: 'PCC',
    credits: 4.0,
    ltp: '3-1-0',
    lectureHours: 3,
    tutorialHours: 1,
    practicalHours: 0,
    internalMarks: 30,
    endSemMarks: 70,
    totalMarks: 100,
    description: 'Relational data models, ER diagrams, SQL DDL/DML, Relational Algebra, Normalization (1NF to BCNF), Transaction Processing, Concurrency Control, and Indexing.',
    sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
    sourceDocumentName: 'BEU_BTech_CSE_4th_Sem_Syllabus.pdf',
    isOfficialSource: true,
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    units: [
      {
        id: 'unit-dbms-u1',
        unitNumber: 1,
        unitTitle: 'Unit 1: Introduction to DBMS Architecture & ER Modeling',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Database system concepts, 3-tier architecture, data independence; Entity-Relationship (ER) model: Entities, attributes, keys, relationships, cardinality, ER-to-relational schema mapping.',
        topics: [
          {
            id: 'topic-dbms-u1-t1',
            orderIndex: 1,
            title: 'DBMS 3-Schema Architecture & Data Independence',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Differentiate physical and logical data independence in 3-schema ANSI/SPARC model'],
            subTopics: [
              { id: 'sub-db1-1', orderIndex: 1, title: 'Physical, Conceptual and External Schema Views' },
              { id: 'sub-db1-2', orderIndex: 2, title: 'Logical vs Physical Data Independence Principles' },
            ],
          },
          {
            id: 'topic-dbms-u1-t2',
            orderIndex: 2,
            title: 'ER Modeling & Relational Schema Conversion',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Design comprehensive ER diagrams with weak entities and convert to relational tables'],
            subTopics: [
              { id: 'sub-db1-3', orderIndex: 1, title: 'Strong vs Weak Entities and Identifying Relationships' },
              { id: 'sub-db1-4', orderIndex: 2, title: 'Cardinality Constraints and Foreign Key Schema Mapping' },
            ],
          },
        ],
      },
      {
        id: 'unit-dbms-u2',
        unitNumber: 2,
        unitTitle: 'Unit 2: Relational Model, Relational Algebra & SQL',
        hours: 10,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Relational algebra: Select, project, join, division, set operations; SQL: DDL, DML, DCL, integrity constraints, complex nested queries, aggregate functions, views and triggers.',
        topics: [
          {
            id: 'topic-dbms-u2-t1',
            orderIndex: 1,
            title: 'Relational Algebra Operators & Query Optimization',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Write relational algebra expressions for natural join, theta join, selection and division'],
            subTopics: [
              { id: 'sub-db2-1', orderIndex: 1, title: 'Select (σ), Project (π), Cartesian Product (×) and Joins (⨝)' },
              { id: 'sub-db2-2', orderIndex: 2, title: 'Division Operator (÷) for Universal Quantification Queries' },
            ],
          },
          {
            id: 'topic-dbms-u2-t2',
            orderIndex: 2,
            title: 'Advanced SQL, Correlated Subqueries & Triggers',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Construct complex SQL queries with GROUP BY, HAVING, subqueries, views and PL/SQL triggers'],
            subTopics: [
              { id: 'sub-db2-3', orderIndex: 1, title: 'Correlated Subqueries with EXISTS, IN and ANY/ALL' },
              { id: 'sub-db2-4', orderIndex: 2, title: 'Database Triggers, Stored Procedures and View Updatability' },
            ],
          },
        ],
      },
      {
        id: 'unit-dbms-u3',
        unitNumber: 3,
        unitTitle: 'Unit 3: Relational Database Design & Normalization',
        hours: 10,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Functional dependencies, Armstrong’s axioms, closure of attribute sets, minimal cover; Normal Forms: 1NF, 2NF, 3NF, BCNF, 4NF; Lossless-join decomposition, dependency preservation.',
        topics: [
          {
            id: 'topic-dbms-u3-t1',
            orderIndex: 1,
            title: 'Functional Dependencies & Candidate Keys',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Compute attribute closure (X+) and find all candidate keys of a relation'],
            subTopics: [
              { id: 'sub-db3-1', orderIndex: 1, title: 'Armstrong’s Axioms (Reflexivity, Augmentation, Transitivity)' },
              { id: 'sub-db3-2', orderIndex: 2, title: 'Finding Canonical Minimal Cover of Functional Dependencies' },
            ],
          },
          {
            id: 'topic-dbms-u3-t2',
            orderIndex: 2,
            title: 'Normal Forms: 1NF, 2NF, 3NF, BCNF & Decomposition',
            hours: 5.0,
            isCore: true,
            learningOutcomes: ['Decompose relations into 3NF/BCNF while testing lossless join and dependency preservation'],
            subTopics: [
              { id: 'sub-db3-3', orderIndex: 1, title: 'Prime vs Non-Prime Attributes in 2NF and 3NF' },
              { id: 'sub-db3-4', orderIndex: 2, title: 'BCNF Violation Analysis and Lossless Join Testing' },
            ],
          },
        ],
      },
      {
        id: 'unit-dbms-u4',
        unitNumber: 4,
        unitTitle: 'Unit 4: Transaction Processing & Concurrency Control',
        hours: 9,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Transaction concepts, ACID properties, serializability (conflict and view serializability); Concurrency control protocols: Two-Phase Locking (2PL), Strict 2PL, Timestamp ordering, Deadlock detection and prevention.',
        topics: [
          {
            id: 'topic-dbms-u4-t1',
            orderIndex: 1,
            title: 'ACID Properties & Conflict Serializability',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Draw precedence graphs (serialization graphs) to verify conflict serializability'],
            subTopics: [
              { id: 'sub-db4-1', orderIndex: 1, title: 'Atomicity, Consistency, Isolation, Durability (ACID) Guarantees' },
              { id: 'sub-db4-2', orderIndex: 2, title: 'Conflict Equivalent Schedules & Precedence Graph Cycles' },
            ],
          },
          {
            id: 'topic-dbms-u4-t2',
            orderIndex: 2,
            title: 'Locking Protocols (2PL) & Deadlock Management',
            hours: 4.5,
            isCore: true,
            learningOutcomes: ['Differentiate growing/shrinking phase in 2PL and apply Wait-Die / Wound-Wait deadlock schemes'],
            subTopics: [
              { id: 'sub-db4-3', orderIndex: 1, title: 'Basic 2PL, Conservative 2PL, Strict 2PL and Rigorous 2PL' },
              { id: 'sub-db4-4', orderIndex: 2, title: 'Wait-for Graph Deadlock Detection & Timestamp Ordering Protocol' },
            ],
          },
        ],
      },
      {
        id: 'unit-dbms-u5',
        unitNumber: 5,
        unitTitle: 'Unit 5: Crash Recovery, Storage & Indexing Structures',
        hours: 8,
        examFrequency: 'HIGH',
        sourceUrl: 'https://beu-bih.ac.in/academics/Syllabus/B.Tech',
        description: 'Recovery systems: Log-based recovery (deferred and immediate database modification), checkpoints; Storage and file structure, indexing: Dense and sparse indices, primary and secondary indices, B+ tree indexing.',
        topics: [
          {
            id: 'topic-dbms-u5-t1',
            orderIndex: 1,
            title: 'Log-Based Recovery & Checkpointing (ARIES)',
            hours: 4.0,
            isCore: true,
            learningOutcomes: ['Perform REDO and UNDO log recovery operations after system crash'],
            subTopics: [
              { id: 'sub-db5-1', orderIndex: 1, title: 'Write-Ahead Logging (WAL) Protocol & Deferred/Immediate Updates' },
              { id: 'sub-db5-2', orderIndex: 2, title: 'Checkpointing Mechanisms for Truncating Active Log Search' },
            ],
          },
          {
            id: 'topic-dbms-u5-t2',
            orderIndex: 2,
            title: 'B+ Tree Indexing & File Organization',
            hours: 4.0,
            isCore: true,
            learningOutcomes: ['Calculate tree height, block fan-out and IO disk access cost using B+ trees'],
            subTopics: [
              { id: 'sub-db5-3', orderIndex: 1, title: 'Dense vs Sparse Index and Primary vs Clustering Indexes' },
              { id: 'sub-db5-4', orderIndex: 2, title: 'B+ Tree Leaf Linked Nodes and Range Query Efficiency' },
            ],
          },
        ],
      },
    ],
  },
];
