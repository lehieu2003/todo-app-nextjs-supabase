'use client';

import dynamic from 'next/dynamic';

// Use dynamic import to avoid hydration issues with client components
const NavBar = dynamic(() => import('@/components/NavBar'), { ssr: false });

export default function AboutPage() {
  return (
    <div>
      <NavBar />
      <div className='container mx-auto p-8 max-w-4xl'>
        <h1 className='text-3xl font-bold mb-6'>About This Todo App</h1>

        <div className='prose lg:prose-xl'>
          <p className='mb-4'>
            This Todo application demonstrates a full-stack implementation using
            Next.js and Supabase, providing a seamless experience for managing
            your tasks.
          </p>

          <h2 className='text-2xl font-semibold mt-6 mb-3'>Features</h2>
          <ul className='list-disc pl-5 mb-6 space-y-2'>
            <li>User authentication with Supabase Auth</li>
            <li>Create, read, update, and delete todos</li>
            <li>Real-time updates with Supabase</li>
            <li>Responsive design with Tailwind CSS</li>
            <li>Server-side rendering with Next.js</li>
          </ul>

          <h2 className='text-2xl font-semibold mt-6 mb-3'>Tech Stack</h2>
          <div className='mb-6'>
            <h3 className='text-xl font-medium mb-2'>Frontend</h3>
            <ul className='list-disc pl-5 space-y-1'>
              <li>Next.js - React framework</li>
              <li>Tailwind CSS - Utility-first CSS framework</li>
              <li>React Hooks for state management</li>
            </ul>
          </div>

          <div className='mb-6'>
            <h3 className='text-xl font-medium mb-2'>Backend</h3>
            <ul className='list-disc pl-5 space-y-1'>
              <li>Supabase - Open source Firebase alternative</li>
              <li>PostgreSQL - SQL database hosted by Supabase</li>
              <li>Supabase Auth - Authentication system</li>
            </ul>
          </div>

          <h2 className='text-2xl font-semibold mt-6 mb-3'>Getting Started</h2>
          <p className='mb-4'>
            To get started with using this application, create an account or
            sign in if you already have one. Once authenticated, you can start
            adding todos to your list.
          </p>

          <p className='mb-4'>
            This project is built as a demonstration of modern web development
            practices and can be extended with additional features as needed.
          </p>
        </div>
      </div>
    </div>
  );
}
