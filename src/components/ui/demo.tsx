import { SignInPage, Testimonial } from "./sign-in";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Dr. Sarah Chen",
    handle: "Chief of Neurology",
    text: "CuraMind has completely transformed our patient engagement. The diagnostic clarity we get from these AI insights is unparalleled."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "Performance Athlete",
    text: "The personalized wellness tracking and seamless integration with my wearable data is exactly what I was looking for."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "Health Researcher",
    text: "Minimalist, secure, and incredibly powerful. This is the future of health technology."
  },
];

const SignInPageDemo = () => {
  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Sign In submitted:", data);
    alert(`Sign In Submitted! Welcome back to CuraMind.`);
  };

  const handleGoogleSignIn = () => {
    console.log("Continue with Google clicked");
    alert("Authenticating with Google...");
  };
  
  const handleResetPassword = () => {
    alert("Password reset instructions sent to your email.");
  }

  const handleCreateAccount = () => {
    alert("Redirecting to account creation...");
  }

  return (
    <div className="bg-background text-foreground">
      <SignInPage
        title={<>Better Insights,<br /><span className="text-primary">Better Health.</span></>}
        description="Your professional health dashboard is just a sign-in away."
        heroImageSrc="https://images.unsplash.com/photo-1631217818202-90a456109383?w=2160&q=80" // High-end clinical laboratory / glass tech
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};

export default SignInPageDemo;
