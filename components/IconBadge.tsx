export function IconBadge({
  children,
  from,
  to,
  size = 48,
  shape = "circle",
}: {
  children: React.ReactNode;
  from: string;
  to: string;
  size?: number;
  shape?: "circle" | "square";
}) {
  const id = `iconbadge-${from.replace("#", "")}-${to.replace("#", "")}`;
  return (
    <div
      className={`flex items-center justify-center shrink-0 shadow-[0_10px_20px_-10px_rgba(20,24,31,0.35)] ${
        shape === "circle" ? "rounded-full" : "rounded-2xl"
      }`}
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <g stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {children}
        </g>
      </svg>
    </div>
  );
}
