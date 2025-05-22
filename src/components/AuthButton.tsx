'use client';

import { useState, useEffect } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirect to login page after signing out
  };

  if (loading) {
    return <div className='animate-pulse bg-gray-200 h-10 w-24 rounded' />;
  }

  return user ? (
    <div className='flex items-center gap-4'>
      <div className='flex items-center'>
        <div className='h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2'>
          <span className='font-medium text-blue-600 dark:text-blue-300'>
            {user.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className='text-sm text-slate-700 dark:text-slate-300'>
          {user.email}
        </span>
      </div>
      <button
        onClick={handleSignOut}
        className='bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow'
      >
        Sign Out
      </button>
    </div>
  ) : (
    <div className='space-x-2'>
      <Link
        href='/login'
        className='bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow transition-all'
      >
        Login
      </Link>
      <Link
        href='/signup'
        className='bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all'
      >
        Sign Up
      </Link>
    </div>
  );
}
