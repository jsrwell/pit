export function HeroArt() {
  return (
    <div className="hero__art" aria-hidden="true">
      <svg viewBox="0 0 420 420">
        <defs>
          <linearGradient id="hero-gold" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f3d58a" />
            <stop offset="0.5" stopColor="#c5a46d" />
            <stop offset="1" stopColor="#8c6c39" />
          </linearGradient>
          <radialGradient id="hero-glow" cx="50%" cy="45%" r="55%">
            <stop offset="0" stopColor="#dcc394" stopOpacity="0.28" />
            <stop offset="1" stopColor="#dcc394" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="210" cy="210" r="205" fill="url(#hero-glow)" />
        <circle
          cx="210"
          cy="210"
          r="190"
          fill="none"
          stroke="url(#hero-gold)"
          strokeOpacity="0.5"
        />
        <circle
          cx="210"
          cy="210"
          r="168"
          fill="none"
          stroke="url(#hero-gold)"
          strokeOpacity="0.25"
          strokeDasharray="2 8"
        />
        <g fill="none" stroke="url(#hero-gold)" strokeWidth="2.4" strokeLinejoin="round">
          <path d="M128 222c-10-36 18-56 40-52-2-28 20-46 40-46s44 18 42 46c22-4 50 16 40 52z" />
          <path d="M150 170c34 12 86 12 118 0" strokeOpacity="0.6" />
          <path d="M168 136c22 10 54 10 76 0" strokeOpacity="0.6" />
          <rect x="124" y="222" width="172" height="12" rx="6" />
          <path d="M136 234h148l-20 96c-32 10-76 10-108 0z" />
          <path d="M168 238l8 90M208 238v94M248 238l-8 90" strokeOpacity="0.55" />
        </g>
        <circle cx="210" cy="104" r="15" fill="url(#hero-gold)" />
        <g fill="#dcc394">
          <circle cx="96" cy="128" r="2.5" />
          <circle cx="330" cy="150" r="3" />
          <circle cx="318" cy="300" r="2" />
          <circle cx="88" cy="292" r="2.5" />
          <circle cx="262" cy="74" r="2" />
        </g>
      </svg>
    </div>
  )
}
