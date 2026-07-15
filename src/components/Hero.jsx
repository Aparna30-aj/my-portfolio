import { useEffect, useState } from "react";
import "./Hero.css";

const IMPACTS = [
  { value: "64%", label: "faster API response", accent: "violet" },
  { value: "70%", label: "faster incident alerts", accent: "cyan" },
  { value: "35%", label: "fewer recurring incidents", accent: "mint" },
  { value: "8+", label: "services standardised", accent: "amber" },
];

function ImpactDashboard() {
  return (
    <div className="hero__impact glass-card">
      <div className="hero__impact-head">
        <span className="hero__impact-orb">✦</span>
        <div>
          <span className="hero__impact-kicker">Engineering impact</span>
          <h2>Built for the moments that matter.</h2>
        </div>
      </div>
      <p className="hero__impact-copy">Measured improvements from enterprise energy platforms, where reliability and response time are never optional.</p>
      <div className="hero__impact-grid">
        {IMPACTS.map((impact) => (
          <div key={impact.label} className={`hero__impact-item hero__impact-item--${impact.accent}`}>
            <strong>{impact.value}</strong>
            <span>{impact.label}</span>
          </div>
        ))}
      </div>
      <div className="hero__impact-footer">
        <span>Event-driven systems</span>
        <span>AI-assisted support</span>
      </div>
    </div>
  );
}

/* ── Count-up ── */
function useCountUp(target, active) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1200, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return v;
}

const STATS = [
  { value: 4,   suffix: "+", label: "YEARS EXP" },
  { value: 2,   suffix: "",  label: "INNOVATION AWARDS" },
  { value: 10,  suffix: "+", label: "SERVICES OWNED" },
  { value: 2,   suffix: "",  label: "CONTINENTS DEPLOYED" },
];

export default function Hero({ profile }) {
  const [active, setActive] = useState(false);
  const firstName = (profile?.name ?? "Aparna Patel").split(" ")[0];
  const lastName  = (profile?.name ?? "Aparna Patel").split(" ").slice(1).join(" ");
  const contactItems = [
    { icon: "📞", label: "MOBILE UPLINK", value: profile?.phone },
    { icon: "✉", label: "NEURAL NET (EMAIL)", value: profile?.email },
    { icon: "📍", label: "LOCATION", value: profile?.location },
  ].filter((item) => item.value);

  useEffect(() => {
    const t = setTimeout(() => setActive(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="top" className="hero">
      <div className="hero__orb hero__orb--a" />
      <div className="hero__orb hero__orb--b" />

      <div className="hero__wrap">
        {/* ── TOP ROW ── */}
        <div className="hero__top">
          {/* LEFT */}
          <div className="hero__left">
            <div className="hero__badge eyebrow">v1.0.0 SYSTEM_READY</div>

            <h1 className="hero__name">
              <span className="hero__name-first">{firstName}</span>
              <span className="hero__name-last">{lastName}</span>
            </h1>

            <p className="hero__role">
              <span className="hero__role-icon">&lt;&gt;</span>
              {profile?.title ?? "Software Engineer"}
              <span className="hero__role-sep">|</span>
              <span className="hero__role-icon">⚙</span>
              Backend Systems Specialist
            </p>

            <p className="hero__summary">{profile?.tagline}</p>

            <div className="hero__contacts">
              {contactItems.map((c) => (
                <div key={c.label} className="hero__contact-card glass-card">
                  <span className="hero__contact-icon">{c.icon}</span>
                  <div>
                    <div className="hero__contact-label">{c.label}</div>
                    <div className="hero__contact-val">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero__right">
            <ImpactDashboard />
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="hero__stats">
          {STATS.map((s, i) => (
            <StatTile key={s.label} s={s} active={active} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatTile({ s, active, delay }) {
  const v = useCountUp(s.value, active);
  return (
    <div className="hero__stat glass-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="hero__stat-val">{v}{s.suffix}</div>
      <div className="hero__stat-label">{s.label}</div>
    </div>
  );
}
