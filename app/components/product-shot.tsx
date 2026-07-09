type Variant = "jar" | "tube" | "pump" | "spray" | "dropper";

const surfaces: Record<string, { from: string; to: string; glow: string }> = {
  mint: { from: "#eef5f0", to: "#d2e4d9", glow: "#ffffff" },
  cream: { from: "#f5f3ee", to: "#e5e0d5", glow: "#ffffff" },
  blush: { from: "#f8f1eb", to: "#ecdccf", glow: "#ffffff" },
  slate: { from: "#eef1f1", to: "#dbe1e1", glow: "#ffffff" },
};

/**
 * Vector stand-in for product photography — frosted-glass bottles with
 * specular highlights, reflections and a soft cast shadow on a lit backdrop.
 */
export function ProductShot({
  variant,
  surface = "cream",
  label = "AL-MADINA",
  className = "",
}: {
  variant: Variant;
  surface?: keyof typeof surfaces;
  label?: string;
  className?: string;
}) {
  const s = surfaces[surface];
  const gid = `${variant}-${surface}`;

  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      role="img"
      aria-label={`${label} ${variant}`}
    >
      <defs>
        {/* lit studio backdrop */}
        <radialGradient id={`bg-${gid}`} cx="0.5" cy="0.38" r="0.75">
          <stop offset="0" stopColor={s.glow} />
          <stop offset="0.5" stopColor={s.from} />
          <stop offset="1" stopColor={s.to} />
        </radialGradient>
        {/* frosted glass */}
        <linearGradient id={`glass-${gid}`} x1="0" y1="0" x2="1" y2="0.15">
          <stop offset="0" stopColor="#dcdcd7" />
          <stop offset="0.18" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#f3f3f0" />
          <stop offset="0.82" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d3d3ce" />
        </linearGradient>
        {/* dark glass (spray) */}
        <linearGradient id={`dark-${gid}`} x1="0" y1="0" x2="1" y2="0.1">
          <stop offset="0" stopColor="#20272e" />
          <stop offset="0.2" stopColor="#3a4650" />
          <stop offset="0.5" stopColor="#2b343c" />
          <stop offset="0.82" stopColor="#3a4650" />
          <stop offset="1" stopColor="#1c2229" />
        </linearGradient>
        {/* amber glass (dropper) */}
        <linearGradient id={`amber-${gid}`} x1="0" y1="0" x2="1" y2="0.1">
          <stop offset="0" stopColor="#b98b52" />
          <stop offset="0.2" stopColor="#e2b57e" />
          <stop offset="0.5" stopColor="#cf9d63" />
          <stop offset="0.82" stopColor="#e2b57e" />
          <stop offset="1" stopColor="#a97c46" />
        </linearGradient>
        <linearGradient id={`cap-${gid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1f1f1d" />
          <stop offset="0.25" stopColor="#45443f" />
          <stop offset="0.6" stopColor="#2a2a27" />
          <stop offset="1" stopColor="#161614" />
        </linearGradient>
        <linearGradient id={`wood-${gid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b08a5e" />
          <stop offset="0.5" stopColor="#d8b184" />
          <stop offset="1" stopColor="#a67c4f" />
        </linearGradient>
      </defs>

      <rect width="300" height="300" fill={`url(#bg-${gid})`} />
      {/* long soft cast shadow */}
      <ellipse cx="150" cy="252" rx="82" ry="14" fill="#4a4a44" opacity="0.16" />
      <ellipse cx="150" cy="250" rx="52" ry="8" fill="#3a3a34" opacity="0.14" />

      {renderBottle(variant, gid)}

      {/* specular highlight strip shared across glass bottles */}
      {variant !== "spray" && variant !== "dropper" && (
        <rect
          x={highlightX(variant)}
          y={highlightY(variant)}
          width="7"
          height={highlightH(variant)}
          rx="3.5"
          fill="#ffffff"
          opacity="0.7"
        />
      )}

      {/* label */}
      <LabelPlate variant={variant} label={label} />
    </svg>
  );
}

function renderBottle(variant: Variant, gid: string) {
  const glass = `url(#glass-${gid})`;
  const stroke = "#c9c9c3";
  switch (variant) {
    case "jar":
      return (
        <g>
          <rect x="94" y="148" width="112" height="90" rx="14" fill={glass} stroke={stroke} strokeWidth="1" />
          <rect x="88" y="120" width="124" height="34" rx="10" fill="#eef3ef" stroke={stroke} strokeWidth="1" />
          <ellipse cx="150" cy="120" rx="62" ry="9" fill="#f8faf8" stroke={stroke} strokeWidth="0.8" />
          <rect x="104" y="196" width="92" height="34" rx="6" fill="#fff" opacity="0.5" />
        </g>
      );
    case "tube":
      return (
        <g>
          <path d="M116 108c0-8 6-14 34-14s34 6 34 14v118c0 8-4 14-34 14s-34-6-34-14Z" fill={glass} stroke={stroke} strokeWidth="1" />
          <rect x="126" y="80" width="48" height="22" rx="6" fill={`url(#cap-${gid})`} />
          <path d="M116 226c0-8 6-12 34-12s34 4 34 12" fill="none" stroke={stroke} strokeWidth="1" opacity="0.7" />
        </g>
      );
    case "pump":
      return (
        <g>
          <rect x="104" y="118" width="92" height="122" rx="16" fill={glass} stroke={stroke} strokeWidth="1" />
          <rect x="141" y="82" width="18" height="34" fill={`url(#cap-${gid})`} />
          <path d="M150 74h30a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-30Z" fill={`url(#cap-${gid})`} />
          <rect x="128" y="106" width="44" height="16" rx="4" fill={`url(#cap-${gid})`} />
        </g>
      );
    case "spray":
      return (
        <g>
          <rect x="114" y="116" width="72" height="124" rx="12" fill={`url(#dark-${gid})`} stroke="#20272e" strokeWidth="1" />
          <rect x="130" y="86" width="40" height="32" rx="3" fill={`url(#cap-${gid})`} />
          <path d="M126 78h26a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-26Z" fill={`url(#cap-${gid})`} />
          <rect x="122" y="132" width="6" height="90" rx="3" fill="#ffffff" opacity="0.16" />
        </g>
      );
    case "dropper":
      return (
        <g>
          <rect x="118" y="118" width="64" height="124" rx="10" fill={`url(#amber-${gid})`} stroke="#a97c46" strokeWidth="1" />
          <rect x="128" y="72" width="44" height="50" rx="6" fill={`url(#cap-${gid})`} />
          <rect x="144" y="50" width="12" height="26" rx="3" fill={`url(#cap-${gid})`} />
          <rect x="126" y="134" width="6" height="90" rx="3" fill="#ffffff" opacity="0.3" />
        </g>
      );
  }
}

function LabelPlate({ variant, label }: { variant: Variant; label: string }) {
  const dark = variant === "spray";
  const y = variant === "spray" || variant === "dropper" ? 160 : 176;
  const w = variant === "tube" ? 60 : variant === "spray" || variant === "dropper" ? 64 : 82;
  return (
    <g>
      <rect
        x={150 - w / 2}
        y={y}
        width={w}
        height="36"
        rx="4"
        fill={dark ? "#11161b" : "#ffffff"}
        opacity={dark ? 0.85 : 0.94}
      />
      <text
        x="150"
        y={y + 16}
        textAnchor="middle"
        textLength={w - 14}
        lengthAdjust="spacingAndGlyphs"
        fontFamily="var(--font-display), serif"
        fontSize="11"
        fill={dark ? "#eef3ef" : "#2a2a28"}
      >
        {label}
      </text>
      <text
        x="150"
        y={y + 28}
        textAnchor="middle"
        fontFamily="var(--font-sans), sans-serif"
        fontSize="5"
        letterSpacing="1.5"
        fill={dark ? "#9fb0a2" : "#8a8a83"}
      >
        SKIN CARE
      </text>
    </g>
  );
}

function highlightX(v: Variant) {
  return v === "jar" ? 108 : v === "tube" ? 128 : 118;
}
function highlightY(v: Variant) {
  return v === "jar" ? 158 : v === "tube" ? 112 : 128;
}
function highlightH(v: Variant) {
  return v === "jar" ? 66 : v === "tube" ? 104 : 96;
}
