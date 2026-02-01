export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon: Stylized mobile phone with checkmark */}
      <div className="relative">
        <svg 
          width="52" 
          height="52" 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          
          {/* Mobile phone shape */}
          <rect 
            x="12" 
            y="6" 
            width="16" 
            height="28" 
            rx="3" 
            fill="url(#phoneGradient)"
          />
          <rect 
            x="14" 
            y="9" 
            width="12" 
            height="19" 
            rx="1" 
            fill="white" 
            opacity="0.2"
          />
          
          {/* Checkmark circle (gold accent) */}
          <circle 
            cx="28" 
            cy="12" 
            r="7" 
            fill="url(#checkGradient)"
          />
          
          {/* Checkmark */}
          <path 
            d="M 25.5 12 L 27 13.5 L 30.5 10" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      
      {/* Text logo */}
      <div className="flex items-baseline leading-none text-[24px]" dir="ltr">
        <span className="text-2xl font-bold text-slate-900 tracking-tight text-[36px]">
          Ikhtar
        </span>
        <span className="text-xs font-medium text-[rgb(0,0,0)] tracking-wide text-[20px]">
          .se
        </span>
      </div>
    </div>
  );
}