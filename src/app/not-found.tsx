import { Metadata } from 'next';
import * as React from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <div className='text-foreground'>
    <main className='mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 sm:px-6 lg:px-8 h-[60vh]'>
      <div className='my-auto flex-shrink-0 '>
        <p className='font-semibold text-[#D1376A] text-5xl'>404</p>
        <h1 className='mt-2 text-4xl font-bold tracking-tight sm:text-5xl'>
          Page not found
        </h1>
        <p className='mt-2 text-base text-gray-500 font-primary'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className='mt-6'>
          <Link href='/' className='text-base font-medium text-[#D1376A] hover:text-[#D1376A]/70'>
            Go back home
            <span aria-hidden='true'> &rarr;</span>
          </Link>
        </div>
      </div>
    </main>
    </div>
  );
}
