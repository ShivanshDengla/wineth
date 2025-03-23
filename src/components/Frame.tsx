'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';
import Image from 'next/image';

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("Frame SDK loading...");
        // Call ready to signal the frame is ready to display
        sdk.actions.ready();
        console.log("Frame SDK ready called");
        setIsSDKLoaded(true);
      } catch (error) {
        console.error("Error loading Frame SDK:", error);
      }
    };

    load();
  }, []);

  return (
    <div className="w-[300px] mx-auto py-4 px-2 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">winEth Frame</h1>
      
      <div className="flex justify-center mb-4">
        <Image
          src="/images/wineth.png"
          height={100}
          width={100}
          alt="WinEth Logo"
          className="h-auto"
        />
      </div>
      
      <p className="text-center mb-4">
        Contribute to a good cause while saving and winning with PoolTogether
      </p>
      
      <div className="flex justify-center">
        <button 
          onClick={() => sdk.actions.openUrl('https://wineth.org')}
          className="px-4 py-2 bg-[#2A2A5B] text-white rounded-lg hover:bg-opacity-90"
        >
          Visit winEth
        </button>
      </div>
    </div>
  );
} 