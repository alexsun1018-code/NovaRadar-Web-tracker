export type IconName =
  | "globe"
  | "users"
  | "shield"
  | "leaf"
  | "chevronLeft"
  | "chevronRight"
  | "externalLink"
  | "menu"
  | "close"
  | "clock"
  | "wrench"
  | "flask"
  | "rocket"
  | "target"
  | "handshake"
  | "lightbulb"
  | "barChart"
  | "search"
  | "bridge";

const paths: Record<IconName, React.ReactNode> = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9s1.3-6.3 3.8-9Z" />
    </>
  ),
  users: (
    <>
      <circle cx="8" cy="8" r="3" />
      <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14a5 5 0 0 1 6.5 4.8" />
    </>
  ),
  shield: <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />,
  leaf: <path d="M5 19c8 0 14-6 14-14 0 0-9-1-13 3S5 19 5 19Zm0 0c1-3 3-6 6-8" />,
  chevronLeft: <path d="M15 6l-6 6 6 6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  externalLink: (
    <>
      <path d="M14 5h5v5" />
      <path d="M19 5l-9 9" />
      <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-2.6 2.6-2-.6-.6-2 2.6-2.6Z" />
  ),
  flask: (
    <>
      <path d="M10 3h4M9 3v6.5L4.6 18a2 2 0 0 0 1.8 3h11.2a2 2 0 0 0 1.8-3L15 9.5V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  rocket: (
    <>
      <path d="M14.5 3.5c2.5.5 4 2 4.5 4.5.4 2-.2 4.6-2 7.2-1 .1-2.9 1.8-3.6 2.5l-3.6-3.6c.7-.7 2.4-2.6 2.5-3.6 2.6-1.8 5.2-2.4 7.2-2 .1 0 .1-.1.1-.1" />
      <path d="M9.5 14.5 6 16l2-3.5" />
      <path d="M8 18c-1.5.3-3 1-4 2 1-1 1.7-2.5 2-4" />
      <circle cx="15" cy="9" r="1.4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </>
  ),
  handshake: (
    <>
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3Z" />
    </>
  ),
  barChart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" />
    </>
  ),
  bridge: (
    <>
      <path d="M3 17c3-4 15-4 18 0" />
      <path d="M6 17V9M18 17V9M12 17V6" />
      <path d="M2 21h20" />
    </>
  ),
};

export default function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
