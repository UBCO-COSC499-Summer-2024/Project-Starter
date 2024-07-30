import { createClient } from '@supabase/supabase-js';

// Create a Supabase client instance using environment variables for security
const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);

// Describe a set of tests related to Supabase data fetching
describe('Supabase Data Fetching', () => {
  // Test to ensure data can be fetched from a specific table or view
  test('fetches data from the service_role table', async () => {
    // Attempt to select data from the service_role table
    const { data, error } = await supabase.from('service_role').select();

    // Ensure that data is not null, indicating a successful fetch
    expect(data).not.toBeNull();

    // Ensure that there is no error, indicating a successful operation
    expect(error).toBeNull();
  });

  // Test to check behavior when attempting to fetch from a non-existent table
  test('attempts to read from a non-existent table', async () => {
    // Attempt to select data from a non-existent table
    const { data, error } = await supabase.from('non_existent_table').select();

    // Ensure that data is null, indicating no data was found
    expect(data).toBeNull();

    // Ensure that an error is returned, indicating an issue with the operation
    expect(error).not.toBeNull();
  });
});
