import getStudentData from '../../src/hooks/getStudentData';

global.fetch = jest.fn();

describe('getStudentData', () => {
  const mockCourseId = '123';
  const mockStudents = [
    { id: '1', name: 'Student 1' },
    { id: '2', name: 'Student 2' },
  ];

  beforeEach(() => {
    fetch.mockClear();
  });

  it('returns students when the fetch is successful', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStudents,
    });

    const result = await getStudentData(mockCourseId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/${mockCourseId}`);
    expect(result).toEqual(mockStudents);
  });

  it('logs an error and returns undefined when the fetch fails with a non-200 status', async () => {
    console.error = jest.fn();

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const result = await getStudentData(mockCourseId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/${mockCourseId}`);
    expect(console.error).toHaveBeenCalledWith('GET Error', 500, 'Internal Server Error');
    expect(result).toBeUndefined();
  });

  it('logs an error and returns undefined when the fetch throws an exception', async () => {
    console.error = jest.fn();

    fetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await getStudentData(mockCourseId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost/api/users/${mockCourseId}`);
    expect(console.error).toHaveBeenCalledWith('Failure fetching data: ', new Error('Network Error'));
    expect(result).toBeUndefined();
  });
});
