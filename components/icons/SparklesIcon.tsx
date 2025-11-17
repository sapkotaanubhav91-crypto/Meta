
import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2L9.8 8.2l-6.2 2.8 6.2 2.8L12 22l2.2-6.2 6.2-2.8-6.2-2.8L12 2z" />
    <path d="M4 4l1.5 3L8 8.5 5.5 10 4 13l-1.5-3L0 8.5l2.5-1.5z" />
    <path d="M16 4l1.5 3L20 8.5 17.5 10 16 13l-1.5-3L12 8.5l2.5-1.5z" />
  </svg>
);
