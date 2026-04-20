"use client";

import { useEffect, useState } from "react";

export default function ErrorPage() {
  const [glitch, setGlitch] = useState(false);
  const [scanline, setScanline] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load Google Fonts via link tag (safe, no hydration mismatch)
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);

    // Inject keyframe animations (client-only, safe)
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @keyframes float1 {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-30px) scale(1.05); }
      }
      @keyframes float2 {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(25px) scale(0.95); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes shimmer {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }
    `;
    document.head.appendChild(styleEl);

    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);

    const scanlineInterval = setInterval(() => {
      setScanline((prev) => (prev + 1) % 100);
    }, 30);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(scanlineInterval);
      document.head.removeChild(link);
      document.head.removeChild(styleEl);
    };
  }, []);

  const handleGoBack = () => window.history.back();
  const handleGoHome = () => (window.location.href = "/");

  // Render static shell saat SSR untuk hindari hydration mismatch
  if (!mounted) {
    return <section style={styles.root}><div style={styles.gridBg} /></section>;
  }

  return (
    <section style={styles.root}>
      <div style={styles.gridBg} />
      <div style={{ ...styles.scanline, top: `${scanline}%` }} />

      <div style={styles.container}>
        {/* Orbs */}
        <div style={{ ...styles.orb, width: "400px", height: "400px", background: "rgba(59,130,246,0.12)", top: "-150px", left: "-100px", animation: "float1 8s ease-in-out infinite" }} />
        <div style={{ ...styles.orb, width: "300px", height: "300px", background: "rgba(99,102,241,0.1)", bottom: "-100px", right: "-80px", animation: "float2 10s ease-in-out infinite" }} />

        {/* 404 */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: "8px", zIndex: 1 }}>
          <span style={{ ...styles.errorCode, ...(glitch ? { filter: "blur(1px)" } : {}) }}>404</span>
          {glitch && (
            <>
              <span style={{ ...styles.errorCode, position: "absolute", top: "3px", left: "-3px", background: "linear-gradient(135deg,#ff4d6d,#f43f5e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", opacity: 0.7, clipPath: "polygon(0 30%,100% 30%,100% 50%,0 50%)" }}>404</span>
              <span style={{ ...styles.errorCode, position: "absolute", top: "-3px", left: "3px", background: "linear-gradient(135deg,#22d3ee,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", opacity: 0.7, clipPath: "polygon(0 60%,100% 60%,100% 75%,0 75%)" }}>404</span>
            </>
          )}
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6", boxShadow: "0 0 10px #3b82f6", animation: "pulse 2s ease-in-out infinite", display: "inline-block", flexShrink: 0 }} />
          <div style={styles.dividerLine} />
        </div>

        {/* Content */}
        <div style={{ marginBottom: "40px", zIndex: 1 }}>
          <h1 style={styles.heading}>
            Halaman tidak
            <br />
            <span style={{ background: "linear-gradient(90deg,#3b82f6,#818cf8,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", backgroundSize: "200% auto", animation: "shimmer 3s linear infinite", display: "inline-block" }}>
              ditemukan
            </span>
          </h1>
          <p style={styles.subtext}>
            Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
            <br />
            Sabar ya bosss — yuk balik ke halaman utama dulu.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" as const, justifyContent: "center", marginBottom: "48px", zIndex: 1 }}>
          <button
            onClick={handleGoBack}
            style={styles.btnOutline}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.border = "1px solid rgba(99,149,255,0.8)"; el.style.backgroundColor = "rgba(59,130,246,0.15)"; el.style.color = "#e2e8f0"; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.border = "1px solid rgba(99,149,255,0.35)"; el.style.backgroundColor = "rgba(59,130,246,0.07)"; el.style.color = "#94a3b8"; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: "16px", height: "16px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            style={styles.btnPrimary}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "linear-gradient(135deg,#1d4ed8,#4338ca)"; el.style.boxShadow = "0 0 35px rgba(59,130,246,0.5)"; el.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "linear-gradient(135deg,#2563eb,#4f46e5)"; el.style.boxShadow = "0 0 20px rgba(59,130,246,0.3)"; el.style.transform = "translateY(0)"; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: "16px", height: "16px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Take me home
          </button>
        </div>

        {/* Status bar */}
        <div style={styles.statusBar}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444", boxShadow: "0 0 8px #ef4444", animation: "blink 1.5s ease-in-out infinite", flexShrink: 0, display: "inline-block" }} />
          <span style={styles.statusText}>STATUS: 404 — PAGE NOT FOUND</span>
          <span style={{ ...styles.statusText, marginLeft: "auto", color: "rgba(59,130,246,0.5)" }}>ERR::0x00000404</span>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "relative",
    minHeight: "100vh",
    backgroundColor: "#080b14",
    overflow: "hidden",
    fontFamily: "'Space Mono', monospace",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  gridBg: {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(rgba(59,130,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.05) 1px,transparent 1px)`,
    backgroundSize: "60px 60px",
    maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
  },
  scanline: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent, rgba(99,179,255,0.08), transparent)",
    pointerEvents: "none",
    zIndex: 1,
    transition: "top 0.03s linear",
  },
  container: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "40px 24px",
    maxWidth: "700px",
    animation: "fadeInUp 0.8s ease forwards",
  },
  orb: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  errorCode: {
    display: "block",
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(100px, 20vw, 200px)",
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-0.05em",
    background: "linear-gradient(135deg, #ffffff 0%, #3b82f6 50%, #6366f1 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    userSelect: "none",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    maxWidth: "400px",
    marginBottom: "32px",
    zIndex: 1,
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(99,149,255,0.4), transparent)",
  },
  heading: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(28px, 5vw, 48px)",
    fontWeight: 800,
    color: "#ffffff",
    lineHeight: 1.15,
    marginBottom: "16px",
    letterSpacing: "-0.02em",
  },
  subtext: {
    color: "rgba(148,163,184,0.85)",
    fontSize: "15px",
    lineHeight: 1.8,
    maxWidth: "460px",
    fontFamily: "'Space Mono', monospace",
  },
  btnOutline: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 28px",
    borderRadius: "8px",
    border: "1px solid rgba(99,149,255,0.35)",
    backgroundColor: "rgba(59,130,246,0.07)",
    color: "#94a3b8",
    fontSize: "13px",
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "all 0.25s ease",
    backdropFilter: "blur(6px)",
  },
  btnPrimary: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 28px",
    borderRadius: "8px",
    border: "1px solid rgba(99,130,246,0.5)",
    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#ffffff",
    fontSize: "13px",
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 0 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
  },
  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 20px",
    borderRadius: "6px",
    border: "1px solid rgba(59,130,246,0.15)",
    backgroundColor: "rgba(59,130,246,0.04)",
    zIndex: 1,
    width: "100%",
    maxWidth: "500px",
  },
  statusText: {
    color: "rgba(148,163,184,0.6)",
    fontSize: "11px",
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.08em",
  },
};