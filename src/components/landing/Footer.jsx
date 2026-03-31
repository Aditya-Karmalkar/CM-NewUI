import React from "react";
import { Link } from "react-router-dom";
import CuraMind_logo from "../../assets/Curamind_logo.jpg";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <section style={{ backgroundColor: "#fff", padding: "40px 0 80px" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "0 6%" }}>
        
        {/* Rounded Footer Card — Exactly as per screenshot */}
        <div style={{ 
          backgroundColor: "#0b0b0b", 
          borderRadius: "48px", 
          padding: "80px 80px 40px", 
          position: "relative",
          overflow: "hidden",
          color: "#fff"
        }}>
          
          {/* Main Content Grid */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start", 
            flexWrap: "wrap", 
            gap: "60px",
            marginBottom: "80px"
          }}>
            
            {/* L: Brand Block */}
            <div style={{ flex: "0 0 280px" }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "24px" }}>
                <div style={{ backgroundColor: "#0068ff", overflow: "hidden", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <img src={CuraMind_logo} alt="CuraMind Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "19px", color: "#fff", letterSpacing: "-0.01em" }}>
                  CuraMind
                </span>
              </Link>
              <p style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontSize: "15px", 
                lineHeight: "1.6", 
                color: "#6c6c6c",
                margin: 0
              }}>
                Dedicated to your health, every day
              </p>
            </div>

            {/* R: Links Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "100px" }}>
              
              {/* Quick links */}
              <div>
                <h5 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px", color: "#fff", marginBottom: "28px" }}>
                  Quicks links
                </h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <FooterNavLink to="/">Home</FooterNavLink>
                  <FooterNavLink to="#about">About Us</FooterNavLink>
                  <FooterNavLink to="#services">Our Services</FooterNavLink>
                  <FooterNavLink to="#contact">Contact Us</FooterNavLink>
                </div>
              </div>

              {/* Resources */}
              <div>
                <h5 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px", color: "#fff", marginBottom: "28px" }}>
                  Resources
                </h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <FooterNavLink to="/blog">Blog</FooterNavLink>
                  <FooterNavLink to="/doctors">Doctors</FooterNavLink>
                  <FooterNavLink to="/location">Location</FooterNavLink>
                </div>
              </div>

              {/* Follow us */}
              <div>
                <h5 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px", color: "#fff", marginBottom: "28px" }}>
                  Follow us
                </h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <FooterNavLink to="https://x.com">X</FooterNavLink>
                  <FooterNavLink to="https://linkedin.com">LinkedIn</FooterNavLink>
                  <FooterNavLink to="https://instagram.com">Instagram</FooterNavLink>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Copyright Pill Section */}
          <div style={{ 
            backgroundColor: "rgba(255,255,255,0.03)", 
            borderRadius: "32px", 
            padding: "24px 40px", 
            display: "flex", 
            alignItems: "center"
          }}>
            <p style={{ 
              fontFamily: "'Inter', sans-serif", 
              fontSize: "13px", 
              color: "#6c6c6c", 
              margin: 0 
            }}>
              © {year} CuraMind Health Solution. All rights reserved.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

const FooterNavLink = ({ to, children }) => (
  <Link 
    to={to} 
    style={{ 
      fontFamily: "'Inter', sans-serif", 
      fontSize: "14px", 
      color: "#6c6c6c", 
      textDecoration: "none", 
      transition: "color 0.2s" 
    }} 
    onMouseEnter={e => e.target.style.color = "#fff"} 
    onMouseLeave={e => e.target.style.color = "#6c6c6c"}
  >
    {children}
  </Link>
);

export default Footer;
