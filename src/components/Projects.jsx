import Reveal from "./Reveal";
import "./Projects.css";

const PROJECTS = [
  {
    id: "01", name: "Payday", tagline: "Peer-to-peer loan platform",
    description: "A loan-application experience that connects lenders and borrowers through a clear, end-to-end lending workflow.",
    tags: ["Java", "Spring Boot", "Microservices", "Angular"],
    color: "amber", icon: "💸",
  },
  {
    id: "02", name: "Foodholic", tagline: "Recipes + food delivery app",
    description: "A food discovery product that brings recipe finding and food delivery together in one seamless experience.",
    tags: ["Java", "Spring Boot", "Microservices", "React.js"],
    color: "teal", icon: "🍜",
  },
  {
    id: "03", name: "Ecommerce", tagline: "Fashion e-commerce (Myntra-style)",
    description: "A responsive fashion storefront shaped around product discovery, browsing, and a smooth journey to cart.",
    tags: ["HTML", "CSS", "JavaScript"],
    color: "purple", icon: "👗",
  },
  {
    id: "04", name: "Code Converter", tagline: "AI-powered developer tool",
    description: "Converts code between languages and explains the result, making unfamiliar syntax easier to understand and use.",
    tags: ["MongoDB", "Express", "React", "Node.js", "OpenAI API"],
    color: "teal", icon: "↔",
  },
];

const VARIANTS = ["left", "up", "right", "up"];

export default function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal>
        <div className="section-heading">
          <span className="tag">LOG_04</span>
          <h2>Personal Projects</h2>
          <div className="rule" />
        </div>
      </Reveal>

      <div className="projects-grid">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.id} delay={i * 100} variant={VARIANTS[i]} className={`proj-card proj-card--${p.color} glass-card`}>
            <div className="proj-card__top">
              <span className="proj-card__icon">{p.icon}</span>
              <span className="proj-card__id">PROJECT_{p.id}</span>
            </div>
            <div className="proj-card__name">{p.name}</div>
            <div className="proj-card__tagline">{p.tagline}</div>
            <p className="proj-card__desc">{p.description}</p>
            <div className="proj-card__tags">
              {p.tags.map(t => <span key={t} className="proj-tag">{t}</span>)}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
