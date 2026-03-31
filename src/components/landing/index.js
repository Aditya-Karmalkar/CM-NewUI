import React from "react";
import Hero from "./Hero";
import About from "./About";
import Features from "./Features";
import Benefits from "./Benefits";
import HowItWorks from "./HowItWorks";
import Integration from "./Integration";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import CallToAction from "./CallToAction";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import UniqueLoading from "../ui/morph-loading";

// Reusable Reveal component for premium section entry
const SectionReveal = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1], // Custom medical-grade cubic bezier for smoothness
      delay: 0.1
    }}
  >
    {children}
  </motion.div>
);

const LandingPage = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 999, 
            backgroundColor: '#fff', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <UniqueLoading size="lg" />
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={{ 
              marginTop: '24px', 
              color: '#0068ff', 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600,
              fontSize: '18px',
              letterSpacing: '1px'
            }}
          >
            CURAMIND
          </motion.p>
        </motion.div>
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ backgroundColor: "#fff", overflowX: "hidden" }}
        >
          <Hero />
          <About />
          <SectionReveal><Benefits /></SectionReveal>
          <Features />
          <SectionReveal><HowItWorks /></SectionReveal>
          <SectionReveal><Testimonials /></SectionReveal>
          <SectionReveal><FAQ /></SectionReveal>
          <SectionReveal><CallToAction /></SectionReveal>
          <SectionReveal><Footer /></SectionReveal>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandingPage;
