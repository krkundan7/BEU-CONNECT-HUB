import { getBranchNameByCode } from '../utils/branchCodeMapper';

describe('Branch Code Mapper', () => {
  it('maps 101 to Computer Science & Engineering', () => {
    expect(getBranchNameByCode('101')).toBe('Computer Science & Engineering');
  });

  it('returns fallback for unknown code', () => {
    expect(getBranchNameByCode('999')).toBe('General Engineering');
  });
});
