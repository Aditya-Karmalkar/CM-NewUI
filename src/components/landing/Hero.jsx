import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { auth } from "../../firebase";
import heroDoctor from "../../assets/hero_doctor.png";
import IridescenceBackground from "./IridescenceBackground";

const Hero = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const { scrollY } = useScroll();

  // Parallax offsets
  const yBackground = useTransform(scrollY, [0, 500], [0, 150]);
  const yContent = useTransform(scrollY, [0, 500], [0, -50]);
  const yImage = useTransform(scrollY, [0, 500], [0, -100]);
  const opacityBackground = useTransform(scrollY, [0, 300], [1, 0.4]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setCurrentUser(u && u.uid ? u : null);
    });
    return () => unsub();
  }, []);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const watermarkVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <section
      style={{
        backgroundColor: "#fff",
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Premium Background */}
      <IridescenceBackground 
        color={[0.0, 0.4, 1.0]} 
        speed={0.5} 
        amplitude={0.1}
        className="absolute inset-0 z-0 opacity-20" 
      />

      {/* Giant background heading — Watermark */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={watermarkVariants}
        style={{
          y: yBackground,
          opacity: opacityBackground,
          position: "absolute",
          top: "12%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(100px, 20vw, 200px)",
            color: "#000",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            whiteSpace: "nowrap",
            margin: 0,
          }}
        >
          CuraMind
        </h1>
      </motion.div>

      {/* Content layer */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          y: yContent,
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          padding: "180px 6% 120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {/* Left: subtitle + CTA */}
        <motion.div
          variants={itemVariants}
          style={{
            flex: "1 1 340px",
            maxWidth: "400px",
            alignSelf: "flex-end",
            marginBottom: "40px",
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              lineHeight: "1.6",
              color: "#595959",
              marginBottom: "32px",
              fontWeight: 400,
            }}
          >
            We provide compassionate care and advanced treatments tailored to your needs.
            Experience convenient access to healthcare.
          </p>

          <Link
            to={currentUser ? "/health-dashboard" : "/signup"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              color: "#fff",
              backgroundColor: "#0068ff",
              borderRadius: "48px",
              padding: "15px 32px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 14px 0 rgba(0,104,255,0.3)",
            }}
          >
            Explore services
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Right: doctor image card (Video Call UI) */}
        <motion.div
          variants={itemVariants}
          style={{
            y: yImage,
            flex: "0 0 auto",
            width: "clamp(280px, 30vw, 330px)",
            position: "relative",
            zIndex: 20,
          }}
        >
          <div
            style={{
              borderRadius: "48px",
              overflow: "hidden",
              backgroundColor: "#edeef1",
              aspectRatio: "1 / 1.15",
              position: "relative",
              boxShadow: "0 32px 64px rgba(0,0,0,0.12)",
            }}
          >
            <img
              src={heroDoctor}
              alt="Healthcare Professional"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />

            {/* Video Call Controls Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "32px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(12px)",
                padding: "8px 20px",
                borderRadius: "32px",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </div>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "#ff3b30", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.01-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-10.49 0-19-8.51-19-19 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Service Ticker Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          width: "90%",
          margin: "0 auto 40px",
          backgroundColor: "#0068ff",
          borderRadius: "32px",
          padding: "16px 0",
          overflow: "hidden",
          position: "relative",
          zIndex: 15,
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "ticker-scroll 25s linear infinite",
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "32px", paddingRight: "32px" }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "20px", color: "#fff" }}>AI Diagnosis</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "24px" }}>•</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "20px", color: "#fff" }}>Mental Health Support</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "24px" }}>•</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "20px", color: "#fff" }}>Medication Tracking</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "24px" }}>•</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "20px", color: "#fff" }}>Virtual Consultations</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "24px" }}>•</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "20px", color: "#fff" }}>Health Insights</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "24px" }}>•</span>
            </div>
          ))}
        </div>
      </motion.div>

      <style>
        {`
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
