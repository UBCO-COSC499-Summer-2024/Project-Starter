// app/frontend/tests/hooks/validateUser.test.js

import validateUser from '../../src/hooks/validateUser';

describe('validateUser', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('returns true when user is valid', async () => {
    const mockToken = 'valid-token';
    const mockUser = { userId: '123' };
    localStorage.setItem('token', mockToken);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      })
    );

    const isValid = await validateUser();

    expect(isValid).toBe(true);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:80/api/auth/authenticate/${mockToken}`);
  });

  it('returns false when user is invalid', async () => {
    const mockToken = 'invalid-token';
    localStorage.setItem('token', mockToken);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    const isValid = await validateUser();

    expect(isValid).toBe(false);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:80/api/auth/authenticate/${mockToken}`);
  });

  it('returns false when there is an error', async () => {
    const mockToken = 'valid-token';
    localStorage.setItem('token', mockToken);

    global.fetch = jest.fn(() => Promise.reject('API is down'));

    const isValid = await validateUser();

    expect(isValid).toBe(false);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:80/api/auth/authenticate/${mockToken}`);
  });

  it('returns false when no token is present', async () => {
    const isValid = await validateUser();

    expect(isValid).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
});
