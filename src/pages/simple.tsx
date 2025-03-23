import Head from 'next/head';

export default function SimplePage() {
  return (
    <>
      <Head>
        <title>Simple Frame Test</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://winwin-git-frames-shivansh-denglas-projects.vercel.app/images/embed.png" />
        <meta property="fc:frame:button:1" content="Visit winEth" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="https://wineth.org" />
      </Head>
      <div>
        <h1>Simple Frame Test</h1>
        <p>This is a simple test page for Farcaster Frames.</p>
      </div>
    </>
  );
} 