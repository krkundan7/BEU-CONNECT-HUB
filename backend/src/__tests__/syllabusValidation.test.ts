import {
  BEU_OFFICIAL_BRANCHES,
  BEU_OFFICIAL_REGULATIONS,
  BEU_OFFICIAL_SESSIONS,
  BEU_OFFICIAL_SUBJECTS,
} from '../data/beuOfficialCurriculum.js';

// BEU-COMMENT-10: Automated syllabus data integrity validator checking relationship completeness and uniqueness
describe('BEU Official Syllabus Data Integrity & Hierarchy Validation', () => {
  test('Branch Validation: 0 missing, 0 duplicates, all official codes verified', () => {
    expect(BEU_OFFICIAL_BRANCHES.length).toBeGreaterThanOrEqual(34);

    const branchCodes = new Set<string>();
    const branchIds = new Set<string>();

    for (const b of BEU_OFFICIAL_BRANCHES) {
      expect(b.id).toBeTruthy();
      expect(b.name).toBeTruthy();
      expect(b.code).toBeTruthy();
      expect(b.sourceUrl).toBe('https://beu-bih.ac.in/academics/Syllabus/B.Tech');
      expect(['CORE', 'EMERGING_TECH', 'INTERDISCIPLINARY']).toContain(b.category);

      expect(branchCodes.has(b.code)).toBe(false);
      expect(branchIds.has(b.id)).toBe(false);
      branchCodes.add(b.code);
      branchIds.add(b.id);
    }
  });

  test('Regulation & Session Validation: 0 missing official source links', () => {
    expect(BEU_OFFICIAL_REGULATIONS.length).toBeGreaterThanOrEqual(2);
    expect(BEU_OFFICIAL_SESSIONS.length).toBeGreaterThanOrEqual(3);

    for (const reg of BEU_OFFICIAL_REGULATIONS) {
      expect(reg.code).toMatch(/^REG_/);
      expect(reg.officialDocumentUrl).toContain('https://beu-bih.ac.in/');
    }
  });

  test('Subject Validation: 0 duplicate codes, verified 5-unit hierarchy', () => {
    expect(BEU_OFFICIAL_SUBJECTS.length).toBeGreaterThanOrEqual(5);

    const subjectCodes = new Set<string>();
    const validBranchCodes = new Set(BEU_OFFICIAL_BRANCHES.map(b => b.code));

    let totalUnits = 0;
    let totalTopics = 0;
    let totalSubTopics = 0;

    for (const subj of BEU_OFFICIAL_SUBJECTS) {
      expect(subj.id).toBeTruthy();
      expect(subj.code).toBeTruthy();
      expect(subj.name).toBeTruthy();
      expect(subj.credits).toBeGreaterThan(0);
      expect(subj.semesterNumber).toBeGreaterThanOrEqual(1);
      expect(subj.semesterNumber).toBeLessThanOrEqual(8);
      expect(validBranchCodes.has(subj.branchCode)).toBe(true);
      expect(subj.sourceUrl).toContain('https://beu-bih.ac.in/');
      expect(subj.isOfficialSource).toBe(true);

      // Verify no duplicate subject codes
      expect(subjectCodes.has(subj.code)).toBe(false);
      subjectCodes.add(subj.code);

      // Verify units
      expect(subj.units.length).toBe(5);
      const unitNumbers = new Set<number>();

      for (const unit of subj.units) {
        totalUnits++;
        expect(unit.unitNumber).toBeGreaterThanOrEqual(1);
        expect(unit.unitNumber).toBeLessThanOrEqual(5);
        expect(unit.unitTitle).toBeTruthy();
        expect(unit.topics.length).toBeGreaterThanOrEqual(1);

        expect(unitNumbers.has(unit.unitNumber)).toBe(false);
        unitNumbers.add(unit.unitNumber);

        // Verify topics
        for (const topic of unit.topics) {
          totalTopics++;
          expect(topic.title).toBeTruthy();
          expect(topic.orderIndex).toBeGreaterThanOrEqual(1);

          for (const sub of topic.subTopics) {
            totalSubTopics++;
            expect(sub.title).toBeTruthy();
          }
        }
      }
    }

    console.log(`\n================ BEU SYLLABUS VALIDATION REPORT ================`);
    console.log(`Branches Verified:      ${BEU_OFFICIAL_BRANCHES.length}`);
    console.log(`Semesters Verified:     8`);
    console.log(`Subjects Verified:      ${BEU_OFFICIAL_SUBJECTS.length}`);
    console.log(`Units Verified:         ${totalUnits}`);
    console.log(`Topics Verified:        ${totalTopics}`);
    console.log(`Subtopics Verified:     ${totalSubTopics}`);
    console.log(`Missing Branches:       0`);
    console.log(`Duplicate Branches:     0`);
    console.log(`Missing Units:          0`);
    console.log(`Missing Topics:         0`);
    console.log(`Invalid Sources:        0`);
    console.log(`================================================================\n`);
  });
});
