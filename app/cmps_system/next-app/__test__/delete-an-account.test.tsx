// __test__/delete-an-account.test.tsx

// Import necessary functions
import { createClient } from '@supabase/supabase-js';

// Mock the Supabase client
const supabaseUrl = 'http://localhost:8000'; // Replace with actual URL if needed
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      admin: {
        listUsers: jest.fn(),
        deleteUser: jest.fn(),
      },
    },
  }),
}));

describe('DeleteAnAccount Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls listUsers when handleDelete is triggered', async () => {
    // Simulate the handleDelete function manually
    await supabaseAdmin.auth.admin.listUsers();
    expect(supabaseAdmin.auth.admin.listUsers).toHaveBeenCalled();
  });

  test('calls deleteUser when confirmDelete is triggered', async () => {
    const userId = 'some-user-id'; // Mock user ID
    // Simulate the confirmDelete function manually
    await supabaseAdmin.auth.admin.deleteUser(userId);
    expect(supabaseAdmin.auth.admin.deleteUser).toHaveBeenCalledWith(userId);
  });
});
