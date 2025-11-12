interface HeaderCoinProps {
  balance?: number;
}

const HeaderCoin = ({ balance = 400 }: HeaderCoinProps) => {
  return (
    <div 
      className="cc-chip inline-flex items-center gap-[10px] px-3 h-8 rounded-full"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.12))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08), 0 0 12px rgba(255,122,0,.20)'
      }}
      aria-label={`Cadence Coins: ${balance}`}
    >
      {/* Flat SVG coin */}
      <svg 
        className="cc-coin w-[28px] h-[28px]" 
        aria-hidden="true" 
        viewBox="0 0 100 100" 
        role="img" 
        focusable="false"
        style={{
          filter: 'drop-shadow(0 0 6px rgba(255,122,0,.6))',
          transformStyle: 'preserve-3d',
          animation: 'cc-spin 8s linear infinite'
        }}
      >
        <defs>
          <radialGradient id="ccGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FFB366"/>
            <stop offset="55%" stopColor="#FF7A00"/>
            <stop offset="100%" stopColor="#FF4500"/>
          </radialGradient>
          <linearGradient id="ccRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC080"/>
            <stop offset="50%" stopColor="#FF8C1A"/>
            <stop offset="100%" stopColor="#FF5A00"/>
          </linearGradient>
        </defs>
        {/* halo */}
        <circle cx="50" cy="50" r="48" fill="url(#ccGlow)" opacity="0.18"/>
        {/* coin base */}
        <circle cx="50" cy="50" r="40" fill="url(#ccGlow)"/>
        {/* rim */}
        <circle cx="50" cy="50" r="42" fill="none" stroke="url(#ccRim)" strokeWidth="6"/>
        {/* rim accents */}
        <circle cx="50" cy="50" r="36" fill="none" stroke="url(#ccRim)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 6" opacity=".8"/>
        <circle cx="50" cy="50" r="31" fill="none" stroke="url(#ccRim)" strokeWidth=".8" strokeDasharray="2 3" opacity=".35"/>
        {/* flat 'C' mark */}
        <g transform="translate(50,50)">
          <path 
            d="M-10 -24 h20 v6 h-8 a16 16 0 1 0 0 36 h8 v6 h-20 a22 22 0 1 1 0 -48 z"
            fill="#FFE6CC"
          />
        </g>
      </svg>

      {/* PNG fallback */}
      <img 
        className="cc-coin-fallback hidden w-[28px] h-[28px] object-contain" 
        src="/cadence-coin.jpg" 
        alt="Cadence Coin"
        style={{ filter: 'drop-shadow(0 0 6px rgba(255,122,0,.6))' }}
      />

      <span 
        className="cc-digits text-white font-bold"
        style={{ 
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 8px rgba(255,122,0,.35)'
        }}
      >
        {balance}
      </span>
    </div>
  );
};

export default HeaderCoin;
