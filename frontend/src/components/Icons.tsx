import React from 'react';

export const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Standard Official LeetCode Icon
export const LeetCodeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    role="img"
  >
    <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.649 1.837-.649s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.213 5.213 0 0 0-3.85-1.462 5.163 5.163 0 0 0-3.838 1.462l-4.32 4.381c-1.025 1.025-1.589 2.39-1.589 3.84s.564 2.815 1.589 3.84l4.332 4.363c1.025 1.025 2.39 1.589 3.838 1.589 1.449 0 2.825-.564 3.85-1.589l2.609-2.636c.514-.514.496-1.365-.039-1.901-.535-.535-1.386-.553-1.9-.038z M10.825 13.018h9.856c.745 0 1.357-.612 1.357-1.357s-.612-1.357-1.357-1.357h-9.856c-.745 0-1.357.612-1.357 1.357s.612 1.357 1.357 1.357z" />
  </svg>
);

// Standard Official Codeforces Icon (3-bar hierarchy)
export const CodeforcesIcon: React.FC<{ className?: string; colored?: boolean }> = ({
  className = 'w-5 h-5',
  colored = false,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    role="img"
  >
    {/* Yellow/Amber Left Bar */}
    <path
      d="M4.5 7.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h1.5a1.5 1.5 0 0 0 1.5-1.5V9a1.5 1.5 0 0 0-1.5-1.5h-1.5z"
      fill={colored ? '#EAA43B' : 'currentColor'}
    />
    {/* Blue Middle Bar */}
    <path
      d="M10.5 1.5A1.5 1.5 0 0 0 9 3v16.5A1.5 1.5 0 0 0 10.5 21h1.5A1.5 1.5 0 0 0 13.5 19.5V3A1.5 1.5 0 0 0 12 1.5h-1.5z"
      fill={colored ? '#215CA8' : 'currentColor'}
    />
    {/* Red Right Bar */}
    <path
      d="M16.5 4.5A1.5 1.5 0 0 0 15 6v13.5A1.5 1.5 0 0 0 16.5 21h1.5A1.5 1.5 0 0 0 19.5 19.5V6A1.5 1.5 0 0 0 18 4.5h-1.5z"
      fill={colored ? '#B13331' : 'currentColor'}
    />
  </svg>
);
