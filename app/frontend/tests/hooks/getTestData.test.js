// app/frontend/tests/hooks/getTestData.test.js

import getTestData from '../../src/hooks/getTestData';

describe('getTestData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns test data when API call is successful', async () => {
    const mockCourseId = 'course123';
    const mockTests = [{ test: 'Test 1' }, { test: 'Test 2' }];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTests),
      })
    );

    const tests = await getTestData(mockCourseId);

    expect(tests).toEqual(mockTests);
    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/tests/${mockCourseId}`);
  });

  it('returns undefined when API call fails', async () => {
    const mockCourseId = 'course123';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
    );

    const tests = await getTestData(mockCourseId);

    expect(tests).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/tests/${mockCourseId}`);
  });

  it('returns undefined when there is an error', async () => {
    const mockCourseId = 'course123';

    global.fetch = jest.fn(() => Promise.reject('API is down'));

    const tests = await getTestData(mockCourseId);

    expect(tests).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/tests/${mockCourseId}`);
  });
});
