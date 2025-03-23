import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`px-4 py-2 bg-[#2A2A5B] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}; 