// components/PrizeTokenIcon.tsx
import React from 'react';
import { ADDRESS } from '../constants/address';

interface PrizeTokenIconProps {
  size: number; // Size for both width and height
}

const PrizeTokenIcon: React.FC<PrizeTokenIconProps> = ({ size }) => {
  return (
    <img
      src={ADDRESS.PRIZETOKEN.ICON}
      alt={`${ADDRESS.PRIZETOKEN.SYMBOL} Icon`}
      width={size}
      height={size}
      style={{ borderRadius: '50%' }} // Optional: make it round
    />
  );
};

export default PrizeTokenIcon;
