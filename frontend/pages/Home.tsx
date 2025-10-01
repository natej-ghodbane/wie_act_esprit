// pages/Home.tsx - Ultra-Modern 2025 Redesign
"use client";
import React, { useState, useEffect, useCallback, memo, useRef } from "react"
import { marked } from 'marked';
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
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
          className="absolute rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 blur-sm"
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
    <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20" />
    
    {/* Animated blobs */}
    <motion.div
      className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-300/40 to-pink-300/40 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl"
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
      className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-fuchsia-300/40 to-rose-300/40 dark:from-fuchsia-500/20 dark:to-rose-500/20 rounded-full blur-3xl"
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
      className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-br from-pink-400/30 to-purple-400/30 dark:from-pink-500/15 dark:to-purple-500/15 rounded-full blur-2xl"
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
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 rounded-full blur-lg opacity-60 group-hover:opacity-90 transition duration-500"></div>
      <div className="relative px-6 py-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-purple-200/30 dark:border-purple-500/30 shadow-xl">
        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 text-transparent bg-clip-text text-sm font-semibold flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
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
          className="absolute -inset-3 bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 blur-2xl opacity-40"
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
        <span className="relative bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
          AGRI-HOPE
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 dark:from-purple-400 dark:via-pink-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
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
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 rounded-2xl opacity-70 blur-md group-hover:opacity-100 transition-all duration-500"></div>
          <div className="relative h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl border border-white/20 overflow-hidden">
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
              className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
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
));

// Feature Card Component
const FeatureCard = memo<FeatureCardProps>(({ icon: Icon, title, description, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
      <div className="relative h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500">
        <div className="relative mb-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 shadow-lg"
          >
            <Icon className="w-full h-full text-white" />
          </motion.div>
          <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition duration-500"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
});

// Stat Item Component
const StatItem = memo<StatItemProps>(({ value, label, icon: Icon, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, delay }}
      className="text-center group cursor-pointer"
    >
      <div className="relative inline-block mb-4">
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-12 h-12 mx-auto mb-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-md opacity-50 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </motion.div>
      </div>
      <motion.div
        className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 dark:from-purple-400 dark:via-pink-400 dark:to-fuchsia-400 bg-clip-text text-transparent mb-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: delay + 0.2 }}
      >
        {value}
      </motion.div>
      <div className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-300">
        {label}
      </div>
    </motion.div>
  );
});

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["Agricultural Innovation Platform", "Connecting Farmers to Markets", "Sustainable Farming Solutions", "Digital Agriculture Marketplace"];

const Home = () => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Check dark mode preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  // Typing effect
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
    <div className="min-h-screen overflow-hidden relative bg-white dark:bg-gray-950" id="Home">
      {/* Animated Background */}
      <MeshBackground />
      <FloatingParticles />
      
      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center space-y-8 py-20">
            {/* Badge */}
            <StatusBadge />
            
            {/* Main Title */}
            <MainTitle />
            
            {/* Typing Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-12 flex items-center justify-center"
            >
              <span className="text-2xl md:text-3xl bg-gradient-to-r from-purple-700 via-pink-700 to-fuchsia-700 dark:from-purple-400 dark:via-pink-400 dark:to-fuchsia-400 bg-clip-text text-transparent font-medium">
                {text}
              </span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-0.5 h-8 bg-gradient-to-b from-purple-600 to-pink-600 ml-1"
              />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-4"
            >
              Transforming agriculture through innovative digital solutions that connect farmers directly with buyers,
              ensuring fair prices, sustainable practices, and efficient supply chain management.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <CTAButton href="/auth/login" text="Sign In" icon={ExternalLink} variant="primary" />
              <CTAButton href="/auth/signup" text="Sign Up" icon={Mail} variant="secondary" />
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="pt-16"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-600"
              >
                <span className="text-sm font-medium">Scroll to explore</span>
                <ArrowRight className="w-5 h-5 rotate-90" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-4"
            >
              <div className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                  Why Choose Us
                </span>
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6"
            >
              Why Choose{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 dark:from-purple-400 dark:via-pink-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                AGRI-HOPE
              </span>
              ?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            >
              Empowering farmers and buyers through cutting-edge technology and sustainable agricultural practices
            </motion.p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <FeatureCard
              icon={Leaf}
              title="Direct Farm-to-Market"
              description="Connect farmers directly with buyers, eliminating middlemen and ensuring fair pricing for quality agricultural products."
              delay={0.1}
            />
            <FeatureCard
              icon={BarChart3}
              title="Real-time Analytics"
              description="Advanced analytics and market insights to help farmers make informed decisions and optimize their crop production."
              delay={0.2}
            />
            <FeatureCard
              icon={Globe}
              title="Sustainable Practices"
              description="Promoting eco-friendly farming methods and sustainable supply chain solutions for a greener future."
              delay={0.3}
            />
          </div>

          {/* Stats Section */}
          <div className="mt-32">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              <StatItem value="10K+" label="Active Farmers" icon={Users} delay={0.1} />
              <StatItem value="50K+" label="Products Listed" icon={Package} delay={0.2} />
              <StatItem value="200%" label="Growth Rate" icon={TrendingUp} delay={0.3} />
              <StatItem value="95%" label="Satisfaction Rate" icon={Award} delay={0.4} />
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />

      {/* Featured Products */}
      <FeaturedProducts />
    </div>
  );
};

export default memo(Home);
