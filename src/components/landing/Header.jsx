import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { motion, useScroll, useSpring } from "framer-motion";
import CuraMind_logo from "../../assets/Curamind_logo.jpg";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      // Small delay to ensure state is clean
      setCurrentUser(u && u.uid ? u : null);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/#services" },
    { name: "About Us", path: "/#about" },
    { name: "FAQ", path: "/#faq" },
  ];

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 w-full z-50 flex justify-center"
      style={{ paddingTop: isScrolled ? "12px" : "20px", transition: "padding 0.3s ease" }}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        style={{
          scaleX,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "#0068ff",
          transformOrigin: "0%",
          zIndex: 60
        }}
      />
      {/* Floating pill nav — Healis style */}
      <div
        className="w-full mx-4 md:mx-auto"
        style={{ maxWidth: "1100px" }}
      >
        <nav
          style={{
            backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.8)" : "#fff",
            backdropFilter: isScrolled ? "blur(12px)" : "none",
            borderRadius: "48px",
            padding: "10px 10px 10px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: isScrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "0 2px 12px rgba(0,0,0,0.06)",
            transition: "all 0.3s ease",
            border: isScrolled ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5" aria-label="Curamind homepage">
            <div style={{ backgroundColor: "#0068ff", overflow: "hidden", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <img src={CuraMind_logo} alt="CuraMind Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "18px", color: "#111", letterSpacing: "-0.02em" }}>
              CuraMind
            </span>
          </Link>

          {/* Desktop nav links — Centered like image */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#595959",
                  textDecoration: "none",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={e => e.target.style.color = "#111"}
                onMouseLeave={e => e.target.style.color = "#595959"}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA buttons — Sign in & Get started */}
          <div className="hidden md:flex items-center gap-8">
            {currentUser ? (
              <Link
                to="/health-dashboard"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#fff",
                  backgroundColor: "#0068ff",
                  borderRadius: "48px",
                  padding: "12px 28px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(0,104,255,0.25)"
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = "#0056d6";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = "#0068ff";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signin"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#595959",
                    textDecoration: "none",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.color = "#111"}
                  onMouseLeave={e => e.target.style.color = "#595959"}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#fff",
                    backgroundColor: "#0068ff",
                    borderRadius: "48px",
                    padding: "12px 28px",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(0,104,255,0.25)"
                  }}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = "#0056d6";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = "#0068ff";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{ color: "#111" }}
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ backgroundColor: "#fff", borderRadius: "24px", marginTop: "8px", padding: "16px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "block", fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "15px", color: "#111", padding: "10px 0", borderBottom: "1px solid #edeef1", textDecoration: "none" }}
              >
                {link.name}
              </a>
            ))}
            {!currentUser && (
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "block", textAlign: "center", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "14px", color: "#595959", padding: "12px", textDecoration: "none" }}
              >
                Sign in
              </Link>
            )}
            <Link
              to={currentUser ? "/health-dashboard" : "/signup"}
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: "block", marginTop: "8px", textAlign: "center", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "14px", color: "#fff", backgroundColor: "#0068ff", borderRadius: "48px", padding: "12px", textDecoration: "none" }}
            >
              {currentUser ? "Dashboard" : "Get Started"}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
