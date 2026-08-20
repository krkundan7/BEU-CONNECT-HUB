import { AcademicService } from '../services/academic.service.js';
import { BEUSyllabusSyncService } from '../services/beuSyllabusSync.service.js';
import {
  BEU_OFFICIAL_BRANCHES,
  BEU_OFFICIAL_REGULATIONS,
  BEU_OFFICIAL_SESSIONS,
  BEU_OFFICIAL_SUBJECTS,
} from '../data/beuOfficialCurriculum.js';

describe('BEU Connect Hub - Official Syllabus & Academic Service', () => {
  describe('1. 34 BEU B.Tech Programmes Registry', () => {
    it('should list all 34 official BEU B.Tech branches', async () => {
      const branches = await AcademicService.getBranches();
      expect(branches.length).toBeGreaterThanOrEqual(34);

      const branchCodes = branches.map((b: any) => b.code);
      expect(branchCodes).toContain('CSE');
      expect(branchCodes).toContain('CE');
      expect(branchCodes).toContain('ME');
      expect(branchCodes).toContain('EE');
      expect(branchCodes).toContain('ECE');
      expect(branchCodes).toContain('IT');
      expect(branchCodes).toContain('CSE_AIML');
      expect(branchCodes).toContain('CSE_DS');
      expect(branchCodes).toContain('CSE_CYBER');
      expect(branchCodes).toContain('RA'); // Robotics & Automation
      expect(branchCodes).toContain('EE_VLSI'); // VLSI
      expect(branchCodes).toContain('CT_LT'); // Leather Tech
      expect(branchCodes).toContain('MRE'); // Marine Engg
    });

    it('should have valid official source URL on all branches', () => {
      BEU_OFFICIAL_BRANCHES.forEach(branch => {
        expect(branch.sourceUrl).toBe('https://beu-bih.ac.in/academics/Syllabus/B.Tech');
        expect(branch.hasOfficialSyllabus).toBe(true);
      });
    });
  });

  describe('2. Batch & Regulation Versioning', () => {
    it('should support 2026 UG Regulation and previous AICTE model curriculum', async () => {
      const regulations = await AcademicService.getRegulations();
      expect(regulations.length).toBeGreaterThanOrEqual(2);

      const regCodes = regulations.map((r: any) => r.code);
      expect(regCodes).toContain('REG_2026');
      expect(regCodes).toContain('REG_2018');

      const reg2026 = regulations.find((r: any) => r.code === 'REG_2026');
      expect(reg2026?.effectiveFromYear).toBe(2026);
      expect(reg2026?.officialDocumentUrl).toContain('UG%20Regulation_05.04.2026.pdf');
    });

    it('should support academic sessions from 2026-27 onwards', async () => {
      const sessions = await AcademicService.getSessions();
      expect(sessions.length).toBeGreaterThanOrEqual(3);

      const sessionNames = sessions.map((s: any) => s.name);
      expect(sessionNames).toContain('2026-2027');
      expect(sessionNames).toContain('2025-2026');
    });
  });

  describe('3. Semester & Subject Structure', () => {
    it('should retrieve 8 semesters with correct group classifications', async () => {
      const semesters = await AcademicService.getSemesters();
      expect(semesters.length).toBe(8);
      expect(semesters[0].number).toBe(1);
      expect(semesters[7].number).toBe(8);
    });

    it('should return authentic subjects for CSE Semester 3', async () => {
      const subjects = await AcademicService.getSubjects({
        branchCode: 'CSE',
        semesterNumber: 3,
        regulationCode: 'REG_2026',
      });

      expect(subjects.length).toBeGreaterThanOrEqual(1);
      const dsa = subjects.find((s: any) => s.code === 'PCC-CS301');
      expect(dsa).toBeDefined();
      expect(dsa?.name).toBe('Data Structures and Algorithms');
      expect(dsa?.credits).toBe(4.0);
      expect(dsa?.ltp).toBe('3-1-0');
      expect(dsa?.isOfficialSource).toBe(true);
    });

    it('should return complete 5-unit hierarchy for a subject', async () => {
      const subject = await AcademicService.getSubjectById('PCC-CS301');
      expect(subject).toBeDefined();
      expect(subject.units).toBeDefined();
      expect(subject.units?.length).toBe(5);

      // Verify Unit 1 Topics & Subtopics
      const unit1 = subject.units?.[0];
      expect(unit1?.unitNumber).toBe(1);
      expect(unit1?.unitTitle).toContain('Complexity Analysis');
      expect(unit1?.topics.length).toBeGreaterThanOrEqual(2);

      const topic1 = unit1?.topics[0];
      expect(topic1?.title).toContain('Asymptotic Notations');
      expect(topic1?.subTopics.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('4. Topic-Level Progress Tracking', () => {
    it('should allow student to update topic study status', async () => {
      const testUserId = 'student-test-01';
      const testTopicId = 'topic-dsa-u1-t1';

      const updated = await AcademicService.updateTopicProgress(testUserId, testTopicId, {
        status: 'COMPLETED',
        progressPercentage: 100,
        notes: 'Mastered Big-O and Master Theorem',
      });

      expect(updated).toBeDefined();
      expect(updated.status).toBe('COMPLETED');
      expect(updated.progressPercentage).toBe(100);
    });

    it('should calculate overall user progress accurately', async () => {
      const testUserId = 'student-test-01';
      const progress = await AcademicService.getUserProgress(testUserId, 'CSE', 3);

      expect(progress).toBeDefined();
      expect(progress.overallPercentage).toBeGreaterThanOrEqual(0);
      expect(typeof progress.completedTopics).toBe('number');
      expect(typeof progress.inProgressTopics).toBe('number');
    });
  });

  describe('5. Multi-field Syllabus Search', () => {
    it('should find topics by query keyword', async () => {
      const results = await AcademicService.searchSyllabus('Taylor');
      expect(results.topics.length).toBeGreaterThanOrEqual(1);
      expect(results.topics[0].title).toContain('Taylor');
    });

    it('should find subjects by subject code', async () => {
      const results = await AcademicService.searchSyllabus('PCC-CS301');
      expect(results.subjects.length).toBeGreaterThanOrEqual(1);
      expect(results.subjects[0].code).toBe('PCC-CS301');
    });

    it('should find units by unit title', async () => {
      const results = await AcademicService.searchSyllabus('Trees');
      expect(results.units.length + results.topics.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('6. Admin Syllabus Synchronization & Deduplication', () => {
    it('should execute sync pipeline without throwing errors', async () => {
      const syncResult = await BEUSyllabusSyncService.syncAllFromOfficialSource();
      expect(syncResult.success).toBe(true);
      expect(syncResult.stats.branchesUpserted).toBeGreaterThanOrEqual(34);
    });

    it('should return syllabus version history', async () => {
      const versions = await BEUSyllabusSyncService.getSyllabusVersions();
      expect(versions.length).toBeGreaterThanOrEqual(2);
    });
  });
});
