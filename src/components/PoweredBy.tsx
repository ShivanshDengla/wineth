import React from "react";
import { size } from "viem";

const PoweredBy: React.FC = () => {
  const socialLinks = [
    { name: "Docs", url: "https://docs.wineth.org/", icon: "/images/docs.png", size: "8" },
    { name: "Twitter", url: "https://twitter.com/PoolTogether_", icon: "/images/twitter.png", size: "8" },
    { name: "Discord", url: "https://pooltogether.com/discord", icon: "/images/discord.png" },
    { name: "Farcaster", url: "https://warpcast.com/~/channel/pool-together", icon: "/images/farcaster.png" },
  ];

  const poweredBy = [
    { name: "PoolTogether", image: "/images/pooltogether.png", size: "32" },
    { name: "AAVE", image: "/images/aave.svg", size: "32" },
    { name: "Optimism", image: "/images/optimism.svg", size: "32" },
  ];

  return (
    <div className="flex-grow flex flex-col justify-end w-full px-0 py-0 mb-12 md:fixed md:bottom-0 md:left-0 md:right-0 md:px-8 md:mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Powered By (Sponsors) */}
        <div className="flex space-x-6 md:space-x-8 mb-4 md:mb-2">
          {poweredBy.map((sponsor, index) => (
            <img
              key={index}
              src={sponsor.image}
              alt={sponsor.name}
              className="w-12 h-12 md:w-16 md:h-16"
            />
          ))}
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 md:space-x-6 mb-4 md:mb-0">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <img 
                src={link.icon} 
                alt={link.name} 
                className={`w-6 h-6 md:w-${link.size || '8'} md:h-${link.size || '8'}`}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoweredBy;
