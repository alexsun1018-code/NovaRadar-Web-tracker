type Variant = "esg" | "investors" | "careers" | "auth";

function EsgArt() {
  return (
    <>
      <ellipse cx="120" cy="150" rx="90" ry="14" fill="#e8f5ef" />
      {/* globe */}
      <circle cx="110" cy="95" r="46" fill="#04948c" />
      <path
        d="M64 95c0-25 20-46 46-46m0 92c-25 0-46-21-46-46"
        stroke="#e8f5ef"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <ellipse cx="110" cy="95" rx="20" ry="46" stroke="#e8f5ef" strokeWidth="4" fill="none" opacity="0.5" />
      <path d="M64 95h92M75 70h70M75 120h70" stroke="#e8f5ef" strokeWidth="4" opacity="0.5" />
      {/* leaf on top */}
      <path
        d="M110 54c18-22 46-24 58-14 2 20-14 42-40 44-14 1-24-12-18-30Z"
        fill="#c9a227"
      />
      <path d="M112 84c14-16 32-26 48-30" stroke="#0c344c" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* floating sparkles */}
      <circle cx="45" cy="60" r="6" fill="#c9a227" />
      <circle cx="185" cy="55" r="5" fill="#0c344c" />
      <circle cx="195" cy="110" r="7" fill="#04948c" opacity="0.5" />
      <circle cx="35" cy="115" r="5" fill="#0c344c" opacity="0.6" />
    </>
  );
}

function InvestorsArt() {
  return (
    <>
      <ellipse cx="120" cy="150" rx="90" ry="14" fill="#fbf4e4" />
      {/* bar chart */}
      <rect x="52" y="98" width="26" height="46" rx="6" fill="#0c344c" />
      <rect x="88" y="76" width="26" height="68" rx="6" fill="#04948c" />
      <rect x="124" y="56" width="26" height="88" rx="6" fill="#c9a227" />
      {/* trend arrow */}
      <path
        d="M50 92 L96 58 L138 40 L172 20"
        stroke="#0c344c"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M154 18h20v20" stroke="#0c344c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* coin stack */}
      <ellipse cx="188" cy="118" rx="22" ry="9" fill="#c9a227" />
      <ellipse cx="188" cy="108" rx="22" ry="9" fill="#e0b93f" />
      <ellipse cx="188" cy="98" rx="22" ry="9" fill="#c9a227" />
      <text x="188" y="102" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0c344c">
        $
      </text>
      <circle cx="30" cy="40" r="5" fill="#04948c" />
      <circle cx="205" cy="55" r="6" fill="#0c344c" opacity="0.5" />
    </>
  );
}

function CareersArt() {
  return (
    <>
      <ellipse cx="120" cy="150" rx="90" ry="14" fill="#eaf1f8" />
      {/* person A */}
      <circle cx="70" cy="70" r="18" fill="#0c344c" />
      <circle cx="64" cy="67" r="2.4" fill="#eaf1f8" />
      <circle cx="76" cy="67" r="2.4" fill="#eaf1f8" />
      <path d="M64 76c4 4 12 4 16 0" stroke="#eaf1f8" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M40 140c2-30 20-46 30-46s28 16 30 46Z" fill="#0c344c" />
      {/* person B */}
      <circle cx="164" cy="66" r="19" fill="#04948c" />
      <circle cx="158" cy="63" r="2.4" fill="#0c344c" />
      <circle cx="170" cy="63" r="2.4" fill="#0c344c" />
      <path d="M157 73c4 4 12 4 16 0" stroke="#0c344c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M132 140c2-32 24-49 32-49s28 17 32 49Z" fill="#04948c" />
      {/* high five */}
      <path
        d="M92 98c8-10 16-14 22-14M132 90c-8-8-14-10-18-10"
        stroke="#0c344c"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M114 74l3 7 7 1-5.5 5 1.5 7-6-3.6-6 3.6 1.5-7-5.5-5 7-1Z"
        fill="#c9a227"
      />
      {/* confetti */}
      <rect x="30" y="42" width="8" height="8" rx="2" fill="#c9a227" transform="rotate(20 34 46)" />
      <circle cx="196" cy="46" r="5" fill="#0c344c" opacity="0.5" />
      <rect x="188" y="86" width="7" height="7" rx="2" fill="#04948c" transform="rotate(-15 191 90)" />
      <circle cx="44" cy="100" r="4" fill="#c9a227" opacity="0.7" />
    </>
  );
}

function AuthArt() {
  return (
    <>
      <ellipse cx="120" cy="150" rx="90" ry="14" fill="#eef0fb" />
      {/* account badge */}
      <circle cx="98" cy="82" r="52" fill="#0c344c" opacity="0.08" />
      <circle cx="98" cy="66" r="20" fill="#0c344c" />
      <path d="M60 132c3-26 18-40 38-40s35 14 38 40Z" fill="#0c344c" />
      {/* padlock */}
      <rect x="128" y="88" width="64" height="52" rx="10" fill="#04948c" />
      <path
        d="M142 88v-14c0-12 9-21 20-21s20 9 20 21v14"
        stroke="#04948c"
        strokeWidth="9"
        fill="none"
      />
      <circle cx="160" cy="110" r="8" fill="#c9a227" />
      <rect x="157" y="114" width="6" height="14" rx="3" fill="#c9a227" />
      {/* sparkles */}
      <circle cx="40" cy="45" r="6" fill="#c9a227" />
      <circle cx="205" cy="60" r="5" fill="#0c344c" opacity="0.5" />
      <circle cx="52" cy="115" r="5" fill="#04948c" opacity="0.6" />
    </>
  );
}

const artByVariant: Record<Variant, () => React.ReactNode> = {
  esg: EsgArt,
  investors: InvestorsArt,
  careers: CareersArt,
  auth: AuthArt,
};

export default function ComingSoonIllustration({ variant }: { variant: Variant }) {
  const Art = artByVariant[variant];
  return (
    <svg
      viewBox="0 0 240 160"
      className="h-40 w-auto sm:h-48"
      role="img"
      aria-hidden="true"
    >
      <Art />
    </svg>
  );
}
