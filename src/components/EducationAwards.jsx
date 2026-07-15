import Reveal from "./Reveal";
import "./EducationAwards.css";

export default function EducationAwards({ education, awards }) {
  if (!education?.length && !awards?.length) return null;

  return (
    <>
      {education?.length > 0 && (
        <section id="education" className="section education-section">
          <Reveal>
            <div className="section-heading">
              <span className="tag">LOG_00</span>
              <h2>Education</h2>
              <div className="rule" />
            </div>
          </Reveal>
          <div className="edu-grid">
            {education.map((edu, i) => (
            <Reveal key={edu.school} delay={i * 40} className="edu-card glass-card">
              <div className="edu-card__badge">🎓</div>
              <div className="edu-card__content">
                <div className="edu-card__lbl">Education</div>
                <div className="edu-card__school">{edu.school}</div>
                <div className="edu-card__degree">{edu.degree}</div>
                <div className="edu-card__meta">{edu.duration} · {edu.location}</div>
                <div className="edu-card__gpa">{edu.gpa}</div>
              </div>
            </Reveal>
            ))}
          </div>
        </section>
      )}

      {awards?.length > 0 && (
        <section id="awards" className="section awards-section">
          <Reveal>
            <div className="section-heading">
              <span className="tag">LOG_01</span>
              <h2>Recognition</h2>
              <div className="rule" />
            </div>
          </Reveal>
          <div className="awards-grid">
            {awards.map((award, index) => <AwardCard key={award} award={award} index={index} />)}
          </div>
        </section>
      )}
    </>
  );
}

function AwardCard({ award, index }) {
  const details = [
    { icon: "✦", title: "Best Collaborative Performer", label: "Team impact" },
    { icon: "◈", title: "Kaizen Recognition", label: "Modernisation" },
  ][index] ?? { icon: "✦", title: "Recognition", label: "Achievement" };

  return (
    <Reveal delay={index * 80} className="award-card glass-card">
      <span className="award-card__icon">{details.icon}</span>
      <span className="award-card__label">{details.label}</span>
      <h3>{details.title}</h3>
      <p>{award}</p>
    </Reveal>
  );
}
