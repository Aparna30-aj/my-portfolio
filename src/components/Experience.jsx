import { useState } from "react";
import Reveal from "./Reveal";
import "./Experience.css";

export default function Experience({ experience }) {
  const [openProject, setOpenProject] = useState(0);
  if (!experience?.length) return null;
  return (
    <div className="exp-col">
      <div className="exp-col-header">
        <span className="exp-col-icon">🗂</span>
        <h2 className="exp-col-title">Mission Logs</h2>
      </div>

      <div className="exp-timeline">
        {experience.map((co, ci) => (
          <Reveal key={co.company} delay={ci * 60} className="exp-company">
            {/* Timeline dot + line */}
            <div className="exp-company__dot" />
            <div className="exp-company__body">
              {/* Company header */}
              <div className="exp-company__header">
                <div>
                  <div className="exp-company__role">{co.role}</div>
                  <div className="exp-company__name">{co.company} · {co.location}</div>
                </div>
                <div className="exp-company__duration">{co.duration}</div>
              </div>

              {/* Projects */}
              <div className="exp-projects">
                {co.projects.map((p, pi) => (
                  <ProjectEntry
                    key={p.name}
                    project={p}
                    index={pi}
                    open={openProject === pi}
                    onToggle={() => setOpenProject(pi)}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ProjectEntry({ project, open, onToggle }) {
  return (
    <div className={`exp-project ${open ? "exp-project--open" : ""}`}>
      <button className="exp-project__toggle" onClick={onToggle} aria-expanded={open}>
        <div className="exp-project__toggle-left">
          <span className="exp-project__name">{project.name}</span>
          <span className="exp-project__domain">{project.domain}</span>
        </div>
        <div className="exp-project__toggle-right">
          <span className="exp-project__dur">{project.duration}</span>
          <span className="exp-project__chevron">{open ? "−" : "+"}</span>
        </div>
      </button>

      {open && (
        <ul className="exp-project__highlights">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
