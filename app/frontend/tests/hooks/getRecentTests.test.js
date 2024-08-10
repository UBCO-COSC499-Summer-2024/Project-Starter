import getRecentTests from '../../src/hooks/getRecentTests';

global.fetch = jest.fn();

describe('getRecentTests', () => {
  const mockUserId = '123';
  const mockTests = [
    { id: '1', name: 'Test 1' },
    { id: '2', name: 'Test 2' },
  ];

  beforeEach(() => {
    fetch.mockClear();
  });

  it('returns tests when the fetch is successful', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTests,
    });

    const result = await getRecentTests(mockUserId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/tests/recent/${mockUserId}`);
    expect(result).toEqual(mockTests);
  });

  it('logs an error and returns undefined when the fetch fails with a non-200 status', async () => {
    console.error = jest.fn();

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const result = await getRecentTests(mockUserId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/tests/recent/${mockUserId}`);
    expect(console.error).toHaveBeenCalledWith('POST Error', 500, 'Internal Server Error');
    expect(result).toBeUndefined();
  });

  it('logs an error and returns undefined when the fetch throws an exception', async () => {
    console.error = jest.fn();

    fetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await getRecentTests(mockUserId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/tests/recent/${mockUserId}`);
    expect(console.error).toHaveBeenCalledWith('Failure fetching data: ', new Error('Network Error'));
    expect(result).toBeUndefined();
  });
});
