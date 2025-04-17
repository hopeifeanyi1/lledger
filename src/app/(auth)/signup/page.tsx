// src/app/(auth)/signup/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Intro } from '../../../../public/svgs';
import Logo from '@/components/store/Logo';
import { Mail } from 'lucide-react';
import { Google } from '@/components/store/Icon';
import { signIn, useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { status } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/overview');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Create user in Supabase
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      // Sign in with NextAuth
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // If sign-in fails, still tell the user signup was successful
        router.push('/login?message=Check your email to verify your account');
      } else {
        router.push('/overview');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signIn('google', { callbackUrl: '/overview' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Failed to sign up with Google');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className='bg-white text-black px-4 sm:px-6 md:px-[8vw] flex flex-col md:flex-row justify-between lg:space-x-14 min-h-screen md:h-screen items-center py-8 md:py-0'>
      <div className='hidden md:block'>
        <Image src={Intro} alt='Welcome illustration' className='h-[82dvh] w-auto'/>
      </div>
      
      <div className='w-full max-w-[420px] md:w-[420px]'>
        <div className='mb-6 md:mb-10'>
          <Logo />
        </div>
        
        <h1 className='text-xl md:text-2xl font-semibold mb-1 md:mb-1.5'>Create an Account</h1>
        <p className='text-black/80 text-sm md:text-md mb-4 md:mb-6'>Select method to sign up</p>
        
        {error && <div className='mb-4 text-sm text-red-500'>{error}</div>}
        
        <div className='mb-4 md:mb-6'>
          <button 
            className='w-full flex items-center justify-center gap-2 md:gap-3 py-2.5 md:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition'
            onClick={handleGoogleSignup}
          >
            <Google/>
            <span>Continue with Google</span>
          </button>
        </div>
        
        <div className='flex items-center gap-3 mb-4 md:mb-6'>
          <div className='h-px bg-gray-300 flex-1'></div>
          <span className='text-gray-500 text-xs md:text-sm'>or use email</span>
          <div className='h-px bg-gray-300 flex-1'></div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className='mb-3 md:mb-5.5'>
            <div className='relative'>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full py-2 px-3 md:px-4 border border-black/40 focus:border-black rounded-md text-sm md:text-base focus:outline-none transition-colors'
                placeholder='Email'
                required
              />
              <Mail className='absolute right-3 top-2.5 text-gray-400' size={18} />
            </div>
          </div>
          
          <div className='mb-3 md:mb-5.5'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full py-2 px-3 md:px-4 border border-black/40 focus:border-black rounded-md text-sm md:text-base focus:outline-none transition-colors'
              placeholder='Create Password'
              required
            />
          </div>
          
          <div className='mb-3 md:md:mb-5.5'>
            <input
              id='confirmPassword'
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full py-2 px-3 md:px-4 border border-black/40 focus:border-black rounded-md text-sm md:text-base focus:outline-none transition-colors'
              placeholder='Confirm Password'
              required
            />
          </div>
          
          <div className='mb-4 md:mb-16 flex items-center'>
            <input
              id='showPassword'
              type='checkbox'
              checked={showPassword}
              onChange={togglePasswordVisibility}
              className='h-3 w-3 md:h-3.5 md:w-3.5 border-gray-300 rounded accent-[#D1376A]'
            />
            <label htmlFor='showPassword' className='ml-2 block text-xs md:text-sm text-gray-700'>
              Show password
            </label>
          </div>
          
          <button
            type='submit'
            className='w-full bg-[#D1376A] hover:bg-[#d1376a]/80 text-white font-medium py-2.5 md:py-3 rounded-lg transition text-sm md:text-base'
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        
        <p className='text-center text-xs md:text-sm mt-4 md:mt-5'>
          Already have an account?{' '}
          <a href='/login' className='text-[#D1376A] hover:text-[#D1376A]/80 font-medium'>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;