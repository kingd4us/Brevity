// src/components/Button.tsx
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
  {...props}
  className={`w-full bg-primary text-text py-3 px-4 rounded-md border-2 border-border
              font-semibold shadow-[4px_4px_0px_#1A1A1A] hover:bg-muted hover:shadow-[2px_2px_0px_#1A1A1A]
              active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1A1A1A]
              transition-all duration-150 disabled:bg-gray-400 disabled:shadow-none
              ${className}`}
>
  {children}
</button>
  );
};

export default Button;