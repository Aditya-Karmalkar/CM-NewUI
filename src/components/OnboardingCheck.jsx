import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import UniqueLoading from "./ui/morph-loading";

const OnboardingCheck = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/signin");
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          // If user hasn't completed onboarding, redirect them
          if (!userData.hasCompletedOnboarding) {
            navigate("/onboarding");
            return;
          }
        } else {
          // If user doc doesn't exist, they need to complete onboarding
          navigate("/onboarding");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="min-h-screen flex flex-col items-center justify-center bg-white"
      >
        <UniqueLoading size="lg" />
        <p className="mt-4 text-blue-600 font-semibold animate-pulse">
          Preparing your experience...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default OnboardingCheck;
