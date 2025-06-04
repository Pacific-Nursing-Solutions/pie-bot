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
      {/* Briefcase/Suitcase shape */}
      <rect
        x="4"
        y="8"
        width="16"
        height="12"
        rx="2"
        ry="2"
        fill="#f97316"
        stroke="#ea580c"
        strokeWidth="0.5"
      />
      
      {/* Handle */}
      <path
        d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke="#ea580c"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Lock/Clasp */}
      <rect
        x="11"
        y="7"
        width="2"
        height="3"
        rx="0.5"
        fill="#ea580c"
      />
      
      {/* Corner details */}
      <circle cx="6" cy="10" r="0.5" fill="#ea580c" />
      <circle cx="18" cy="10" r="0.5" fill="#ea580c" />
      <circle cx="6" cy="18" r="0.5" fill="#ea580c" />
      <circle cx="18" cy="18" r="0.5" fill="#ea580c" />
    </svg>
  );
};