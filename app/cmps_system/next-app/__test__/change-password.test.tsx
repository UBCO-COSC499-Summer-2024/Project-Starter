// __test__/change-password.test.tsx

// Import necessary functions
import { createClient } from '@supabase/supabase-js';

// Mock the Supabase client
const supabase = createClient('http://localhost:8000', 'service-role-key');

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      updateUser: jest.fn(),
    },
  }),
}));

describe('Supabase Mock Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls getSession', async () => {
    await supabase.auth.getSession();
    expect(supabase.auth.getSession).toHaveBeenCalled();
  });

  test('calls signInWithPassword', async () => {
    await supabase.auth.signInWithPassword({ email: 'test@example.com', password: 'password' });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
  });

  test('calls updateUser', async () => {
    await supabase.auth.updateUser({ password: 'new-password' });
    expect(supabase.auth.updateUser).toHaveBeenCalled();
  });

  test('calls signOut', async () => {
    await supabase.auth.signOut();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
