// src/__tests__/PostmarkWebservice.test.ts
import axios, { AxiosInstance } from 'axios';
import { PostmarkWebservice } from '../PostmarkWebservice';

// Mock the entire axios module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PostmarkWebservice', () => {
  let postMock: jest.Mock;

  beforeEach(() => {
    postMock = jest.fn();
    // axios.create() returns a client whose .post is our mock
    mockedAxios.create.mockReturnValue({ post: postMock } as unknown as AxiosInstance);
  });

  it('should return score and detailed report when long report is requested', async () => {
    postMock.mockResolvedValue({
      data: { success: true, score: 7.5, report: 'Detailed report' }
    });

    const svc = new PostmarkWebservice(true);
    const score = await svc.getScore('raw email content');
    expect(score).toBe(7.5);
    expect(svc.getReport()).toBe('Detailed report');
    expect(postMock).toHaveBeenCalledWith(
      'https://spamcheck.postmarkapp.com/filter',
      { email: 'raw email content', options: 'long' }
    );
  });

  it('should return score and null report when short report is requested', async () => {
    postMock.mockResolvedValue({
      data: { success: true, score: 2.1 }
    });

    const svc = new PostmarkWebservice(false);
    const score = await svc.getScore('foo');
    expect(score).toBe(2.1);
    expect(svc.getReport()).toBeNull();
  });

  it('should throw an error when API returns success=false', async () => {
    postMock.mockResolvedValue({
      data: { success: false, message: 'API error' }
    });

    const svc = new PostmarkWebservice();
    await expect(svc.getScore('x')).rejects.toThrow('API error');
  });

  it('should throw an error when score is missing in response', async () => {
    postMock.mockResolvedValue({
      data: { success: true }
    });

    const svc = new PostmarkWebservice();
    await expect(svc.getScore('y')).rejects.toThrow('API did not return a score');
  });

  it('should reset previous report on each getScore call', async () => {
    postMock
      .mockResolvedValueOnce({ data: { success: true, score: 1, report: 'R1' } })
      .mockResolvedValueOnce({ data: { success: true, score: 2 } });

    const svc = new PostmarkWebservice(true);

    const s1 = await svc.getScore('a');
    expect(svc.getReport()).toBe('R1');

    const s2 = await svc.getScore('b');
    expect(svc.getReport()).toBeNull();
  });
});
