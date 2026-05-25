// @ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  TweakColor,
  TweakRadio,
  TweakSection,
  TweakText,
  TweakToggle,
  TweaksPanel,
  useTweaks,
} from './tweaks'
import { sampleTracks } from '../../lib/tracks'
import { extractYouTubeId, useYouTubeMusicPlayer } from '../../lib/useYouTubeMusicPlayer'
import { useGitHubContributions } from '../../lib/useGitHubContributions'
import GitHubActivity from '../components/GitHubActivity'

// ---------- TWEAKS ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "nightdrive",
  "accent": "#ff7a3d",
  "motion": "on",
  "displayName": "Shresth"
}/*EDITMODE-END*/;

// ---------- SCROLL FX ----------
function useScrollReveal(motionOn) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // auto-attach data-reveal to children of .stagger-children
    document.querySelectorAll(".stagger-children").forEach((parent) => {
      [...parent.children].forEach((child, idx) => {
        if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "up");
        if (!child.style.getPropertyValue("--reveal-delay")) {
          child.style.setProperty("--reveal-delay", `${idx * 0.07}s`);
        }
      });
    });
    const nodes = document.querySelectorAll("[data-reveal]");
    if (!motionOn || prefersReduced) {
      nodes.forEach((n) => n.setAttribute("data-revealed", ""));
      return;
    }
    nodes.forEach((n) => n.removeAttribute("data-revealed"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.setAttribute("data-revealed", "");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [motionOn]);
}

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="scroll-progress" style={{ width: `${pct}%` }} />;
}

function WordReveal({ children, delay = 0 }) {
  const words = String(children).split(/(\s+)/);
  return (
    <>
      {words.map((w, i) => /\s+/.test(w) ? w : (
        <span
          key={i}
          className="word"
          data-reveal="word"
          style={{ "--reveal-delay": `${delay + i * 0.04}s` }}
        >
          {w}
        </span>
      ))}
    </>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const motionOn = t.motion === "on";
  const isWhiteTheme = t.theme === "pitlane";

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
  }, [t.theme]);

  useEffect(() => {
    // override accent (orange) via inline CSS var
    document.documentElement.style.setProperty("--accent-override", t.accent);
    // also write to --accent if user picked a custom one
    document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.accent]);

  useScrollReveal(motionOn);

  return (
    <>
      <Nav
        isWhiteTheme={isWhiteTheme}
        onToggleTheme={() => setTweak("theme", isWhiteTheme ? "nightdrive" : "pitlane")}
      />
      <Hero name={t.displayName} />
      <Telemetry />
      <About />
      <Experience />
      <Now />
      <Stack />
      <OffTheClock motion={motionOn} />
      <Contact />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio
            value={t.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[
              { value: "nightdrive", label: "Night Drive" },
              { value: "pitlane",    label: "Pit Lane" },
              { value: "arcade",     label: "Arcade" },
            ]}
          />
        </TweakSection>
        <TweakSection label="Accent">
          <TweakColor
            value={t.accent}
            onChange={(v) => setTweak("accent", v)}
            options={["#ff7a3d", "#c0ff00", "#b794f4", "#ff4d6d", "#3ddc97"]}
          />
        </TweakSection>
        <TweakSection label="Motion">
          <TweakToggle value={t.motion === "on"} onChange={(v) => setTweak("motion", v ? "on" : "off")} label="Animations" />
        </TweakSection>
        <TweakSection label="Display Name">
          <TweakText value={t.displayName} onChange={(v) => setTweak("displayName", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// ---------- NAV ----------
function Nav({ isWhiteTheme, onToggleTheme }) {
  const handleToggle = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      if (!isWhiteTheme) {
        // switching to light: two quick bright ascending tones
        [[880, 0], [1320, 0.06]].forEach(([freq, t]) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.type = 'sine'; osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.13, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.1);
          osc.start(now + t); osc.stop(now + t + 0.1);
        });
      } else {
        // switching to dark: descending tone with quick fade
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);
        gain.gain.setValueAtTime(0.13, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now); osc.stop(now + 0.18);
      }
    } catch (_) {}
    onToggleTheme();
  };
  return (
    <nav className="nav" data-screen-label="Nav">
      <span className="dot"></span>
      <span className="status mono">AVAILABLE / SUMMER '26</span>
      <a href="#about">About</a>
      <a href="#work">Work</a>
      <a href="#now">Now</a>
      <a href="#stack">Stack</a>
      <a href="#off">Off the clock</a>
      <a href="#contact">Contact</a>
      <button
        type="button"
        className={`theme-toggle mono ${isWhiteTheme ? "theme-toggle-on" : "theme-toggle-off"}`}
        onClick={handleToggle}
        aria-label={isWhiteTheme ? "Switch page to black" : "Switch page to white"}
        title={isWhiteTheme ? "Switch page to black" : "Switch page to white"}
      >
        <svg
          className="theme-toggle-bulb"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            className="bulb-glass"
            d="M12 3.5C8.41 3.5 5.5 6.41 5.5 10c0 2.26 1.15 4.25 2.9 5.42.63.42 1.1 1.11 1.19 1.86l.03.22h4.76l.03-.22c.09-.75.56-1.44 1.19-1.86A6.46 6.46 0 0 0 18.5 10c0-3.59-2.91-6.5-6.5-6.5Z"
          />
          <path
            className="bulb-base"
            d="M9.25 18.5h5.5M9.75 20.5h4.5"
          />
        </svg>
      </button>
    </nav>
  );
}

// ---------- HERO ----------
const Highlight = ({ tone = "acid", children }) => (
  <span className={`hl hl-${tone}`}>{children}</span>
);

const Circled = ({ children }) => (
  <span className="circled">
    {children}
    <svg className="scribble-circle" viewBox="0 0 220 60" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M 14 32 Q 8 12, 56 7 Q 130 3, 196 14 Q 212 28, 200 48 Q 130 58, 56 54 Q 6 50, 14 28 L 22 22"
        fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  </span>
);

const Underlined = ({ children }) => (
  <span className="underlined">
    {children}
    <svg className="scribble-underline" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M 3 7 Q 28 1, 56 6 T 110 6 T 168 7 T 198 5"
        fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round"
      />
    </svg>
  </span>
);

const Asterisk = () => (
  <svg className="scribble-asterisk" viewBox="0 0 44 64" aria-hidden="true">
    <path
      d="M 22 8 L 22 56 M 6 16 L 38 48 M 6 48 L 38 16 M 2 32 L 42 32"
      stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" fill="none"
    />
    <text x="48" y="38" fontFamily="Caveat, cursive" fontSize="16" fill="var(--ink-mute)">← this part</text>
  </svg>
);

function Hero({ name }) {
  const { summary } = useGitHubContributions('shresthkapoor7')
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="hero-tag" data-reveal="up">
              <span className="px"></span>
              <span>NYU · COMPUTER SCIENCE · NYC 40.7128° N</span>
            </div>
            <h1 className="hero-title">
              <span data-reveal="up" style={{ "--reveal-delay": "0.05s" }}>{name}, </span><span className="it" data-reveal="up" style={{ "--reveal-delay": "0.15s" }}>building</span><br/>
              <span className="strike" data-reveal="up" style={{ "--reveal-delay": "0.25s" }}>backend</span><br/>
              <span data-reveal="up" style={{ "--reveal-delay": "0.35s" }}>brains for</span><br/>
              <span data-reveal="up" style={{ "--reveal-delay": "0.45s" }}>the </span><span className="it" data-reveal="up" style={{ "--reveal-delay": "0.55s" }}>frontier.</span>
            </h1>
            <p className="hero-sub notebook" data-reveal="up" style={{ "--reveal-delay": "0.55s" }}>
              I'm a CS student at <b>NYU</b> who likes the seam between{" "}
              <Highlight tone="acid">agentic AI</Highlight>,{" "}
              <Circled>infrastructure</Circled>{" "}
              and full-stack craft. Currently turning{" "}
              <Highlight tone="lilac">RAG pipelines</Highlight> and Pydantic-typed
              backends into <Underlined><b>practical applications</b></Underlined>.
              <Asterisk />
            </p>
            <div className="hero-meta" data-reveal="up" style={{ "--reveal-delay": "0.7s" }}>
              <div>STATUS<span>Open to SWE / AI Eng internships '26</span></div>
              <div>BASED<span>New York, NY</span></div>
              <div>
                LAST PUSH
                <span>{summary.label}</span>
              </div>
            </div>
          </div>

          <Collage />
        </div>
      </div>
    </section>
  );
}

function Collage() {
  const collageRef = useRef(null);
  const zRef = useRef(20);
  const bountyAudioRef = useRef(null);
  const s = (i) => ({ "--reveal-delay": `${0.3 + i * 0.08}s` });
  const [selectedId, setSelectedId] = useState(null);
  const [bountyFxActive, setBountyFxActive] = useState(false);
  const [items, setItems] = useState({
    skyline: { top: 30, right: 0, rotation: -6, zIndex: 3, width: 192, dx: 0, dy: 0, scale: 1 },
    telem: { top: 0, left: 20, rotation: 4, zIndex: 2, width: 214, dx: 0, dy: 0, scale: 1 },
    note: { top: 260, left: 0, rotation: -3, zIndex: 2, width: 192, dx: 0, dy: 0, scale: 1 },
    player: { top: 220, right: 10, rotation: 3, zIndex: 5, width: 278, dx: 0, dy: 0, scale: 1 },
    miniTrack: { top: 480, right: 10, rotation: -10, zIndex: 8, width: 234, dx: 0, dy: 0, scale: 1 },
    ping: { top: 440, left: 60, rotation: 5, zIndex: 4, width: 240, dx: 0, dy: 0, scale: 1 },
    bounty: { top: 58, left: 138, rotation: -8, zIndex: 1, width: 162, dx: 0, dy: 0, scale: 1 },
    nyu: { top: 650, left: 40, rotation: 4, zIndex: 5, width: 150, dx: 0, dy: 0, scale: 1 },
    githubCard: { top: 690, left: 80, rotation: 3, zIndex: 4, width: 340, dx: 0, dy: 0, scale: 1 },
  });

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!collageRef.current?.contains(event.target)) {
        setSelectedId(null);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (selectedId !== "bounty") return;

    document.documentElement.classList.remove("site-bounty-bounce");
    document.body.classList.remove("site-bounty-bounce");
    void document.body.offsetWidth;
    document.documentElement.classList.add("site-bounty-bounce");
    document.body.classList.add("site-bounty-bounce");
    setBountyFxActive(false);

    if (!bountyAudioRef.current) {
      bountyAudioRef.current = new Audio("/gear-5-luffy-sounds-made-with-Voicemod.mp3");
      bountyAudioRef.current.preload = "auto";
    }

    try {
      bountyAudioRef.current.currentTime = 0;
      void bountyAudioRef.current.play();
    } catch (_) {}

    const streakTimeout = window.setTimeout(() => {
      setBountyFxActive(true);
    }, 1000);

    const timeout = window.setTimeout(() => {
      document.documentElement.classList.remove("site-bounty-bounce");
      document.body.classList.remove("site-bounty-bounce");
      setBountyFxActive(false);
    }, 3000);

    return () => {
      window.clearTimeout(streakTimeout);
      window.clearTimeout(timeout);
      document.documentElement.classList.remove("site-bounty-bounce");
      document.body.classList.remove("site-bounty-bounce");
      setBountyFxActive(false);
    };
  }, [selectedId]);

  const updateItem = (id, patch) => {
    setItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const selectItem = (id) => {
    zRef.current += 1;
    setSelectedId(id);
    updateItem(id, { zIndex: zRef.current });
  };

  return (
    <>
      {bountyFxActive ? (
        <svg
          className="bounty-streaks-overlay"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* far left — fat slow bolt, 2 wide jags, full height */}
          <g className="bounty-bolt bolt-1">
            <path className="bounty-bolt-outer" pathLength="100" d="M9 0 L18 30 L3 30 L15 65 L1 65 L12 100" />
            <path className="bounty-bolt-inner" pathLength="100" d="M9 0 L18 30 L3 30 L15 65 L1 65 L12 100" />
          </g>
          {/* far right — many tight rapid jags, stops at 72% */}
          <g className="bounty-bolt bolt-2">
            <path className="bounty-bolt-outer" pathLength="100" d="M90 0 L86 11 L93 11 L87 23 L94 23 L88 37 L95 37 L86 52 L93 52 L85 72" />
            <path className="bounty-bolt-inner" pathLength="100" d="M90 0 L86 11 L93 11 L87 23 L94 23 L88 37 L95 37 L86 52 L93 52 L85 72" />
          </g>
          {/* diagonal top-right → bottom-left */}
          <g className="bounty-bolt bolt-3">
            <path className="bounty-bolt-outer" pathLength="100" d="M73 0 L60 24 L76 32 L50 56 L68 66 L40 86 L56 92 L26 100" />
            <path className="bounty-bolt-inner" pathLength="100" d="M73 0 L60 24 L76 32 L50 56 L68 66 L40 86 L56 92 L26 100" />
          </g>
          {/* diagonal top-left → bottom-right */}
          <g className="bounty-bolt bolt-4">
            <path className="bounty-bolt-outer" pathLength="100" d="M24 0 L40 20 L22 30 L50 52 L30 62 L60 82 L38 90 L70 100" />
            <path className="bounty-bolt-inner" pathLength="100" d="M24 0 L40 20 L22 30 L50 52 L30 62 L60 82 L38 90 L70 100" />
          </g>
        </svg>
      ) : null}
      <div className="collage" ref={collageRef}>
      {/* polaroid - skyline */}
      <EditableCollageItem
        id="skyline"
        item={items.skyline}
        isSelected={selectedId === "skyline"}
        onSelect={selectItem}
        onUpdate={updateItem}
        style={s(0)}
      >
      <div className="sticker photo" data-reveal="fade" style={{ width: 192 }}>
        <div className="ph" style={{ height: 150, padding: 0, overflow: "hidden" }}>
          <img
            src="/images/homebase.jpeg"
            alt="Home base"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div className="cap">home base ✶</div>
      </div>
      </EditableCollageItem>

      {/* telem */}
      <EditableCollageItem
        id="telem"
        item={items.telem}
        isSelected={selectedId === "telem"}
        onSelect={selectItem}
        onUpdate={updateItem}
        style={s(1)}
      >
      <div className="sticker telem" data-reveal="fade">
        <div className="row"><span>LAP</span><b>31 / 64</b></div>
        <div className="row" data-hover-note="repos per language"><span>typescript</span><b>9</b></div>
        <div className="row" data-hover-note="repos per language"><span>dart</span><b>9</b></div>
        <div className="row" data-hover-note="repos per language"><span>javascript</span><b>7</b></div>
        <div className="row" data-hover-note="repos per language"><span>python</span><b>6</b></div>
        <div className="barwrap"><div className="bar" style={{ width: "48%" }}></div></div>
        <div className="row" style={{ marginTop: 4 }}><span>RPL</span><b>48%</b></div>
      </div>
      </EditableCollageItem>

      {/* sticky note */}
      <EditableCollageItem
        id="note"
        item={items.note}
        isSelected={selectedId === "note"}
        onSelect={selectItem}
        onUpdate={updateItem}
        style={s(2)}
      >
      <div className="sticker note" data-reveal="fade">
        ship it,<br/>then ship<br/>it again
        <div className="meta">— 3:14 AM</div>
      </div>
      </EditableCollageItem>

      {/* music player */}
      <EditableCollageItem
        id="player"
        item={items.player}
        isSelected={selectedId === "player"}
        onSelect={selectItem}
        onUpdate={updateItem}
        style={s(3)}
      >
        <MusicPlayer />
      </EditableCollageItem>

      {/* mini track preview */}
      <EditableCollageItem
        id="miniTrack"
        item={items.miniTrack}
        isSelected={selectedId === "miniTrack"}
        onSelect={selectItem}
        onUpdate={updateItem}
        style={s(4)}
      >
      <div className="sticker mini-track" data-reveal="fade">
        <div className="mini-track-head">
          <span><span className="live-dot"></span> MONACO GP</span>
          <span>L 47 / 78</span>
        </div>
        <MiniTrack />
        <div className="mini-track-meta">
          <span>BEST 2:23:15.554</span>
          <span>P3 ↑</span>
        </div>
      </div>
      </EditableCollageItem>

      {/* photo - table tennis */}
      <EditableCollageItem
        id="ping"
        item={items.ping}
        isSelected={selectedId === "ping"}
        onSelect={selectItem}
        onUpdate={updateItem}
        style={s(5)}
      >
      <div className="sticker photo" data-reveal="fade" style={{ width: 240 }}>
        <div className="ph" style={{ height: 200, padding: 0, overflow: "hidden" }}>
          <video
            src="/6791ECE0-B477-4211-A639-D8064ECEA786.MP4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div className="cap">basement gym</div>
      </div>
      </EditableCollageItem>

      {/* photo - bounty */}
      <EditableCollageItem
        id="bounty"
        item={items.bounty}
        isSelected={selectedId === "bounty"}
        onSelect={selectItem}
        onUpdate={updateItem}
        style={s(6)}
      >
      <img
        src="/images/bounty.jpg"
        alt="Bounty"
        data-reveal="fade"
        style={{ width: 162, height: "auto", maxHeight: 205, objectFit: "contain", display: "block", borderRadius: 10 }}
      />
      </EditableCollageItem>

      <EditableCollageItem
        id="nyu"
        item={items.nyu}
        isSelected={selectedId === "nyu"}
        onSelect={selectItem}
        onUpdate={updateItem}
        style={s(7)}
      >
      <img
        src="/images/nyu.png"
        alt="NYU"
        data-reveal="fade"
        style={{ width: 150, height: "auto", maxHeight: 174, objectFit: "contain", display: "block", borderRadius: 10 }}
      />
      </EditableCollageItem>

      <EditableCollageItem
        id="githubCard"
        item={items.githubCard}
        isSelected={selectedId === "githubCard"}
        onSelect={selectItem}
        onUpdate={updateItem}
        style={s(8)}
      >
      <div className="sticker github-card" data-reveal="fade">
        <div className="github-card-cap mono">github activity</div>
        <GitHubActivity username="shresthkapoor7" />
      </div>
      </EditableCollageItem>
    </div>
    </>
  );
}

function EditableCollageItem({ id, item, isSelected, onSelect, onUpdate, style, children }) {
  const ref = useRef(null);

  const startDrag = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest("button, a, input")) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(id);
    const startX = event.clientX;
    const startY = event.clientY;
    const startDx = item.dx;
    const startDy = item.dy;

    const onMove = (moveEvent) => {
      onUpdate(id, {
        dx: startDx + (moveEvent.clientX - startX),
        dy: startDy + (moveEvent.clientY - startY),
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const startResize = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(id);

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startDistance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    const startScale = item.scale ?? 1;

    const onMove = (moveEvent) => {
      const nextDistance = Math.hypot(moveEvent.clientX - centerX, moveEvent.clientY - centerY);
      const scaleDelta = startDistance > 0 ? nextDistance / startDistance : 1;
      onUpdate(id, {
        scale: Math.max(0.65, Math.min(1.8, startScale * scaleDelta)),
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const startRotate = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(id);

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
    const startRotation = item.rotation;

    const onMove = (moveEvent) => {
      const nextAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
      onUpdate(id, {
        rotation: startRotation + (nextAngle - startAngle),
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const placement = {
    top: item.top,
    left: item.left,
    right: item.right,
    width: item.width,
    zIndex: item.zIndex,
    transform: `translate(${item.dx}px, ${item.dy}px) rotate(${item.rotation}deg) scale(${item.scale ?? 1})`,
    ...style,
  };

  return (
    <div
      ref={ref}
      className={`collage-editable ${isSelected ? "is-selected" : ""}`}
      style={placement}
      onPointerDown={startDrag}
    >
      {children}
      {isSelected ? (
        <div className="collage-selection" aria-hidden="true">
          <button type="button" className="collage-handle collage-handle-corner top-left" onPointerDown={startResize} aria-label="Resize item"></button>
          <button type="button" className="collage-handle collage-handle-corner top-right" onPointerDown={startResize} aria-label="Resize item"></button>
          <button type="button" className="collage-handle collage-handle-corner bottom-left" onPointerDown={startResize} aria-label="Resize item"></button>
          <button type="button" className="collage-handle collage-handle-corner bottom-right" onPointerDown={startResize} aria-label="Resize item"></button>
          <button type="button" className="collage-handle collage-handle-side mid-top" onPointerDown={startResize} aria-label="Resize item"></button>
          <button type="button" className="collage-handle collage-handle-side mid-left" onPointerDown={startResize} aria-label="Resize item"></button>
          <button type="button" className="collage-handle collage-handle-side mid-right" onPointerDown={startResize} aria-label="Resize item"></button>
          <button type="button" className="collage-handle collage-handle-side mid-bottom" onPointerDown={startResize} aria-label="Resize item"></button>
          <button
            type="button"
            className="collage-rotate-handle"
            onPointerDown={startRotate}
            aria-label="Rotate item"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 11a7 7 0 1 1-2.05-4.95" />
              <path d="M19 4v5h-5" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function MusicPlayer() {
  const {
    tracks,
    currentTrack,
    currentVideoId,
    isPaused,
    currentTime,
    duration,
    progressPercent,
    playerElementId,
    playNextTrack,
    playPreviousTrack,
    seekToPercent,
    togglePlayPause,
  } = useYouTubeMusicPlayer(sampleTracks);

  const fallbackTrack = tracks[0];
  const activeTrack = currentTrack ?? fallbackTrack;
  const videoId = currentVideoId ?? (activeTrack?.youtubeUrl ? extractYouTubeId(activeTrack.youtubeUrl) : null);

  const coverGradients = [
    ["oklch(0.35 0.18 25)", "oklch(0.18 0.10 320)"],
    ["oklch(0.40 0.18 50)", "oklch(0.20 0.08 280)"],
    ["oklch(0.32 0.14 230)", "oklch(0.18 0.06 290)"],
    ["oklch(0.45 0.20 145)", "oklch(0.16 0.06 270)"],
    ["oklch(0.38 0.17 15)", "oklch(0.17 0.09 300)"],
  ];

  const activeIndex = Math.max(0, tracks.findIndex((track) => track.id === activeTrack?.id));
  const activeGradient = coverGradients[activeIndex % coverGradients.length];

  const formatSeconds = (seconds) => {
    const safeSeconds = Math.max(0, Math.floor(seconds || 0));
    const mm = Math.floor(safeSeconds / 60);
    const ss = safeSeconds % 60;
    return `${mm}:${String(ss).padStart(2, "0")}`;
  };

  return (
    <div className="player">
      <div className="player-top">
        <div className="cover" style={{ background: `linear-gradient(135deg, ${activeGradient[0]}, ${activeGradient[1]})` }}>
          {videoId ? <img className="cover-image" src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={activeTrack?.title} /> : null}
          <div className="cover-grain"></div>
          <span className="cover-mark mono">SHR · {String(activeIndex + 1).padStart(2, "0")}</span>
          {!isPaused && currentTrack && (
            <div className="cover-eq">
              <i></i><i></i><i></i>
            </div>
          )}
        </div>
        <div className="player-meta">
          <div className="player-tag mono">▸ NOW PLAYING</div>
          <div className="player-title">{activeTrack?.title || "Tap to play"}</div>
          <div className="player-artist">{activeTrack?.artist || "youtube queue"}</div>
        </div>
      </div>

      <div
        className="player-bar"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          seekToPercent(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
        }}
      >
        <div className="player-bar-fill" style={{ width: `${progressPercent}%` }}>
          <span className="player-bar-thumb"></span>
        </div>
      </div>
      <div className="player-times mono">
        <span>{formatSeconds(currentTime)}</span>
        <span>−{formatSeconds(Math.max(0, duration - currentTime))}</span>
      </div>

      <div className="player-controls">
        <button onClick={playPreviousTrack} aria-label="previous">
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 2v12M14 2 6 8l8 6V2Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round"/></svg>
        </button>
        <button className="play" onClick={togglePlayPause} aria-label={!isPaused && currentTrack ? "pause" : "play"}>
          {!isPaused && currentTrack
            ? <svg viewBox="0 0 16 16" width="14" height="14"><rect x="3" y="2" width="3.5" height="12" fill="currentColor"/><rect x="9.5" y="2" width="3.5" height="12" fill="currentColor"/></svg>
            : <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 2v12l11-6L4 2Z" fill="currentColor"/></svg>
          }
        </button>
        <button onClick={playNextTrack} aria-label="next">
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M12 2v12M2 2l8 6-8 6V2Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round"/></svg>
        </button>
        <div className="player-vol mono">
          <span>♪</span>
          <div className="vol-bars"><i></i><i></i><i></i><i></i><i></i></div>
        </div>
      </div>
      <div id={playerElementId} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}></div>
    </div>
  );
}

function MiniTrack() {
  return (
    <MonacoTrackArt
      className="mini-track-svg monaco-track-art mini-track-art"
      cars={[{ color: "#A00C23", num: "16", dur: "11s" }]}
    />
  );
}

const MONACO_TRACK_PATH = "m352.8 4.1504c-13.81 0.8243-23.48 12.177-34.76 18.75-15.132 10.842-32.937 19.166-44.42 34.236-3.8081 11.918 7.2143 21.834 7.6992 33.469 2.3799 12.877-3.9727 27.691-17.039 31.797-21.608 7.9502-44.019-3.3155-66.164-0.58398-15.249 1.2564-30.576 4.4208-45.71 1.0769-13.872-2.7824-28.009-3.0697-42.061-3.0837-20.279-0.65526-40.401-4.4655-60.107-8.5499-9.8358 3.4808-9.1748 16.051-15.302 23.046-9.2645 14.858-16.918 30.931-19.749 48.338-10.382 42.601-16.335 87.914-5.9935 131.09 2.9845 6.9487-1.9927 16.823 5.5254 21.516 8.5182 5.6162 19.511 4.4647 29.15 4.5723 6.3627-3.221 3.5124-12.152-0.89324-15.875-6.8457-7.1679-11.759-15.961-14.144-25.596-4.1818-13.935-6.0953-29.779-0.05469-43.404 4.8274-5.2939 10.31-10.783 10.423-18.477 2.5399-11.575 5.598-24.511-0.11424-35.558-6.7172-18.477 1.3628-38.363 12.014-53.545 5.3451-6.2228 10.439-14.267 18.566-16.574 12.2-1.5865 24.011 3.4785 36.021 4.8867 20.127 4.04 40.985 5.4105 60.521 11.713 5.4989 3.2393 13.36 5.9094 18.477 0.5171 10.835-5.0042 22.484 1.5092 33.75 0.85938 45.376 3.648 94.373-5.7234 129.19-36.775 23.603-21.125 44.441-46.111 58.145-74.801 3.2737-6.3889 3.6047-17.129-4.7976-19.494-8.795-2.811-18.662-1.7299-27.287 1.0391-6.7679 3.5504-5.7201 12.534-1.7773 17.836 2.2246 4.0916 6.7494 10.278 2.7715 14.559-5.2639 1.897-12.792-1.8673-11.882-8.136-1.2118-9.6578-5.9329-20.115-0.9949-29.337 1.655-3.8575-0.53501-8.6517-4.8828-9.2363 2.5888 1.5696-3.0196-1.1724-4.1191-0.27539z";
const MONACO_SPEED_SEGMENTS = [
  { start: 1, length: 14, className: "speed-fast" },
  { start: 15.5, length: 10, className: "speed-medium" },
  { start: 26.5, length: 13.5, className: "speed-slow" },
  { start: 41.5, length: 10.5, className: "speed-medium" },
  { start: 53, length: 12.5, className: "speed-slow" },
  { start: 66.5, length: 8.5, className: "speed-medium" },
  { start: 76.5, length: 9.5, className: "speed-fast" },
  { start: 87, length: 8, className: "speed-fast" },
  { start: 95.5, length: 4, className: "speed-medium" },
];

function MonacoTrackArt({ className = "", cars = [] }) {
  const pathId = useId().replace(/:/g, "");
  const checkersId = `${pathId}-checkers`;
  return (
    <svg
      className={className}
      viewBox="0 0 411.72235 343.69802"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Monaco circuit layout"
      role="img"
    >
      <defs>
        <path id={pathId} d={MONACO_TRACK_PATH} />
        <pattern id={checkersId} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#fff" />
          <rect width="3" height="3" fill="#111" />
          <rect x="3" y="3" width="3" height="3" fill="#111" />
        </pattern>
      </defs>
      <use href={`#${pathId}`} className="monaco-track-shadow" />
      <path d={MONACO_TRACK_PATH} className="monaco-track-path" pathLength="100" />
      {MONACO_SPEED_SEGMENTS.map((segment, index) => (
        <path
          key={index}
          d={MONACO_TRACK_PATH}
          pathLength="100"
          className={`monaco-speed-segment ${segment.className}`}
          strokeDasharray={`${segment.length} 1000`}
          strokeDashoffset={-segment.start}
        />
      ))}
      <g transform="translate(299 36) rotate(-31)">
        <rect x="-10" y="-4" width="20" height="8" fill={`url(#${checkersId})`} rx="1" />
      </g>
      <g transform="translate(299 36) rotate(-31)">
        <rect x="-33" y="-7" width="66" height="14" className="monaco-pit-lane" rx="2.5" />
      </g>
      {cars.map((car, index) => (
        <MonacoTrackCar
          key={`${car.num}-${index}`}
          pathId={pathId}
          color={car.color}
          num={car.num}
          dur={car.dur}
          delay={car.delay}
        />
      ))}
    </svg>
  );
}

function MonacoTrackCar({ pathId, color, num, dur, delay = "0s" }) {
  return (
    <g className="car">
      <ellipse cx="0" cy="4.4" rx="8.2" ry="2.1" fill="rgba(0,0,0,0.28)" />
      <path
        d="M-8.4 -2.1 H-4.1 L-4.1 -3.4 H1.9 L6.7 0 L1.9 3.4 H-4.1 L-4.1 2.1 H-8.4 Z"
        fill={color}
      />
      <rect x="-2.1" y="-1.95" width="2.2" height="3.9" rx="0.6" fill="rgba(255,255,255,0.92)" />
      <rect x="-8.4" y="-0.7" width="2.1" height="1.4" rx="0.3" fill="rgba(0,0,0,0.26)" />
      <rect x="4.95" y="-0.35" width="1.1" height="0.7" rx="0.2" fill="rgba(0,0,0,0.24)" />
      <text x="-1.1" y="0.9" fontFamily="JetBrains Mono" fontSize="2.5" fill="rgba(0,0,0,0.74)" textAnchor="middle" fontWeight="700">{num}</text>
      <animateMotion dur={dur} begin={delay} repeatCount="indefinite" rotate="auto">
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </g>
  );
}

function PixelSprite() {
  // 8x8 original mascot - just abstract pixel shapes, not branded
  const grid = [
    "..XXXX..",
    ".XOOOOX.",
    "XOAOOAOX",
    "XOOOOOOX",
    "XO-WW-OX",
    ".XOOOOX.",
    "..X..X..",
    ".X....X.",
  ];
  const colorOf = (c) => ({
    "X": "var(--ink)",
    "O": "oklch(0.92 0.10 95)",
    "A": "var(--bg)",
    "W": "var(--accent)",
    "-": "oklch(0.7 0.02 80)",
  }[c] || "transparent");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridAutoRows: "1fr", gap: 1, width: 88, aspectRatio: "1 / 1" }}>
      {grid.flatMap((row, ri) => row.split("").map((c, ci) => (
        <div key={`${ri}-${ci}`} style={{ background: colorOf(c) }}></div>
      )))}
    </div>
  );
}

// ---------- TELEMETRY TICKER ----------
function Telemetry() {
  const items = [
    ["UPTIME", "247d", "↑"],
    ["BUILDING", "AGENTIC RAG", "★"],
    ["TIMEZONE", "EST / UTC-5", ""],
    ["FAV LANG", "PYTHON · TS", ""],
    ["FAV TRACK", "MONACO", "○"],
    ["COFFEE", "DOUBLE ESP", "☕"],
    ["BPM", "92", "♪"],
    ["DEPLOY", "AWS · VERCEL", "↗"],
    ["RUN", "PNPM DEV", "▶"],
  ];
  const ticker = (
    <div className="ticker">
      {[0,1].map((k) => items.map((it, i) => (
        <span key={`${k}-${i}`}>
          <b>{it[0]}</b> {it[1]} <i>{it[2]}</i>
        </span>
      )))}
    </div>
  );
  return <div className="telemetry">{ticker}</div>;
}

// ---------- ABOUT ----------
function About() {
  return (
    <section id="about" data-screen-label="02 About">
      <div className="wrap">
        <div className="sec-head" data-reveal="up">
          <span className="num">02</span>
          <h2>The <span className="it">long</span> version.</h2>
          <span className="right">↳ scroll</span>
        </div>
        <div className="about-grid">
          <div className="about-body">
            <p data-reveal="up">
              I'm <b>Shresth</b>, a computer science student at <b>NYU</b>. Previously a software
              engineer at <span className="accent">TalentTitan</span>, an EdTech startup, where I
              shipped backend and frontend features in <b>Spring Boot, Angular, MySQL and AWS</b>.
            </p>
            <p data-reveal="up" style={{ "--reveal-delay": "0.1s" }}>
              Lately I've been exploring <b>agentic workflows</b> and <b>retrieval-augmented systems</b>
              with React, Next.js and Python — using Pydantic to structure backend logic and AWS to
              deploy. I'm interested in the seam between AI systems, infrastructure and full-stack
              craft, and where they turn into <span className="accent">practical applications</span>.
            </p>
            <p className="serif-it" data-reveal="up" style={{ fontSize: 26, color: "var(--ink)", "--reveal-delay": "0.2s" }}>
              My favorite thing to do on any website is to open the <em>network tab.</em>
            </p>
          </div>
          <aside className="about-side" data-reveal="left" style={{ "--reveal-delay": "0.15s" }}>
            <dl>
              <dt>School</dt><dd>NYU · Computer Science</dd>
              <dt>City</dt><dd>New York, NY</dd>
              <dt>Last role</dt><dd>SWE @ TalentTitan</dd>
              <dt>Stack</dt><dd>Python · TS · Spring · AWS</dd>
              <dt>Fluent in</dt><dd>English, Hindi</dd>
              <dt>Open to</dt><dd>SWE & AI Eng internships</dd>
              <dt>Contact</dt><dd><a href="#contact">say hi →</a></dd>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ---------- EXPERIENCE ----------
function Experience() {
  const rows = [
    {
      when: "Sep 2025 — now",
      role: "Computer Vision Engineer",
      org: "NYU Arc Robotics",
      kind: "Robotics | VIP Program",
      blurb: "Building a real-time vision pipeline on NVIDIA Jetson Orin — YOLOv8 for robot detection with hyperparameter tuning and model quantization for embedded deployment. Also working on an autonomous navigation module with LiDAR-based SLAM and obstacle avoidance. Containerized the full perception stack with uv + Docker for reproducible cross-team experiments.",
      stack: ["YOLOv8", "NVIDIA Jetson", "LiDAR SLAM", "Docker", "PyTorch", "Python"],
    },
    {
      when: "Jul 2023 — Aug 2024",
      role: "Software Engineer",
      org: "TalentTitan",
      kind: "EdTech | Full-time",
      blurb: "Built an agentic workflow for automated content generation — autonomously creating and updating 100+ interview-prep pages daily across 120+ job roles. Diagnosed server bottlenecks and deployed AWS CloudFront CDN, cutting load times by 75–80%. Upgraded legacy Spring/Java services (+25% throughput). Won the SPOT award — given to the top 5% of employees at Bounteous x Accolite.",
      stack: ["Spring Boot", "Angular", "Python", "OpenAI", "AWS", "MySQL"],
    },
    {
      when: "Jan 2023 — Jun 2023",
      role: "Software Engineer Intern",
      org: "TalentTitan",
      kind: "EdTech | Internship",
      blurb: "Built reusable Angular components backed by Spring Boot REST APIs for an internal platform used by 5+ enterprise clients. Resolved cross-browser issues across 6 browsers via LambdaTest for 2000+ active users. Set up automated SonarQube analysis, fixing memory leaks across 10+ microservices before production.",
      stack: ["Angular", "Spring Boot", "REST", "SonarQube", "LambdaTest"],
    },
    {
      when: "Jan 2022 — May 2022",
      role: "Mobile Developer Intern",
      org: "Decoders",
      kind: "Startup | Remote",
      blurb: "Built Pixectra, a gallery-based mobile app from scratch in Flutter — iOS and Android. Led the migration of YourGrocer's mobile codebase to the latest Flutter version. Integrated Facebook and Instagram SDKs for image import. Introduced Riverpod-based architecture, improving feature release speed by 30%.",
      stack: ["Flutter", "Dart", "Riverpod", "iOS", "Android", "Facebook SDK"],
    },
  ];
  return (
    <section id="work" data-screen-label="03 Work">
      <div className="wrap">
        <div className="sec-head" data-reveal="up">
          <span className="num">03</span>
          <h2><span className="it">Where</span> I've shipped.</h2>
          <span className="right">{rows.length} entries</span>
        </div>
        {(() => {
          // group consecutive same-org rows
          const groups: { org: string; entries: typeof rows }[] = [];
          rows.forEach((r) => {
            const last = groups[groups.length - 1];
            if (last && last.org === r.org) last.entries.push(r);
            else groups.push({ org: r.org, entries: [r] });
          });
          let globalIdx = 0;
          return groups.map((group) => (
            <div key={group.org} className={`exp-group ${group.entries.length > 1 ? "exp-group-multi" : ""}`}>
              {group.entries.map((r) => {
                const delay = `${globalIdx++ * 0.08}s`;
                return (
                  <div className="exp" key={r.role} data-reveal="up" style={{ "--reveal-delay": delay }}>
                    <div className="exp-track">
                      <span className="exp-dot" />
                    </div>
                    <div className="when mono">{r.when}</div>
                    <div className="what">
                      <h3>{r.role} <span className="at">@ {r.org}</span></h3>
                      <p>{r.blurb}</p>
                      <div className="stack">{r.stack.map((s) => <span key={s}>{s}</span>)}</div>
                    </div>
                    <div className="where">{r.kind}</div>
                  </div>
                );
              })}
            </div>
          ));
        })()}
      </div>
    </section>
  );
}

// ---------- NOW (currently building) ----------
const NOW_PROJECTS = [
  {
    id: "sediment",
    status: "ACTIVE",
    name: "Sediment",
    tagline: "Agent-powered research lineage explorer",
    short: "Enter any concept or paper — it traces intellectual ancestry back through time, surfacing key papers as an interactive chronological graph.",
    description: "You enter any concept or paper and Sediment traces the intellectual ancestry back through time, surfacing the key papers and breakthroughs that led to it. The result is an interactive chronological graph you can explore and expand node by node.\n\nThe backend is designed so OpenAlex handles all graph traversal and batch hydration of candidate papers. Claude only steps in for the expensive judgment layer — seed selection, lineage ranking, and summaries. This kept costs tight and made the system predictable.\n\nI hand-rolled the canvas in SVG instead of reaching for React Flow, which gave precise control over branching layout. Also built Obsidian-ready markdown export and shareable URLs that persist full graph state via Supabase — no login required.",
    highlights: ["30+ researchers using it — including PhD and Masters students.", "$0.10 in free API credits given to each user daily. <5s end-to-end latency from query to rendered graph.", "Hand-rolled SVG canvas with no React Flow — full control over branching layout.", "Obsidian-ready wikilinked markdown export so the full tree lives in your PKM.", "Shareable URLs persist graph state via Supabase — no login required."],
    stack: ["Next.js", "FastAPI", "Claude", "OpenAlex", "Supabase", "Railway", "Vercel"],
    timeline: "Apr 2026",
    role: "Solo · Full-stack",
    live: "https://sediment-seven.vercel.app/",
    github: null,
  },
  {
    id: "dowsing",
    status: "ACTIVE",
    name: "Dowsing",
    tagline: "LLM-free semantic web navigator in Rust",
    short: "Rust web agent that navigates entirely by cosine similarity — no per-hop LLM calls. ~7s vs ~60s for browser-use, at $0 per query.",
    description: "Dowsing is a web navigation agent that embeds the query once via a local all-MiniLM-L6-v2 ONNX model, then navigates entirely by cosine similarity — no per-hop LLM calls.\n\nIt connects to the user's live Chromium session via CDP for zero-config authenticated access. Navigation uses a parallel beam-search loop with nav-bar decay, peak detection, and dead-end backtracking.\n\nResults come back in ~7s vs ~60s for browser-use, and the per-query cost drops from ~$0.04 (GPT-4o) to $0.",
    highlights: ["~7s vs ~60s for browser-use on the same queries.", "$0 per query vs ~$0.04 with GPT-4o — model runs fully offline via ONNX.", "Zero-config authenticated access via the user's live Chromium session (CDP).", "Parallel beam-search with nav-bar decay, peak detection, and dead-end backtracking."],
    stack: ["Rust", "ONNX Runtime", "CDP", "all-MiniLM-L6-v2", "Chromium"],
    timeline: "Apr 2026",
    role: "Solo · Systems / Rust",
    live: null,
    github: "https://github.com/shresthkapoor7/dowsing",
  },
  {
    id: "blackbox",
    status: "ACTIVE",
    name: "BlackBox RL Agent",
    tagline: "LangGraph + Playwright pentesting framework that hunts vulns autonomously",
    short: "Multi-agent web pentesting with RL. 3rd place at AIE Hackathon NYC (30+ teams).",
    description: "A LangGraph and Playwright powered multi-agent penetration testing framework using Gemini for autonomous web vulnerability discovery. The QA agent navigates real web apps, injects payloads, gets rewarded for finding bugs, and hands off to an exploit planner and attack agent that visually matches targets across page states.",
    highlights: ["RL reward loop: +2.0 for database dump, penalties for stagnation — agent learns to hunt efficiently without human guidance.", "Visual matching: compares live browser screenshot vs reference screenshot to relocate the same vulnerable element across page reloads.", "$10,000 in Gemini API credits awarded. Sponsored by CodeRabbit and DeepMind."],
    stack: ["LangGraph", "Playwright", "Gemini", "Python", "CodeRabbit"],
    timeline: "Mar 2025",
    role: "Hackathon",
    live: null,
    github: "https://github.com/shresthkapoor7/aie-hackathon",
  },
];

function SedimentPreview() {
  return (
    <svg viewBox="0 0 200 120" width="100%" height="100%" style={{ padding: 8 }}>
      <line x1="100" y1="15" x2="60" y2="45" stroke="var(--line)" strokeWidth="1" />
      <line x1="100" y1="15" x2="140" y2="45" stroke="var(--line)" strokeWidth="1" />
      <line x1="60" y1="45" x2="35" y2="80" stroke="var(--line)" strokeWidth="1" />
      <line x1="60" y1="45" x2="85" y2="80" stroke="var(--line)" strokeWidth="1" />
      <line x1="140" y1="45" x2="115" y2="80" stroke="var(--line)" strokeWidth="1" />
      <line x1="140" y1="45" x2="165" y2="80" stroke="var(--line)" strokeWidth="1" />
      <circle cx="100" cy="15" r="7" fill="var(--accent)" />
      <circle cx="60" cy="45" r="5.5" fill="var(--lilac)" />
      <circle cx="140" cy="45" r="5.5" fill="var(--lilac)" />
      <circle cx="35" cy="80" r="4" fill="var(--card)" stroke="var(--line)" strokeWidth="1" />
      <circle cx="85" cy="80" r="4" fill="var(--card)" stroke="var(--line)" strokeWidth="1" />
      <circle cx="115" cy="80" r="4" fill="var(--acid)" />
      <circle cx="165" cy="80" r="4" fill="var(--card)" stroke="var(--line)" strokeWidth="1" />
      <text x="100" y="110" fontFamily="JetBrains Mono" fontSize="7" fill="var(--ink-dim)" textAnchor="middle">research lineage graph</text>
    </svg>
  );
}

function DowsingPreview() {
  return (
    <div className="mono" style={{ fontSize: 9.5, color: "var(--ink-mute)", padding: "10px 14px", lineHeight: 1.7 }}>
      <div style={{ color: "var(--ink-dim)" }}>$ dowsing query "anthropic claude architecture"</div>
      <div style={{ marginTop: 4 }}>embed <span style={{ color: "var(--lilac)" }}>once</span> → navigate by <span style={{ color: "var(--acid)" }}>cosine</span></div>
      <div style={{ marginLeft: 8, borderLeft: "1px solid var(--line)", paddingLeft: 10, marginTop: 4 }}>
        <div>beam[0] sim=<span style={{ color: "var(--acid)" }}>0.91</span> ✓</div>
        <div>beam[1] sim=<span style={{ color: "var(--acid)" }}>0.84</span> ✓</div>
        <div>beam[2] sim=<span style={{ color: "var(--ink-dim)" }}>0.31</span> ✗ backtrack</div>
      </div>
      <div style={{ marginTop: 6, color: "var(--accent)" }}>done in 6.8s · $0.00</div>
    </div>
  );
}

function BlackBoxPreview() {
  const rows = [
    { label: "STEP 3", action: "fill_input", detail: "' OR '1'='1' --", hi: false },
    { label: "REWARD", action: "+1.0", detail: "SQL injection detected", hi: true },
    { label: "STEP 4", action: "press_enter", detail: "submitting payload…", hi: false },
    { label: "REWARD", action: "+1.5", detail: "query executed /users", hi: true },
    { label: "STEP 5", action: "analyze", detail: "3 rows dumped ██████", hi: "acid" },
    { label: "REWARD", action: "+2.0", detail: "MISSION COMPLETE", hi: "acid" },
  ];
  return (
    <div style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 8, lineHeight: 1.65, height: "100%", overflow: "hidden" }}>
      <div style={{ color: "var(--acid)", marginBottom: 6, fontSize: 7.5, letterSpacing: "0.08em" }}>▲ SECGYM — SCANNING strandschat.com</div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 6, opacity: i === rows.length - 1 ? 1 : 0.75 }}>
          <span style={{ color: "var(--ink-mute)", width: 36, flexShrink: 0 }}>{r.label}</span>
          <span style={{ color: r.hi === "acid" ? "var(--acid)" : r.hi ? "var(--accent)" : "var(--ink-dim)", width: 80, flexShrink: 0 }}>{r.action}</span>
          <span style={{ color: "var(--ink-mute)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.detail}</span>
        </div>
      ))}
    </div>
  );
}

function ProjectPanel({ project, onClose }) {
  const [closing, setClosing] = useState(false);
  const previews = { sediment: <SedimentPreview />, dowsing: <DowsingPreview />, blackbox: <BlackBoxPreview /> };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  return (
    <>
      <div className={`proj-panel-backdrop ${closing ? "proj-panel-backdrop-out" : ""}`} onClick={handleClose} />
      <aside className={`proj-panel ${closing ? "proj-panel-closing" : ""}`}>
        <button
          className={`proj-panel-close ${closing ? "spinning" : ""}`}
          onClick={handleClose}
          aria-label="Close"
        >×</button>

        <div className="proj-panel-body">
          <div className={`proj-panel-status mono ${project.status === "ACTIVE" ? "status-active" : "status-cooking"}`}>
            {project.status === "ACTIVE" ? "▲ ACTIVE" : "○ COOKING"}
          </div>
          <h2 className="proj-panel-title">{project.name}</h2>

          <div className="proj-panel-preview-wrap">
            {previews[project.id]}
          </div>

          <p className="proj-panel-desc-short">{project.short}</p>

          <div className="proj-panel-grid2">
            <div>
              <div className="proj-section-label mono">TIMELINE</div>
              <div className="proj-grid2-val">{project.timeline}</div>
            </div>
            <div>
              <div className="proj-section-label mono">ROLE</div>
              <div className="proj-grid2-val">{project.role}</div>
            </div>
          </div>

          <div className="proj-section">
            <div className="proj-section-label mono">STACK</div>
            <div className="proj-pills">
              {project.stack.map((s) => (
                <span key={s} className="proj-pill">
                  <span className="proj-pill-dot" />
                  {s}
                </span>
              ))}
            </div>
          </div>

          {project.highlights.length > 0 && (
            <div className="proj-section">
              <div className="proj-section-label mono">WHAT'S INSIDE</div>
              <ul className="proj-inside">
                {project.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
          )}

          {(project.live || project.github) && (
            <div className="proj-section">
              <div className="proj-section-label mono">LINKS</div>
              <div className="proj-links-rows">
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="proj-link-row">
                    <span className="proj-link-label mono">LIVE</span>
                    <span className="proj-link-url mono">{project.live.replace("https://", "")}</span>
                    <span className="proj-link-arrow">↗</span>
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="proj-link-row">
                    <span className="proj-link-label mono">GITHUB</span>
                    <span className="proj-link-url mono">{project.github.replace("https://github.com/", "")}</span>
                    <span className="proj-link-arrow">↗</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function Now() {
  const [openId, setOpenId] = useState(null);
  const openProject = NOW_PROJECTS.find((p) => p.id === openId) ?? null;
  const previews = { sediment: <SedimentPreview />, dowsing: <DowsingPreview />, blackbox: <BlackBoxPreview /> };

  const playOpenSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (_) {}
  };

  return (
    <section id="now" data-screen-label="04 Now">
      <div className="wrap">
        <div className="sec-head" data-reveal="up">
          <span className="num">04</span>
          <h2>Currently <span className="it">building.</span></h2>
          <span className="right">2 active · 1 cooking</span>
        </div>
        <div className="now-grid">
          {NOW_PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className={`now-card now-card-clickable ${p.status === "COOKING" ? "now-card-cooking" : ""}`}
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 0.1}s` }}
              onClick={() => { playOpenSound(); setOpenId(p.id); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") { playOpenSound(); setOpenId(p.id); } }}
            >
              <div className="tag">{p.status === "ACTIVE" ? "▲ ACTIVE" : "○ COOKING"}</div>
              <h3>{p.name}</h3>
              <p>{p.short}</p>
              <div className="preview">{previews[p.id]}</div>
              <div className="now-card-open mono">open ↗</div>
            </article>
          ))}
        </div>
      </div>
      {openProject && <ProjectPanel project={openProject} onClose={() => setOpenId(null)} />}
    </section>
  );
}

// ---------- STACK (fighter select) ----------
const FIGHTERS = [
  // STRIKER — core languages
  { id: "py", name: "Python",            glyph: "PY", cls: "STRIKER",  color: "accent", years: 4, projects: 18, sig: "fast.iter()" },
  { id: "ts", name: "TypeScript",        glyph: "TS", cls: "STRIKER",  color: "accent", years: 3, projects: 14, sig: "type.guard" },
  { id: "js", name: "JavaScript",        glyph: "JS", cls: "STRIKER",  color: "accent", years: 4, projects: 16, sig: "event.loop" },
  { id: "ja", name: "Java",              glyph: "JA", cls: "STRIKER",  color: "accent", years: 3, projects: 8,  sig: "old.faithful" },
  { id: "sq", name: "SQL",               glyph: "SQ", cls: "STRIKER",  color: "accent", years: 4, projects: 22, sig: "JOIN.combo" },
  { id: "sh", name: "Bash",              glyph: "SH", cls: "STRIKER",  color: "accent", years: 5, projects: 30, sig: "one.liner" },
  // MAGE — frontend / web
  { id: "re", name: "React",             glyph: "RE", cls: "MAGE",     color: "lilac",  years: 3, projects: 12, sig: "useReality" },
  { id: "nx", name: "Next.js",           glyph: "NX", cls: "MAGE",     color: "lilac",  years: 2, projects: 7,  sig: "edge.render" },
  { id: "ng", name: "Angular",           glyph: "NG", cls: "MAGE",     color: "lilac",  years: 2, projects: 5,  sig: "RxJS chain" },
  // TANK — backend frameworks
  { id: "fa", name: "FastAPI",           glyph: "FA", cls: "TANK",     color: "accent", years: 2, projects: 9,  sig: "pydantic.shield" },
  { id: "sb", name: "Spring Boot",       glyph: "SB", cls: "TANK",     color: "accent", years: 2, projects: 6,  sig: "@RestController" },
  { id: "pd", name: "Pydantic",          glyph: "PD", cls: "TANK",     color: "accent", years: 2, projects: 11, sig: "type.lock" },
  { id: "rs", name: "REST",              glyph: "RS", cls: "TANK",     color: "accent", years: 4, projects: 20, sig: "verb.master" },
  // SUMMONER — AI / ML / GenAI
  { id: "lc", name: "LangChain",         glyph: "LC", cls: "SUMMONER", color: "acid",   years: 1, projects: 5,  sig: "chain.link" },
  { id: "ag", name: "LLM Agents",        glyph: "AG", cls: "SUMMONER", color: "acid",   years: 1, projects: 6,  sig: "tool.call" },
  { id: "ra", name: "RAG",               glyph: "RA", cls: "SUMMONER", color: "acid",   years: 1, projects: 5,  sig: "retrieve.aug" },
  { id: "vc", name: "Vector DBs",        glyph: "VC", cls: "SUMMONER", color: "acid",   years: 1, projects: 4,  sig: "cosine.strike" },
  { id: "ll", name: "OpenAI / Anthropic",glyph: "LL", cls: "SUMMONER", color: "acid",   years: 2, projects: 9,  sig: "prompt.craft" },
  { id: "pt", name: "PyTorch",           glyph: "PT", cls: "SUMMONER", color: "acid",   years: 2, projects: 6,  sig: "grad.descent" },
  { id: "cv", name: "OpenCV",            glyph: "CV", cls: "SUMMONER", color: "acid",   years: 2, projects: 4,  sig: "pixel.vision" },
  // ENGINEER — infra / devops
  { id: "aw", name: "AWS",               glyph: "AW", cls: "ENGINEER", color: "lilac",  years: 3, projects: 14, sig: "deploy.always" },
  { id: "dk", name: "Docker",            glyph: "DK", cls: "ENGINEER", color: "lilac",  years: 3, projects: 16, sig: "containerize" },
  { id: "rd", name: "Redis",             glyph: "RD", cls: "ENGINEER", color: "lilac",  years: 1, projects: 4,  sig: "cache.king" },
  { id: "gt", name: "Git",               glyph: "GT", cls: "ENGINEER", color: "lilac",  years: 5, projects: 99, sig: "rebase.fearless" },
];

function powerOf(f) { return Math.min(99, 40 + f.years * 8 + Math.min(40, f.projects * 1.4)); }

function FighterPortrait({ glyph, colorVar }) {
  const seed = (glyph.charCodeAt(0) * 31 + glyph.charCodeAt(1)) >>> 0;
  let s = seed;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
  const cells = [];
  for (let y = 0; y < 8; y++) {
    const row = [];
    for (let x = 0; x < 4; x++) {
      const r = rand();
      row.push(r > 0.55 ? (r > 0.85 ? 2 : 1) : 0);
    }
    cells.push([...row, ...row.slice().reverse()]);
  }
  return (
    <div className="ppx">
      {cells.flatMap((row, y) => row.map((v, x) => (
        <span key={`${x}-${y}`} data-v={v} />
      )))}
      <span className="ppx-glyph mono" style={{ color: `var(${colorVar})` }}>{glyph}</span>
    </div>
  );
}

function PixelFighter({ glyph, colorVar }) {
  // 12×19 humanoid fighter — SVG so it scales to fill available space
  const GRID = [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,2,2,2,2,1,0,0,0],
    [0,0,0,1,3,2,2,3,1,0,0,0],
    [0,0,0,1,2,2,2,2,1,0,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,1,1,2,2,2,2,1,1,0,0],
    [0,1,2,1,2,2,2,2,1,2,1,0],
    [1,2,2,0,1,2,2,1,0,2,2,1],
    [1,3,3,0,1,2,2,1,0,3,3,1],
    [0,1,1,0,1,2,2,1,0,1,1,0],
    [0,0,0,1,2,2,2,2,1,0,0,0],
    [0,0,0,1,4,4,4,4,1,0,0,0],
    [0,0,0,1,2,0,0,2,1,0,0,0],
    [0,0,0,1,2,0,0,2,1,0,0,0],
    [0,0,0,1,2,0,0,2,1,0,0,0],
    [0,0,0,1,2,0,0,2,1,0,0,0],
    [0,0,0,1,1,0,0,1,1,0,0,0],
    [0,0,1,2,2,0,0,2,2,1,0,0],
    [0,0,1,1,1,0,0,1,1,1,0,0],
  ];
  const colorOf = (v) => {
    if (v === 1) return 'rgba(0,0,0,0.82)';
    if (v === 2) return `var(${colorVar})`;
    if (v === 3) return 'oklch(0.78 0.07 55)';
    if (v === 4) return 'oklch(0.20 0.06 40)';
    return 'none';
  };
  return (
    <svg
      viewBox="0 0 12 19"
      style={{ width: '100%', height: '100%', display: 'block' }}
      shapeRendering="crispEdges"
    >
      {GRID.flatMap((row, y) => row.map((v, x) =>
        v === 0 ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={colorOf(v)} />
      ))}
      {/* glyph centered on chest (cols 4-7, rows 7-9 → x=6, y=8.3) */}
      <text
        x={6} y={8.5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily='"JetBrains Mono", monospace'
        fontWeight="800"
        fontSize="1.5"
        fill="rgba(0,0,0,0.88)"
        letterSpacing="-0.08"
      >
        {glyph}
      </text>
    </svg>
  );
}

function FighterPanel({ f }) {
  if (!f) return null;
  const power = Math.round(powerOf(f));
  const speed = Math.min(99, 50 + (f.name.length % 5) * 9 + f.years * 3);
  const range = Math.min(99, 35 + f.projects * 2);
  const exp   = Math.min(99, 30 + f.years * 12);
  const stats = [
    { k: "POWER", v: power },
    { k: "SPEED", v: speed },
    { k: "RANGE", v: range },
    { k: "EXP",   v: exp },
  ];
  const colorVar = f.color === "accent" ? "--accent" : `--${f.color}`;
  return (
    <div className="fpanel">
      <div className="fpanel-head">
        <span className={`fpanel-class fpanel-class-${f.color}`}>{f.cls}</span>
        <span className="fpanel-id mono">#{String(FIGHTERS.indexOf(f) + 1).padStart(2, "0")}/{FIGHTERS.length}</span>
      </div>
      <div className="fpanel-name">
        <FighterPortrait glyph={f.glyph} colorVar={colorVar} />
        <div>
          <div className="fpanel-display">{f.name}</div>
          <div className="mono fpanel-sub">SIG · <span style={{ color: `var(${colorVar})` }}>{f.sig}</span></div>
        </div>
      </div>
      <div className="fpanel-stats">
        {stats.map((st) => (
          <div className="fstat" key={st.k}>
            <span className="fstat-k mono">{st.k}</span>
            <div className="fstat-bar">
              {Array.from({ length: 20 }).map((_, i) => (
                <span key={i} className={`fstat-px ${i < Math.floor(st.v / 5) ? "lit" : ""}`} />
              ))}
            </div>
            <span className="fstat-v mono">{st.v}</span>
          </div>
        ))}
      </div>
      <div className="fpanel-foot mono">
        <span>YEARS · {f.years}</span>
        <span>PROJECTS · {f.projects}</span>
        <span className="fpanel-ready">READY ▶</span>
      </div>
      <div className="fpanel-fighter-wrap">
        <PixelFighter glyph={f.glyph} colorVar={colorVar} />
      </div>
    </div>
  );
}

function Stack() {
  const [selectedId, setSelectedId] = useState("py");
  const [hoverId, setHoverId] = useState(null);
  const active = FIGHTERS.find((f) => f.id === (hoverId || selectedId));
  const playSelectSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      // two-step rising blip: classic arcade fighter select
      const tones = [{ f: 320, t: 0 }, { f: 640, t: 0.07 }, { f: 960, t: 0.13 }];
      tones.forEach(({ f, t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0.12, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.09);
        osc.start(now + t);
        osc.stop(now + t + 0.09);
      });
    } catch (_) {}
  };

  return (
    <section id="stack" data-screen-label="05 Stack">
      <div className="wrap">
        <div className="sec-head" data-reveal="up">
          <span className="num">05</span>
          <h2>Select your <span className="it">fighter.</span></h2>
          <span className="right">{FIGHTERS.length} on roster</span>
        </div>

        <div className="cab" data-reveal="up">
          <div className="cab-bezel">
            <div className="cab-header">
              <div className="cab-title">
                <span className="cab-coin">★</span>
                <span className="mono">SHRESTH.EXE · PLAYER 1 · ROSTER</span>
                <span className="cab-credits mono">CREDITS: 99</span>
              </div>
              <div className="cab-marquee">
                <span className="cab-marquee-text">FIGHTER · ★ · CHOOSE WISELY · ★ · ROUND 1 · FIGHT! · ★ · SELECT YOUR FIGHTER · ★ · CHOOSE WISELY · ★ · ROUND 1 · FIGHT! · ★ · </span>
                <span className="cab-marquee-text">FIGHTER · ★ · CHOOSE WISELY · ★ · ROUND 1 · FIGHT! · ★ · SELECT YOUR FIGHTER · ★ · CHOOSE WISELY · ★ · ROUND 1 · FIGHT! · ★ · </span>
              </div>
            </div>

            <div className="cab-body">
              <div className="cab-roster">
                {FIGHTERS.map((f, i) => {
                  const isActive = (hoverId || selectedId) === f.id;
                  const isSelected = selectedId === f.id;
                  const colorVar = f.color === "accent" ? "--accent" : `--${f.color}`;
                  return (
                    <button
                      key={f.id}
                      className={`fcard color-${f.color} ${isActive ? "is-active" : ""} ${isSelected ? "is-selected" : ""}`}
                      onMouseEnter={() => setHoverId(f.id)}
                      onMouseLeave={() => setHoverId(null)}
                      onFocus={() => setHoverId(f.id)}
                      onBlur={() => setHoverId(null)}
                      onClick={() => { setSelectedId(f.id); playSelectSound(); }}
                      style={{ "--card-i": i }}
                      aria-label={f.name}
                    >
                      <FighterPortrait glyph={f.glyph} colorVar={colorVar} />
                      <span className="fcard-name mono">{f.name}</span>
                      {isSelected && <span className="fcard-p1 mono">P1</span>}
                    </button>
                  );
                })}
              </div>

              <FighterPanel f={active} />
            </div>

            <div className="cab-footer mono">
              <span>↑↓←→ navigate</span>
              <span>[A] select</span>
              <span>[B] back</span>
              <span className="cab-status">HIGH SCORE · 1,337,420</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- OFF THE CLOCK ----------
const TILE_BLOGS = {
  racing: {
    label: "FILE.01 — open-wheel obsession",
    title: <>Lights out, <span className="it">lap after lap.</span></>,
    body: [
      "I got into F1 properly during the 2020 season — the one that kept getting reshuffled because of COVID. By the time the season actually ran, I was deep enough to care about tyre deg and undercut windows. That's how it gets you.",
      "Monaco 2024 was the one. Leclerc finally winning his home race after years of heartbreaks — the 2021 mechanical, the 2022 pole that turned into nothing. When he crossed the line I genuinely couldn't sit still. There's something about a driver winning the race they were born to win.",
      "What I actually love about F1 is that it's a systems problem with a human at the center. The car, the strategy, the driver, the weather — all of it has to align perfectly. A tenth of a second in qualifying can change the whole weekend. That overlap between engineering precision and split-second human decisions is endlessly interesting to me.",
      "Current wall of shame: I've watched every Monaco race since 1984 on YouTube. I regret nothing.",
    ],
  },
  manga: {
    label: "FILE.02 — long-form storytelling",
    title: <>Adventure arcs, <span className="it">printed weekly.</span></>,
    body: [
      "One Piece is the only piece of fiction I've engaged with consistently for years. It's absurd that a story about pirates looking for treasure has turned into one of the most layered explorations of freedom, power, and what it means to choose your crew.",
      "What Oda does that no one else does: he plants seeds 400 chapters before they pay off. The Nika mythology was foreshadowed so early that going back and finding the breadcrumbs feels like a second read of a completely different story. That kind of craft takes a specific kind of patience and vision.",
      "I don't read manga the way I watch YouTube — passively. A new chapter is something I actually sit down for. The pacing of weekly releases also forces a different relationship with the story: you live with the cliffhangers, you speculate, you get the theory wrong and enjoy being wrong.",
      "Current chapter: 1104+. Current theory: probably wrong, but confidently held.",
    ],
  },
  music: {
    label: "FILE.03 — heavy rotation",
    title: <>Late-night, <span className="it">low-end.</span></>,
    body: [
      "My coding playlist has drifted a long way from lo-fi beats. These days it's more likely to be something with a slow build and no vocals — the kind of music that fills a room without demanding attention.",
      "There's a window between 11pm and 2am where something about the silence and the low-end frequency of the right track makes me genuinely more focused. I don't fully understand why it works. I've stopped trying to explain it.",
      "I keep a rotating queue of tracks that have made it through a full deep-work session without breaking flow. That's the only curation criteria. If I had to skip it, it's out.",
    ],
  },
  arcade: {
    label: "FILE.04 — quarter-eaters",
    title: <>2-player, <span className="it">no continues.</span></>,
    body: [
      "Fighting games taught me more about feedback loops than most programming tutorials. You lose, you identify the exact moment you lost, you adjust. The game doesn't care about your feelings. It just runs the simulation.",
      "There's a specific kind of focus that only happens when someone is sitting next to you at the same screen. No lag, no excuses, no disconnect — just two people and a game that doesn't lie about who's better today.",
      "The cabinet design era of arcade games was peak industrial design. Every element had to justify its existence. The button placement, the joystick weight, the bezel art — all of it was functional and intentional in a way that modern controllers just aren't.",
    ],
  },
  pingpong: {
    label: "FILE.05 — basement sport",
    title: <>Spin, <span className="it">smash.</span></>,
    body: [
      "The basement ping pong table is the most egalitarian piece of equipment in any building. Everyone thinks they're better than they are until the first rally goes long and the topspin kicks in.",
      "I play with too much wrist. My backhand is embarrassingly better than my forehand. I've been told my serve is 'technically illegal' at least twice. I choose to view all of this as character.",
      "What I like about ping pong is that it rewards feel over strength. You can beat someone twice your size with placement and spin. That's a principle I try to apply to writing software too — precision beats brute force most of the time.",
    ],
  },
  nyc: {
    label: "FILE.06 — current cell",
    title: <>New York, <span className="it">all of it.</span></>,
    body: [
      "I ended up in New York because NYU was the right school, and I've stayed because the city makes a compelling case for itself every week. Not always in the ways you expect.",
      "Washington Square at 10pm on a weekday is one of my favorite places to exist. There's always something happening — chess, music, someone arguing passionately about something — and none of it requires you to participate.",
      "The subway is a feature, not a bug. I've had more interesting 20-minute interactions on the A train than in most planned social settings. The city compresses people together in a way that generates a specific kind of energy I haven't found anywhere else.",
      "Current favorite spot to ship code: a corner seat somewhere near the park, one espresso, noise-cancelling headphones. The ambient chaos is useful.",
    ],
  },
  shuffle: {
    label: "FILE.07 — moodboards as nutrition",
    title: <>Collage <span className="it">brain.</span></>,
    body: [
      "I build moodboards the way some people take notes. It's not about making something pretty — it's about figuring out what I actually think about a problem by seeing how images and colors respond to each other.",
      "A good moodboard for a project tells me the emotional target before I know what the UI looks like. The typography decisions come later. The feeling has to be right first.",
      "I've found that the visual instincts you develop from looking at a lot of design work bleed into code decisions. The same sense that tells you a layout is off will tell you an abstraction is slightly wrong. It's the same muscle.",
    ],
  },
};

function TileBlogOverlay({ id, tileContent, onClose }) {
  const [closing, setClosing] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const blog = TILE_BLOGS[id];

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setSpinning(true);
    setClosing(true);
    setTimeout(onClose, 280);
  };

  return (
    <div className={`tile-blog-overlay ${closing ? "tile-blog-closing" : ""}`}>
      <button className={`tile-blog-close${spinning ? " spinning" : ""}`} onClick={handleClose} aria-label="Close">×</button>
      <div className="tile-blog-inner">
        <div className="tile-blog-header">
          <div className="label mono">{blog.label}</div>
          <h2 className="tile-blog-title">{blog.title}</h2>
        </div>
        <div className="tile-blog-preview">
          <div className="tile-blog-preview-inner">{tileContent}</div>
        </div>
        <div className="tile-blog-body">
          {blog.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </div>
  );
}

function OffTheClock({ motion }) {
  const [openTile, setOpenTile] = useState(null);

  const tiles = [
    { id: "racing",   el: <TileRacing /> },
    { id: "manga",    el: <TileManga /> },
    { id: "music",    el: <TileMusic motion={motion} /> },
    { id: "arcade",   el: <TileArcade /> },
    { id: "pingpong", el: <TilePingPong motion={motion} /> },
    { id: "nyc",      el: <TileNYC /> },
    { id: "shuffle",  el: <TileShuffle /> },
  ];

  return (
    <section id="off" data-screen-label="06 Off the clock">
      <div className="wrap">
        <div className="sec-head" data-reveal="up">
          <span className="num">06</span>
          <h2>Off the <span className="it">clock.</span></h2>
          <span className="right">a small museum</span>
        </div>
        <div className="off-grid stagger-children">
          {tiles.map((t) => (
            <div
              key={t.id}
              className="tile-clickable-wrap"
              onClick={() => setOpenTile(t.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setOpenTile(t.id)}
            >
              {t.el}
            </div>
          ))}
        </div>
      </div>
      {openTile && (
        <TileBlogOverlay
          id={openTile}
          tileContent={tiles.find((t) => t.id === openTile)?.el}
          onClose={() => setOpenTile(null)}
        />
      )}
    </section>
  );
}

function TileRacing() {
  const laps = [
    { n: 51, t: "1:21.402", pct: 64 },
    { n: 52, t: "1:20.991", pct: 68 },
    { n: 53, t: "1:20.108", pct: 76, best: true },
    { n: 54, t: "1:21.553", pct: 60 },
    { n: 55, t: "1:21.014", pct: 67 },
  ];
  return (
    <div className="tile racing">
      <div className="label">FILE.01 — open-wheel obsession</div>
      <div className="name">Lights out, <span className="it">lap after lap.</span></div>
      <div className="lapchart">
        {laps.map((l) => (
          <div className={`lap ${l.best ? "best" : ""}`} key={l.n}>
            <span className="num">L{l.n}</span>
            <div className="bar"><i style={{ width: `${l.pct}%` }}></i></div>
            <span className="t">{l.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TileManga() {
  return (
    <div className="tile manga">
      <div className="label">FILE.02 — long-form storytelling</div>
      <div className="name">Adventure arcs, <span className="it">printed weekly.</span></div>
      <div className="panels">
        <div className="panel sun">
          <span className="pcap">CH. 1104</span>
          <img src="/images/one_piece.jpeg" alt="" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
        </div>
        <div className="panel speed">
          <span className="pcap">— SFX —</span>
          <img src="/images/future-sight.jpeg" alt="" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
        </div>
        <div className="panel bubble">
          <span className="pcap">DIALOGUE</span>
          <img src="/images/mingo.jpeg" alt="" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
          <div className="bubble-text">"Pirates are evil? The Marines are righteous?"</div>
        </div>
      </div>
    </div>
  );
}

function TileMusic({ motion }) {
  const bars = Array.from({ length: 32 }, (_, i) => {
    const h = 20 + Math.abs(Math.sin(i * 0.6) * 40) + (i % 3) * 6;
    return h;
  });
  return (
    <div className="tile music">
      <div className="label">FILE.03 — heavy rotation</div>
      <div className="name">Late-night, <span className="it">low-end.</span></div>
      <div className="waveform" style={{ animationPlayState: motion ? "running" : "paused" }}>
        {bars.map((h, i) => (
          <i key={i} style={{
            height: `${h}%`,
            animationPlayState: motion ? "running" : "paused",
            animationDelay: `${i * 0.04}s`
          }}></i>
        ))}
      </div>
      <div className="now-playing">
        <span className="live">LIVE — moody hour</span>
        <span>03:42 / 04:18</span>
      </div>
    </div>
  );
}

function TileArcade() {
  // 16x8 pixel art - abstract retro fighter silhouette (original)
  const layout = [
    "................",
    "....h.......c...",
    "...hhh.....ccc..",
    "..lllll...lllll.",
    "..lhhhl...lhhhl.",
    "..llllll.llllll.",
    "...l..l...l..l..",
    "................",
  ];
  return (
    <div className="tile arcade">
      <div className="label">FILE.04 — quarter-eaters</div>
      <div className="name">2-player, <span className="it">no continues.</span></div>
      <div className="crt">
        <span className="label">P1 VS P2</span>
        <span className="score">0:42</span>
        <div className="px-grid">
          {layout.flatMap((row, ri) => row.split("").map((c, ci) => {
            const cls = c === "h" ? "hot" : c === "c" ? "cool" : c === "l" ? "lit" : "";
            return <i key={`${ri}-${ci}`} className={cls}></i>;
          }))}
        </div>
      </div>
    </div>
  );
}

function TilePingPong({ motion }) {
  return (
    <div className="tile pingpong">
      <div className="label">FILE.05 — basement sport</div>
      <div className="name">Spin, <span className="it">smash.</span></div>
      {motion && <div className="ball"></div>}
      <div className="rally">
        <span className="side">11</span>
        <span className="vs">— RALLY —</span>
        <span className="side" style={{ color: "var(--ink-dim)" }}>09</span>
      </div>
    </div>
  );
}

function TileNYC() {
  return (
    <div className="tile nyc">
      <div className="label">FILE.06 — current cell</div>
      <div className="name">New York, <span className="it">all of it.</span></div>
      <div className="subway">
        <span className="bullet b1">1</span>
        <span className="bullet bA">A</span>
        <span className="bullet bF">F</span>
        <span className="bullet bN">N</span>
        <span className="bullet bR">R</span>
        <span className="bullet bL">L</span>
      </div>
      <div className="ascii">{`╭─ washington sq → home
╰─ 14 min ∙ no transfers`}</div>
    </div>
  );
}

function TileShuffle() {
  return (
    <div className="tile shuffle">
      <div className="label">FILE.07 — moodboards as nutrition</div>
      <div className="name">Collage <span className="it">brain.</span></div>
      <div className="mood">
        <div className="m1"></div>
        <div className="m2"></div>
        <div className="m3"></div>
        <div className="m4"></div>
        <div className="m5"></div>
      </div>
    </div>
  );
}

// ---------- CONTACT (F1-inspired) ----------
function Contact() {
  const trackWrapRef = useRef(null);
  const [trackHeight, setTrackHeight] = useState(null);

  useEffect(() => {
    const node = trackWrapRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const updateHeight = () => {
      setTrackHeight(node.getBoundingClientRect().height);
    };

    updateHeight();
    const observer = new ResizeObserver(() => updateHeight());
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="contact contact-race" id="contact" data-screen-label="07 Contact">
      <div className="wrap">
        <div className="pre" data-reveal="up">↓ lights out · say hi ↓</div>
        <StartLights />
        <h2 data-reveal="up" style={{ "--reveal-delay": "0.1s" }}>
          let's <span className="it">build</span><br/>
          something <span className="it">weird.</span>
        </h2>

        <div className="contact-layout" data-reveal="up" style={{ "--reveal-delay": "0.2s" }}>
          <div className="track-wrap" ref={trackWrapRef}>
            <div className="track-cap mono">CIRCUIT — MONACO · 3.337 KM · 19 CORNERS</div>
            <RaceTrack />
            <div className="track-meta mono">
              <span>FASTEST <b>1:14.165</b></span>
              <span>WEATHER · CLEAR</span>
              <span>WIND 6 KPH</span>
              <span>TRACK TEMP 28°C</span>
            </div>
          </div>
          <div
            className="contact-side"
            style={trackHeight ? {
              "--contact-side-height": `${trackHeight}px`,
              "--contact-panel-height": `calc((${trackHeight}px - 18px) / 2)`,
            } : undefined}
          >
            <StartingGrid />
            <PhotoWidget />
          </div>
        </div>
      </div>
    </section>
  );
}

function StartLights() {
  return (
    <div className="start-lights" aria-hidden="true">
      {[0,1,2,3,4].map((i) => (
        <span key={i} className={`light light-${i + 1}`}></span>
      ))}
    </div>
  );
}

function RaceTrack() {
  return (
    <MonacoTrackArt
      className="track-svg monaco-track-art track-art"
      cars={[
        { color: "#A00C23", num: "16", dur: "14s" },
        { color: "#EFDF8B", num: "81", dur: "16s", delay: "-3.5s" },
        { color: "#A00C23", num: "55", dur: "18s", delay: "-7s" },
        { color: "#005D6B", num: "4", dur: "20s", delay: "-10s" },
      ]}
    />
  );
}

function StartingGrid() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const rows = [
    { pos: "P1", channel: "EMAIL",     handle: "shresthkapoor7@gmail.com", href: "mailto:shresthkapoor7@gmail.com", arr: "→", color: "#A00C23", time: "fastest", copy: true },
    { pos: "P2", channel: "LINKEDIN",  handle: "linkedin.com/in/shresth-kapoor-7skp", href: "https://www.linkedin.com/in/shresth-kapoor-7skp/", arr: "↗", color: "#EFDF8B", time: "+7.152s" },
    { pos: "P3", channel: "TWITTER/X", handle: "x.com/shresthkapoor7", href: "https://x.com/shresthkapoor7", arr: "↗", color: "#A00C23",  time: "+7.585s" },
    { pos: "P4", channel: "GITHUB",    handle: "github.com/shresthkapoor7", href: "https://github.com/shresthkapoor7", arr: "↗", color: "#005D6B", time: "+8.65s" },
    { pos: "DNF", channel: "RESUME",   handle: "resume.pdf", href: "", arr: "↓", color: "var(--ink-dim)", time: "no time", dnq: true, disabled: true },
  ];

  const handleRowClick = async (event, row) => {
    if (row.disabled) {
      event.preventDefault();
      return;
    }
    if (!row.copy) return;
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(row.handle);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      // no-op fallback for unsupported clipboard envs
    }
  };

  return (
    <div className="grid-board" data-reveal="up" style={{ "--reveal-delay": "0.3s" }}>
      <div className="grid-head mono">
        <span>POS</span>
        <span>CHANNEL</span>
        <span>HANDLE</span>
        <span>GAP</span>
        <span></span>
      </div>
      {rows.map((r, i) => (
        <a
          className={`grid-row ${r.dnq ? "dnq" : ""}`}
          key={i}
          href={r.href}
          target={r.copy || r.disabled || !r.href ? undefined : "_blank"}
          rel={r.copy || r.disabled || !r.href ? undefined : "noopener noreferrer"}
          onClick={(event) => handleRowClick(event, r)}
          data-hover-note={r.channel === "RESUME" ? "Reach out via email" : undefined}
          aria-disabled={r.disabled ? "true" : undefined}
          style={{ "--row-delay": `${i * 0.05}s` }}
        >
          <span className="pos" style={{ color: r.color }}>{r.pos}</span>
          <span className="channel">{r.channel}</span>
          <span className="handle mono">{r.handle}</span>
          <span className="gap mono">{r.copy && copiedEmail ? "copied" : r.time}</span>
          <span className="arr mono">{r.copy && copiedEmail ? "✓" : r.arr}</span>
        </a>
      ))}
    </div>
  );
}

function PhotoWidget() {
  const [imagePaths, setImagePaths] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const photos = imagePaths.map((src, index) => ({
    src,
    label: String(index + 1).padStart(2, "0"),
  }));
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  useEffect(() => {
    let cancelled = false;

    const loadImages = async () => {
      try {
        const response = await fetch("/api/f1-images");
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && Array.isArray(data.images)) {
          setImagePaths(data.images);
        }
      } catch {
        // no-op fallback for unavailable image list
      }
    };

    loadImages();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeIndex !== null && activeIndex >= photos.length) {
      setActiveIndex(null);
    }
  }, [activeIndex, photos.length]);

  const showPrev = () => {
    setActiveIndex((current) => {
      if (!photos.length) return null;
      if (current === null) return 0;
      return (current - 1 + photos.length) % photos.length;
    });
  };

  const showNext = () => {
    setActiveIndex((current) => {
      if (!photos.length) return null;
      if (current === null) return 0;
      return (current + 1) % photos.length;
    });
  };

  return (
    <div className="photo-widget" data-reveal="up" style={{ "--reveal-delay": "0.38s" }}>
      <div className="photo-widget-head mono">
        <span>PICTURES</span>
        <span>{activePhoto ? `${activeIndex + 1} / ${photos.length}` : `${photos.length} SHOTS`}</span>
      </div>

      {activePhoto ? (
        <div className="photo-viewer">
          <button type="button" className="photo-close mono" onClick={() => setActiveIndex(null)} aria-label="Back to photo grid">
            ×
          </button>
          <button type="button" className="photo-nav prev mono" onClick={showPrev} aria-label="Previous photo">
            ←
          </button>
          <img className="photo-active-image" src={activePhoto.src} alt={activePhoto.label} />
          <button type="button" className="photo-nav next mono" onClick={showNext} aria-label="Next photo">
            →
          </button>
          <div className="photo-caption mono">{activePhoto.label}</div>
        </div>
      ) : (
        <div className="photo-grid" role="list">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className="photo-thumb"
              onClick={() => setActiveIndex(index)}
              aria-label={`Open ${photo.label}`}
            >
              <img src={photo.src} alt={photo.label} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <span>© {new Date().getFullYear()} SHRESTH · NYC</span>
        <span>BUILT IN ZED / T3CODE · v2.1</span>
      </div>
    </footer>
  );
}

export default function PortfolioClient() {
  return <App />
}
