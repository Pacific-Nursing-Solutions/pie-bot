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
      {/* Robot body/head - rounded rectangle */}
      <rect
        x="6"
        y="8"
        width="12"
        height="10"
        rx="3"
        ry="3"
        fill="#f97316"
        stroke="#ea580c"
        strokeWidth="1"
      />
      
      {/* Antenna */}
      <rect
        x="11"
        y="5"
        width="2"
        height="3"
        fill="#ea580c"
      />
      <circle cx="12" cy="4" r="1.5" fill="#ea580c" />
      
      {/* Eyes */}
      <circle cx="9.5" cy="12" r="1.5" fill="#ffffff" />
      <circle cx="14.5" cy="12" r="1.5" fill="#ffffff" />
      
      {/* Eye dots */}
      <circle cx="9.5" cy="12" r="0.5" fill="#1f2937" />
      <circle cx="14.5" cy="12" r="0.5" fill="#1f2937" />
      
      {/* Mouth */}
      <rect
        x="10"
        y="15"
        width="4"
        height="1.5"
        rx="0.75"
        fill="#ea580c"
      />
      
      {/* Side details */}
      <rect x="5" y="10" width="1" height="2" fill="#ea580c" />
      <rect x="18" y="10" width="1" height="2" fill="#ea580c" />
    </svg>
  );
};