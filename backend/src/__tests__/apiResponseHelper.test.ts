import { ApiResponse } from '../utils/apiResponse';

describe('ApiResponse Utility', () => {
  it('creates standardized success response object', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    ApiResponse.success(mockRes, { message: 'Loaded' }, 'Success');
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
