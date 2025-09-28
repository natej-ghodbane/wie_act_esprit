import React, { useState } from 'react';
import { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import '../styles/globals.css';
import AnimatedBackground from '../components/Background';
import Navbar from '../components/Navbar';
import WelcomeScreen from './WelcomeScreen';

function MyApp({ Component, pageProps }: AppProps) {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
          <AnimatedBackground />
          <Component {...pageProps} />
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
        </>
      )}
    </>
  );
}

export default MyApp;