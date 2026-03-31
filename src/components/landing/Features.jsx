import React from "react";
import { motion } from "framer-motion";
import patientsAvatar from "../../assets/avatar_satisfied_patients.png";

const Features = () => {
  const cards = [
    {
      title: "Personalized, ongoing health management for your needs",
      desc: "Your first step towards a healthier life starts here.",
      icon: "heart"
    },
    {
      title: "Urgent attention for your immediate health concerns",
      desc: "Quick access to care when you need it most.",
      icon: "shield"
    },
    {
      title: "Advanced care in cardiology, orthopedics, and more",
      desc: "Get expert care tailored to your specific health needs.",
      icon: "plus"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <section id="features" style={{ backgroundColor: "#fff", padding: "100px 0" }}>
      <div 
        style={{ 
          maxWidth: "1250px", 
          margin: "0 auto", 
          padding: "0 6%", 
          display: "flex", 
          flexDirection: "row", 
          gap: "80px", 
          alignItems: "flex-start" 
        }} 
        className="features-container"
      >
        
        {/* Left: Content Block */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          style={{ flex: "1 1 40%", minWidth: "320px" }} 
          className="features-left"
        >
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            backgroundColor: "#f1f3f6", 
            borderRadius: "100px", 
            padding: "10px 24px", 
            marginBottom: "32px" 
          }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "#0068ff" }}>
              CuraMind Health Solution
            </span>
          </div>

          <h2 style={{ 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: 700, 
            fontSize: "clamp(38px, 5vw, 60px)", 
            color: "#111", 
            lineHeight: 1.05, 
            letterSpacing: "-0.04em", 
            marginBottom: "32px" 
          }}>
            Comprehensive care for every stage of <span style={{ color: "#0068ff" }}>life</span>
          </h2>

          <p style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontSize: "17px", 
            lineHeight: "1.6", 
            color: "#595959", 
            marginBottom: "80px", 
            maxWidth: "520px" 
          }}>
            At our facility, we prioritize your health with a range of services tailored to your needs. 
            From routine check-ups to specialized treatments, our dedicated team is here to support you. 
            Experience the convenience of comprehensive care all in one place.
          </p>

          {/* Social Proof: Avatars */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <img 
              src={patientsAvatar} 
              alt="17k+ Satisfied patients" 
              style={{ height: "48px", objectFit: "contain" }} 
            />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "18px", color: "#0068ff" }}>17k+</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "#595959" }}>Satisfied patients</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Vertical List of Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ flex: "1 1 50%", minWidth: "350px" }} 
          className="features-right"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {cards.map((card, i) => (
              <motion.div 
                key={i} 
                variants={cardVariants}
                style={{ 
                  backgroundColor: "#f1f3f6", 
                  borderRadius: "48px", 
                  padding: "40px 50px", 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "24px",
                  transition: "transform 0.3s ease, background-color 0.3s ease"
                }}
                onMouseEnter={(e) => {
                   e.currentTarget.style.backgroundColor = "#fff";
                   e.currentTarget.style.transform = "translateY(-5px)";
                   e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                   e.currentTarget.style.backgroundColor = "#f1f3f6";
                   e.currentTarget.style.transform = "translateY(0)";
                   e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Icon Circle */}
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "50%", 
                  backgroundColor: "#0068ff", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  {card.icon === "heart" && <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>}
                  {card.icon === "shield" && <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z M12 7l4 2v5c0 2.41-1.62 4.67-4 5.29V7z"/></svg>}
                  {card.icon === "plus" && <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>}
                </div>

                {/* Text Content */}
                <div>
                  <h4 style={{ 
                    fontFamily: "'Poppins', sans-serif", 
                    fontWeight: 700, 
                    fontSize: "20px", 
                    color: "#111", 
                    marginBottom: "12px", 
                    lineHeight: 1.3 
                  }}>
                    {card.title}
                  </h4>
                  <p style={{ 
                    fontFamily: "'Inter', sans-serif", 
                    fontSize: "15px", 
                    color: "#595959", 
                    lineHeight: 1.5, 
                    marginBottom: "12px" 
                  }}>
                    {card.desc}
                  </p>
                  <a href="/signup" style={{ 
                    fontFamily: "'Inter', sans-serif", 
                    fontWeight: 700, 
                    fontSize: "15px", 
                    color: "#0068ff", 
                    textDecoration: "none" 
                  }}>
                    Learn more
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .features-container {
            flex-direction: column !important;
            gap: 60px !important;
          }
          .features-left {
             max-width: 100% !important;
             text-align: center;
          }
          .features-left p {
             margin-left: auto;
             margin-right: auto;
          }
          .features-left div {
             justify-content: center;
          }
          .features-right {
             width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Features;
