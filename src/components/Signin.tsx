import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { SignInPage, Testimonial } from "./ui/sign-in";
import authHero from "../assets/auth_hero.png";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Dr. Sarah Chen",
    handle: "Chief of Neurology",
    text: "CuraMind has completely transformed our patient engagement. The diagnostic clarity it provides is unmatched."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "Performance Athlete",
    text: "The integration with my sleep and heart data is seamless. The AI insights help me optimize recovery everyday."
  }
];

const Signin = () => {
  const navigate = useNavigate();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/health-dashboard");
    } catch (err) {
      console.error("Sign in failed:", err);
      alert("Invalid credentials. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { handleOAuthSignInWithFallback } = await import('../firebase');
      await handleOAuthSignInWithFallback('google');
      navigate("/health-dashboard");
    } catch (err) {
      console.error("Google sign in failed:", err);
    }
  };

  return (
    <SignInPage
      title="Sign In"
      description="Welcome back to CuraMind"
      heroImageSrc={authHero}
      testimonials={sampleTestimonials}
      onSignIn={handleSignIn}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={() => navigate("/forgot-password")}
      onCreateAccount={() => navigate("/signup")}
    />
  );
};

export default Signin;