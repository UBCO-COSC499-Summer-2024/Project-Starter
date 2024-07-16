// Import necessary libraries and methods for testing
import { createClient } from '@supabase/supabase-js'
 
const supabase = createClient(process.env.SUPABASE_PUBLIC_URL, process.env.ANON_KEY);

// Tests for checking time tracking data retrieval from Supabase
describe('Supabase Data Fetching', () => {
  test('reads data from existing Supabase view for time tracking', async () => {
    const { data, error } = await supabase.from("v_timetracking").select();
    expect(data).not.toBeNull();
    expect(error).toBeNull();
  });

  test('attempts to read from a non-existent Supabase view', async () => {
    const { data, error } = await supabase.from("no_exsist_v_timetracking").select();
    expect(error).not.toBeNull();
    expect(data).toBeNull();
  });

  test('reads from and modifies data in the service hours benchmark table', async () => {
    // Fetch initial data
    const { data: initialData, error: initialError } = await supabase.from("service_hours_benchmark").select();
    expect(initialError).toBeNull();

    // Delete a record
    const deleteResponse = await supabase.from('service_hours_benchmark').delete().match({ benchmark_id: initialData[0].benchmark_id });
    expect(deleteResponse.error).toBeNull();

    // Check data after deletion
    const { data: afterDeleteData, error: afterDeleteError } = await supabase.from("service_hours_benchmark").select();
    expect(afterDeleteError).toBeNull();
    expect(afterDeleteData.length).toBe(initialData.length - 1);

    // Insert the deleted record back
    const insertResponse = await supabase.from('service_hours_benchmark').insert([initialData[0]]);
    expect(insertResponse.error).toBeNull();

    // Check data after re-insertion
    const { data: finalData, error: finalError } = await supabase.from("service_hours_benchmark").select();
    expect(finalError).toBeNull();
    expect(finalData.length).toBe(initialData.length);
  });
});
