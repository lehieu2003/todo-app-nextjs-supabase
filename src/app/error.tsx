'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-8'>
      <div className='bg-red-50 border border-red-100 rounded-lg p-8 max-w-lg'>
        <h2 className='text-2xl font-bold text-red-800 mb-4'>
          Something went wrong!
        </h2>
        <p className='text-red-600 mb-6'>
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => reset()}
          className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
        >
          Try again
        </button>
      </div>
    </div>
  );
}
