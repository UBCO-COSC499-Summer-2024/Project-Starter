import getCourseData from '../../src/hooks/getCourseData';

global.fetch = jest.fn();

describe('getCourseData', () => {
  const mockUserId = '123';
  const mockCourses = [
    { id: '1', name: 'Course 1' },
    { id: '2', name: 'Course 2' },
  ];

  beforeEach(() => {
    fetch.mockClear();
  });

  it('returns courses when the fetch is successful', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses,
    });

    const result = await getCourseData(mockUserId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/courses/${mockUserId}`);
    expect(result).toEqual(mockCourses);
  });

  it('logs an error and returns undefined when the fetch fails with a non-200 status', async () => {
    console.error = jest.fn();

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const result = await getCourseData(mockUserId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/courses/${mockUserId}`);
    expect(console.error).toHaveBeenCalledWith('POST Error', 500, 'Internal Server Error');
    expect(result).toBeUndefined();
  });

  it('logs an error and returns undefined when the fetch throws an exception', async () => {
    console.error = jest.fn();

    fetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await getCourseData(mockUserId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/courses/${mockUserId}`);
    expect(console.error).toHaveBeenCalledWith('Failure fetching data: ', new Error('Network Error'));
    expect(result).toBeUndefined();
  });
});
