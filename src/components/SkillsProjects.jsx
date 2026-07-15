import { useState } from "react";
import Reveal from "./Reveal";
import "./SkillsProjects.css";

const SKILL_GROUPS = [
  {
    icon: "{ }", label: "Languages",
    skills: ["Java", "JavaScript"],
  },
  {
    icon: "⚙", label: "Backend",
    skills: ["Spring Boot", "Spring MVC", "Spring Cloud (Eureka, API Gateway)", "Spring Data JPA", "REST APIs", "Microservices", "JUnit 5", "Spring AI"],
  },
  {
    icon: "◎", label: "Core Concepts",
    skills: ["Java 8", "Collections Framework", "Multi-Threading", "Concurrency", "Exception Handling", "Design Patterns", "OOP", "SOLID Principles", "DSA", "CompletableFuture", "ExecutorService"],
  },
  {
    icon: "⇄", label: "Messaging & Eventing",
    skills: ["RabbitMQ", "Kafka", "Azure Service Bus", "Event-Driven Architecture", "Asynchronous Processing"],
  },
  {
    icon: "◈", label: "Frontend",
    skills: ["React.js", "PrimeFaces (JSF)", "HTML5", "CSS3"],
  },
  {
    icon: "⬡", label: "Databases & Persistence",
    skills: ["SQL", "MySQL", "PostgreSQL", "MongoDB", "VectorDB", "Query Optimization"],
  },
  {
    icon: "⊞", label: "Cloud & Tools",
    skills: ["AWS EC2", "Azure", "Docker", "Jenkins", "Maven", "Git", "Postman", "ServiceNow", "JasperReports", "OpenAI", "Gemini", "CI/CD Pipelines"],
  },
  {
    icon: "◆", label: "Methodologies & Practices",
    skills: ["Agile", "Scrum", "SDLC", "Performance Optimization", "Production Support", "Root Cause Analysis (RCA)", "System Design", "Distributed Systems", "RAG"],
  },
];

const ICONS_BY_LABEL = {
  Languages: "{ }",
  Backend: "⚙",
  "Messaging & Eventing": "⇄",
  Frontend: "◈",
  Databases: "⬡",
  Concepts: "◎",
  "Tools & Platforms": "⊞",
};

export default function SkillsProjects({ skills }) {
  const groups = skills && Object.keys(skills).length
    ? Object.entries(skills).map(([label, items]) => ({
        icon: ICONS_BY_LABEL[label] ?? "◆",
        label,
        skills: Array.isArray(items) ? items : [],
      }))
    : SKILL_GROUPS;

  return (
    <div className="sp-skills-col">
      <div className="sp-col-header">
        <span className="sp-col-icon">⚙</span>
        <h2 className="sp-col-title">Neural Capacities</h2>
      </div>
      <div className="sp-skills-list">
        {groups.map((g, i) => (
          <Reveal key={g.label} delay={i * 40} className="sp-skill-group glass-card">
            <div className="sp-skill-group__header">
              <span className="sp-skill-group__icon">{g.icon}</span>
              <span className="sp-skill-group__label">{g.label}</span>
            </div>
            <div className="sp-chips">
              {g.skills.map((s) => <SkillChip key={s} label={s} />)}
            </div>
          </Reveal>
        ))}
      </div>

    </div>
  );
}

function SkillChip({ label }) {
  const [on, setOn] = useState(false);
  return (
    <span
      className={`sp-chip ${on ? "sp-chip--on" : ""}`}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
    >
      {label}
    </span>
  );
}
