import React from "react";

const PoweredBy: React.FC = () => {
  const socialLinks = [
    { name: "Twitter", url: "https://twitter.com/PoolTogether_", icon: "/images/twitter.png" },
    { name: "Discord", url: "https://pooltogether.com/discord", icon: "/images/discord.png" },
    { name: "Farcaster", url: "https://warpcast.com/~/channel/pool-together", icon: "/images/farcaster.png" },
  ];

  const poweredBy = [
    { name: "PoolTogether", image: "/images/pooltogether.png" },
    { name: "AAVE", image: "/images/aave.svg" },
    { name: "Optimism", image: "/images/optimism.svg" },
  ];

  return (
    <div className="flex-grow flex flex-col justify-end w-full px-0 py-0 mb-12 md:absolute md:bottom-0 md:left-0 md:right-0 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Powered By (Sponsors) */}
        <div className="flex space-x-8 mb-2 md:mb-2">
          {poweredBy.map((sponsor, index) => (
            <img
              key={index}
              src={sponsor.image}
              alt={sponsor.name}
              className="w-16 h-16"
            />
          ))}
        </div>

        {/* Social Links */}
        <div className="flex space-x-6">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <img src={link.icon} alt={link.name} className="w-8 h-8" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoweredBy;
