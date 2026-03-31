import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import patientsAvatar from "../../assets/avatar_satisfied_patients.png";

const Testimonials = () => {
  const containerRef = useRef(null);

  // Track scroll progress through the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth out the scroll progress for a premium feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Giant Heading Animations: Moves vertically slower than the cards (parallax)
  const textY = useTransform(smoothProgress, [0, 1], [-200, 200]);
  const textScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.1, 0.8]);
  const textOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.1, 1, 1, 0.1]);

  // Card Parallax Movements — Each moving at a unique speed and direction
  const card1Y = useTransform(smoothProgress, [0, 1], [300, -400]);
  const card1X = useTransform(smoothProgress, [0, 1], [-20, 20]);

  const card2Y = useTransform(smoothProgress, [0, 1], [500, -300]);
  const card2X = useTransform(smoothProgress, [0, 1], [30, -30]);

  const card3Y = useTransform(smoothProgress, [0, 1], [400, -500]);
  const card3X = useTransform(smoothProgress, [0, 1], [-40, 40]);

  const card4Y = useTransform(smoothProgress, [0, 1], [600, -200]);
  const card4X = useTransform(smoothProgress, [0, 1], [50, -50]);

  const testimonials = [
    {
      quote: "I really appreciated how attentive and caring the doctors were. They made me feel safe and valued.",
      name: "Valentina",
    },
    {
      quote: "The care I received was exceptional, and the staff made me feel at ease throughout treatment.",
      name: "Laura",
    },
    {
      quote: "CuraMind has completely changed how I manage my family's health. The insights are life-changing.",
      name: "Caroline",
    },
    {
      quote: "The level of professionalism and compassion was outstanding. They prioritize patient well-being.",
      name: "Isabella",
    }
  ];

  return (
    <section
      ref={containerRef}
      id="testimonials"
      style={{
        backgroundColor: "#fff",
        padding: "150px 0",
        overflow: "hidden",
        position: "relative",
        minHeight: "150vh" // High enough for sustained scroll effect
      }}
    >
      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "0 6%", position: "relative", height: "1000px" }}>

        {/* Giant Background Heading with Vertical Parallax — Shifted Further Left */}
        <motion.div
          style={{
            position: "absolute",
            top: "40%",
            left: "-20%", // Shifted further left
            zIndex: 1,
            opacity: textOpacity,
            y: textY,
            scale: textScale,
            pointerEvents: "none"
          }}
        >
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(120px, 24vw, 300px)",
            color: "#000",
            lineHeight: 0.8,
            letterSpacing: "-0.05em",
            margin: "0",
            textTransform: "capitalize",
            whiteSpace: "nowrap"
          }}>
            Testimonials
          </h2>
        </motion.div>

        {/* Parallax Testimonial Cards Overlay */}
        <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100%" }}>

          {/* Card 1: Valentina (Top Central Area) */}
          <motion.div
            style={{
              position: "absolute",
              top: "10%",
              left: "35%",
              y: card1Y,
              x: card1X,
              backgroundColor: "#edeef1",
              borderRadius: "44px",
              padding: "44px",
              width: "380px",
              textAlign: "center",
              boxShadow: "0 30px 60px rgba(0,0,0,0.08)"
            }}
          >
            <div style={{ width: "68px", height: "68px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 24px" }}>
              <img src={patientsAvatar} alt="Patient" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "17px", lineHeight: "1.6", color: "#111", marginBottom: "20px", fontWeight: 500 }}>
              "{testimonials[0].quote}"
            </p>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#595959", fontWeight: 700 }}>
              {testimonials[0].name}
            </span>
          </motion.div>

          {/* Card 2: Laura (Mid Left) */}
          <motion.div
            style={{
              position: "absolute",
              top: "35%",
              left: "0%",
              y: card2Y,
              x: card2X,
              backgroundColor: "#edeef1",
              borderRadius: "40px",
              padding: "36px",
              width: "320px",
              textAlign: "center",
              boxShadow: "0 25px 50px rgba(0,0,0,0.06)"
            }}
          >
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 20px" }}>
              <img src={patientsAvatar} alt="Patient" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: "1.6", color: "#111", marginBottom: "16px" }}>
              "{testimonials[1].quote}"
            </p>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#595959", fontWeight: 700 }}>
              {testimonials[1].name}
            </span>
          </motion.div>

          {/* Card 3: Caroline (Mid Right) */}
          <motion.div
            style={{
              position: "absolute",
              top: "40%",
              right: "0%",
              y: card3Y,
              x: card3X,
              backgroundColor: "#edeef1",
              borderRadius: "40px",
              padding: "36px",
              width: "320px",
              textAlign: "center",
              boxShadow: "0 25px 50px rgba(0,0,0,0.06)"
            }}
          >
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 20px" }}>
              <img src={patientsAvatar} alt="Patient" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: "1.6", color: "#111", marginBottom: "16px" }}>
              "{testimonials[2].quote}"
            </p>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#595959", fontWeight: 700 }}>
              {testimonials[2].name}
            </span>
          </motion.div>

          {/* Card 4: Isabella (Bottom Area) */}
          <motion.div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "25%",
              y: card4Y,
              x: card4X,
              backgroundColor: "#edeef1",
              borderRadius: "40px",
              padding: "40px",
              width: "350px",
              textAlign: "center",
              boxShadow: "0 30px 60px rgba(0,0,0,0.08)"
            }}
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 24px" }}>
              <img src={patientsAvatar} alt="Patient" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: "1.6", color: "#111", marginBottom: "20px", fontWeight: 500 }}>
              "{testimonials[3].quote}"
            </p>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#595959", fontWeight: 700 }}>
              {testimonials[3].name}
            </span>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
