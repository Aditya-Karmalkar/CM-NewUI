import React from "react";
import doctorsTeam from "../../assets/doctors_team_portrait.png";
import doctorFemale from "../../assets/doctor_female_portrait.png";
import doctorMale from "../../assets/doctor_male_portrait.png";

const CallToAction = () => {
  return (
    <section id="guides" style={{ backgroundColor: "#fff", padding: "80px 0 120px" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "0 6%" }}>
        
        {/* Get In Touch Banner — High Fidelity */}
        <div style={{ 
          backgroundColor: "#0068ff", 
          borderRadius: "40px", 
          padding: "40px 60px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "120px",
          boxShadow: "0 20px 50px rgba(0,104,255,0.2)"
        }}>
          <h2 style={{ 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: 700, 
            fontSize: "clamp(24px, 4vw, 44px)", 
            color: "#fff",
            margin: 0
          }}>
            Get in touch
          </h2>
          <a href="/contact" style={{ 
            backgroundColor: "#fff", 
            color: "#0068ff", 
            padding: "16px 36px", 
            borderRadius: "100px", 
            fontFamily: "'Inter', sans-serif", 
            fontWeight: 700, 
            fontSize: "15px", 
            textDecoration: "none",
            transition: "transform 0.2s ease"
          }}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            Contact us
          </a>
        </div>

        {/* Your Guide to Health Section */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
           <div style={{ 
             display: "inline-flex", 
             alignItems: "center", 
             backgroundColor: "#f1f3f6", 
             borderRadius: "100px", 
             padding: "8px 24px", 
             marginBottom: "24px" 
           }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "#a0a0a0" }}>
                CuraMind Health Solution
              </span>
           </div>
           <h2 style={{ 
             fontFamily: "'Poppins', sans-serif", 
             fontWeight: 700, 
             fontSize: "clamp(34px, 5vw, 64px)", 
             color: "#111", 
             lineHeight: 1.1, 
             letterSpacing: "-0.03em",
             marginBottom: "20px"
           }}>
             Your guide to <span style={{ color: "#0068ff" }}>health</span>
           </h2>
           <p style={{ 
             fontFamily: "'Inter', sans-serif", 
             fontSize: "18px", 
             color: "#595959",
             margin: 0
           }}>
             Explore insightful articles and health tips for everyone.
           </p>
        </div>

        {/* Guides Grid — 3 Columns */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "32px" 
        }}>
          
          {/* Card 1: Nutrition */}
          <GuideCard 
            image={doctorsTeam}
            category="Nutrition Insights"
            title="Understanding nutrition needs"
            desc="Learn how to balance your diet for optimal health and energy."
          />

          {/* Card 2: Wellness */}
          <GuideCard 
            image={doctorFemale}
            category="Wellness Advice"
            title="Tips for staying active"
            desc="Discover fun ways to incorporate exercise into your daily routine."
          />

          {/* Card 3: Stress */}
          <GuideCard 
            image={doctorMale}
            category="Health Tips"
            title="Managing stress effectively"
            desc="Explore techniques to reduce stress and enhance your well-being."
          />
          
        </div>

      </div>
    </section>
  );
};

const GuideCard = ({ image, category, title, desc }) => (
  <div style={{ 
     backgroundColor: "#f1f3f6", 
     borderRadius: "40px", 
     padding: "24px",
     transition: "transform 0.3s ease",
     cursor: "pointer"
  }}
  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
  >
    <div style={{ borderRadius: "24px", overflow: "hidden", marginBottom: "24px", aspectRatio: "1.4 / 1" }}>
       <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    <div style={{ 
      display: "inline-block", 
      backgroundColor: "#fff", 
      borderRadius: "100px", 
      padding: "6px 16px", 
      marginBottom: "16px" 
    }}>
       <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, color: "#111" }}>
          {category}
       </span>
    </div>
    <h3 style={{ 
      fontFamily: "'Poppins', sans-serif", 
      fontWeight: 700, 
      fontSize: "22px", 
      color: "#111", 
      marginBottom: "12px",
      letterSpacing: "-0.01em"
    }}>
      {title}
    </h3>
    <p style={{ 
      fontFamily: "'Inter', sans-serif", 
      fontSize: "15px", 
      lineHeight: "1.6", 
      color: "#595959", 
      marginBottom: "24px" 
    }}>
      {desc}
    </p>
    <a href="/blog" style={{ 
      fontFamily: "'Inter', sans-serif", 
      fontWeight: 700, 
      fontSize: "14px", 
      color: "#0068ff", 
      textDecoration: "none" 
    }}>
      Learn more
    </a>
  </div>
);

export default CallToAction;
