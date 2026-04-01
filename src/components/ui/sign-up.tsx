import React, { useState } from 'react';
import { Eye, EyeOff, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignUpPageProps {
  title?: React.ReactNode;
  description?: string;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignUp?: (formData: any) => void;
  onGoogleSignUp?: () => void;
  onSigninClick?: () => void;
}

// --- SUB-COMPONENTS ---

const FormInput = ({ label, name, type, value, onChange, placeholder, isFullWidth }: any) => (
  <div className={`space-y-2 ${isFullWidth ? 'md:col-span-2' : ''}`}>
    <label className="text-[13px] font-bold text-zinc-500 font-inter uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
       <input
         required
         name={name}
         type={type}
         placeholder={placeholder}
         value={value}
         onChange={onChange}
         className="w-full bg-zinc-50 border border-zinc-100 text-zinc-950 text-sm p-4 h-[58px] rounded-[22px] focus:outline-none focus:ring-2 focus:ring-[#0068ff]/10 focus:border-[#0068ff] focus:bg-white transition-all font-inter placeholder:text-zinc-400 font-medium"
       />
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignUpPage: React.FC<SignUpPageProps> = ({
  title = "Sign Up",
  description = "Join CuraMind",
  heroImageSrc = "https://images.unsplash.com/photo-1631217818202-90a456109383?w=2160&q=80",
  testimonials = [],
  onSignUp,
  onGoogleSignUp,
  onSigninClick,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '+91 ',
    userType: 'Patient'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp?.(form);
  };

  return (
     <div className="min-h-screen flex font-inter bg-white overflow-hidden">
      {/* Left side: Form (Matches Sign In Layout) */}
      <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-12 z-10 overflow-y-auto custom-scrollbar">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[500px] w-full mx-auto"
        >
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-poppins font-bold tracking-tight text-zinc-950 mb-3">{title}</h1>
            <p className="text-zinc-500 font-medium leading-relaxed">{description}</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
            <FormInput 
              isFullWidth
              label="Full Name"
              name="fullName"
              placeholder="e.g. John Doe"
              type="text"
              value={form.fullName}
              onChange={handleChange}
            />
            
            <FormInput 
              label="Email"
              name="email"
              placeholder="example@gmail.com"
              type="email"
              value={form.email}
              onChange={handleChange}
            />

            <div className="space-y-2 relative">
               <FormInput 
                label="Password"
                name="password"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-10 right-5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
                style={{ marginTop: '0.2rem' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <FormInput 
              label="Phone"
              name="phone"
              placeholder="+91 00000 00000"
              type="tel"
              value={form.phone}
              onChange={handleChange}
            />

            <div className="space-y-2">
               <label className="text-[13px] font-bold text-zinc-500 font-inter uppercase tracking-widest ml-1">Profile</label>
               <div className="relative">
                 <select 
                   name="userType" 
                   value={form.userType} 
                   onChange={handleChange}
                   className="w-full bg-zinc-50 border border-zinc-100 text-zinc-950 text-sm p-4 h-[58px] rounded-[22px] focus:outline-none focus:border-[#0068ff] appearance-none font-bold cursor-pointer transition-all"
                 >
                   <option value="Patient">Patient</option>
                   <option value="Doctor">Healthcare Professional</option>
                 </select>
                 <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 w-5 h-5 text-zinc-400 pointer-events-none" />
               </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: "#0056d6" }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="md:col-span-2 w-full h-[60px] rounded-[22px] bg-[#0068ff] font-bold text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 transition-all mt-4"
            >
              Sign Up
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          {/* Secondary Auth */}
          <div className="relative my-8 flex items-center justify-center">
            <div className="w-full border-t border-zinc-100"></div>
            <span className="absolute bg-white px-5 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">or</span>
          </div>

          <button onClick={onGoogleSignUp} className="w-full h-[58px] flex items-center justify-center gap-4 border border-zinc-200 rounded-[22px] hover:bg-zinc-50 transition-all font-bold text-zinc-800 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-[14px] font-medium text-zinc-500 pb-12 tracking-tight mt-8">
            Already have an account?{" "}
            <button 
              onClick={onSigninClick} 
              className="text-[#0068ff] font-bold hover:underline underline-offset-4 ml-1"
            >
              Sign In
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
