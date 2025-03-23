'use client';

import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import components that use the Frame SDK
const FramesProvider = dynamic(() => import('../components/providers/FramesProvider'), {
  ssr: false,
});

const Frame = dynamic(() => import('../components/Frame'), {
  ssr: false,
});

export default function FramePage() {
  return (
    <>
      <Head>
        <title>winEth | Farcaster Frame</title>
        <meta content="Contribute to a good cause while saving and winning with PoolTogether" name="description" />
        <link href="/images/favicon.ico" rel="icon" />
        
        {/* Frame metadata */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://wineth.org/images/embed.png" />
        <meta property="fc:frame:button:1" content="Visit winEth" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta property="fc:frame:post_url" content="https://wineth.org/frame" />
      </Head>
      
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
        <FramesProvider>
          <Frame />
        </FramesProvider>
      </main>
    </>
  );
} 