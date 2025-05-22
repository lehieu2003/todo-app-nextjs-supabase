import { createBrowserClient } from '@supabase/ssr';

export const createClientSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Deprecated - but keeping for backward compatibility with existing components
// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
