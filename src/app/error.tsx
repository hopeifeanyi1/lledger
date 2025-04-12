'use client'; 

import * as React from 'react';
import TextButton from '@/components/ui/TextButton';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
    <main className=" md:pt-14 lg:pt-32">
      <section className='bg-white'>
        <div className='layout flex flex-col h-[50dvh] items-center justify-center text-center text-black'>
          
          <h1 className='md:mt-8 mt-24 text-3xl md:text-6xl'>
            Oops, something went wrong!
          </h1>
          <TextButton variant='basic' onClick={reset} className='mt-4'>
            Try again
          </TextButton>
        </div>
      </section>
    </main>
    </div>
  );
}
