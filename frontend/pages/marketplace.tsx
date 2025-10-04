import React from 'react'
import Head from 'next/head'
import { MarketplacePage } from '@/components/marketplace/MarketplacePage'

const Marketplace: React.FC = () => {
  return (
    <>
      <Head>
        <title>Marketplace | KOFTI</title>
        <meta name="description" content="Browse fresh, local farm products." />
      </Head>
      <main>
        <MarketplacePage />
      </main>
    </>
  )
}

export default Marketplace 