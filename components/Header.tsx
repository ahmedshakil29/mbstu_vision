interface HeaderProps {
  isLive: boolean;
}

export default function Header({ isLive }: HeaderProps) {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5" />
            <circle cx="9" cy="9" r="3" fill="white" opacity="0.8" />
            <line x1="9" y1="2" x2="9" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="9" y1="13" x2="9" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="9" x2="5" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="9" x2="16" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span className="logo-text">
          MBSTU<span style={{ color: 'var(--accent)' }}>VISION</span>
        </span>
      </div>
      <div className="status-pill">
        <div className={`status-dot ${isLive ? 'live' : ''}`} />
        <span>{isLive ? 'LIVE' : 'OFFLINE'}</span>
      </div>
    </header>
  );
}
