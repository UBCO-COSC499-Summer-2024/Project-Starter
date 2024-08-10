// app/frontend/tests/hooks/ChangePassword.test.js

import ChangePassword from '../../src/hooks/ChangePassword';

describe('ChangePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs success message when password change is successful', async () => {
    const mockUserId = 'user123';
    const mockOldPass = 'oldPass';
    const mockNewPass = 'newPass';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      })
    );

    console.log = jest.fn();

    await ChangePassword(mockUserId, mockOldPass, mockNewPass);

    expect(console.log).toHaveBeenCalledWith('Password changed successfully');
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/auth/change', expect.any(Object));
  });

  it('logs failure message when password change is unsuccessful', async () => {
    const mockUserId = 'user123';
    const mockOldPass = 'oldPass';
    const mockNewPass = 'newPass';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    console.log = jest.fn();

    await ChangePassword(mockUserId, mockOldPass, mockNewPass);

    expect(console.log).toHaveBeenCalledWith('Change password unsuccessful');
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/auth/change', expect.any(Object));
  });

  it('logs error when there is an error during password change', async () => {
    const mockUserId = 'user123';
    const mockOldPass = 'oldPass';
    const mockNewPass = 'newPass';

    global.fetch = jest.fn(() => Promise.reject('API is down'));

    console.error = jest.fn();

    await ChangePassword(mockUserId, mockOldPass, mockNewPass);

    expect(console.error).toHaveBeenCalledWith('Change password failed:', 'API is down');
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/auth/change', expect.any(Object));
  });
});
