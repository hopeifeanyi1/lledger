import { Metadata } from 'next';
import * as React from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <div>
    <main className='mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 sm:px-6 lg:px-8 h-[60vh]'>
      <div className='my-auto flex-shrink-0 '>
        <p className='text-base font-semibold text-[#451EB2]'>404</p>
        <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
          Page not found
        </h1>
        <p className='mt-2 text-base text-gray-500 font-primary'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className='mt-6'>
          <Link href='/' className='text-base font-medium text-[#451EB2] hover:text-indigo-800'>
            Go back home
            <span aria-hidden='true'> &rarr;</span>
          </Link>
        </div>
      </div>
    </main>
    </div>
  );
}
