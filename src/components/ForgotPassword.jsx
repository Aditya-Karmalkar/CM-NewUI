import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { ForgotPasswordPage } from "./ui/forgot-password";
import authHero from "../assets/auth_hero.png";

const sampleTestimonials = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/42.jpg",
    name: "Dr. Elena Vance",
    handle: "Chief of Medical Innovation",
    text: "Empowering patients to own their health journey is the heart of CuraMind's mission. Truly revolutionary."
  }
];

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ForgotPasswordPage
      email={email}
      onChangeEmail={setEmail}
      isSubmitting={isSubmitting}
      isSubmitted={isSubmitted}
      error={error}
      onSubmit={handleSubmit}
      onBackToSignIn={() => navigate("/signin")}
      heroImageSrc={authHero}
      testimonials={sampleTestimonials}
    />
  );
};

export default ForgotPassword;
