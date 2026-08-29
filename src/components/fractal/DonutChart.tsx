type Slice = { id: string; value: number; color: string };

const safeNumber = (n: unknown): number => {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return v < 0 ? 0 : v;
};

export function DonutChart({
  slices,
  total,
  label,
}: {
  slices: Slice[];
  total: number;
  label: string;
}) {
  // Never let a bad value break the screen: coerce everything to finite, non-negative numbers.
  const safeSlices = Array.isArray(slices) ? slices : [];
  const safeTotal = safeNumber(total);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="18"
        />
        {safeSlices.map((s) => {
          const value = safeNumber(s?.value);
          const share = safeTotal > 0 ? value / safeTotal : 0;
          const dash = Math.min(Math.max(share, 0), 1) * circumference;
          const el = (
            <circle
              key={s.id ?? "slice"}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={s.color || "var(--muted)"}
              strokeWidth="18"
              strokeLinecap="butt"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              className="transition-all duration-700 ease-out"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="text-lg font-extrabold tabular-nums text-foreground">
          ${safeTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  );
}
