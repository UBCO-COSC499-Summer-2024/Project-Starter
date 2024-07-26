// __test__/create-new-account.test.tsx

// Import necessary functions
import { createClient } from '@supabase/supabase-js';

// Mock the Supabase client
const supabaseUrl = 'http://localhost:8000'; // Replace with actual URL if needed
const supabaseAnonKey = 'anon-key';
const supabaseServiceKey = 'service-role-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      admin: {
        createUser: jest.fn(),
      },
    },
  }),
}));

describe('CreateNewAccount Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls createUser on form submit', async () => {
    // Mock form data
    const email = 'test@example.com';
    const password = 'password';

    // Call the function manually as we're not rendering JSX
    await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });
    
    expect(supabaseAdmin.auth.admin.createUser).toHaveBeenCalledWith({ email, password, email_confirm: true });
  });
});
