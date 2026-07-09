import { ReactNode } from 'react';

interface GamButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'sun' | 'cream' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export function GamButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: GamButtonProps) {
  // Pop-shadow cartoon buttons: thick ink outline, hard offset shadow,
  // pill radius. Ported from the Gamellito Claude Design reference.
  const baseStyles =
    'btn font-display disabled:pointer-events-none';

  const variantStyles = {
    primary: 'btn-orange',
    secondary: 'btn-cream',
    sun: 'btn-sun',
    cream: 'btn-cream',
    purple: 'btn-purple',
  };

  const sizeStyles = {
    sm: 'text-sm !py-2 !px-4',
    md: '',
    lg: 'text-lg !py-4 !px-8',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
