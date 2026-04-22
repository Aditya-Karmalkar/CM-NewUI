import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface ResetPasswordPageProps {
  title?: string;
  description?: string;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  isCompleted?: boolean;
  email?: string;
  onSubmit?: (password: string) => void;
  onBackToSignIn?: () => void;
  isSubmitting?: boolean;
  error?: string;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  title = "Create New Password",
  description = "Please enter your new password below.",
  heroImageSrc = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=2160&q=80",
  testimonials = [],
  isCompleted = false,
  email = "",
  onSubmit,
  onBackToSignIn,
  isSubmitting = false,
  error = "",
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Calculate strength (0-4)
  const strength = password.length === 0 ? 0 : 
                   [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/]
                   .filter(regex => regex.test(password)).length;

  const passwordsMatch = password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordsMatch && strength >= 2) {
      onSubmit?.(password);
    }
  };

  return (
    <div className="min-h-screen flex font-inter bg-white overflow-hidden">
      <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[400px] w-full mx-auto"
        >
          {!isCompleted ? (
            <>
              <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-poppins font-bold tracking-tight text-zinc-950 mb-3">{title}</h1>
                <p className="text-zinc-500 font-medium leading-relaxed">
                  Resetting password for <span className="text-zinc-950 font-bold">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex gap-3 text-red-600 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider ml-1">New Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 text-zinc-950 text-sm p-4 h-[58px] rounded-[22px] focus:outline-none focus:ring-2 focus:ring-[#0068ff]/10 focus:border-[#0068ff] focus:bg-white transition-all placeholder:text-zinc-400 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-5 flex items-center text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Strength bar */}
                  <div className="px-1 pt-1">
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          strength <= 1 ? 'bg-red-400' : strength === 2 ? 'bg-yellow-400' : strength === 3 ? 'bg-blue-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${(strength / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Confirm Password</label>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-zinc-50 border ${confirmPassword && !passwordsMatch ? 'border-red-400 ring-2 ring-red-100' : 'border-zinc-100'} text-zinc-950 text-sm p-4 h-[58px] rounded-[22px] focus:outline-none focus:ring-2 focus:ring-[#0068ff]/10 focus:border-[#0068ff] focus:bg-white transition-all placeholder:text-zinc-400 font-medium`}
                  />
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-red-500 text-xs font-bold ml-1">Passwords do not match</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: "#0056d6" }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting || !passwordsMatch || strength < 2}
                  className="w-full h-[58px] rounded-[22px] bg-[#0068ff] font-bold text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                  {!isSubmitting && <Lock className="w-4 h-4" />}
                </motion.button>
              </form>
            </>
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
              <h2 className="text-2xl font-poppins font-bold text-zinc-950 mb-3">Password updated</h2>
              <p className="text-zinc-500 font-medium leading-relaxed mb-8">
                Your password has been successfully updated. You can now use your new password to sign into your account.
              </p>
              
              <button
                onClick={onBackToSignIn}
                className="w-full h-[58px] rounded-[22px] bg-[#0068ff] font-bold text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 transition-all"
              >
                Sign In Now
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="hidden lg:block relative flex-1 p-8">
        <div className="h-full w-full relative rounded-[48px] overflow-hidden shadow-xl bg-zinc-100">
          <img 
             src={heroImageSrc} 
             className="h-full w-full object-cover" 
             alt="Reset Password"
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
