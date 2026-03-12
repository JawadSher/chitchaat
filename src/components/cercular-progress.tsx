export function CircularProgress({ value }: { value: number }) {
  const radius = 45;
  const stroke = 4;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-primary-foreground/50">
      <svg
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="max-w-20 max-h-20"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          stroke="rgba(255, 255, 255, 0.2)"
          fill="none"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="#f1a50a"
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-300 -rotate-90"
          style={{ transformOrigin: "50% 50%" }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-primary">
        {Math.round(value)}%
      </div>
    </div>
  );
}