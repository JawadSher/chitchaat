export function CircularProgress({ value }: { value: number }) {
  const radius = 18;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="absolute top-50 right-50">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="absolute inset-0 m-auto"
      >
        <circle
          stroke="rgba(255,255,255,0.3)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="white"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-200"
        />
      </svg>
    </div>
  );
}
