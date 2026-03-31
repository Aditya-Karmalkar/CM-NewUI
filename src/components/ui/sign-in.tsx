import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);


// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: string;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
}

// --- SUB-COMPONENTS ---

const InputField = ({ label, name, type, placeholder, showPasswordToggle, onToggle }: any) => (
  <div className="space-y-2">
    <label className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full bg-zinc-50 border border-zinc-100 text-zinc-950 text-sm p-4 h-[58px] rounded-[22px] focus:outline-none focus:ring-2 focus:ring-[#0068ff]/10 focus:border-[#0068ff] focus:bg-white transition-all placeholder:text-zinc-400 font-medium"
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          {type === 'password' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      )}
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title = "Sign In",
  description = "Welcome back to CuraMind",
  heroImageSrc = "https://images.unsplash.com/photo-1631217818202-90a456109383?w=2160&q=80",
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex font-inter bg-white overflow-hidden">
      {/* Left side: Form */}
      <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[400px] w-full mx-auto"
        >
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-poppins font-bold tracking-tight text-zinc-950 mb-3">{title}</h1>
            <p className="text-zinc-500 font-medium leading-relaxed">{description}</p>
          </div>

          <form className="space-y-5" onSubmit={onSignIn}>
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="name@company.com"
            />

            <div className="space-y-1">
              <InputField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                showPasswordToggle
                onToggle={() => setShowPassword(!showPassword)}
              />
              <div className="flex justify-end pt-1">
                <button 
                  type="button" 
                  onClick={onResetPassword}
                  className="text-sm font-bold text-[#0068ff] hover:underline underline-offset-4"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: "#0056d6" }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full h-[58px] rounded-[22px] bg-[#0068ff] font-bold text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all mt-4"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="relative flex items-center justify-center my-8">
            <div className="w-full border-t border-zinc-100"></div>
            <span className="absolute bg-white px-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">or</span>
          </div>

          <button
            onClick={onGoogleSignIn}
            className="w-full h-[58px] flex items-center justify-center gap-4 border border-zinc-200 rounded-[22px] hover:bg-zinc-50 transition-all font-bold text-zinc-800 shadow-sm"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-10 text-center text-[14px] text-zinc-500 font-medium">
            Don't have an account?{" "}
            <button 
              onClick={onCreateAccount}
              className="text-[#0068ff] font-bold hover:underline underline-offset-4 ml-1"
            >
              Sign Up
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right side: Shared Hero Image */}
      <div className="hidden lg:block relative flex-1 p-8">
        <div className="h-full w-full relative rounded-[48px] overflow-hidden shadow-xl">
          <img 
             src={heroImageSrc} 
             className="h-full w-full object-cover" 
             alt="CuraMind Clinical"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0068ff]/30 via-transparent to-transparent backdrop-brightness-110"></div>
          
          {testimonials.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-12 left-12 right-12 bg-white/80 backdrop-blur-xl p-8 rounded-[36px] border border-white/50 shadow-2xl max-w-[450px]"
            >
              <p className="text-zinc-800 text-lg font-medium italic leading-relaxed mb-6">
                "{testimonials[0].text}"
              </p>
              <div className="flex items-center gap-4">
                <img src={testimonials[0].avatarSrc} className="w-12 h-12 rounded-2xl object-cover" alt={testimonials[0].name} />
                <div>
                  <p className="font-bold text-zinc-950 leading-none">{testimonials[0].name}</p>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">{testimonials[0].handle}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
