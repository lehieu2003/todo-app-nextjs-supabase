'use client';

import { useState } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const supabase = createClientSupabaseClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (authMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setMessage('Signed in successfully!');
        // Redirect to home page after successful login
        router.push('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        setMessage((error as { message: string }).message);
      } else {
        setMessage('An error occurred during authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setMessage('');
  };

  return (
    <div className='max-w-md mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700'>
      <div className='flex items-center justify-center mb-6'>
        <div className='flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white shadow-md'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
            />
          </svg>
        </div>
      </div>

      <h2 className='text-2xl font-bold mb-6 text-center text-slate-800 dark:text-white'>
        {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
      </h2>

      <form onSubmit={handleAuth} className='space-y-5'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'
          >
            Email Address
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='your@email.com'
            className='w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={
              authMode === 'signin' ? '••••••••' : 'Create a password'
            }
            className='w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading
            ? 'Processing...'
            : authMode === 'signin'
            ? 'Sign In'
            : 'Sign Up'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-6 p-4 rounded-lg text-center ${
            message.toLowerCase().includes('error') ||
            message.toLowerCase().includes('failed')
              ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
          }`}
        >
          {message.includes('error') || message.includes('failed') ? (
            <div className='flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {message}
            </div>
          ) : (
            <div className='flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              {message}
            </div>
          )}
        </div>
      )}

      <div className='mt-6 text-center'>
        <button
          onClick={toggleAuthMode}
          className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors focus:outline-none'
        >
          {authMode === 'signin'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
