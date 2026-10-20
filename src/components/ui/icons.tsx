/* Icônes au trait du design system (grille 24, trait 1,7, classe « i »). */
const P = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  bag: <><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chev: <path d="m6 9 6 6 6-6" />,
  chevRight: <path d="m9 6 6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />,
  mail: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  user: <><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20.5c1.3-3.8 4.2-5.6 7.5-5.6s6.2 1.8 7.5 5.6" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.5 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.5-3.6-8.5s1.1-5.9 3.6-8.5Z" /></>,
  home: <><path d="M4 20V10l8-6 8 6v10" /><path d="M9.5 20v-5.5h5V20" /></>,
  truck: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  tool: <path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5Z" />,
  cycle: <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />,
  error: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></>,
  bins: <><path d="M4 12h16" /><path d="M8 8h8" /></>,
  flip: <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4" />,
  down: <path d="M12 5v14M7 14l5 5 5-5" />,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.4" /></>,
  shield: <path d="M12 3.5 5 6v5.5c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V6Z" />,
  layers: <><path d="m12 4 8.5 4.5L12 13 3.5 8.5Z" /><path d="m3.5 12.5 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5" /></>,
} as const;

export type IconName = keyof typeof P;
export function Icon({ name, className = "i" }: { name: IconName; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true">{P[name]}</svg>;
}

export const HEART_PATH = "M17 28.5C7.5 22 1.5 16.5 1.5 10a7.8 7.8 0 0 1 15.5-1.6A7.8 7.8 0 0 1 32.5 10c0 6.5-6 12-15.5 18.5Z";
export function Heart({ className = "heart" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 34 30" aria-hidden="true"><path d={HEART_PATH} /></svg>;
}

/* Pictogrammes des univers (puces, méga menu, menu mobile) */
export function UniversIcon({ univers }: { univers: "creer" | "imaginer" | "ranger" | "bouger" }) {
  const s = { fill: "none", stroke: "var(--ink)", strokeWidth: 1.4, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" style={s}>
      {univers === "creer" && <rect x="1.5" y="5" width="13" height="7" rx="2" />}
      {univers === "imaginer" && <path d="M2.5 14V7L8 2.5 13.5 7v7Z" />}
      {univers === "ranger" && <path d="M3 2.5v11M13 2.5v11M3 6h10M3 10h10" />}
      {univers === "bouger" && <path d="M8 2 2.5 14h11Z" />}
    </svg>
  );
}
