import { noteUploadSchema } from '../validators/noteUpload.validator';

describe('Note Upload Validator Schema', () => {
  it('validates mandatory note fields', () => {
    const res = noteUploadSchema.safeParse({
      title: 'Operating System Unit 1 Notes',
      subjectCode: 'PCC-CS401',
      branch: 'CSE',
      semester: 4,
    });
    expect(res.success).toBe(true);
  });
});
