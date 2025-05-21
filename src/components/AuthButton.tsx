'use client';

import { useState, useEffect } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';

export default function AuthButton() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
  };

  if (loading) {
    return <div className='animate-pulse bg-gray-200 h-10 w-24 rounded' />;
  }

  return user ? (
    <div className='flex items-center gap-4'>
      <span className='text-sm text-gray-700'>{user.email}</span>
      <button
        onClick={handleSignOut}
        className='bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-md text-sm font-medium'
      >
        Sign Out
      </button>
    </div>
  ) : (
    <div className='space-x-2'>
      <Link
        href='/login'
        className='bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-md'
      >
        Login
      </Link>
      <Link
        href='/signup'
        className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md'
      >
        Sign Up
      </Link>
    </div>
  );
}
