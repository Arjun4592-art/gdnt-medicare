export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export default function DonutChart({ data, size = 150 }: { data: DonutDatum[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2;
  const stroke = size * 0.22;
  const r = radius - stroke / 2;
  const circumference = 2 * Math.PI * r;

  const segments = data.reduce<Array<DonutDatum & { dash: number; gap: number; offset: number }>>((acc, d) => {
    const prevOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    const dash = (d.value / total) * circumference;
    acc.push({ ...d, dash, gap: circumference - dash, offset: prevOffset });
    return acc;
  }, []);

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0">
        <circle cx={radius} cy={radius} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        {segments.map((s) => (
          <circle
            key={s.label}
            cx={radius}
            cy={radius}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-[12.5px]">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="font-semibold text-navy">{d.label}</span>
            <span className="text-muted font-bold ml-auto pl-3">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
