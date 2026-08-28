import { ProductIcon as IconType } from "@/lib/products";

const GRADIENTS: Record<IconType, { from: string; to: string; id: string }> = {
  tablet: { from: "#14A876", to: "#0B4F38", id: "grad-tablet" },
  syrup: { from: "#1B2A4A", to: "#0F1A30", id: "grad-syrup" },
  capsule: { from: "#D9AE5F", to: "#B07F2A", id: "grad-capsule" },
  ointment: { from: "#0F6E4E", to: "#123A2C", id: "grad-ointment" },
};

export default function ProductIcon({
  icon,
  className = "w-16 h-16",
}: {
  icon: IconType;
  className?: string;
}) {
  const g = GRADIENTS[icon];

  switch (icon) {
    case "tablet":
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id={g.id} x1="6" y1="12" x2="42" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor={g.from} />
              <stop offset="1" stopColor={g.to} />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="40" height="40" rx="13" fill={`url(#${g.id})`} />
          <path d="M12 24a5 5 0 015-5h14a5 5 0 010 10H17a5 5 0 01-5-5z" fill="white" fillOpacity="0.14" stroke="white" strokeWidth="1.6" strokeOpacity="0.95" />
          <line x1="24" y1="19" x2="24" y2="29" stroke="#C79A48" strokeWidth="1.8" />
          <circle cx="15.5" cy="24" r="1.1" fill="white" />
        </svg>
      );
    case "syrup":
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id={g.id} x1="8" y1="6" x2="40" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor={g.from} />
              <stop offset="1" stopColor={g.to} />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="40" height="40" rx="13" fill={`url(#${g.id})`} />
          <path
            d="M20 11h8v6.5l5 6.5v11.5a3 3 0 01-3 3H18a3 3 0 01-3-3V24l5-6.5V11z"
            fill="white"
            fillOpacity="0.12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeOpacity="0.95"
          />
          <path d="M16.4 27.5h15.2" stroke="#C79A48" strokeWidth="1.5" />
          <rect x="19" y="8.4" width="10" height="2.6" rx="1" fill="#C79A48" />
        </svg>
      );
    case "capsule":
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id={g.id} x1="6" y1="12" x2="42" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor={g.from} />
              <stop offset="1" stopColor={g.to} />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="40" height="40" rx="13" fill={`url(#${g.id})`} />
          <path d="M10 24a6 6 0 016-6h12a6 6 0 010 12H16a6 6 0 01-6-6z" fill="white" fillOpacity="0.16" stroke="white" strokeWidth="1.6" strokeOpacity="0.95" />
          <path d="M24 18v12" stroke="#1B2A4A" strokeWidth="1.6" strokeOpacity="0.55" />
          <path d="M16 20.5c1.4-1.2 3-1.2 4 0" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
        </svg>
      );
    case "ointment":
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id={g.id} x1="8" y1="6" x2="40" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor={g.from} />
              <stop offset="1" stopColor={g.to} />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="40" height="40" rx="13" fill={`url(#${g.id})`} />
          <rect x="16" y="12" width="16" height="26" rx="4" fill="white" fillOpacity="0.14" stroke="white" strokeWidth="1.5" strokeOpacity="0.95" />
          <path d="M21 12V8h6v4" stroke="#C79A48" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M19.5 24h9" stroke="#C79A48" strokeWidth="1.4" />
          <path d="M19.5 28.5h9" stroke="white" strokeWidth="1.1" strokeOpacity="0.55" />
        </svg>
      );
  }
}
