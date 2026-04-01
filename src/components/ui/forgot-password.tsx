import React from 'react';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface ForgotPasswordPageProps {
  title?: string;
  description?: string;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  isSubmitted?: boolean;
  email?: string;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  onBackToSignIn?: () => void;
  onChangeEmail?: (email: string) => void;
  isSubmitting?: boolean;
  error?: string;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  title = "Forgot Password?",
  description = "No worries, we'll send you reset instructions.",
  heroImageSrc = "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=2160&q=80",
  testimonials = [],
  isSubmitted = false,
  email = "",
  onSubmit,
  onBackToSignIn,
  onChangeEmail,
  isSubmitting = false,
  error = "",
}) => {
  return (
    <div className="min-h-screen flex font-inter bg-white overflow-hidden">
      {/* Left side: Content */}
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

          {!isSubmitted ? (
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => onChangeEmail?.(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-100 text-zinc-950 text-sm p-4 h-[58px] rounded-[22px] focus:outline-none focus:ring-2 focus:ring-[#0068ff]/10 focus:border-[#0068ff] focus:bg-white transition-all placeholder:text-zinc-400 font-medium"
                />
              </div>

              {error && (
                <div role="alert" className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: "#0056d6" }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[58px] rounded-[22px] bg-[#0068ff] font-bold text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                {!isSubmitting && <Send className="w-4 h-4" />}
              </motion.button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center md:text-left"
            >
              <div className="mb-6 flex justify-center md:justify-start">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-poppins font-bold text-zinc-950 mb-3">Check your email</h2>
              <p className="text-zinc-500 font-medium leading-relaxed mb-8">
                We've sent a password reset link to <span className="text-zinc-950 font-bold">{email}</span>. Please check your inbox and follow the instructions.
              </p>
              
              <button
                onClick={() => window.location.reload()}
                className="text-[#0068ff] font-bold hover:underline underline-offset-4 flex items-center gap-2"
              >
                Didn't receive the email? Try again
              </button>
            </motion.div>
          )}

          <div className="mt-10">
            <button 
              onClick={onBackToSignIn}
              className="group flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-zinc-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Sign In
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right side: Hero Section */}
      <div className="hidden lg:block relative flex-1 p-8">
        <div className="h-full w-full relative rounded-[48px] overflow-hidden shadow-xl bg-zinc-100">
          <img 
             src={heroImageSrc} 
             className="h-full w-full object-cover" 
             alt="CuraMind Clinical Support"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0068ff]/30 via-transparent to-transparent"></div>
          
          {testimonials.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
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
