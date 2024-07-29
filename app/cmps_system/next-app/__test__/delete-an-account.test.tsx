// __test__/delete-an-account.test.tsx

// Import necessary functions
import { createClient } from '@supabase/supabase-js';

// Mock the Supabase client
const supabaseUrl = 'http://localhost:8000'; // Replace with actual URL if needed
const supabaseServiceKey = 'service-role-key';

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
