import React from 'react';

/**
 * Authentic SVG icons for supported CP platforms
 */
export function PlatformIcon({ platform, size = 16, className = '' }) {
  const p = (platform || '').toLowerCase();

  if (p.includes('codeforces')) {
    // Codeforces iconic 3-bar logo
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="10" width="4.5" height="11" rx="1.5" fill="#eab308" />
        <rect x="9.5" y="4" width="4.5" height="17" rx="1.5" fill="#3b82f6" />
        <rect x="17" y="13" width="4.5" height="8" rx="1.5" fill="#ef4444" />
      </svg>
    );
  }

  if (p.includes('leetcode')) {
    // LeetCode iconic logo
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.97 3.653c.302.016.606.012.91-.012a6.38 6.38 0 0 0 2.21-.63 6.643 6.643 0 0 0 1.956-1.503l3.854-4.126 1.838-1.966a1.374 1.374 0 0 0-.961-2.348h-7.61a1.374 1.374 0 0 0 0 2.748h5.368L12.42 14.59a3.896 3.896 0 0 1-1.148.882 3.636 3.636 0 0 1-1.26.36 3.2 3.2 0 0 1-2.73-2.008 3.16 3.16 0 0 1-.036-1.353 3.01 3.01 0 0 1 .69-1.204l4.58-4.903 2.93-3.136A1.374 1.374 0 0 0 13.483 0z"
          fill="#f59e0b"
        />
        <path
          d="M17.065 17.065a1.374 1.374 0 0 1 1.943 0l3.05 3.05a1.374 1.374 0 0 1-1.943 1.943l-3.05-3.05a1.374 1.374 0 0 1 0-1.943z"
          fill="#94a3b8"
        />
      </svg>
    );
  }

  if (p.includes('codechef')) {
    // CodeChef chef / bracket badge
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="2" />
        <path
          d="M8 9C8 7.34315 9.34315 6 11 6H13C14.6569 6 16 7.34315 16 9C16 10.6569 14.6569 12 13 12H11C9.34315 12 8 10.6569 8 9Z"
          fill="#a855f7"
        />
        <path d="M7 16L12 13L17 16" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (p.includes('atcoder')) {
    // AtCoder crystal hexagon
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
          fill="rgba(6, 182, 212, 0.2)"
          stroke="#06b6d4"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M12 2L12 22" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.5" />
        <path d="M3 7L21 17" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.5" />
      </svg>
    );
  }

  // Generic fallback code icon
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
