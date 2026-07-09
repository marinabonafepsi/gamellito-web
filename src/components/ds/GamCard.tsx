import { ReactNode } from 'react';

interface GamCardProps {
  children: ReactNode;
  surface?: 'white' | 'orange' | 'cream' | 'purple' | 'sun' | 'lilac';
  className?: string;
}

export function GamCard({
  children,
  surface = 'white',
  className = '',
}: GamCardProps) {
  // Cartoon card: ink outline + hard pop shadow + round corners,
  // matching the Gamellito Claude Design reference.
  const surfaceStyles = {
    white: 'bg-white text-ink',
    orange: 'bg-orange text-white',
    cream: 'bg-cream text-ink',
    purple: 'bg-purple-soft text-white',
    sun: 'bg-sun text-ink',
    lilac: 'bg-lilac-soft text-ink',
  };

  return (
    <div
      className={`
        card ${surfaceStyles[surface]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
