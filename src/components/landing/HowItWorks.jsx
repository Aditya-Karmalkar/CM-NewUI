import React from "react";
import { motion } from "framer-motion";
import doctorsTeam from "../../assets/doctors_team_portrait.png";

const HowItWorks = () => {
  return (
    <section id="mission" style={{ backgroundColor: "#fff", padding: "120px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "0 6%" }}>
        
        {/* Horizontal Mission Card Area */}
        <div 
          style={{ 
            display: "flex", 
            flexDirection: "row", 
            alignItems: "center", 
            gap: "80px",
            marginBottom: "100px"
          }} 
          className="mission-container"
        >
          
          {/* L: Image - Large rounded rectangle with hover effect */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: "0 0 550px", position: "relative" }} 
            className="mission-image"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              style={{ 
                 borderRadius: "48px", 
                 overflow: "hidden", 
                 aspectRatio: "1.3 / 1",
                 backgroundColor: "#f1f3f6",
                 boxShadow: "0 30px 60px -12px rgba(0,0,0,0.15)"
              }}>
              <img 
                src={doctorsTeam} 
                alt="Doctors Team" 
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
              />
            </motion.div>
            
            {/* Decorative element */}
            <div style={{ 
              position: "absolute", 
              top: "-20px", 
              left: "-20px", 
              width: "100px", 
              height: "100px", 
              border: "4px solid #0068ff", 
              borderRadius: "24px", 
              zIndex: -1 
            }} />
          </motion.div>

          {/* R: Content block with staggered reveal */}
          <div style={{ flex: "1" }} className="mission-content">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                backgroundColor: "rgba(0,104,255,0.08)", 
                borderRadius: "100px", 
                padding: "10px 24px", 
                marginBottom: "24px",
                border: "1px solid rgba(0,104,255,0.1)"
              }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "#0068ff" }}>
                CuraMind Health Solution
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{ 
                fontFamily: "'Poppins', sans-serif", 
                fontWeight: 700, 
                fontSize: "clamp(34px, 4.5vw, 54px)", 
                color: "#111", 
                lineHeight: 1.1, 
                letterSpacing: "-0.04em", 
                marginBottom: "24px" 
              }}>
              Dedicated to your health and <span style={{ color: "#0068ff" }}>well-being</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontSize: "18px", 
                lineHeight: "1.6", 
                color: "#595959", 
                marginBottom: "48px", 
                maxWidth: "500px" 
              }}>
              Our mission is to provide exceptional healthcare tailored to your needs. 
              We are committed to fostering a healthier community through compassionate care and advanced medical practices.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <a href="/signup" 
                className="mission-cta"
                style={{ 
                  display: "inline-block", 
                  backgroundColor: "#111", 
                  color: "#fff", 
                  padding: "18px 48px", 
                  borderRadius: "100px", 
                  fontFamily: "'Inter', sans-serif", 
                  fontWeight: 700, 
                  fontSize: "16px", 
                  textDecoration: "none", 
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease"
                }}>
                Learn more
              </a>
            </motion.div>
          </div>
        </div>

        {/* Secondary Ticker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            width: "100%",
            backgroundColor: "#0068ff",
            borderRadius: "40px",
            padding: "24px 0",
            overflow: "hidden",
            position: "relative",
            zIndex: 15,
            boxShadow: "0 20px 50px rgba(0,104,255,0.2)"
          }}
        >
          <div
            style={{
              display: "flex",
              whiteSpace: "nowrap",
              animation: "ticker-scroll-mission 40s linear infinite",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "48px", paddingRight: "48px" }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "22px", color: "#fff" }}>24/7 Monitoring</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "26px" }}>•</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "22px", color: "#fff" }}>Preventive Care</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "26px" }}>•</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "22px", color: "#fff" }}>AI Wellness Coach</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "26px" }}>•</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "22px", color: "#fff" }}>Secure Health Vault</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "26px" }}>•</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "22px", color: "#fff" }}>Emergency Support</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "26px" }}>•</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      <style>{`
        @keyframes ticker-scroll-mission {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .mission-cta:hover {
          background-color: #0068ff !important;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0,104,255,0.3) !important;
        }
        @media (max-width: 1024px) {
          .mission-container {
             flex-direction: column !important;
             gap: 60px !important;
             text-align: center;
          }
          .mission-image {
             flex: 0 0 auto !important;
             width: 100% !important;
             max-width: 600px;
          }
          .mission-content p {
             margin-left: auto;
             margin-right: auto;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
