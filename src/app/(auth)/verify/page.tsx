'use client'
import React, { useState, useEffect } from 'react';
import { Back } from '@/components/store/Icon';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const Page = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(180); 
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(180); 
      setCanResend(false);
    }
  };

  return (
    <div className='flex justify-center items-center w-screen relative pt-12'>
        <Link href='/signup' className='absolute top-9 left-5'> <Back /></Link>
      <div className='flex flex-col items-center w-full px-4 py-8'>
        <div className='bg-[#d1376a]/20 text-[#d1376a] font-semibold text-xl py-2 px-6 rounded-xl mb-12'>
          Verify Account
        </div>
        
        <p className='font-semibold text-xl text-center mb-24'>
          Please enter the verification code we sent to your email
        </p>

        <div className='flex justify-center w-full mb-12'>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup className='gap-4 flex justify-center'>
              <InputOTPSlot index={0} className="w-11 h-11 text-lg" />
              <InputOTPSlot index={1} className="w-11 h-11 text-lg" />
              <InputOTPSlot index={2} className="w-11 h-11 text-lg" />
              <InputOTPSlot index={3} className="w-11 h-11 text-lg" />
              <InputOTPSlot index={4} className="w-11 h-11 text-lg" />
              <InputOTPSlot index={5} className="w-11 h-11 text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className='bg-[#d1376a]/20 text-[#d1376a] font-semibold text-[25px] tracking-widest py-1.5 px-3 rounded-xl mb-6'>
          {formatTime(timer)}
        </div>

        <Button 
          variant="link" 
          className={`text-md font-normal ${canResend ? 'text-black cursor-pointer' : 'text-black/90 cursor-not-allowed'}`}
          onClick={handleResend}
          disabled={!canResend}
        >
          Resend again?
        </Button>
      </div>
    </div>
  );
};

export default Page;