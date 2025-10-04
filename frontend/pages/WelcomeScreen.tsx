import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Leaf, Sun, Moon, Zap, Heart, 
  ArrowRight, CheckCircle, Loader2, Star
} from 'lucide-react';
import Head from 'next/head';

// Component prop types
interface TypewriterEffectProps {
  text: string;
  delay?: number;
  speed?: number;
}

interface WelcomeScreenProps {
  onLoadingComplete?: () => void;
}

interface FloatingElementProps {
  delay: number;
  duration: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ 
  text, 
  delay = 0, 
  speed = 100 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    const startTimer = setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(timer);
          setShowCursor(false);
        }
      }, speed);
      
      return () => clearInterval(timer);
    }, delay);
    
    return () => clearTimeout(startTimer);
  }, [text, delay, speed]);

  return (
    <span className="inline-block">
      {displayText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="ml-1"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

const FloatingElement: React.FC<FloatingElementProps> = ({ 
  delay, 
  duration, 
  x, 
  y, 
  size, 
  color 
}) => (
  <motion.div
    className={`absolute rounded-full ${color} blur-xl`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}%`,
      top: `${y}%`,
    }}
    animate={{
      x: [0, 50, -30, 0],
      y: [0, -50, 30, 0],
      scale: [1, 1.2, 0.8, 1],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const ParticleField = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLoadingComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Phase progression
    const phases = [
      { duration: 1000, progress: 25 },
      { duration: 1500, progress: 50 },
      { duration: 1000, progress: 75 },
      { duration: 500, progress: 100 },
    ];

    let totalDuration = 0;
    phases.forEach((phase, index) => {
      setTimeout(() => {
        setCurrentPhase(index + 1);
        setLoadingProgress(phase.progress);
      }, totalDuration);
      totalDuration += phase.duration;
    });

    // Complete loading
    const completeTimer = setTimeout(() => {
      setTimeout(() => {
        onLoadingComplete?.();
      }, 800);
    }, totalDuration);

    return () => clearTimeout(completeTimer);
  }, [onLoadingComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(20px)",
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      }
    }
  };

  const logoVariants = {
    initial: { 
      scale: 0, 
      rotate: -360, 
      opacity: 0,
      filter: "blur(10px)"
    },
    animate: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 1.5,
      }
    }
  };

  const phaseMessages = [
    "Initializing KOFTI...",
    "Connecting to agricultural networks...",
    "Loading marketplace data...",
    "Welcome to the future of farming!"
  ];

  const phaseIcons = [Loader2, Zap, Leaf, CheckCircle];

  return (
    <>
      <Head>
        <title>KOFTI - Agricultural Innovation</title>
        <meta name="description" content="Connecting farmers to global markets through innovative technology" />
      </Head>

      <AnimatePresence>
        {currentPhase < 4 && (
          <motion.div
            variants={containerVariants}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit="exit"
            className={`fixed inset-0 z-50 transition-colors duration-1000 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900' 
                : 'bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50'
            }`}
          >
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <FloatingElement
                delay={0}
                duration={8}
                x={10}
                y={20}
                size={150}
                color="bg-gradient-to-r from-purple-300/20 to-pink-300/20"
              />
              <FloatingElement
                delay={1}
                duration={10}
                x={80}
                y={70}
                size={200}
                color="bg-gradient-to-r from-pink-300/20 to-fuchsia-300/20"
              />
              <FloatingElement
                delay={2}
                duration={12}
                x={50}
                y={10}
                size={100}
                color="bg-gradient-to-r from-fuchsia-300/20 to-purple-300/20"
              />
              
              {/* Mesh Gradient Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />
              
              {/* Particle Field */}
              <ParticleField />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
              {/* Logo Section */}
              <motion.div
                variants={logoVariants}
                initial="initial"
                animate="animate"
                className="text-center mb-16"
              >
                {/* Logo Container */}
                <div className="relative mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 rounded-full blur-2xl opacity-30"
                    style={{ width: '120px', height: '120px', margin: '10px' }}
                  />
                  
                  <div className="relative w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-16 h-16 text-white" />
                    
                    {/* Orbiting Elements */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <Leaf className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Sun className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                        <Heart className="w-4 h-4 text-pink-400" />
                      </div>
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                        <Star className="w-4 h-4 text-fuchsia-400" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={`text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent ${
                    isDarkMode ? 'dark:from-purple-400 dark:via-pink-400 dark:to-fuchsia-400' : ''
                  }`}
                >
                  KOFTI
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className={`text-xl md:text-2xl font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <TypewriterEffect 
                    text="Connecting Farmers to Global Markets" 
                    delay={1200}
                    speed={80}
                  />
                </motion.p>
              </motion.div>

              {/* Loading Section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="text-center max-w-md w-full"
              >
                {/* Phase Icon and Message */}
                <div className="mb-8">
                  <motion.div
                    key={currentPhase}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center mb-4"
                  >
                    {React.createElement(phaseIcons[currentPhase] || Loader2, {
                      className: `w-8 h-8 ${
                        phaseIcons[currentPhase] === CheckCircle 
                          ? 'text-emerald-500' 
                          : 'text-teal-500 animate-spin'
                      }`,
                    })}
                  </motion.div>
                  
                  <motion.p
                    key={`message-${currentPhase}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`text-lg font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {phaseMessages[currentPhase] || phaseMessages[0]}
                  </motion.p>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  
                  {/* Progress Percentage */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`text-sm font-medium mt-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {loadingProgress}%
                  </motion.div>
                </div>

                {/* Loading Dots */}
                <div className="flex justify-center space-x-2 mt-6">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Skip Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                onClick={onLoadingComplete}
                className={`absolute bottom-8 right-8 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                    : 'bg-black/10 text-gray-700 border border-black/20 hover:bg-black/20'
                } backdrop-blur-sm`}
              >
                <div className="flex items-center space-x-2">
                  <span>Skip</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WelcomeScreen;