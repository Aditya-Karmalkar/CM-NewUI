import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import ProfileSummary from "./components/ProfileSummary";
import EmailVerification from "./components/EmailVerification";
import VerificationRequiredPage from "./components/VerificationRequiredPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/UserProfile";
import Navigation from "./components/Navigation";
import CuraMindDashboard from "./components/newdashboard/CuraMindDashboard";
import DoctorDashboard from "./components/doctor-dashboard/DoctorDashboard";
import AdminDashboard from "./components/admin-dashboard/AdminDashboard";
import { SettingsLayout } from "./components/settings";
import EmergencyProfilePage from "./components/emergency/EmergencyProfilePage";
import "./App.css";
import "./styles/iridescence.css";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ui/ToastContainer";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";
import OnboardingCheck from "./components/OnboardingCheck";
import FAQPage from "./components/faq/FAQPage";
import LandingPage from "./components/landing";
import { SettingsProvider } from "./context/SettingsContext";
import PageTransitionWrapper from "./components/transition-effect/PageTransitionWrapper";
import Header from "./components/landing/Header";
import SubscriptionPage from "./pages/SubscriptionPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import { supabase } from "./supabase";

const RoleBasedDashboard = ({ patientComponent, doctorComponent, adminComponent }: { patientComponent: React.ReactNode, doctorComponent: React.ReactNode, adminComponent: React.ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userType = session.user.user_metadata?.user_type;
        if (userType) {
          setRole(userType);
          setLoading(false);
          return;
        }

        const { data } = await supabase.from('users').select('user_type').eq('id', session.user.id).single();
        if (data) setRole(data.user_type);
      }
      setLoading(false);
    };
    checkRole();
  }, []);

  if (loading) return null;
  if (role === 'Admin') return <>{adminComponent}</>;
  if (role === 'Doctor') return <>{doctorComponent}</>;
  return <>{patientComponent}</>;
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname === "/chat";
  const [darkMode] = useState(false);

  // Handle OAuth redirect result on app load
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const { handleOAuthRedirectResult } = await import('./firebase');
        await handleOAuthRedirectResult(navigate);
      } catch (error) {
        console.error('OAuth redirect handling error:', error);
      }
    };

    handleRedirect();
  }, [navigate]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .scale-reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    return () => {
        revealElements.forEach(el => revealObserver.unobserve(el));
    };
  }, [location.pathname]);

  return (
    <>
      {!isChatPage &&
        !['/', '/landing', '/signin', '/signup', '/forgot-password', '/health-dashboard'].includes(location.pathname) && 
        !location.pathname.startsWith("/reset-password") && <Navigation />}
      {["/", "/landing"].includes(location.pathname) && <Header />}
      <div
        className={
          !isChatPage &&
          !['/signin', '/signup', '/forgot-password'].some(p => location.pathname.startsWith(p))
            ? "bg-background text-foreground min-h-screen"
            : ""
        }
      >
        <PageTransitionWrapper location={location}>
          <Routes location={location} key={location.pathname}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route
              path="/verification-required"
              element={<VerificationRequiredPage />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            
            {/* Emergency Profile Route - Public for universal access */}
            <Route path="/emergency-profile" element={<EmergencyProfilePage />} />
            
            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <OnboardingCheck>
                    <RoleBasedDashboard 
                      patientComponent={<CuraMindDashboard />} 
                      doctorComponent={<DoctorDashboard />} 
                      adminComponent={<AdminDashboard />} 
                    />
                  </OnboardingCheck>
                </ProtectedRoute>
              }
            />
            <Route
              path="/health-dashboard"
              element={
                <ProtectedRoute>
                  <RoleBasedDashboard 
                    patientComponent={<CuraMindDashboard />} 
                    doctorComponent={<DoctorDashboard />} 
                    adminComponent={<AdminDashboard />} 
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/*"
              element={
                <ProtectedRoute>
                  <SettingsLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingFlow />
                </ProtectedRoute>
              }
            />
            <Route path="/faq" element={<FAQPage darkMode={darkMode} />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </PageTransitionWrapper>
      </div>
    </>
  );
};

const App = () => {
  return (
    <SettingsProvider>
      <ToastProvider>
        <div className="App">
          <Router>
            <ToastContainer />
            <AppContent />
          </Router>
        </div>
      </ToastProvider>
    </SettingsProvider>
  );
};

export default App;
