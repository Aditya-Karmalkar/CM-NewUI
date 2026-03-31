import React from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail } from "../supabase";
import { SignUpPage, Testimonial } from "./ui/sign-up";
import authHero from "../assets/auth_hero.png";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Dr. Elena Rossi",
    handle: "Clinical Director",
    text: "CuraMind represents the pinnacle of patient-first data intelligence. The onboarding is as seamless as the care it facilitates."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/85.jpg",
    name: "Thomas W.",
    handle: "Wellness Advocate",
    text: "Finally, a platform that respects data privacy while delivering high-fidelity health insights. A true game-changer."
  }
];

const Signup = () => {
  const navigate = useNavigate();

  const handleSignUp = async (formData: any) => {
    try {
      const { data: { user }, error } = await signUpWithEmail(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          user_type: formData.userType,
          auth_provider: 'email'
        }
      );
      if (error) throw error;
      if (user) navigate("/health-dashboard");
    } catch (err: any) {
      console.error("Sign up failed:", err);
      alert(err.message || "Failed to establish account. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { handleOAuthSignInWithFallback } = await import('../firebase');
      await handleOAuthSignInWithFallback('google');
      navigate("/health-dashboard");
    } catch (err) {
      console.error("Google sign up failed:", err);
    }
  };

  return (
    <SignUpPage
      title="Sign Up"
      description="Join the CuraMind health intelligence network."
      heroImageSrc={authHero}
      testimonials={sampleTestimonials}
      onSignUp={handleSignUp}
      onGoogleSignUp={handleGoogleSignUp}
      onSigninClick={() => navigate("/signin")}
    />
  );
};

export default Signup;