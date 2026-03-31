import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import UniqueLoading from '../ui/morph-loading';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(6px)',
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

const PageTransitionWrapper = ({ children, location }) => {
  const [showTransition, setShowTransition] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowTransition(true);
    setShowContent(false);

    const timer = setTimeout(() => {
      setShowTransition(false);
      setShowContent(true);
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`relative min-h-screen overflow-hidden transition-colors duration-500`}
      >
        {showTransition && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white pointer-events-none">
            <UniqueLoading size="lg" />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-blue-600 font-semibold tracking-widest text-lg font-['Poppins']"
            >
              CURAMIND
            </motion.p>
          </div>
        )}

        {showContent && (
          <div className="relative z-10">
            {children}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionWrapper;
