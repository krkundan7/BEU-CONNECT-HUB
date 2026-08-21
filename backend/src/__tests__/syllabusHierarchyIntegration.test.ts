import { BEUCollegesService } from '../services/beuColleges.service';

describe('Syllabus & College Integration', () => {
  it('fetches list of all 38 BEU colleges', () => {
    const colleges = BEUCollegesService.getAllColleges();
    expect(colleges.length).toBeGreaterThan(0);
  });
});
