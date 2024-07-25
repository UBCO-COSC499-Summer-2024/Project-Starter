// __test__/account.test.tsx

// Import necessary libraries for testing
import { createClient } from '@supabase/supabase-js';
import { jest } from '@jest/globals';

// Environment variables (replace with your actual values)
const SUPABASE_URL = "http://localhost:8000"; // Replace with your actual Supabase URL
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";

// Create a Supabase client instance
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

describe('Supabase Mock Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({ data: null, error: null });
    jest.spyOn(supabase.auth, 'signOut').mockResolvedValue({ error: null });
    jest.spyOn(supabase.auth, 'getSession').mockResolvedValue({ data: { session: null }, error: null });
    jest.spyOn(supabase.auth, 'updateUser').mockResolvedValue({ data: null, error: null });
  });

  test('mock test for getSession', async () => {
    await supabase.auth.getSession();
    expect(supabase.auth.getSession).toHaveBeenCalled();
  });

  test('mock test for signInWithPassword', async () => {
    await supabase.auth.signInWithPassword({ email: 'test@example.com', password: 'password' });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
  });

  test('mock test for signOut', async () => {
    await supabase.auth.signOut();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  test('mock test for updateUser', async () => {
    await supabase.auth.updateUser({ data: { display_name: 'New Name' } });
    expect(supabase.auth.updateUser).toHaveBeenCalled();
  });
});
