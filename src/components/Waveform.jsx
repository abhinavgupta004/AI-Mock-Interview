import React from 'react';

export default function Waveform({ active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2.5, height: 32 }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 2,
            background: 'linear-gradient(to top, #00D4FF, #60A5FA)',
            height: active ? `${6 + Math.abs(Math.sin(i * 0.8)) * 20}px` : '4px',
            animation: active
              ? `waveBar ${0.6 + (i % 4) * 0.15}s ease-in-out ${i * 0.04}s infinite`
              : 'none',
            opacity: active ? 0.9 : 0.25,
            transition: 'height 0.3s',
          }}
        />
      ))}
    </div>
  );
}
