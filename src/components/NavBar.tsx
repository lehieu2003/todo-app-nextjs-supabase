'use client';

import Link from 'next/link';
import AuthButton from './AuthButton';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className='backdrop-blur-md bg-white/80 dark:bg-slate-900/80 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link href='/' className='flex-shrink-0 flex items-center group'>
              <div className='flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white mr-2 shadow-md transition-all group-hover:scale-110'>
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
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
              </div>
              <span className='ml-2 text-xl font-bold text-slate-800 dark:text-white'>
                TaskMaster
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className='hidden sm:ml-6 sm:flex sm:items-center'>
            <div className='flex space-x-4'>
              <Link
                href='/'
                className='px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 transition-colors'
              >
                Home
              </Link>
              <Link
                href='/about'
                className='px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 transition-colors'
              >
                About
              </Link>
            </div>
            <div className='ml-4 flex items-center space-x-2'>
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='sm:hidden flex items-center'>
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none'
              aria-controls='mobile-menu'
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className='sr-only'>Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className='block h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              ) : (
                <svg
                  className='block h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='sm:hidden' id='mobile-menu'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            <Link
              href='/'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href='/about'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
          <div className='px-4 py-3 border-t border-gray-200'>
            <div className='flex items-center space-x-4'>
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
