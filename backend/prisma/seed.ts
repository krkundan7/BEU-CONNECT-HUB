import { PrismaClient, Role, VerificationStatus, PostType, OpportunityCategory, NoticeCategory, ExamFrequency } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { BEUSyllabusSyncService } from '../src/services/beuSyllabusSync.service.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding BEU Connect Hub demo database...');

  // 0. Sync Full Official BEU Curriculum (34 Branches, Regulations, Semesters, Subjects, Units & Topics)
  await BEUSyllabusSyncService.syncAllFromOfficialSource();

  // 1. Colleges
  const mit = await prisma.college.upsert({
    where: { code: 'MIT-01' },
    create: {
      name: 'Muzaffarpur Institute of Technology',
      code: 'MIT-01',
      location: 'Muzaffarpur, Bihar',
      district: 'Muzaffarpur',
      website: 'https://mitmuzaffarpur.org',
    },
    update: {},
  });

  const bce = await prisma.college.upsert({
    where: { code: 'BCE-02' },
    create: {
      name: 'Bhagalpur College of Engineering',
      code: 'BCE-02',
      location: 'Bhagalpur, Bihar',
      district: 'Bhagalpur',
      website: 'https://bcebhagalpur.ac.in',
    },
    update: {},
  });

  const bceBakhtiyarpur = await prisma.college.upsert({
    where: { code: 'BCE-03' },
    create: {
      name: 'Bakhtiyarpur College of Engineering',
      code: 'BCE-03',
      location: 'Patna, Bihar',
      district: 'Patna',
      website: 'https://bcepatna.ac.in',
    },
    update: {},
  });

  // 2. Branches
  const cse = await prisma.branch.upsert({
    where: { code: 'CSE' },
    create: { name: 'Computer Science and Engineering', code: 'CSE' },
    update: {},
  });

  const ece = await prisma.branch.upsert({
    where: { code: 'ECE' },
    create: { name: 'Electronics and Communication Engineering', code: 'ECE' },
    update: {},
  });

  const me = await prisma.branch.upsert({
    where: { code: 'ME' },
    create: { name: 'Mechanical Engineering', code: 'ME' },
    update: {},
  });

  const ce = await prisma.branch.upsert({
    where: { code: 'CE' },
    create: { name: 'Civil Engineering', code: 'CE' },
    update: {},
  });

  const ee = await prisma.branch.upsert({
    where: { code: 'EE' },
    create: { name: 'Electrical Engineering', code: 'EE' },
    update: {},
  });

  // 3. Semesters
  const semesters: any[] = [];
  for (let i = 1; i <= 8; i++) {
    const sem = await prisma.semester.upsert({
      where: { number: i },
      create: { number: i, name: `Semester ${i}` },
      update: {},
    });
    semesters.push(sem);
  }

  // 4. Skills
  const skillNames = [
    'Data Structures & Algorithms',
    'Python',
    'Java',
    'C++',
    'React',
    'Node.js',
    'FastAPI',
    'PostgreSQL',
    'Machine Learning',
    'Deep Learning',
    'IoT & Embedded Systems',
    'GATE CSE Preparation',
  ];

  for (const sk of skillNames) {
    await prisma.skill.upsert({
      where: { name: sk },
      create: { name: sk, category: 'Technical' },
      update: {},
    });
  }

  // 5. Subjects & Syllabus for 3rd Sem CSE
  const dsa = await prisma.subject.upsert({
    where: { code: 'PCC-CS301' },
    create: {
      name: 'Data Structures and Algorithms',
      code: 'PCC-CS301',
      branchId: cse.id,
      semesterId: semesters[2].id, // 3rd Sem
      credits: 4,
      description: 'Foundations of data structures, arrays, linked lists, stacks, queues, trees, graphs, sorting, and searching.',
      syllabus: {
        create: {
          totalHours: 45,
          examMarks: 70,
          internalMarks: 30,
          topics: {
            create: [
              { unitNumber: 1, unitTitle: 'Unit 1: Introduction & Analysis', title: 'Asymptotic Notations & Recurrence Relations', hours: 8, examFrequency: ExamFrequency.HIGH },
              { unitNumber: 2, unitTitle: 'Unit 2: Linear Data Structures', title: 'Stacks, Queues & Linked Lists Applications', hours: 10, examFrequency: ExamFrequency.HIGH },
              { unitNumber: 3, unitTitle: 'Unit 3: Non-Linear Structures: Trees', title: 'Binary Search Trees, AVL Tree Rotations & Red-Black Trees', hours: 10, examFrequency: ExamFrequency.HIGH },
              { unitNumber: 4, unitTitle: 'Unit 4: Graphs & Algorithms', title: 'BFS, DFS, Dijkstra & Kruskal Minimum Spanning Tree', hours: 9, examFrequency: ExamFrequency.HIGH },
              { unitNumber: 5, unitTitle: 'Unit 5: Advanced Searching & Sorting', title: 'Quick Sort, Merge Sort, Hash Tables & B-Trees', hours: 8, examFrequency: ExamFrequency.MEDIUM },
            ],
          },
        },
      },
    },
    update: {},
  });

  const dbms = await prisma.subject.upsert({
    where: { code: 'PCC-CS401' },
    create: {
      name: 'Database Management Systems',
      code: 'PCC-CS401',
      branchId: cse.id,
      semesterId: semesters[3].id, // 4th Sem
      credits: 4,
      description: 'Relational algebra, ER Modeling, SQL queries, Normalization (1NF to BCNF), and Transaction concurrency.',
    },
    update: {},
  });

  // 6. Users (Demo Personas)
  const passwordHash = await bcrypt.hash('Password123', 10);

  // Student Persona
  const student = await prisma.user.upsert({
    where: { email: 'aman.mit@beu.edu.in' },
    create: {
      name: 'Aman Kumar',
      email: 'aman.mit@beu.edu.in',
      passwordHash,
      role: Role.STUDENT,
      verificationStatus: VerificationStatus.VERIFIED,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      bio: 'B.Tech CSE 3rd Semester at MIT Muzaffarpur. SIH 2025 Finalist & full-stack developer.',
      collegeId: mit.id,
      branchId: cse.id,
      semesterId: semesters[2].id,
      beuRegNo: '23103108001',
      contributionPoints: 780,
      profile: {
        create: {
          github: 'https://github.com/aman-beu',
          linkedin: 'https://linkedin.com/in/aman-beu',
          interests: ['AI/ML', 'Full Stack Development', 'Hackathons'],
          careerGoals: 'Software Engineer at top product tech company.',
        },
      },
    },
    update: {},
  });

  // Senior Mentor Persona
  const mentor = await prisma.user.upsert({
    where: { email: 'priya.mentor@beu.edu.in' },
    create: {
      name: 'Priya Sharma',
      email: 'priya.mentor@beu.edu.in',
      passwordHash,
      role: Role.STUDENT,
      verificationStatus: VerificationStatus.VERIFIED,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
      bio: '4th Year CSE at BCE Bhagalpur. Placed at Cognizant. Mentoring juniors in DSA & Placement prep.',
      collegeId: bce.id,
      branchId: cse.id,
      semesterId: semesters[6].id,
      beuRegNo: '21103108044',
      contributionPoints: 1250,
      mentorProfile: {
        create: {
          bio: 'Passionate senior mentor helping juniors with DSA, web projects, and off-campus placements.',
          skills: ['Data Structures & Algorithms', 'React', 'System Design', 'Resume Review'],
          domain: 'Software Engineering & Placements',
          yearOfStudy: '4th Year',
          rating: 4.9,
          reviewsCount: 24,
          availableSlots: 6,
        },
      },
    },
    update: {},
  });

  // Admin Persona
  const admin = await prisma.user.upsert({
    where: { email: 'admin.verma@beu.edu.in' },
    create: {
      name: 'Prof. R.K. Verma',
      email: 'admin.verma@beu.edu.in',
      passwordHash,
      role: Role.ADMIN,
      verificationStatus: VerificationStatus.VERIFIED,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      bio: 'Academic Coordinator & Nodal Officer, Bihar Engineering University, Patna.',
      collegeId: mit.id,
      branchId: cse.id,
      semesterId: semesters[7].id,
      beuRegNo: 'ADMIN-BEU-001',
      contributionPoints: 5000,
    },
    update: {},
  });

  // 7. Solved PYQs
  await prisma.pYQ.create({
    data: {
      subjectId: dsa.id,
      year: 2024,
      examType: 'END_TERM',
      fileUrl: 'https://example.com/beu-dsa-2024-pyq.pdf',
      solutionUrl: 'https://example.com/beu-dsa-2024-solutions.pdf',
      uploadedById: admin.id,
    },
  });

  // 8. Notes
  await prisma.note.create({
    data: {
      subjectId: dsa.id,
      title: 'Complete Unit 3: Binary Trees, BST & AVL Rotations Handwritten Notes',
      description: 'Neat formulas, balance factor calculation examples, and 2019-2024 solved numericals.',
      unitNumber: 3,
      fileUrl: 'https://example.com/beu-dsa-unit3-notes.pdf',
      uploadedById: student.id,
      downloadsCount: 142,
    },
  });

  // 9. Official Notices
  await prisma.notice.create({
    data: {
      title: 'Notification: B.Tech 3rd Semester Practical Examinations 2025 Datesheet',
      category: NoticeCategory.EXAM,
      isOfficial: true,
      source: 'Office of the Controller of Examinations, Bihar Engineering University, Patna',
      summary: 'Practical exams for 3rd semester commence from Sept 12, 2025 across all affiliated colleges.',
      content: 'All Principals of affiliated Engineering Colleges are hereby informed that the B.Tech 3rd Semester Practical Examinations will commence on Sept 12, 2025. Marks must be submitted to university portal within 48 hours.',
      isUrgent: true,
      publishedAt: 'August 17, 2025',
    },
  });

  // 10. Opportunities
  await prisma.opportunity.create({
    data: {
      title: 'Bihar State Student Innovation & Startup Grant 2025',
      description: 'Department of Science, Technology & Technical Education (DSTTE) Bihar provides up to ₹2,25,000 for verified student hardware/software prototypes.',
      category: OpportunityCategory.SCHOLARSHIP,
      organization: 'DSTTE, Govt. of Bihar',
      location: 'Patna, Bihar',
      isOnline: false,
      stipendOrPrize: '₹2,25,000 Prototype Seed Grant',
      deadline: 'September 30, 2025',
      source: 'DSTTE Official Innovation Portal',
      sourceUrl: 'https://state.bihar.gov.in/dst',
    },
  });

  console.log('✅ Demo database seeded successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
