// Hometown — shared icons (SVG, stroke style à la Lucide)
// Renders <svg> with consistent 16px sizing & 1.6 stroke

const Icon = ({ d, paths, size = 16, fill = false, viewBox = "0 0 24 24", style }) => (
  <svg
    width={size} height={size} viewBox={viewBox}
    fill={fill ? "currentColor" : "none"}
    stroke={fill ? "none" : "currentColor"}
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
    style={style}
    className="ico"
  >
    {d ? <path d={d} /> : null}
    {paths ? paths.map((p, i) => <path key={i} d={p} />) : null}
  </svg>
);

const Icons = {
  Home: (p) => <Icon {...p} paths={["M3 11.5 12 4l9 7.5", "M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"]} />,
  Bolt: (p) => <Icon {...p} d="M13 2 3 14h8l-1 8 10-12h-8z" />,
  Form: (p) => <Icon {...p} paths={["M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z","M8 8h8","M8 12h8","M8 16h5"]} />,
  Builder: (p) => <Icon {...p} paths={["M4 4h7v7H4z","M13 4h7v4h-7z","M13 10h7v10h-7z","M4 13h7v7H4z"]} />,
  Inbox: (p) => <Icon {...p} paths={["M3 13 5 5h14l2 8","M3 13v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6","M3 13h5l1 2h6l1-2h5"]} />,
  Mail: (p) => <Icon {...p} paths={["M3 6h18v12H3z","m3 7 9 6 9-6"]} />,
  User: (p) => <Icon {...p} paths={["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M4 20c1-4 4-6 8-6s7 2 8 6"]} />,
  Plus: (p) => <Icon {...p} paths={["M12 5v14","M5 12h14"]} />,
  Search: (p) => <Icon {...p} paths={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z","m21 21-4.3-4.3"]} />,
  Check: (p) => <Icon {...p} d="m5 12 5 5 9-11" />,
  X: (p) => <Icon {...p} paths={["M6 6l12 12","M18 6 6 18"]} />,
  ChevronDown: (p) => <Icon {...p} d="m6 9 6 6 6-6" />,
  ChevronRight: (p) => <Icon {...p} d="m9 6 6 6-6 6" />,
  ChevronLeft: (p) => <Icon {...p} d="m15 6-6 6 6 6" />,
  ChevronUp: (p) => <Icon {...p} d="m6 15 6-6 6 6" />,
  Phone: (p) => <Icon {...p} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />,
  AtSign: (p) => <Icon {...p} paths={["M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"]} />,
  Drag: (p) => <Icon {...p} paths={["M9 5h.01","M9 12h.01","M9 19h.01","M15 5h.01","M15 12h.01","M15 19h.01"]} />,
  Trash: (p) => <Icon {...p} paths={["M3 6h18","M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2","M19 6v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6","M10 11v6","M14 11v6"]} />,
  Copy: (p) => <Icon {...p} paths={["M9 9h11v11H9z","M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"]} />,
  Eye: (p) => <Icon {...p} paths={["M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"]} />,
  Settings: (p) => <Icon {...p} paths={["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"]} />,
  Calendar: (p) => <Icon {...p} paths={["M3 5h18v16H3z","M3 9h18","M8 3v4","M16 3v4"]} />,
  Type: (p) => <Icon {...p} paths={["M4 7V5h16v2","M9 20h6","M12 5v15"]} />,
  AlignLeft: (p) => <Icon {...p} paths={["M3 6h18","M3 12h12","M3 18h18","M3 24h12"]} viewBox="0 0 24 28" />,
  List: (p) => <Icon {...p} paths={["M8 6h13","M8 12h13","M8 18h13","M3 6h.01","M3 12h.01","M3 18h.01"]} />,
  Radio: (p) => <Icon {...p} paths={["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z","M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]} />,
  CheckSquare: (p) => <Icon {...p} paths={["m9 11 3 3 7-7","M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"]} />,
  Hash: (p) => <Icon {...p} paths={["M4 9h16","M4 15h16","M10 3 8 21","M16 3l-2 18"]} />,
  Link: (p) => <Icon {...p} paths={["M10 13a5 5 0 0 0 7 0l3-3a5 5 0 1 0-7-7l-1 1","M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 1 0 7 7l1-1"]} />,
  Send: (p) => <Icon {...p} paths={["M22 2 11 13","M22 2 15 22l-4-9-9-4z"]} />,
  Filter: (p) => <Icon {...p} d="M3 4h18l-7 8v8l-4-2v-6z" />,
  Star: (p) => <Icon {...p} d="m12 2 3 7 7 .5-5.5 4.5L18 21l-6-4-6 4 1.5-7L2 9.5 9 9z" />,
  Github: (p) => <Icon {...p} d="M9 19c-4 1-4-2-6-2m12 4v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6 0C6.7 2.8 5.7 3 5.7 3a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.3 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
  Sparkle: (p) => <Icon {...p} paths={["M12 3v4","M12 17v4","M3 12h4","M17 12h4","m5.6 5.6 2.8 2.8","m15.6 15.6 2.8 2.8","m5.6 18.4 2.8-2.8","m15.6 8.4 2.8-2.8"]} />,
  Logout: (p) => <Icon {...p} paths={["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","m16 17 5-5-5-5","M21 12H9"]} />,
  Archive: (p) => <Icon {...p} paths={["M3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7","M2 4h20v3H2z","M10 11h4"]} />,
  Reply: (p) => <Icon {...p} paths={["M9 17 4 12l5-5","M20 18v-2a4 4 0 0 0-4-4H4"]} />,
  Activity: (p) => <Icon {...p} d="M22 12h-4l-3 9L9 3l-3 9H2" />,
};

window.Icons = Icons;
window.Icon = Icon;
