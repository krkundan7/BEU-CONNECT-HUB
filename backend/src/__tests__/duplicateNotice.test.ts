import { DuplicateNoticeDetectorService } from '../services/duplicateNoticeDetector.service';

describe('Duplicate Notice Detector Service', () => {
  it('generates identical fingerprints for duplicate notice content', () => {
    const fp1 = DuplicateNoticeDetectorService.computeFingerprint('BEU Exam Schedule 2026', '2026-08-20');
    const fp2 = DuplicateNoticeDetectorService.computeFingerprint('beu exam schedule 2026 ', '2026-08-20');
    expect(fp1).toBe(fp2);
  });
});
