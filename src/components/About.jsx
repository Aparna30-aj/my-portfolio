import Reveal from "./Reveal";
import "./About.css";

const FACTS = [
  { icon: "⚡", label: "4+ years",      sub: "enterprise production systems" },
  { icon: "🌍", label: "2 continents",  sub: "live platform deployments" },
  { icon: "🔧", label: "10+ services",  sub: "owned, built & optimised" },
  { icon: "🎓", label: "NIT Jalandhar", sub: "B.Tech graduate" },
];

export default function About({ profile }) {
  if (!profile) return null;
  const paragraphs = profile.about?.length ? profile.about : [profile.summary].filter(Boolean);

  return (
    <section id="about" className="section">
      <Reveal>
        <div className="section-heading">
          <span className="tag">LOG_01</span>
          <h2>About</h2>
          <div className="rule" />
        </div>
      </Reveal>

      <div className="about-grid">
        <Reveal variant="left" delay={40} className="about-sidebar glass-card">
          <p className="about-sidebar__quote">
            {profile.tagline}
          </p>
          <div className="about-facts">
            {FACTS.map((f) => (
              <div key={f.label} className="about-fact">
                <span className="about-fact__icon">{f.icon}</span>
                <span className="about-fact__label">{f.label}</span>
                <span className="about-fact__sub">{f.sub}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="about-copy">
          {paragraphs.map((para, i) => (
            <Reveal as="p" key={i} delay={i * 60} variant="right" className="about-para">
              {para}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
