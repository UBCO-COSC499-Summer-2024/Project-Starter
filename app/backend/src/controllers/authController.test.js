const { db } = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendPasswordResetEmail } = require('../mailer');
const {
  authUser,
  verifyUser,
  verifyPass,
  sendPasswordReset,
  resetPassword
} = require('../controllers/authController');

jest.mock('../database', () => ({
  db: {
    oneOrNone: jest.fn(),
    none: jest.fn(),
  }
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('../mailer', () => ({
  sendPasswordResetEmail: jest.fn(),
}));

describe('Auth Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('authUser', () => {
    it('should return a token if credentials are correct', async () => {
      const user = { id: 1, password: 'hashedpassword', role: 'admin', first_name: 'John', last_name: 'Doe', email: 'john@example.com' };
      db.oneOrNone.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const result = await authUser('john@example.com', 'password');

      expect(db.oneOrNone).toHaveBeenCalledWith("SELECT * FROM users WHERE email = $1", ['john@example.com']);
      expect(bcrypt.compare).toHaveBeenCalledWith('password', user.password);
      expect(jwt.sign).toHaveBeenCalledWith({
        userId: user.id,
        role: user.role,
        name: 'John Doe',
        userEmail: 'john@example.com'
      }, 'coscrules', { expiresIn: '12h' });
      expect(result).toEqual({ token: 'token' });
    });

    it('should return an error message if credentials are incorrect', async () => {
      const user = { id: 1, password: 'hashedpassword' };
      db.oneOrNone.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      const result = await authUser('john@example.com', 'wrongpassword');

      expect(result).toEqual({ message: 'Incorrect Credentials' });
    });

    it('should return an error message if user is not found', async () => {
      db.oneOrNone.mockResolvedValue(null);

      const result = await authUser('john@example.com', 'password');

      expect(result).toEqual({ message: 'User not found' });
    });

    it('should throw an error if the database query fails', async () => {
      db.oneOrNone.mockRejectedValue(new Error('DB Error'));
      console.error = jest.fn();

      await expect(authUser('john@example.com', 'password')).rejects.toThrow('Internal Server Error');
      expect(console.error).toHaveBeenCalledWith('Error occurred during authorization:', expect.any(Error));
    });
  });

  describe('verifyUser', () => {
    it('should return null if the token is null', async () => {
      console.log = jest.fn();

      const result = await verifyUser('null');

      expect(console.log).toHaveBeenCalledWith('Token is null');
      expect(result).toBeNull();
    });

    it('should return decoded token if the token is valid', async () => {
      const decoded = { userId: 1 };
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, decoded);
      });

      const result = await verifyUser('validtoken');

      expect(jwt.verify).toHaveBeenCalledWith('validtoken', 'coscrules', expect.any(Function));
      expect(result).toEqual(decoded);
    });

    it('should return null if the token is invalid', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid JWT'), null);
      });
      console.error = jest.fn();

      const result = await verifyUser('invalidtoken');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error occurred during verification:', 'Invalid JWT');
    });
  });

  describe('verifyPass', () => {
    it('should update the password if the old password is correct', async () => {
      db.oneOrNone.mockResolvedValue({ password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('newhashedpassword');

      const result = await verifyPass(1, 'oldpassword', 'newpassword');

      expect(db.oneOrNone).toHaveBeenCalledWith('SELECT password FROM users WHERE id = $1', [1]);
      expect(bcrypt.compare).toHaveBeenCalledWith('oldpassword', 'hashedpassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(db.none).toHaveBeenCalledWith('UPDATE users SET password = $1 WHERE id = $2', ['newhashedpassword', 1]);
      expect(result).toEqual({ message: 'Password updated successfully' });
    });

    it('should return an error message if the old password is incorrect', async () => {
      db.oneOrNone.mockResolvedValue({ password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(false);

      const result = await verifyPass(1, 'wrongoldpassword', 'newpassword');

      expect(result).toEqual({ message: 'Incorrect Old Password' });
    });

    it('should return an error message if the user is not found', async () => {
      db.oneOrNone.mockResolvedValue(null);

      const result = await verifyPass(1, 'oldpassword', 'newpassword');

      expect(result).toEqual({ message: 'User not found' });
    });

    it('should throw an error if the database query fails', async () => {
      db.oneOrNone.mockRejectedValue(new Error('DB Error'));
      console.error = jest.fn();

      await expect(verifyPass(1, 'oldpassword', 'newpassword')).rejects.toThrow('Internal Server Error');
      expect(console.error).toHaveBeenCalledWith('Error occurred verifying password:', expect.any(Error));
    });
  });

  describe('sendPasswordReset', () => {
    it('should send a password reset email if the user is found', async () => {
      const user = { id: 1, role: 'user', first_name: 'John', last_name: 'Doe', email: 'john@example.com' };
      db.oneOrNone.mockResolvedValue(user);
      jwt.sign.mockReturnValue('resettoken');

      const result = await sendPasswordReset('john@example.com');

      expect(db.oneOrNone).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['john@example.com']);
      expect(jwt.sign).toHaveBeenCalledWith({
        userId: user.id,
        role: user.role,
        name: 'John Doe',
        userEmail: 'john@example.com'
      }, 'coscrules', { expiresIn: '1h' });
      expect(sendPasswordResetEmail).toHaveBeenCalledWith('john@example.com', 'resettoken');
      expect(result).toEqual({ message: 'Password reset link sent to your email' });
    });

    it('should return null if the user is not found', async () => {
      db.oneOrNone.mockResolvedValue(null);

      const result = await sendPasswordReset('unknown@example.com');

      expect(result).toBeNull();
    });
  });

  describe('resetPassword', () => {
    it('should reset the password if the token is valid', async () => {
      const decoded = { userEmail: 'john@example.com' };
      jwt.verify.mockReturnValue(decoded);
      bcrypt.hash.mockResolvedValue('newhashedpassword');

      const result = await resetPassword('validtoken', 'newpassword');

      expect(jwt.verify).toHaveBeenCalledWith('validtoken', 'coscrules');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(db.none).toHaveBeenCalledWith('UPDATE users SET password = $1 WHERE email = $2', ['newhashedpassword', 'john@example.com']);
      expect(result).toEqual({ message: 'Password reset successful' });
    });

    it('should return null if the token is invalid', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await resetPassword('invalidtoken', 'newpassword');

      expect(result).toBeNull();
    });
  });
});
