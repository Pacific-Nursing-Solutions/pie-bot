interface PieBotLogoProps {
  size?: number;
  className?: string;
}

export const PieBotLogo = ({ size = 24, className = "" }: PieBotLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Robot head - wide and short like a pie */}
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="7"
        fill="#f97316"
        stroke="#ea580c"
        strokeWidth="1"
      />
      
      {/* Eyes */}
      <circle cx="8" cy="10" r="1.5" fill="#ffffff" />
      <circle cx="16" cy="10" r="1.5" fill="#ffffff" />
      
      {/* Eye pupils */}
      <circle cx="8" cy="10" r="0.7" fill="#1f2937" />
      <circle cx="16" cy="10" r="0.7" fill="#1f2937" />
      
      {/* Mouth/speaker grille */}
      <rect
        x="9"
        y="14"
        width="6"
        height="2"
        rx="1"
        fill="#ea580c"
      />
      
      {/* Small horizontal lines in mouth */}
      <line x1="10" y1="15" x2="14" y2="15" stroke="#ffffff" strokeWidth="0.3" />
      
      {/* Antenna/sensors */}
      <circle cx="6" cy="6" r="1" fill="#ea580c" />
      <circle cx="18" cy="6" r="1" fill="#ea580c" />
      
      {/* Connection lines to antennae */}
      <line x1="7" y1="7" x2="8" y2="8" stroke="#ea580c" strokeWidth="0.8" />
      <line x1="17" y1="7" x2="16" y2="8" stroke="#ea580c" strokeWidth="0.8" />
    </svg>
  );
};