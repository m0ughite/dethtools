import React, { ReactElement, SVGProps } from 'react';

const DEFAULT_SIZE = 30;

export function DownArrowIcon(
  properties: SVGProps<SVGSVGElement>,
): ReactElement {
  return (
    <svg
      width={properties.width ?? DEFAULT_SIZE}
      height={properties.height ?? DEFAULT_SIZE}
      viewBox="0 0 256 256"
      fill={`${properties.fill ?? 'none'}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M128 245L10 127M128 245L246 127M128 245V8"
        stroke="white"
        strokeWidth="8"
      />
    </svg>
  );
}
