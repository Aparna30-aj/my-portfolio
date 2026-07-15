import Reveal from "./Reveal";
import "./Contact.css";

export default function Contact({ profile }) {
  if (!profile) return null;

  return (
    <section id="contact" className="section contact-section">
      <Reveal>
        <div className="section-heading">
          <span className="tag">LOG_06</span>
          <h2>Get in touch</h2>
          <div className="rule" />
        </div>
      </Reveal>

      <div className="contact-grid">
        <Reveal delay={60} className="contact-main glass-card">
          <p className="contact-main__lead">
            Have a role, a project, or just a question? I read every message myself.
          </p>
          <div className="contact-main__actions">
            <a className="contact-cta contact-cta--primary" href={`mailto:${profile.email}`}>
              <span>✉</span> {profile.email}
            </a>
            <a className="contact-cta" href={`tel:${profile.phone}`}>
              <span>📞</span> {profile.phone}
            </a>
          </div>
        </Reveal>

        <Reveal delay={120} className="contact-links">
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact-link-card glass-card">
              <span className="contact-link-card__icon">in</span>
              <div>
                <div className="contact-link-card__label">LinkedIn</div>
                <div className="contact-link-card__sub">Connect with me ↗</div>
              </div>
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className="contact-link-card glass-card">
              <span className="contact-link-card__icon">gh</span>
              <div>
                <div className="contact-link-card__label">GitHub</div>
                <div className="contact-link-card__sub">See my code ↗</div>
              </div>
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
