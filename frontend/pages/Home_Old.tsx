// pages/Home.tsx - 2025 Modern Redesign
"use client";
import React, { useState, useEffect, useCallback, memo, useRef } from "react"
import { marked } from 'marked';
import Link from "next/link"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  ExternalLink, 
  Mail, 
  Sparkles, 
  LucideIcon,
  Leaf,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Globe,
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  BarChart3,
  Package,
  Truck,
  Award
} from "lucide-react"

// Import components
import Chatbot from '../components/chatbot';
import FeaturedProducts from '../components/FeaturedProducts'

// Component prop types
interface CTAButtonProps {
  href: string;
  text: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary';
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

interface StatItemProps {
  value: string;
  label: string;
  icon: LucideIcon;
  delay: number;
}

// Floating Particles Background
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-emerald-400/30 to-teal-400/30 blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated Gradient Mesh Background
const MeshBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Base gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20" />
    
    {/* Animated blobs */}
    <motion.div
      className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-300/40 to-teal-300/40 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 50, 0],
        y: [0, 30, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-300/40 to-blue-300/40 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.3, 1],
        x: [0, -30, 0],
        y: [0, -50, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-400/30 to-emerald-400/30 dark:from-teal-500/15 dark:to-emerald-500/15 rounded-full blur-2xl"
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    
    {/* Grid overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]" />
  </div>
);

// Hero Badge Component
const StatusBadge = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="inline-block"
  >
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full blur-lg opacity-60 group-hover:opacity-90 transition duration-500"></div>
      <div className="relative px-6 py-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-emerald-200/30 dark:border-emerald-500/30 shadow-xl">
        <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-transparent bg-clip-text text-sm font-semibold flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </motion.div>
          Revolutionizing Agriculture 2025
        </span>
      </div>
    </div>
  </motion.div>
));

// Main Title Component
const MainTitle = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="space-y-4"
  >
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
      <span className="relative inline-block">
        <motion.span
          className="absolute -inset-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 blur-2xl opacity-40"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <span className="relative bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 dark:from-white dark:via-emerald-100 dark:to-teal-100 bg-clip-text text-transparent">
          KOFTI
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
          Marketplace
        </span>
      </span>
    </h1>
  </motion.div>
));

// Modern CTA Button
const CTAButton = memo<CTAButtonProps>(({ href, text, icon: Icon, variant = 'primary' }) => (
  <Link href={href}>
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`group relative overflow-hidden ${
        variant === 'primary' ? 'w-40' : 'w-40'
      }`}
    >
      {variant === 'primary' ? (
        <>
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl opacity-70 blur-md group-hover:opacity-100 transition-all duration-500"></div>
          <div className="relative h-14 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl border border-white/20 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center gap-2 text-base font-semibold text-white z-10">
              {text}
              <Icon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-2xl opacity-50 blur group-hover:opacity-70 transition-all duration-500"></div>
          <div className="relative h-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
            />
            <span className="absolute inset-0 flex items-center justify-center gap-2 text-base font-semibold text-gray-900 dark:text-white z-10">
              {text}
              <Icon className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </span>
          </div>
        </>
      )}
    </motion.button>
  </Link>
));// Constants (Keep as is)
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["Agricultural Innovation Platform", "Connecting Farmers to Markets", "Sustainable Farming Solutions", "Digital Agriculture Marketplace"];

const Home = () => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // REMOVED: isOpen, messages, input, isLoading, sendMessage states and logic

  // Optimize AOS initialization (Keep as is)
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Optimize typing effect (Keep as is)
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200 overflow-hidden relative" id="Home">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-yellow-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
      </div>
      
      {/* Floating petals effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-20 animate-bounce`}
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i * 8)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto px-[5%] sm:px-6 lg:px-[10%] min-h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center">
            {/* Main Content */}
            <div className="w-full max-w-4xl space-y-6 sm:space-y-8"
              data-aos="fade-up"
              data-aos-delay="200">
              <div className="space-y-4 sm:space-y-6">
                <StatusBadge />
                <MainTitle />

                {/* Typing Effect */}
                <div className="h-8 flex items-center justify-center" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-xl md:text-2xl bg-gradient-to-r from-pink-700 to-rose-600 bg-clip-text text-transparent font-light">
                    {text}
                  </span>
                  <span className="w-[3px] h-6 bg-gradient-to-t from-pink-500 to-rose-500 ml-1 animate-pulse"></span>
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-pink-800/80 max-w-2xl mx-auto leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  Transforming agriculture through innovative digital solutions that connect farmers directly with buyers, 
                  ensuring fair prices, sustainable practices, and efficient supply chain management.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center" data-aos="fade-up" data-aos-delay="1200">
                  <CTAButton href="/auth/login" text="Sign In" icon={ExternalLink} />
                  <CTAButton href="/auth/signup" text="Sign Up" icon={Mail} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 px-[5%] sm:px-6 lg:px-[10%]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose 
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"> KOFTI</span>
              ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Empowering farmers and buyers through cutting-edge technology and sustainable agricultural practices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-pink-200/20 hover:bg-white/20 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 p-3 mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <span className="text-pink-500 font-bold text-xl">🌾</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Direct Farm-to-Market</h3>
              <p className="text-gray-600">Connect farmers directly with buyers, eliminating middlemen and ensuring fair pricing for quality agricultural products.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-pink-200/20 hover:bg-white/20 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="400">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 p-3 mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <span className="text-pink-500 font-bold text-xl">📊</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">Advanced analytics and market insights to help farmers make informed decisions and optimize their crop production.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-pink-200/20 hover:bg-white/20 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="600">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 p-3 mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <span className="text-pink-500 font-bold text-xl">🌱</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sustainable Practices</h3>
              <p className="text-gray-600">Promoting eco-friendly farming methods and sustainable supply chain solutions for a greener future.</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8" data-aos="fade-up" data-aos-delay="800">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">200%</div>
              <div className="text-gray-600 font-medium">Growth Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">95%</div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>

      {/* RENDER THE NEW CHATBOT COMPONENT HERE */}
      <Chatbot /> 

      <FeaturedProducts />

    </div>
    
  );
};

export default memo(Home);