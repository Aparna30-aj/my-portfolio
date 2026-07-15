import "./Footer.css";

export default function Footer({ profile }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__left">
          <div className="eyebrow">END OF LOG</div>
          <p>{profile?.email} · {profile?.phone}</p>
        </div>
        <div className="footer__right">
          {profile?.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>}
          {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          <a href="#top">↑ Top</a>
        </div>
      </div>
    </footer>
  );
}
