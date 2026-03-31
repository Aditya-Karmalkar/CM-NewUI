import React from "react";
import { Link } from "react-router-dom";
import specialistImage from "../../assets/doctor_female_portrait.png";

const Benefits = () => {
  return (
    <section id="benefits" style={{ backgroundColor: "#fff", padding: "100px 0" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "0 6%" }}>
        
        {/* Horizontal High-Fidelity Card - Fixed Wrap Issue */}
        <div style={{ 
          backgroundColor: "#f1f3f6", 
          borderRadius: "56px", 
          padding: "60px", 
          display: "flex", 
          flexDirection: "row", // Force horizontal layout
          alignItems: "center", 
          gap: "80px",
          width: "100%",
          boxSizing: "border-box"
        }} className="benefits-card">
          
          {/* L: Image - Fixed width to prevent push */}
          <div style={{ 
            flex: "0 0 340px", 
            borderRadius: "48px", 
            overflow: "hidden", 
            aspectRatio: "1 / 1.15",
            backgroundColor: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
          }}>
            <img src={specialistImage} alt="Specialist" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          {/* R: Content Area */}
          <div style={{ flex: "1 1 auto" }}>
            
            {/* Pill Tag */}
            <div style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              backgroundColor: "#fff", 
              borderRadius: "100px", 
              padding: "10px 24px", 
              marginBottom: "24px"
            }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "#0068ff" }}>
                CuraMind Health Solution
              </span>
            </div>

            {/* Main Title */}
            <h2 style={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 700, 
              fontSize: "clamp(32px, 4vw, 54px)", // Reduced slightly to avoid wrap
              color: "#111", 
              lineHeight: 1.1, 
              letterSpacing: "-0.04em", 
              marginBottom: "20px" 
            }}>
              Select your specialist,<br />
              book <span style={{ color: "#0068ff" }}>instantly</span>
            </h2>

            {/* Description */}
            <p style={{ 
              fontFamily: "'Inter', sans-serif", 
              fontSize: "16px", 
              lineHeight: "1.6", 
              color: "#595959", 
              marginBottom: "40px", 
              maxWidth: "520px" 
            }}>
              Easily search for specialists based on your needs. Our user-friendly platform allows you to book appointments in just a few clicks.
            </p>

            {/* Features Row - Explicitly Row */}
            <div style={{ display: "flex", flexDirection: "row", gap: "40px", marginBottom: "40px" }}>
              
              {/* Feature 1 */}
              <div style={{ flex: "1" }}>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%", 
                  backgroundColor: "#0068ff", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  marginBottom: "16px"
                }}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                     <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                   </svg>
                </div>
                <h4 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "18px", color: "#111", marginBottom: "8px" }}>Search filters</h4>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#595959", lineHeight: 1.5 }}>
                   Choose your specialty.
                </p>
              </div>

              {/* Feature 2 */}
              <div style={{ flex: "1" }}>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%", 
                  backgroundColor: "#0068ff", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  marginBottom: "16px"
                }}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                     <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                   </svg>
                </div>
                <h4 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "18px", color: "#111", marginBottom: "8px" }}>Results display</h4>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#595959", lineHeight: 1.5 }}>
                   View detailed profiles.
                </p>
              </div>

            </div>

            {/* CTA */}
            <Link to="/signup" style={{ 
              display: "inline-block", 
              backgroundColor: "#0068ff", 
              color: "#fff", 
              padding: "16px 36px", 
              borderRadius: "100px", 
              fontFamily: "'Inter', sans-serif", 
              fontWeight: 700, 
              fontSize: "15px", 
              textDecoration: "none", 
              boxShadow: "0 8px 24px rgba(0,104,255,0.2)"
            }}>
              Learn more
            </Link>

          </div>
        </div>

      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .benefits-card {
            flex-direction: column !important;
            padding: 40px !important;
            text-align: center;
            align-items: center !important;
            gap: 40px !important;
          }
          .benefits-card > div {
            flex: 0 0 auto !important;
            width: 100% !important;
            max-width: 400px;
          }
        }
      `}</style>
    </section>
  );
};

export default Benefits;
