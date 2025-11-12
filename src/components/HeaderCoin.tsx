interface HeaderCoinProps {
  balance?: number;
}

const HeaderCoin = ({ balance = 400 }: HeaderCoinProps) => {
  return (
    <div 
      className="inline-flex items-center gap-2.5 px-2.5 py-1 rounded-full bg-background/60 backdrop-blur-sm border border-border/40 shadow-sm hover:shadow-md transition-all"
      aria-label={`Cadence Coin balance: ${balance}`}
    >
      <img 
        src="/cadence-coin.jpg" 
        alt="Cadence Coin" 
        className="w-[26px] h-[26px] object-contain"
        style={{ filter: 'drop-shadow(0 0 6px rgba(255,122,0,0.6))' }}
      />
      <span 
        className="text-foreground font-semibold font-variant-numeric-tabular"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {balance}
      </span>
    </div>
  );
};

export default HeaderCoin;
