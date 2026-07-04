import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";

type Page = "work" | "projects" | "about" | "contact";

const FF = {
  display: "var(--font-display)",
  body: "var(--font-body)",
  mono: "var(--font-mono)",
};

// ── Replace with your Calendly link ──────────────────────────────────────────
const CALENDLY_URL = "https://calendly.com/your-link";

const PROJECTS = [
  {
    id: 1,
    title: "FLUX SYSTEM",
    category: "Brand Identity / Motion",
    year: "2025",
    description:
      "Visual identity and motion language for a creative technology studio. Built around fluid, adaptable geometric forms that respond to context.",
    bg: "#e8eef6",
    accent: "#5a7fb8",
    tags: ["Branding", "Motion", "Typography"],
    featured: true,
  },
  {
    id: 2,
    title: "SUBLIMINAL",
    category: "Audio-Visual / Film",
    year: "2024",
    description:
      "A 12-minute experimental short exploring synesthesia through reactive visuals synchronized with generative soundscapes.",
    bg: "#e2eff5",
    accent: "#3a8e8e",
    tags: ["Film", "Sound Design", "After Effects"],
    featured: true,
  },
  {
    id: 3,
    title: "GRID//BREAK",
    category: "Editorial Design",
    year: "2025",
    description:
      "A 6-issue editorial series that systematically deconstructs the traditional magazine grid — one rule broken per issue.",
    bg: "#eeebf6",
    accent: "#7a68b8",
    tags: ["Editorial", "Print", "InDesign"],
    featured: true,
  },
  {
    id: 4,
    title: '"HUMAN OR AI?"',
    category: "Interactive Installation",
    year: "2026",
    description:
      "Pulls from an AI training dataset to play a game with gallery visitors — training human viewers to differentiate between AI-generated and human responses.",
    bg: "#e8eef6",
    accent: "#5a7fb8",
    tags: ["Python", "Media Mesh", "AI / ML"],
    featured: false,
  },
  {
    id: 5,
    title: '"THE WAIT"',
    category: "Interactive Experience",
    year: "2026",
    description:
      "An occupied hospital room where the player confronts the anxious experience of waiting for someone in surgery. Built for empathy through embodiment.",
    bg: "#eeebf6",
    accent: "#7a68b8",
    tags: ["Blender", "Unreal Engine", "Game Design"],
    featured: false,
  },
  {
    id: 6,
    title: '"SAM AND ME"',
    category: "2D Narrative Game",
    year: "2026",
    description:
      "Treats physical movement as narrative language — real-time hand tracking controls character interaction, rewarding labor outside traditional game skills.",
    bg: "#e8f2ec",
    accent: "#4e8c68",
    tags: ["Phaser", "MediaPipe", "OpenCV"],
    featured: false,
    url: "Sam and Me Website",
  },
  {
    id: 7,
    title: '"INTRUDER"',
    category: "Mechatronic Art",
    year: "2025",
    description:
      "A mechanical curtain system that closes when a viewer approaches a window — questioning curiosity, privacy, and the aura of an artwork's home.",
    bg: "#e2eee8",
    accent: "#5a9080",
    tags: ["Arduino", "Physical Computing", "Installation"],
    featured: false,
  },
  {
    id: 8,
    title: "CHASING",
    category: "Interactive Experience",
    year: "2025",
    description:
      "A frustratingly small, blurry lens the user must move to see themselves wholly — a reflection on self-improvement and the continuous pursuit of identity.",
    bg: "#dceaf2",
    accent: "#4a7ea0",
    tags: ["TouchDesigner", "MediaPipe", "Hand Tracking"],
    featured: false,
  },
  {
    id: 9,
    title: "VIS145B MIDTERM",
    category: "Visual Performance",
    year: "2024",
    description:
      "Inspired by Brakhage's Dog Star Man — a live video-essay performance recreating escapism and nostalgia through a collage of personal memories.",
    bg: "#e2eff5",
    accent: "#3a8e8e",
    tags: ["MaxMSP", "MIDI Controller", "Live Performance"],
    featured: false,
  },
];

const VIDEO_WORKS = [
  {
    id: "v1",
    title: '"A WELFARE THANKSGIVING"',
    category: "Experimental Film",
    year: "2025",
    duration: "",
    client: "Self-directed",
    description:
      "Constrained filmmaking across ten obstructions — silent, one take, no edits, animated section, handheld, black and white only.",
    bg: "#e4ecf4",
    accent: "#5a7fb8",
  },
  {
    id: "v2",
    title: '"GROWING PAINS"',
    category: "Found Footage Edit",
    year: "2025",
    duration: "",
    client: "Self-directed",
    description:
      "No new footage permitted — a pure test of editing instinct and storytelling built entirely from media found online.",
    bg: "#eceaf4",
    accent: "#7a68b8",
  },
  {
    id: "v3",
    title: '"THE LIVING ROOM CAFE"',
    category: "Short Film",
    year: "2024",
    duration: "",
    client: "Self-directed",
    description:
      "A quietly intimate video document shot with attention to domestic space, light, and atmosphere.",
    bg: "#e6f0e8",
    accent: "#4e8c68",
  },
  {
    id: "v4",
    title: '"BLACK BEAN NOODLE"',
    category: "Short Film",
    year: "2024",
    duration: "",
    client: "Self-directed",
    description:
      "A short film about identity, cultural experiences, and the growth that comes with moving frequently. Shot on disposable camera.",
    bg: "#e4eef2",
    accent: "#5a9080",
  },
  {
    id: "v5",
    title: "ADRENAL GLAND (MEDULLA)",
    category: "Animated Explainer",
    year: "2022",
    duration: "",
    client: "Academic",
    description:
      "Animated and narrated scientific breakdown of how the adrenal gland medulla functions in the human body.",
    bg: "#dce8f2",
    accent: "#4a7ea0",
  },
  {
    id: "v6",
    title: "EARLY YOUTUBE WORKS",
    category: "Comedy / Gaming Video",
    year: "2021",
    duration: "",
    client: "Self-directed",
    description:
      '"Check Your Bed", "Day of Bedwars", "When U Fall in Love with Bedwars" — comedy gaming content made during lockdown. The beginning of everything.',
    bg: "#e2eff5",
    accent: "#3a8e8e",
  },
];

// ─── 3D SPHERE ───────────────────────────────────────────────────────────────

function Sphere3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotY = useRef(0.6);
  const rotX = useRef(0.28);
  const velY = useRef(0.004);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 520, H = 520, R = 205, cx = W / 2, cy = H / 2;
    const LATS = 18, LONS = 16, PI2 = Math.PI * 2;

    function rot(x: number, y: number, z: number) {
      const cosY = Math.cos(rotY.current), sinY = Math.sin(rotY.current);
      const x1 = x * cosY + z * sinY, z1 = -x * sinY + z * cosY;
      const cosX = Math.cos(rotX.current), sinX = Math.sin(rotX.current);
      return { px: cx + x1, py: cy + y * cosX - z1 * sinX, d: y * sinX + z1 * cosX };
    }

    function seg(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
      const p1 = rot(x1, y1, z1), p2 = rot(x2, y2, z2);
      const depth = ((p1.d + p2.d) / 2 / R + 1) / 2;
      ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py);
      ctx.strokeStyle = `rgba(26,36,33,${0.04 + depth * 0.55})`;
      ctx.lineWidth = 0.3 + depth * 1.1; ctx.stroke();
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      if (!dragging.current) rotY.current += velY.current;
      for (let i = 1; i < LATS; i++) {
        const lat = (i / LATS) * Math.PI - Math.PI / 2, r = Math.cos(lat) * R, hy = Math.sin(lat) * R;
        for (let j = 0; j < LATS * 2; j++) {
          const a1 = (j / (LATS * 2)) * PI2, a2 = ((j + 1) / (LATS * 2)) * PI2;
          seg(r * Math.cos(a1), hy, r * Math.sin(a1), r * Math.cos(a2), hy, r * Math.sin(a2));
        }
      }
      for (let j = 0; j < LONS; j++) {
        const lon = (j / LONS) * PI2;
        for (let i = 0; i < LATS * 2; i++) {
          const lat1 = (i / (LATS * 2)) * Math.PI - Math.PI / 2, lat2 = ((i + 1) / (LATS * 2)) * Math.PI - Math.PI / 2;
          seg(Math.cos(lat1)*R*Math.cos(lon), Math.sin(lat1)*R, Math.cos(lat1)*R*Math.sin(lon),
              Math.cos(lat2)*R*Math.cos(lon), Math.sin(lat2)*R, Math.cos(lat2)*R*Math.sin(lon));
        }
      }
      // equator accent
      for (let j = 0; j < LATS * 4; j++) {
        const a1 = (j / (LATS * 4)) * PI2, a2 = ((j + 1) / (LATS * 4)) * PI2;
        const p1 = rot(R * Math.cos(a1), 0, R * Math.sin(a1));
        const p2 = rot(R * Math.cos(a2), 0, R * Math.sin(a2));
        const depth = ((p1.d + p2.d) / 2 / R + 1) / 2;
        ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py);
        ctx.strokeStyle = `rgba(78,138,122,${0.1 + depth * 0.5})`; ctx.lineWidth = 0.6 + depth * 1.4; ctx.stroke();
      }
      raf.current = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf.current);
  }, []);

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    if ("touches" in e && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if ("clientX" in e) return { x: e.clientX, y: e.clientY };
    return { x: 0, y: 0 };
  }

  return (
    <canvas ref={canvasRef} width={520} height={520}
      className="w-full max-w-[480px] aspect-square cursor-grab active:cursor-grabbing select-none"
      onMouseDown={e => { dragging.current = true; lastPos.current = getPos(e); }}
      onMouseMove={e => {
        if (!dragging.current) return;
        const p = getPos(e);
        rotY.current += (p.x - lastPos.current.x) * 0.007;
        rotX.current += (p.y - lastPos.current.y) * 0.007;
        velY.current = (p.x - lastPos.current.x) * 0.004;
        lastPos.current = p;
      }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={e => { dragging.current = true; lastPos.current = getPos(e); }}
      onTouchMove={e => { const p = getPos(e); rotY.current += (p.x - lastPos.current.x) * 0.007; rotX.current += (p.y - lastPos.current.y) * 0.007; lastPos.current = p; }}
      onTouchEnd={() => { dragging.current = false; }}
    />
  );
}

// ─── PROJECT ARTWORK (bold filler compositions) ──────────────────────────────

type ArtworkProps = { bg: string; accent: string };

function ArtworkFlux({ bg, accent }: ArtworkProps) {
  return (
    <svg viewBox="0 0 560 380" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="560" height="380" fill={bg} />
      {/* Structural grid */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={`h${i}`} x1="0" y1={i*48} x2="560" y2={i*48} stroke={accent} strokeWidth="0.5" strokeOpacity="0.18" />
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <line key={`v${i}`} x1={i*56} y1="0" x2={i*56} y2="380" stroke={accent} strokeWidth="0.5" strokeOpacity="0.18" />
      ))}
      {/* Large overlapping circles — identity system */}
      <circle cx="196" cy="190" r="130" fill={accent} fillOpacity="0.12" />
      <circle cx="364" cy="190" r="130" fill={accent} fillOpacity="0.12" />
      <circle cx="196" cy="190" r="130" stroke={accent} strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="364" cy="190" r="130" stroke={accent} strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Intersection fill — stronger */}
      <clipPath id="cl1"><circle cx="196" cy="190" r="130" /></clipPath>
      <circle cx="364" cy="190" r="130" fill={accent} fillOpacity="0.22" clipPath="url(#cl1)" />
      {/* Centre dot */}
      <circle cx="280" cy="190" r="10" fill={accent} fillOpacity="0.7" />
      <circle cx="280" cy="190" r="22" stroke={accent} strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Corner module boxes */}
      {[[28,28],[504,28],[28,324],[504,324]].map(([x,y],i) => (
        <rect key={i} x={x-16} y={y-16} width="32" height="32" fill={accent} fillOpacity="0.15" stroke={accent} strokeWidth="1" strokeOpacity="0.4" />
      ))}
    </svg>
  );
}

function ArtworkSubliminal({ bg, accent }: ArtworkProps) {
  return (
    <svg viewBox="0 0 560 380" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="560" height="380" fill={bg} />
      {/* Horizontal scan bands */}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x="0" y={i*56} width="560" height="50" fill={accent} fillOpacity={0.03 + i * 0.02} />
      ))}
      {/* Central glow — light source */}
      <ellipse cx="280" cy="190" rx="200" ry="140" fill={accent} fillOpacity="0.07" />
      <ellipse cx="280" cy="190" rx="110" ry="76" fill={accent} fillOpacity="0.1" />
      <ellipse cx="280" cy="190" rx="46" ry="32" fill={accent} fillOpacity="0.22" />
      {/* Bold scan lines */}
      {[132, 190, 248].map(y => (
        <line key={y} x1="0" y1={y} x2="560" y2={y} stroke={accent} strokeWidth={y === 190 ? 2 : 0.8} strokeOpacity={y === 190 ? 0.55 : 0.25} />
      ))}
      {/* Film frame corners */}
      {([[40,40],[ 520,40],[40,340],[520,340]] as [number,number][]).map(([x,y],i) => {
        const sx = x > 280 ? -1 : 1, sy = y > 190 ? -1 : 1;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x + sx*32} y2={y} stroke={accent} strokeWidth="2" strokeOpacity="0.5" />
            <line x1={x} y1={y} x2={x} y2={y + sy*32} stroke={accent} strokeWidth="2" strokeOpacity="0.5" />
          </g>
        );
      })}
      {/* Dots along centre */}
      {[112,196,280,364,448].map(x => (
        <circle key={x} cx={x} cy="190" r="3" fill={accent} fillOpacity="0.5" />
      ))}
    </svg>
  );
}

function ArtworkGrid({ bg, accent }: ArtworkProps) {
  return (
    <svg viewBox="0 0 560 380" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="560" height="380" fill={bg} />
      {/* Regular ruled grid */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={`h${i}`} x1="40" y1={30+i*40} x2="520" y2={30+i*40} stroke={accent} strokeWidth="0.6" strokeOpacity="0.22" />
      ))}
      {[0,1,2,3,4,5,6].map(i => (
        <line key={`v${i}`} x1={40+i*80} y1="30" x2={40+i*80} y2="350" stroke={accent} strokeWidth="0.6" strokeOpacity="0.22" />
      ))}
      {/* THE BREAK — bold diagonal */}
      <line x1="40" y1="350" x2="520" y2="30" stroke={accent} strokeWidth="3" strokeOpacity="0.55" />
      {/* Dominant horizontal rule (the one that matters) */}
      <line x1="40" y1="190" x2="520" y2="190" stroke={accent} strokeWidth="3.5" strokeOpacity="0.85" />
      {/* Filled squares at rule intersections */}
      {[40,120,200,280,360,440,520].map(x => (
        <rect key={x} x={x-5} y="185" width="10" height="10" fill={accent} fillOpacity="0.6" />
      ))}
      {/* Large open rectangle — column structure */}
      <rect x="40" y="30" width="230" height="150" stroke={accent} strokeWidth="1.2" strokeOpacity="0.3" />
      <rect x="40" y="30" width="230" height="150" fill={accent} fillOpacity="0.05" />
      {/* Number hint */}
      <text x="52" y="108" fontFamily="serif" fontSize="72" fill={accent} fillOpacity="0.1" fontWeight="700">03</text>
    </svg>
  );
}

const PROJECT_ARTWORKS = [ArtworkFlux, ArtworkSubliminal, ArtworkGrid];

// ─── DETAIL TYPES ─────────────────────────────────────────────────────────────

type ProjectItem = (typeof PROJECTS)[0];
type VideoItem   = (typeof VIDEO_WORKS)[0];
type DetailItem  = ProjectItem | VideoItem;
const isVideo = (item: DetailItem): item is VideoItem => "duration" in item;

// ─── GENERIC ARTWORK PLACEHOLDERS ────────────────────────────────────────────

function GenericArtwork({ bg, accent, title }: { bg: string; accent: string; title: string }) {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: bg }}>
      <div className="absolute inset-0 opacity-25" style={{
        backgroundImage: "radial-gradient(circle,rgba(26,36,33,0.12) 1px,transparent 1px)",
        backgroundSize: "28px 28px",
      }} />
      <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ background: accent, opacity: 0.65 }} />
      <div className="absolute inset-0 flex items-end p-8 pb-6">
        <span className="leading-none select-none opacity-[0.09] break-all"
          style={{ fontFamily: FF.display, fontSize: "clamp(3rem,9vw,7rem)", color: accent, lineHeight: 0.9 }}>
          {title}
        </span>
      </div>
    </div>
  );
}

function VideoArtwork({ bg, accent }: { bg: string; accent: string }) {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: bg }}>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(26,36,33,0.07) 18px,rgba(26,36,33,0.07) 19px)",
      }} />
      <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ background: accent, opacity: 0.65 }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 flex items-center justify-center border-2 transition-all"
          style={{ borderColor: accent, opacity: 0.5 }}>
          <div className="ml-1" style={{
            width: 0, height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderLeft: `16px solid ${accent}`,
            opacity: 0.8,
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── PROJECT DETAIL PAGE ──────────────────────────────────────────────────────

function ProjectDetailPage({
  item,
  onBack,
  backLabel,
}: {
  item: DetailItem;
  onBack: () => void;
  backLabel: string;
}) {
  const vid = isVideo(item);
  const proj = !vid ? (item as ProjectItem) : null;
  const projIndex = proj ? PROJECTS.findIndex(p => p.id === proj.id) : -1;
  const hasArtwork = proj && proj.id <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="pt-24 pb-24 px-6"
      style={{ maxWidth: 1320, margin: "0 auto" }}
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-10 group"
        style={{ fontFamily: FF.mono }}
      >
        <span className="text-[#88aba5] group-hover:text-[#4e8a7a] group-hover:-translate-x-1 transition-all duration-200 text-lg leading-none">←</span>
        <span className="text-[11px] tracking-[0.25em] uppercase text-[#88aba5] group-hover:text-[#4e8a7a] transition-colors duration-200">
          {backLabel}
        </span>
      </button>

      {/* Artwork */}
      <div className={`w-full mb-10 overflow-hidden border border-black/[0.06] ${vid ? "aspect-video" : "aspect-[16/9]"}`}>
        {hasArtwork && proj
          ? (() => { const A = PROJECT_ARTWORKS[projIndex % 3]; return <A bg={proj.bg} accent={proj.accent} />; })()
          : vid
          ? <VideoArtwork bg={item.bg} accent={item.accent} />
          : <GenericArtwork bg={item.bg} accent={item.accent} title={item.title} />
        }
      </div>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start mb-10 border-b border-black/[0.07] pb-10">
        <div>
          <p className="text-[11px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: FF.mono, color: item.accent }}>
            {item.category}
          </p>
          <h1 className="text-[#1a2421] leading-none"
            style={{ fontFamily: FF.display, fontSize: "clamp(1.8rem, 7vw, 5.5rem)" }}>
            {item.title}
          </h1>
        </div>
        <div className="flex flex-col gap-1 lg:text-right pt-1">
          <span className="text-[11px] tracking-[0.2em] text-[#88aba5]" style={{ fontFamily: FF.mono }}>{item.year}</span>
          {vid && (item as VideoItem).client && (
            <span className="text-[11px] tracking-[0.15em] text-[#9ebdb8]" style={{ fontFamily: FF.mono }}>
              {(item as VideoItem).client}
            </span>
          )}
          {vid && (item as VideoItem).duration && (
            <span className="text-[11px] tracking-[0.15em] text-[#9ebdb8]" style={{ fontFamily: FF.mono }}>
              {(item as VideoItem).duration}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
        <p className="text-[#445e58] text-lg leading-[1.8] text-justify" style={{ fontFamily: FF.body }}>
          {item.description}
        </p>

        <div className="flex flex-col gap-6">
          {proj && proj.tags && proj.tags.length > 0 && (
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#88aba5] mb-3" style={{ fontFamily: FF.mono }}>
                Tools & Media
              </p>
              <div className="flex flex-wrap gap-2">
                {proj.tags.map(tag => (
                  <span key={tag} className="text-[11px] tracking-[0.15em] uppercase px-2.5 py-1 border border-black/10 text-[#688882]"
                    style={{ fontFamily: FF.mono }}>{tag}</span>
                ))}
              </div>
            </div>
          )}
          {"url" in item && item.url && (
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#88aba5] mb-2" style={{ fontFamily: FF.mono }}>
                External
              </p>
              <span className="text-[11px] tracking-[0.15em] text-[#4e8a7a]" style={{ fontFamily: FF.mono }}>
                {item.url} ↗
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── CALENDLY EMBED ──────────────────────────────────────────────────────────

function CalendlyEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Calendly stylesheet once
    if (!document.querySelector('link[href*="calendly.com"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet"; link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }

    const init = () => {
      const Cal = (window as any).Calendly;
      if (Cal && containerRef.current) {
        Cal.initInlineWidget({
          url: `${CALENDLY_URL}?hide_gdpr_banner=1&primary_color=b85c38&text_color=1c1814&background_color=f5f0e8`,
          parentElement: containerRef.current,
        });
      }
    };

    if ((window as any).Calendly) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = init;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full rounded-none overflow-hidden border border-black/[0.07]"
      style={{ minWidth: 280, height: 700 }} />
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { label: "Works", items: PROJECTS as DetailItem[] },
  { label: "Video Works", items: VIDEO_WORKS as DetailItem[] },
];

function Nav({
  current,
  onChange,
  onOpenDetail,
}: {
  current: Page;
  onChange: (p: Page) => void;
  onOpenDetail: (item: DetailItem) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const links: Page[] = ["work", "projects", "about", "contact"];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const openDropdown = () => { clearTimeout(closeTimer.current); setDropdownOpen(true); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setDropdownOpen(false), 130); };

  function navigate(p: Page) { onChange(p); setMenuOpen(false); setProjectsExpanded(false); }

  function openItem(item: DetailItem) {
    onOpenDetail(item);
    setDropdownOpen(false);
    setMenuOpen(false);
    setProjectsExpanded(false);
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#f0f5f3]/90 backdrop-blur-sm border-b border-black/[0.07]" : ""
      }`}>
        <div className="max-w-[1320px] mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate("work")} style={{ fontFamily: FF.mono }}
            className="text-[11px] tracking-[0.35em] text-[#4e8a7a] uppercase">
            Portfolio
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex gap-8 items-center">
            {links.map(p => p === "projects" ? (
              /* Projects with hover dropdown */
              <div key="projects" className="relative" onMouseEnter={openDropdown} onMouseLeave={scheduleClose}>
                <button
                  onClick={() => navigate("projects")}
                  style={{ fontFamily: FF.mono }}
                  className={`text-[11px] tracking-[0.22em] uppercase transition-colors duration-200 flex items-center gap-1.5 ${
                    current === "projects" ? "text-[#4e8a7a]" : "text-[#789a94] hover:text-[#1a2421]"
                  }`}
                >
                  Projects
                  <span className={`transition-transform duration-200 text-[8px] ${dropdownOpen ? "rotate-180" : ""}`}>▾</span>
                </button>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      key="dropdown"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      onMouseEnter={openDropdown}
                      onMouseLeave={scheduleClose}
                      className="absolute right-0 top-[calc(100%+12px)] w-72 bg-[#f0f5f3] border border-black/[0.09] shadow-sm overflow-hidden"
                      style={{ zIndex: 60 }}
                    >
                      {NAV_SECTIONS.map((section, si) => (
                        <div key={section.label}>
                          {si > 0 && <div className="border-t border-black/[0.07]" />}
                          <p className="px-4 pt-3 pb-1.5 text-[9px] tracking-[0.35em] text-[#88aba5] uppercase"
                            style={{ fontFamily: FF.mono }}>
                            {section.label}
                          </p>
                          {section.items.map(item => (
                            <button
                              key={item.title}
                              onClick={() => openItem(item)}
                              className="w-full text-left px-4 py-2 flex items-baseline justify-between gap-3 hover:bg-[#e2eee9] transition-colors duration-150 group/item"
                            >
                              <span className="text-[11px] text-[#1a2421] group-hover/item:text-[#4e8a7a] transition-colors truncate"
                                style={{ fontFamily: FF.mono }}>
                                {item.title}
                              </span>
                              <span className="text-[10px] text-[#9ebdb8] shrink-0" style={{ fontFamily: FF.mono }}>
                                {item.year}
                              </span>
                            </button>
                          ))}
                          <div className="pb-2" />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button key={p} onClick={() => navigate(p)} style={{ fontFamily: FF.mono }}
                className={`text-[11px] tracking-[0.22em] uppercase transition-colors duration-200 ${
                  current === p ? "text-[#4e8a7a]" : "text-[#789a94] hover:text-[#1a2421]"
                }`}>
                {p}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(o => !o)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]" aria-label="Toggle menu">
            <span className={`block h-[1.5px] bg-[#1a2421] transition-all duration-300 origin-center ${menuOpen ? "w-5 rotate-45 translate-y-[6.5px]" : "w-5"}`} />
            <span className={`block h-[1.5px] bg-[#1a2421] transition-all duration-300 ${menuOpen ? "w-0 opacity-0" : "w-5"}`} />
            <span className={`block h-[1.5px] bg-[#1a2421] transition-all duration-300 origin-center ${menuOpen ? "w-5 -rotate-45 -translate-y-[6.5px]" : "w-5"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div key="drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#f0f5f3] border-l border-black/[0.07] flex flex-col md:hidden overflow-y-auto">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.07] shrink-0">
              <span className="text-[11px] tracking-[0.35em] text-[#4e8a7a] uppercase" style={{ fontFamily: FF.mono }}>Menu</span>
              <button onClick={() => setMenuOpen(false)} className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]" aria-label="Close menu">
                <span className="block h-[1.5px] w-5 bg-[#1a2421] rotate-45 translate-y-[1px]" />
                <span className="block h-[1.5px] w-5 bg-[#1a2421] -rotate-45 -translate-y-[1px]" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col px-6 pt-8 gap-0 flex-1">
              {links.map((p, i) => p === "projects" ? (
                <motion.div key="projects" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.1 + i * 0.06 }}>
                  {/* Projects toggle row */}
                  <div className={`flex items-center justify-between py-4 border-b border-black/[0.06] ${
                    current === "projects" ? "text-[#4e8a7a]" : "text-[#1a2421]"
                  }`}>
                    <button onClick={() => navigate("projects")} className="text-left flex-1"
                      style={{ fontFamily: FF.display, fontSize: "clamp(1.1rem, 6vw, 2.2rem)" }}>
                      Projects
                    </button>
                    <button
                      onClick={() => setProjectsExpanded(e => !e)}
                      className="w-8 h-8 flex items-center justify-center text-[#789a94] hover:text-[#4e8a7a] transition-colors"
                      aria-label="Expand projects"
                    >
                      <span className={`block transition-transform duration-200 text-sm ${projectsExpanded ? "rotate-180" : ""}`}>▾</span>
                    </button>
                  </div>

                  {/* Expandable project list */}
                  <AnimatePresence>
                    {projectsExpanded && (
                      <motion.div key="proj-list" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        {NAV_SECTIONS.map((section, si) => (
                          <div key={section.label} className={si > 0 ? "mt-3" : ""}>
                            <p className="px-3 pt-3 pb-1 text-[9px] tracking-[0.3em] text-[#88aba5] uppercase"
                              style={{ fontFamily: FF.mono }}>{section.label}</p>
                            {section.items.map(item => (
                              <button key={item.title} onClick={() => openItem(item)}
                                className="w-full text-left px-3 py-2 flex items-baseline justify-between gap-2 hover:bg-[#e2eee9] transition-colors">
                                <span className="text-[11px] text-[#385450] truncate" style={{ fontFamily: FF.mono }}>
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-[#9ebdb8] shrink-0" style={{ fontFamily: FF.mono }}>
                                  {item.year}
                                </span>
                              </button>
                            ))}
                          </div>
                        ))}
                        <div className="pb-3" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.button key={p} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.1 + i * 0.06 }}
                  onClick={() => navigate(p)}
                  className={`text-left py-4 border-b border-black/[0.06] transition-colors duration-200 ${
                    current === p ? "text-[#4e8a7a]" : "text-[#1a2421] hover:text-[#4e8a7a]"
                  }`}
                  style={{ fontFamily: FF.display, fontSize: "clamp(1.1rem, 6vw, 2.2rem)" }}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                  {current === p && <span className="ml-3 text-[11px] text-[#4e8a7a] align-middle" style={{ fontFamily: FF.mono }}>●</span>}
                </motion.button>
              ))}
            </nav>

            {/* Drawer footer */}
            <div className="px-6 py-8 border-t border-black/[0.06] shrink-0">
              <p className="text-[10px] tracking-[0.3em] text-[#88aba5] uppercase" style={{ fontFamily: FF.mono }}>Multimedia Designer</p>
              <p className="text-[10px] tracking-[0.2em] text-[#9ebdb8] mt-1" style={{ fontFamily: FF.mono }}>Rotterdam, NL</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── PROJECT CARD (grid page) ─────────────────────────────────────────────────

function ProjectCard({ proj, index, onOpen }: { proj: (typeof PROJECTS)[0]; index: number; onOpen: (item: DetailItem) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group cursor-pointer" onClick={() => onOpen(proj)}>
      <div className="aspect-[16/10] mb-4 relative overflow-hidden" style={{ background: proj.bg }}>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle,rgba(26,36,33,0.12) 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <span className="absolute bottom-0 right-0 leading-none tracking-tighter select-none translate-y-[10%] translate-x-[3%] group-hover:translate-y-[5%] transition-transform duration-500 opacity-20 group-hover:opacity-35"
          style={{ fontFamily: FF.display, fontSize: "min(12vw, 9rem)", color: proj.accent }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: proj.accent, opacity: 0.7 }} />
        {/* hover reveal */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: `${proj.bg}cc` }}>
          <span className="text-[11px] tracking-[0.3em] uppercase border border-current px-4 py-2"
            style={{ fontFamily: FF.mono, color: proj.accent }}>View Project →</span>
        </div>
        <div className="absolute bottom-5 left-6 z-10">
          <p className="text-[10px] tracking-[0.32em] uppercase" style={{ fontFamily: FF.mono, color: proj.accent }}>
            {proj.category}
          </p>
        </div>
      </div>
      <div className="flex items-baseline justify-between mb-1.5">
        <h3 className="text-lg text-[#1a2421] group-hover:text-[#4e8a7a] transition-colors duration-200"
          style={{ fontFamily: FF.display }}>{proj.title}</h3>
        <span className="text-[11px] text-[#88aba5] shrink-0 ml-3" style={{ fontFamily: FF.mono }}>{proj.year}</span>
      </div>
      <p className="text-[#4e6868] text-sm leading-relaxed mb-3" style={{ fontFamily: FF.body }}>{proj.description}</p>
      <div className="flex gap-2 flex-wrap">
        {proj.tags.map(tag => (
          <span key={tag} className="text-[10px] tracking-[0.2em] uppercase px-2 py-[3px] border border-black/10 text-[#789a94]"
            style={{ fontFamily: FF.mono }}>{tag}</span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── VIDEO CARD ───────────────────────────────────────────────────────────────

function VideoCard({ vid, index, onOpen }: { vid: (typeof VIDEO_WORKS)[0]; index: number; onOpen: (item: DetailItem) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group cursor-pointer flex gap-5 items-start"
      onClick={() => onOpen(vid)}
    >
      {/* 16:9 thumbnail */}
      <div className="shrink-0 w-[35vw] max-w-[200px] min-w-[100px] aspect-video relative overflow-hidden" style={{ background: vid.bg }}>
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 14px,rgba(26,36,33,0.08) 14px,rgba(26,36,33,0.08) 15px)",
        }} />
        {/* play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-8 h-8 flex items-center justify-center border transition-all duration-200 group-hover:border-opacity-100 group-hover:scale-110"
            style={{ borderColor: vid.accent, borderOpacity: 0.5 }}
          >
            <div className="w-0 h-0 ml-0.5" style={{
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderLeft: `8px solid ${vid.accent}`,
              opacity: 0.7,
            }} />
          </div>
        </div>
        <div className="absolute bottom-1.5 right-2">
          <span className="text-[9px] tracking-[0.1em]" style={{ fontFamily: FF.mono, color: vid.accent, opacity: 0.8 }}>
            {vid.duration}
          </span>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: vid.accent, opacity: 0.6 }} />
      </div>

      {/* info */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[10px] tracking-[0.28em] uppercase mb-1" style={{ fontFamily: FF.mono, color: vid.accent }}>
          {vid.category}
        </p>
        <h3 className="text-base text-[#1a2421] group-hover:text-[#4e8a7a] transition-colors duration-200 mb-1"
          style={{ fontFamily: FF.display }}>{vid.title}</h3>
        <p className="text-[#567070] text-xs leading-relaxed mb-2 line-clamp-2" style={{ fontFamily: FF.body }}>
          {vid.description}
        </p>
        <div className="flex gap-3 text-[10px] text-[#88aba5]" style={{ fontFamily: FF.mono }}>
          <span>{vid.year}</span>
          <span>·</span>
          <span>{vid.client}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── FEATURED CARD (landing page spread) ─────────────────────────────────────

function FeaturedCard({ proj, index, onOpen }: { proj: (typeof PROJECTS)[0]; index: number; onOpen: (item: DetailItem) => void }) {
  const Artwork = PROJECT_ARTWORKS[index % PROJECT_ARTWORKS.length];
  const flip = index % 2 === 1; // alternate image side for rhythm

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group cursor-pointer border-b border-black/[0.07] pb-12 pt-4"
      onClick={() => onOpen(proj)}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-14 items-center ${flip ? "lg:[direction:rtl]" : ""}`}>

        {/* Image panel */}
        <div className={`relative overflow-hidden ${flip ? "[direction:ltr]" : ""}`}
          style={{ aspectRatio: "4/3" }}>
          <Artwork bg={proj.bg} accent={proj.accent} />
          {/* accent top border */}
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: proj.accent, opacity: 0.7 }} />
          {/* index watermark */}
          <span
            className="absolute bottom-3 right-4 leading-none select-none opacity-20 group-hover:opacity-35 transition-opacity duration-300"
            style={{ fontFamily: FF.display, fontSize: "min(8vw, 6rem)", color: proj.accent }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Info panel */}
        <div className={`flex flex-col justify-center gap-5 ${flip ? "[direction:ltr]" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: proj.accent }} />
            <p className="text-[10px] tracking-[0.38em] uppercase" style={{ fontFamily: FF.mono, color: proj.accent }}>
              {proj.category}
            </p>
          </div>

          <h3
            className="text-[#1a2421] group-hover:text-[#4e8a7a] transition-colors duration-200 leading-none"
            style={{ fontFamily: FF.display, fontSize: "clamp(1rem, 4.5vw, 3.2rem)" }}
          >
            {proj.title}
          </h3>

          <p className="text-[#567070] text-base leading-relaxed max-w-[38ch]" style={{ fontFamily: FF.body }}>
            {proj.description}
          </p>

          <div className="flex gap-2 flex-wrap">
            {proj.tags.map(tag => (
              <span key={tag}
                className="text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 border border-black/[0.1] text-[#789a94]"
                style={{ fontFamily: FF.mono }}>
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-1">
            <span className="text-[11px] text-[#88aba5]" style={{ fontFamily: FF.mono }}>{proj.year}</span>
            <span className="text-[#ccc5bc] group-hover:text-[#4e8a7a] group-hover:translate-x-1.5 transition-all duration-250 text-xl leading-none">
              →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── WORK PAGE (LANDING) ───────────────────────────────────────────────────────

function WorkPage({ navigate, onOpen }: { navigate: (p: Page) => void; onOpen: (item: DetailItem) => void }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const sphereScale = useTransform(scrollYProgress, [0, 1], [1, 0.84]);
  const sphereY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const featured = PROJECTS.filter(p => p.featured);

  return (
    <div>
      {/* ── HERO ── */}
      <section ref={heroRef} className="flex items-center pt-24 pb-6 px-6"
        style={{ maxWidth: 1320, margin: "0 auto" }}>
        <motion.div style={{ opacity: heroOpacity }}
          className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-4 items-center">
          <motion.div style={{ y: textY }} className="order-2 lg:order-1 text-center lg:text-left">
            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-[#88aba5] mb-1"
              style={{ fontFamily: FF.mono, fontSize: "clamp(0.65rem, 2vw, 0.85rem)", letterSpacing: "0.3em" }}>
              Hi,
            </motion.p>
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
              className="leading-[0.9] text-[#1a2421]"
              style={{ fontFamily: FF.display, fontSize: "clamp(1.8rem, 10vw, 8.5rem)" }}>
              I'm Regina,
            </motion.h1>
            {/* Subtitle under name */}
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}
              className="text-[#4e8a7a] mt-2 mb-8"
              style={{ fontFamily: FF.display, fontSize: "clamp(0.9rem, 3.5vw, 2rem)" }}>
              your multimedia designer.
            </motion.p>
            {/* Body */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.38 }}
              className="text-[#567070] text-lg leading-relaxed max-w-md mb-4 text-justify lg:text-left mx-auto lg:mx-0"
              style={{ fontFamily: FF.body }}>
              Visual systems, motion narratives, and experiential media — crafted with intention at the edge of design and technology.
            </motion.p>
          </motion.div>
          <motion.div style={{ scale: sphereScale, y: sphereY }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.05 }}>
            <Sphere3D />
          </motion.div>
        </motion.div>
      </section>

      {/* ── SELECTED WORK ── */}
      <section className="pt-10 pb-16 px-6 border-t border-black/[0.07]"
        style={{ maxWidth: 1320, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="flex items-baseline justify-between mb-12">
          <h2 className="text-3xl text-[#1a2421]" style={{ fontFamily: FF.display }}>Selected Work</h2>
          <button onClick={() => navigate("projects")}
            className="text-[11px] tracking-[0.25em] text-[#4e8a7a] uppercase hover:text-[#1a2421] transition-colors duration-200"
            style={{ fontFamily: FF.mono }}>
            All Projects →
          </button>
        </motion.div>
        <div>
          {featured.map((proj, i) => <FeaturedCard key={proj.id} proj={proj} index={i} onOpen={onOpen} />)}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 border-t border-black/[0.07]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10"
          style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <p className="text-[11px] tracking-[0.4em] text-[#88aba5] uppercase mb-3" style={{ fontFamily: FF.mono }}>
              Currently available for work
            </p>
            <h2 className="text-[#1a2421]" style={{ fontFamily: FF.display, fontSize: "clamp(1rem, 5vw, 3.8rem)" }}>
              Let's make something <span className="text-[#4e8a7a]">remarkable.</span>
            </h2>
          </motion.div>
          <motion.button initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1 }}
            onClick={() => navigate("contact")}
            className="shrink-0 px-12 py-4 bg-[#1a2421] text-[#f0f5f3] text-[11px] tracking-[0.28em] uppercase hover:bg-[#4e8a7a] transition-colors duration-200"
            style={{ fontFamily: FF.mono }}>
            Start a Project →
          </motion.button>
        </div>
      </section>
    </div>
  );
}

// ─── PROJECTS PAGE ────────────────────────────────────────────────────────────

function ProjectsPage({ onOpen }: { onOpen: (item: DetailItem) => void }) {
  return (
    <div className="pt-24 pb-24 px-6" style={{ maxWidth: 1320, margin: "0 auto" }}>

      {/* ── Big heading ── */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
        className="mb-16 border-b border-black/[0.07] pb-10">
        <h1 className="leading-none text-[#1a2421] break-words"
          style={{ fontFamily: FF.display, fontSize: "min(10vw, 13rem)", lineHeight: 0.9 }}>
          All Projects.
        </h1>
      </motion.div>

      {/* ── Static / print / design work ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 mb-24">
        {PROJECTS.map((proj, i) => <ProjectCard key={proj.id} proj={proj} index={i} onOpen={onOpen} />)}
      </div>

      {/* ── VIDEO WORKS ── */}
      <div className="border-t border-black/[0.07] pt-16">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="text-[11px] tracking-[0.4em] text-[#4e8a7a] uppercase mb-3" style={{ fontFamily: FF.mono }}>
            Moving Image
          </p>
          <h2 className="text-[#1a2421]"
            style={{ fontFamily: FF.display, fontSize: "clamp(1rem, 5.5vw, 4rem)", lineHeight: 1 }}>
            Video Works
          </h2>
          <p className="text-[#688882] text-sm mt-3 max-w-md leading-relaxed" style={{ fontFamily: FF.body }}>
            Films, motion studies, and audio-visual pieces — from short-form commissions to long-format documentary work.
          </p>
        </motion.div>

        {/* Two-column list — compact but not overwhelming */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {VIDEO_WORKS.map((vid, i) => <VideoCard key={vid.id} vid={vid} index={i} onOpen={onOpen} />)}
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────

function AboutPage() {
  const skills = [
    { cat: "Motion & Film", items: ["After Effects", "Premiere Pro", "DaVinci Resolve", "Cinema 4D"] },
    { cat: "Design", items: ["Figma", "Illustrator", "InDesign", "Photoshop"] },
    { cat: "Interactive", items: ["p5.js", "Three.js", "TouchDesigner", "Processing"] },
    { cat: "Development", items: ["React", "GSAP", "WebGL", "HTML/CSS"] },
  ];
  const timeline = [
    { year: "2025", event: "Senior Motion Designer, Studio FORM, Rotterdam" },
    { year: "2024", event: "Rotterdam Media Art Biennale — PHANTOM TYPE installation" },
    { year: "2023", event: "MA Multimedia Design, Royal Academy of Art (KABK)" },
    { year: "2022", event: "Design Residency, Fabrica Research Centre, Treviso" },
    { year: "2020", event: "BA Fine Arts + Computer Science, Utrecht University" },
  ];

  return (
    <div className="pt-28 pb-24 px-6" style={{ maxWidth: 1320, margin: "0 auto" }}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 mb-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <p className="text-[11px] tracking-[0.45em] text-[#4e8a7a] uppercase mb-4" style={{ fontFamily: FF.mono }}>About</p>
          <h1 className="leading-[0.9] mb-10 text-[#1a2421]"
            style={{ fontFamily: FF.display, fontSize: "clamp(1.4rem, 7vw, 6rem)" }}>
            Multimedia<br />Designer.
          </h1>
          <div className="space-y-5 text-[#567070] text-[1.05rem] leading-[1.75] max-w-[54ch]" style={{ fontFamily: FF.body }}>
            <p>I'm a multimedia designer and creative director working at the intersection of motion, identity, and emerging technology. My practice spans brand systems, audio-visual work, editorial design, and interactive experiences.</p>
            <p>With a background in both fine arts and computer science, I bring technical rigor to creative problems — building systems that are as logical as they are visually expressive.</p>
            <p>Currently based in Rotterdam, working with studios and brands globally. Open to full-time roles and project-based collaborations.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="aspect-[3/4] bg-[#e2eee9] relative overflow-hidden border border-black/[0.07]">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 55% 35%,rgba(78,138,122,0.08) 0%,transparent 65%)" }} />
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle,rgba(26,36,33,0.08) 1px,transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="leading-none tracking-tighter text-[#c0d4d0] select-none"
              style={{ fontFamily: FF.display, fontSize: "min(40vw,160px)" }}>YOU</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-black/[0.07]">
            <p className="text-[10px] tracking-[0.35em] text-[#4e8a7a] uppercase" style={{ fontFamily: FF.mono }}>Available for work</p>
            <p className="text-[11px] text-[#88aba5] mt-1" style={{ fontFamily: FF.mono }}>Rotterdam, NL · Global Remote</p>
          </div>
        </motion.div>
      </div>
      <div className="border-t border-black/[0.07] pt-16 mb-20">
        <p className="text-[11px] tracking-[0.4em] text-[#88aba5] uppercase mb-12" style={{ fontFamily: FF.mono }}>Capabilities</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {skills.map((s, i) => (
            <motion.div key={s.cat} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}>
              <p className="text-[10px] tracking-[0.28em] text-[#4e8a7a] uppercase mb-5" style={{ fontFamily: FF.mono }}>{s.cat}</p>
              <ul className="space-y-2.5">
                {s.items.map(item => <li key={item} className="text-[#567070] text-sm" style={{ fontFamily: FF.body }}>{item}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="border-t border-black/[0.07] pt-16">
        <p className="text-[11px] tracking-[0.4em] text-[#88aba5] uppercase mb-12" style={{ fontFamily: FF.mono }}>Timeline</p>
        {timeline.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
            className="flex gap-8 py-5 border-b border-black/[0.07] group">
            <span className="text-[11px] tracking-[0.2em] text-[#4e8a7a] w-14 shrink-0 pt-0.5" style={{ fontFamily: FF.mono }}>{t.year}</span>
            <span className="text-[#688882] group-hover:text-[#1a2421] transition-colors duration-200 text-sm leading-relaxed" style={{ fontFamily: FF.body }}>{t.event}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="pt-28 pb-24 px-6" style={{ maxWidth: 1320, margin: "0 auto" }}>
      {/* ── info + form ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <p className="text-[11px] tracking-[0.45em] text-[#4e8a7a] uppercase mb-4" style={{ fontFamily: FF.mono }}>Contact</p>
          <h1 className="leading-[0.9] mb-12 text-[#1a2421]"
            style={{ fontFamily: FF.display, fontSize: "clamp(1.4rem, 7vw, 6rem)" }}>
            Let's work<br />together.
          </h1>
          <div className="space-y-8" style={{ fontFamily: FF.body }}>
            <div>
              <p className="text-[10px] tracking-[0.35em] text-[#88aba5] uppercase mb-1.5" style={{ fontFamily: FF.mono }}>Email</p>
              <p className="text-[#1a2421] text-lg">hello@portfolio.work</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.35em] text-[#88aba5] uppercase mb-1.5" style={{ fontFamily: FF.mono }}>Based in</p>
              <p className="text-[#1a2421] text-lg">Rotterdam, Netherlands</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.35em] text-[#88aba5] uppercase mb-3" style={{ fontFamily: FF.mono }}>Elsewhere</p>
              <div className="flex gap-5 flex-wrap">
                {["Behance", "Instagram", "LinkedIn", "Are.na"].map(s => (
                  <button key={s} className="text-[11px] tracking-[0.15em] text-[#789a94] hover:text-[#4e8a7a] transition-colors duration-200"
                    style={{ fontFamily: FF.mono }}>{s} ↗</button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }}>
          {sent ? (
            <div className="h-full flex items-center">
              <div>
                <span className="text-7xl text-[#4e8a7a] block mb-5 leading-none" style={{ fontFamily: FF.display }}>✓</span>
                <p className="text-3xl text-[#1a2421] mb-3" style={{ fontFamily: FF.display }}>Message sent.</p>
                <p className="text-[#789a94] text-sm" style={{ fontFamily: FF.mono }}>I'll get back to you within 48 hours.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-8">
              {[{ id: "name", label: "Name", type: "text", placeholder: "Your name" },
                { id: "email", label: "Email", type: "email", placeholder: "your@email.com" }].map(field => (
                <div key={field.id}>
                  <label className="text-[10px] tracking-[0.35em] text-[#88aba5] uppercase block mb-3" style={{ fontFamily: FF.mono }}>{field.label}</label>
                  <input type={field.type} value={form[field.id as "name" | "email"]}
                    onChange={e => setForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                    placeholder={field.placeholder} required
                    className="w-full bg-transparent border-b border-black/15 focus:border-[#4e8a7a] outline-none py-3 text-[#1a2421] placeholder-[#a2c0ba] transition-colors duration-200 text-base"
                    style={{ fontFamily: FF.body }} />
                </div>
              ))}
              <div>
                <label className="text-[10px] tracking-[0.35em] text-[#88aba5] uppercase block mb-3" style={{ fontFamily: FF.mono }}>Message</label>
                <textarea value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell me about your project..." required rows={5}
                  className="w-full bg-transparent border-b border-black/15 focus:border-[#4e8a7a] outline-none py-3 text-[#1a2421] placeholder-[#a2c0ba] transition-colors duration-200 resize-none text-base"
                  style={{ fontFamily: FF.body }} />
              </div>
              <button type="submit"
                className="w-full py-4 bg-[#1a2421] text-[#f0f5f3] text-[11px] tracking-[0.3em] uppercase hover:bg-[#4e8a7a] transition-colors duration-200"
                style={{ fontFamily: FF.mono }}>
                Send Message →
              </button>
            </form>
          )}
        </motion.div>
      </div>

      {/* ── SCHEDULE A 1:1 ── */}
      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.55 }}>
        {/* OR divider */}
        <div className="relative flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-black/[0.07]" />
          <span
            className="text-[11px] tracking-[0.35em] text-[#88aba5] uppercase shrink-0"
            style={{ fontFamily: FF.mono }}
          >
            or
          </span>
          <div className="flex-1 h-px bg-black/[0.07]" />
        </div>
        <div className="pt-12">
        <div className="mb-10">
          <p className="text-[11px] tracking-[0.45em] text-[#4e8a7a] uppercase mb-3" style={{ fontFamily: FF.mono }}>1-on-1 call</p>
          <h2 className="text-[#1a2421] mb-3" style={{ fontFamily: FF.display, fontSize: "clamp(0.9rem, 4.5vw, 3rem)" }}>
            Schedule a meeting
          </h2>
          <p className="text-[#688882] text-sm leading-relaxed max-w-md" style={{ fontFamily: FF.body }}>
            Book a free 30-minute intro call. Pick a time that works for you — powered by Calendly.
          </p>
        </div>
        <CalendlyEmbed />
        </div>
      </motion.div>
    </div>
  );
}

// ─── ANIMATED MESH BACKGROUND ────────────────────────────────────────────────

function AnimatedBackground() {
  return (
    <>
      <style>{`
        @keyframes drift1 {
          0%,100% { transform: translate(0%,0%) scale(1); }
          30%      { transform: translate(6%,10%) scale(1.06); }
          65%      { transform: translate(-4%,5%) scale(0.96); }
        }
        @keyframes drift2 {
          0%,100% { transform: translate(0%,0%) scale(1); }
          25%      { transform: translate(-7%,-5%) scale(1.09); }
          70%      { transform: translate(5%,8%) scale(0.94); }
        }
        @keyframes drift3 {
          0%,100% { transform: translate(0%,0%) scale(1); }
          40%      { transform: translate(4%,-8%) scale(1.05); }
          80%      { transform: translate(-5%,3%) scale(0.98); }
        }
        @keyframes drift4 {
          0%,100% { transform: translate(0%,0%) scale(1); }
          35%      { transform: translate(-5%,7%) scale(0.95); }
          75%      { transform: translate(7%,-4%) scale(1.07); }
        }
        @keyframes drift5 {
          0%,100% { transform: translate(0%,0%) scale(1) rotate(0deg); }
          50%      { transform: translate(3%,5%) scale(1.04) rotate(8deg); }
        }
      `}</style>

      {/* Fixed backdrop — sits behind all page content */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -10 }}>

        {/* Base colour */}
        <div className="absolute inset-0" style={{ background: "#f0f5f3" }} />

        {/* Vector 11 equivalent — deep green, upper-left */}
        <div style={{
          position: "absolute",
          width: "65%", height: "75%",
          left: "-12%", top: "-8%",
          background: "linear-gradient(334deg, rgba(200,200,200,0.1) 0%, rgba(80,158,60,0.42) 40%, rgba(50,130,40,0.55) 72%, rgba(30,110,20,0.5) 100%)",
          filter: "blur(52px)",
          animation: "drift1 28s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Vector 15 equivalent — salmon/blush, left spine */}
        <div style={{
          position: "absolute",
          width: "55%", height: "90%",
          left: "-5%", top: "8%",
          background: "linear-gradient(337deg, rgba(248,175,168,0.5) 18%, rgba(245,148,138,0.55) 50%, rgba(252,182,170,0.4) 70%, rgba(55,55,55,0.08) 92%)",
          filter: "blur(42px)",
          animation: "drift2 22s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Vector 14 equivalent — mixed green-salmon, centre */}
        <div style={{
          position: "absolute",
          width: "85%", height: "80%",
          left: "8%", top: "18%",
          background: "linear-gradient(23deg, rgba(78,149,45,0.32) 24%, rgba(82,154,54,0.28) 45%, rgba(210,185,140,0.18) 64%, rgba(248,160,155,0.25) 77%, rgba(245,180,210,0.2) 100%)",
          filter: "blur(48px)",
          animation: "drift3 32s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Vector 12 equivalent — warm salmon radial, top-right */}
        <div style={{
          position: "absolute",
          width: "50%", height: "45%",
          right: "-5%", top: "-3%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(252,148,158,0.48) 0%, rgba(252,200,188,0.35) 35%, rgba(252,208,190,0.2) 70%, rgba(65,136,30,0.1) 100%)",
          filter: "blur(55px)",
          animation: "drift4 24s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Vector 13 equivalent — light mist, top-right fill */}
        <div style={{
          position: "absolute",
          width: "48%", height: "55%",
          right: "2%", top: "0%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(240,244,254,0.35) 0%, rgba(235,248,255,0.28) 32%, rgba(225,185,230,0.15) 72%, rgba(180,210,160,0.12) 100%)",
          filter: "blur(55px)",
          animation: "drift5 20s ease-in-out infinite",
          willChange: "transform",
        }} />

        {/* Bottom green anchor — grounds the composition */}
        <div style={{
          position: "absolute",
          width: "75%", height: "45%",
          left: "5%", bottom: "-8%",
          background: "radial-gradient(ellipse at 40% 60%, rgba(72,145,44,0.38) 0%, rgba(95,158,68,0.25) 45%, rgba(180,200,148,0.12) 80%, transparent 100%)",
          filter: "blur(60px)",
          animation: "drift1 35s ease-in-out infinite reverse",
          willChange: "transform",
        }} />

        {/* Subtle global tint overlay to soften and unify */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(143deg, rgba(198,200,200,0.08) 0%, rgba(255,255,255,0.18) 50%, rgba(200,220,200,0.06) 100%)",
          mixBlendMode: "screen",
        }} />
      </div>
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("work");
  const [detail, setDetail] = useState<DetailItem | null>(null);
  const [backTo, setBackTo] = useState<Page>("projects");

  const navigate = (p: Page) => {
    setDetail(null);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDetail = (item: DetailItem, from: Page = page) => {
    setDetail(item);
    setBackTo(from);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeDetail = () => {
    setDetail(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-transparent" style={{ fontFamily: FF.body }}>
      <AnimatedBackground />
      <Nav current={page} onChange={navigate} onOpenDetail={openDetail} />
      <AnimatePresence mode="wait">
        {detail ? (
          <motion.div key={`detail-${detail.title}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease: "easeInOut" }}>
            <ProjectDetailPage
              item={detail}
              onBack={closeDetail}
              backLabel={backTo === "work" ? "Back to Work" : "Back to Projects"}
            />
          </motion.div>
        ) : (
          <motion.main key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease: "easeInOut" }}>
            {page === "work" && <WorkPage navigate={navigate} onOpen={item => openDetail(item, "work")} />}
            {page === "projects" && <ProjectsPage onOpen={item => openDetail(item, "projects")} />}
            {page === "about" && <AboutPage />}
            {page === "contact" && <ContactPage />}
          </motion.main>
        )}
      </AnimatePresence>
      <footer className="border-t border-black/[0.07] py-6 px-6">
        <div className="flex items-center justify-between" style={{ maxWidth: 1320, margin: "0 auto" }}>
          <p className="text-[11px] tracking-[0.22em] text-[#9ebdb8] uppercase" style={{ fontFamily: FF.mono }}>© 2025 Portfolio</p>
          <p className="text-[11px] tracking-[0.22em] text-[#9ebdb8] uppercase" style={{ fontFamily: FF.mono }}>Multimedia Designer · Rotterdam</p>
        </div>
      </footer>
    </div>
  );
}
