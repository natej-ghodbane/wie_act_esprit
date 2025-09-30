import React, { useState } from 'react';
import { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import '../styles/globals.css';
import AnimatedBackground from '../components/Background';
import Navbar from '../components/Navbar';
import WelcomeScreen from './WelcomeScreen';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const [showWelcome, setShowWelcome] = useState(true);
  const router = useRouter();

  // Hide global chrome (Navbar/background/footer) on app sections that provide their own layout
  const pathname = router.pathname || '';
  const hideGlobalChrome = pathname.startsWith('/buyer') || pathname.startsWith('/vendor');

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
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
  );
}

export default MyApp;