// app/frontend/tests/hooks/getQuestions.test.js

import getQuestions from '../../src/hooks/getQuestions';

describe('getQuestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns questions when API call is successful', async () => {
    const mockExamId = 'exam123';
    const mockUserId = 'user123';
    const mockQuestions = [{ question: 'What is 2+2?' }, { question: 'What is the capital of France?' }];
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockQuestions),
      })
    );

    const questions = await getQuestions(mockExamId, mockUserId);

    expect(questions).toEqual(mockQuestions);
    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/questions/responses/${mockExamId}&${mockUserId}`);
  });

  it('returns an empty array when API call fails', async () => {
    const mockExamId = 'exam123';
    const mockUserId = 'user123';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
    );

    const questions = await getQuestions(mockExamId, mockUserId);

    expect(questions).toEqual([]);
    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/questions/responses/${mockExamId}&${mockUserId}`);
  });

  it('returns an empty array when there is an error', async () => {
    const mockExamId = 'exam123';
    const mockUserId = 'user123';

    global.fetch = jest.fn(() => Promise.reject('API is down'));

    const questions = await getQuestions(mockExamId, mockUserId);

    expect(questions).toEqual([]);
    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/questions/responses/${mockExamId}&${mockUserId}`);
  });
});
