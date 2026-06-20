import React from 'react';

export default function ScoreRing({ score, size = 96 }) {
  const r = 36, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? '#34D399' : score >= 60 ? '#F59E0B' : '#F87171';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1A2A3A" strokeWidth="7" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - score / 100)}
        transform={`rotate(-90 ${cx} ${cy})`}
        className="sfill"
      />
      <text x={cx} y={cy - 4} dominantBaseline="middle" textAnchor="middle"
        fill={color} fontSize="17" fontWeight="700"
        fontFamily="Space Grotesk, sans-serif">{score}</text>
      <text x={cx} y={cy + 12} dominantBaseline="middle" textAnchor="middle"
        fill="#8892A4" fontSize="8"
        fontFamily="Inter, sans-serif">/100</text>
    </svg>
  );
}
