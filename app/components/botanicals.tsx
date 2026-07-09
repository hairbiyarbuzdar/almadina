/**
 * Hand-drawn botanical accents that echo the greenery in the design —
 * monstera-style leaves and slender eucalyptus sprigs. Pure SVG, no assets.
 */

export function MonsteraLeaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="monstera-grad" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#6f9e78" />
          <stop offset="0.55" stopColor="#4f7d5a" />
          <stop offset="1" stopColor="#3a6146" />
        </linearGradient>
      </defs>
      {/* stem */}
      <path
        d="M100 214C100 214 98 150 100 120"
        stroke="#3a6146"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* leaf body with characteristic splits */}
      <path
        fill="url(#monstera-grad)"
        d="M100 118c-26-2-48-16-60-40-9-18-10-40-3-58 12 6 20 2 33 6 3-14 12-20 30-24 18 4 27 10 30 24 13-4 21 0 33-6 7 18 6 40-3 58-12 24-34 38-60 40Z"
      />
      {/* vein splits (cut-outs) */}
      <g stroke="#e9efe9" strokeWidth="2.5" fill="none" opacity="0.55" strokeLinecap="round">
        <path d="M100 110V34" />
        <path d="M100 92 74 66" />
        <path d="M100 92 126 66" />
        <path d="M100 66 82 48" />
        <path d="M100 66 118 48" />
      </g>
      {/* fenestration slits */}
      <g fill="#e9efe9" opacity="0.85">
        <path d="M64 74c8 6 12 14 14 24-10-4-18-10-22-20Z" />
        <path d="M136 74c-8 6-12 14-14 24 10-4 18-10 22-20Z" />
        <path d="M76 44c6 5 9 11 10 18-8-3-14-9-16-16Z" />
        <path d="M124 44c-6 5-9 11-10 18 8-3 14-9 16-16Z" />
      </g>
    </svg>
  );
}

export function EucalyptusSprig({ className = "" }: { className?: string }) {
  const leaves = [
    { cx: 70, cy: 30, r: 15, rot: -35 },
    { cx: 92, cy: 55, r: 16, rot: -20 },
    { cx: 70, cy: 78, r: 16, rot: -50 },
    { cx: 96, cy: 100, r: 17, rot: -15 },
    { cx: 70, cy: 124, r: 16, rot: -55 },
    { cx: 94, cy: 146, r: 15, rot: -18 },
  ];
  return (
    <svg viewBox="0 0 130 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="euc-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fb495" />
          <stop offset="1" stopColor="#5a8465" />
        </linearGradient>
      </defs>
      <path
        d="M82 6C74 60 72 120 72 190"
        stroke="#5a8465"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {leaves.map((l, i) => (
        <ellipse
          key={i}
          cx={l.cx}
          cy={l.cy}
          rx={l.r * 0.62}
          ry={l.r}
          fill="url(#euc-grad)"
          transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}
        />
      ))}
    </svg>
  );
}

export function CitrusSlice({ className = "" }: { className?: string }) {
  const segments = Array.from({ length: 8 });
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#f6e6b8" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="#e9d38a" strokeWidth="3" />
      <circle cx="50" cy="50" r="38" fill="#fbf3d6" />
      {segments.map((_, i) => {
        const a = (i / segments.length) * Math.PI * 2;
        const x = 50 + Math.cos(a) * 34;
        const y = 50 + Math.sin(a) * 34;
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={x}
            y2={y}
            stroke="#eddc9a"
            strokeWidth="2"
          />
        );
      })}
      <circle cx="50" cy="50" r="5" fill="#f0e0a0" />
    </svg>
  );
}
