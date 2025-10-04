import React from 'react';
import Head from 'next/head';
import Home from './Home';

const LandingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>KOFTI Marketplace | Agricultural Innovation Platform</title>
        <meta name="description" content="Connect farmers with buyers through our innovative agricultural marketplace platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <Home />
      </main>
    </>
  );
};

export default LandingPage;
