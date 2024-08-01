import { createClient } from '@supabase/supabase-js';
/**
 * This file is used to create a supabase client that is used to interact with the supabase database. All files will import this supabase instance 
 * instad of creating their own. This is to avoid creating multiple instances of the supabase client.
 */
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, process.env.NEXT_PUBLIC_ANON_KEY);
export default supabase