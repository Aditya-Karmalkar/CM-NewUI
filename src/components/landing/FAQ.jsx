import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { question: "Is my health data secure with CuraMind?", answer: "Yes, we take your privacy seriously. CuraMind uses end-to-end encryption to protect your health information. Your data is never sold to third parties and is only used to provide you with personalized health insights." },
  { question: "Can CuraMind replace my doctor?", answer: "No, CuraMind is designed to complement your healthcare providers, not replace them. AI provides evidence-based information, but it should not substitute professional medical advice." },
  { question: "How does medication tracking work?", answer: "CuraMind allows you to input your medications including name, dosage, and frequency. The app sends you timely reminders and tracks your adherence automatically." },
  { question: "What health metrics can I track?", answer: "You can track a wide range of metrics including blood pressure, heart rate, weight, and sleep. We visualize trends over time to help you monitor your well-being." },
  { question: "Is there a cost to use CuraMind?", answer: "CuraMind offers both free and premium subscription options. Premium subscribers get advanced features like in-depth health insights and unlimited metric tracking." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" style={{ backgroundColor: "#fff", padding: "120px 0" }}>
      <div style={{ maxWidth: "1150px", margin: "0 auto", padding: "0 6%" }}>
        
        {/* Modern FAQ Header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
           <div style={{ 
             display: "inline-flex", 
             alignItems: "center", 
             backgroundColor: "#f1f3f6", 
             borderRadius: "100px", 
             padding: "8px 24px", 
             marginBottom: "24px" 
           }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "#0068ff" }}>
                CuraMind Support center
              </span>
           </div>
           <h2 style={{ 
             fontFamily: "'Poppins', sans-serif", 
             fontWeight: 700, 
             fontSize: "clamp(34px, 5vw, 54px)", 
             color: "#111", 
             lineHeight: 1.1, 
             letterSpacing: "-0.03em" 
           }}>
             Common <span style={{ color: "#0068ff" }}>questions</span>
           </h2>
        </div>

        {/* High-Fidelity Accordion List */}
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              style={{ 
                backgroundColor: "#f1f3f6", 
                borderRadius: "32px", 
                overflow: "hidden",
                transition: "all 0.3s ease",
                border: openIndex === i ? "1.5px solid #0068ff" : "1.5px solid transparent"
              }}
            >
              <button
                onClick={() => toggle(i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "32px 40px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span style={{ 
                  fontFamily: "'Poppins', sans-serif", 
                  fontWeight: 600, 
                  fontSize: "18px", 
                  color: "#111" 
                }}>
                  {faq.question}
                </span>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: openIndex === i ? "#0068ff" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease"
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={openIndex === i ? "#fff" : "#111"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div style={{ padding: "0 40px 32px", fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: "1.7", color: "#595959" }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
