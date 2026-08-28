export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

export default function BarChart({ data, valuePrefix = "" }: { data: BarDatum[]; valuePrefix?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="space-y-4">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-[12.5px] mb-1.5">
            <span className="font-semibold text-navy">{d.label}</span>
            <span className="font-bold text-muted">
              {valuePrefix}
              {d.value.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-bg-soft overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color || "linear-gradient(90deg, #0F6E4E, #14A876)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
