"use client";

interface WaveSeparatorProps {
  from?: string;
  to?: string;
  flip?: boolean;
}

export default function WaveSeparator({
  from = "#f9fafb",
  to = "#ffffff",
  flip = false,
}: WaveSeparatorProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""}`}
      style={{ marginTop: -1, marginBottom: -1 }}
    >
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
          fill={to}
        />
        <path
          d="M0 0V40C240 80 480 0 720 40C960 80 1200 0 1440 40V0H0Z"
          fill={from}
        />
      </svg>
    </div>
  );
}
