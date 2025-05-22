import type { Metadata } from 'next';
import { Quicksand, Poppins } from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
  display: 'swap',
});

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TaskMaster - Modern Todo App',
  description:
    'A sleek, modern todo application built with Next.js and Supabase',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${quicksand.variable} ${poppins.variable} antialiased bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900`}
        suppressHydrationWarning
      >
        <div className='min-h-screen flex flex-col'>
          <div className='flex-grow'>{children}</div>
          <footer className='p-4 text-center text-sm text-gray-500 dark:text-gray-400'>
            <p>© {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
