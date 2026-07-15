import { useState } from "react";
import Reveal from "./Reveal";
import "./Skills.css";

const ICONS = {
  "Languages": "{ }",
  "Backend": "⚙",
  "Messaging & Eventing": "⇄",
  "Frontend": "◈",
  "Databases": "⬡",
  "Concepts": "◎",
  "Tools & Platforms": "⊞",
};

export default function Skills({ skills }) {
  const [active, setActive] = useState(null);
  if (!skills) return null;

  return (
    <section id="skills" className="section">
      <Reveal>
        <div className="section-heading">
          <span className="tag">LOG_02</span>
          <h2>Technical Skills</h2>
          <div className="rule" />
        </div>
      </Reveal>

      <div className="skills-grid">
        {Object.entries(skills).map(([cat, items], i) => (
          <Reveal key={cat} delay={i * 55} variant="scale" className="skills-card glass-card">
            <div className="skills-card__cat">
              <span className="skills-card__icon">{ICONS[cat] ?? "◆"}</span>
              {cat}
            </div>
            <div className="skills-card__chips">
              {items.map(item => (
                <span
                  key={item}
                  className={`chip ${active === item ? "chip--active" : ""}`}
                  onMouseEnter={() => setActive(item)}
                  onMouseLeave={() => setActive(null)}
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
