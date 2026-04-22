import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase';
import { ResetPasswordPage } from './ui/reset-password';
import authHero from "../assets/auth_hero.png";

const sampleTestimonials = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Dr. Adrian Thorne",
    handle: "Lead Data Scientist",
    text: "At CuraMind, we prioritize data integrity and security above all else. Your health data is your own."
  }
];

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyCode = async () => {
      const oobCode = searchParams.get('oobCode');
      if (!oobCode) {
        setError('Invalid password reset link. Please request a new one.');
        setIsVerifying(false);
        return;
      }
      
      try {
        const verifiedEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(verifiedEmail);
        setIsVerifying(false);
      } catch (error) {
        console.error("Error verifying reset code:", error);
        setError('This password reset link has expired or is invalid. Please request a new one.');
        setIsVerifying(false);
      }
    };
    
    verifyCode();
  }, [searchParams]);
  
  const handleResetPassword = async (password) => {
    const oobCode = searchParams.get('oobCode');
    if (!oobCode) {
      setError('Invalid reset code');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setIsCompleted(true);
    } catch (error) {
      console.error("Error resetting password:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-[#0068ff] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-500 font-medium">Verifying link...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ResetPasswordPage
      email={email}
      isSubmitting={isSubmitting}
      isCompleted={isCompleted}
      error={error}
      onSubmit={handleResetPassword}
      onBackToSignIn={() => navigate("/signin")}
      heroImageSrc={authHero}
      testimonials={sampleTestimonials}
    />
  );
};

export default ResetPassword;
