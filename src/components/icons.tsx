/**
 * Inline SVG line icons — no dependency, inherit `currentColor` and size.
 * Used by the service / process cards and the call-to-action arrows.
 */
import type { SVGProps } from "react";

export type IconName =
  | "scan"
  | "nodes"
  | "code"
  | "grid"
  | "bot"
  | "search"
  | "document"
  | "send"
  | "arrow-up-right"
  | "arrow-right";

const PATHS: Record<IconName, React.ReactNode> = {
  scan: (
    <>
      <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  nodes: (
    <>
      <circle cx="12" cy="6" r="2" />
      <circle cx="6" cy="14" r="2" />
      <circle cx="18" cy="14" r="2" />
      <circle cx="12" cy="20" r="2" />
      <path d="m10.8 7.6-3.6 4.8M13.2 7.6l3.6 4.8M8 14h8M7.6 15.6l2.8 2.8M16.4 15.6l-2.8 2.8" />
    </>
  ),
  code: (
    <>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
    </>
  ),
  bot: (
    <>
      <rect x="6" y="8" width="12" height="10" rx="2" />
      <path d="M12 8V5M9 5h6M9.5 13h.01M14.5 13h.01M8 18v2M16 18v2M4 12h2M18 12h2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  send: (
    <>
      <path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Z" />
      <path d="m10 13 4.5-4.5" />
    </>
  ),
  "arrow-up-right": <path d="M7 17 17 7M9 7h8v8" />,
  "arrow-right": <path d="M5 12h14M13 5l7 7-7 7" />,
};

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}
