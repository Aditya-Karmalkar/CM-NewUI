import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import doctorFemale from "../../assets/doctor_female_portrait.png";
import doctorMale from "../../assets/doctor_male_portrait.png";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section id="about" style={{ backgroundColor: "#fff", padding: "120px 0" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "0 6%", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "60px" }}>
        
        {/* Left: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ flex: "1 1 450px", minWidth: "300px" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", backgroundColor: "#f1f3f6", borderRadius: "100px", padding: "8px 24px", marginBottom: "32px" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "#0068ff" }}>
              CuraMind Health Solution
            </span>
          </div>
          
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(48px, 6vw, 68px)", color: "#111", lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: "32px" }}>
            Find quality care nearby and access it when you <span style={{ color: "#0068ff" }}>need</span> it
          </h2>
          
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: "1.7", color: "#595959", marginBottom: "48px", maxWidth: "480px" }}>
            Our network of healthcare facilities is designed to provide you with easy access to quality care. 
            Explore our locations to find the best services near you.
          </p>
          
          <Link to="/signup" style={{ display: "inline-block", backgroundColor: "#0068ff", color: "#fff", padding: "18px 48px", borderRadius: "100px", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "16px", textDecoration: "none", boxShadow: "0 8px 24px rgba(0,104,255,0.25)", transition: "all 0.3s ease" }}>
            Learn more
          </Link>
        </motion.div>

        {/* Right: Grid of cards & images */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ flex: "1 1 500px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", position: "relative" }}
        >
          
          {/* Item 1: Large rounded doctor image */}
          <motion.div variants={itemVariants} style={{ borderRadius: "48px", overflow: "hidden", backgroundColor: "#f1f3f6", aspectRatio: "1 / 1.2" }}>
            <img src={doctorFemale} alt="Doctor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>

          {/* Item 2: Explore services card */}
          <motion.div variants={itemVariants} style={{ backgroundColor: "#f1f3f6", borderRadius: "48px", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#0068ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <h4 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "20px", color: "#111", marginBottom: "8px" }}>Explore Services</h4>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#595959", lineHeight: 1.5 }}>
                Click to view all locations and find the care you need.
              </p>
            </div>
          </motion.div>

          {/* Item 3: Find locations card */}
          <motion.div variants={itemVariants} style={{ backgroundColor: "#f1f3f6", borderRadius: "48px", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#0068ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div>
              <h4 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "20px", color: "#111", marginBottom: "8px" }}>Find Locations</h4>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#595959", lineHeight: 1.5 }}>
                Discover our clinics, complete with addresses, phones...
              </p>
            </div>
          </motion.div>

          {/* Item 4: Another doctor image */}
          <motion.div variants={itemVariants} style={{ borderRadius: "48px", overflow: "hidden", backgroundColor: "#f1f3f6", aspectRatio: "1 / 1.2" }}>
            <img src={doctorMale} alt="Doctor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default About;
