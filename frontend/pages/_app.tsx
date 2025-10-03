import React, { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import '../styles/globals.css';
import { CartProvider } from '@/components/CartProvider';
import AnimatedBackground from '../components/Background';
import Navbar from '../components/Navbar';
import WelcomeScreen from './WelcomeScreen';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Hide global chrome (Navbar/background/footer) on app sections that provide their own layout
  const pathname = router.pathname || '';
  const hideGlobalChrome = pathname.startsWith('/buyer') || pathname.startsWith('/vendor') || pathname.startsWith('/auth');

  useEffect(() => {
    // Only show welcome screen on the home page and if it hasn't been shown before
    const welcomeShown = typeof window !== 'undefined' ? sessionStorage.getItem('welcomeShown') : null;
    const isHomePage = pathname === '/' || pathname === '';
    
    if (!welcomeShown && isHomePage) {
      setShowWelcome(true);
    }
    
    setHasInitialized(true);
  }, [pathname]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('welcomeShown', 'true');
    }
  };

  // Don't render anything until we've determined whether to show welcome screen
  if (!hasInitialized) {
    return null;
  }

  return (
    <CartProvider>
      <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={handleWelcomeComplete} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          {!hideGlobalChrome && <Navbar />}
          {!hideGlobalChrome && <AnimatedBackground />}
          <Component {...pageProps} />
          {!hideGlobalChrome && (
            <footer>
              <center>
                <hr className="my-3 border-neon-magenta/20 opacity-50 sm:mx-auto lg:my-6 text-center" />
                <span className="block text-sm pb-4 text-neutral-glow text-center font-rajdhani">
                  © 2025{" "}
                  <a href="" className="hover:underline neon-text-pink">
                    Agrihope
                  </a>
                  . All Rights Reserved.
                </span>
              </center>
            </footer>
          )}
        </>
      )}
      </>
    </CartProvider>
  );
}

export default MyApp;