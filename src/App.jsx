import { useEffect, useState } from "react";
import { getResume } from "./api";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import SkillsProjects from "./components/SkillsProjects";
import EducationAwards from "./components/EducationAwards";
import Chatbot from "./components/Chatbot";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FuturisticBg from "./components/FuturisticBg";
import FloatingDock from "./components/FloatingDock";
import "./App.css";
import "./theme.css";

export default function App() {
  const [resume, setResume] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    getResume().then(setResume);
  }, []);

  if (!resume) {
    return (
      <div className="loading-screen">
        <div className="loading-screen__logo">AP</div>
        <div className="loading-screen__bar">
          <div className="loading-screen__bar-fill" />
        </div>
        <span className="loading-screen__text">Initializing profile…</span>
      </div>
    );
  }

  return (
    <>
      <FuturisticBg theme={theme} />
      <div className="app-shell">
        <Header
          profile={resume.profile}
          theme={theme}
          onThemeToggle={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}
        />
        <main>
          <Hero profile={resume.profile} />
          <EducationAwards education={resume.education} awards={resume.awards} />
          <About profile={resume.profile} />
          <div className="bento-row">
            <SkillsProjects skills={resume.skills} />
            <div className="bento-vdivider" />
            <Experience experience={resume.experience} />
          </div>
          <Projects />
          <Contact profile={resume.profile} />
        </main>
        <Footer profile={resume.profile} />
        <Chatbot />
        <FloatingDock profile={resume.profile} />
      </div>
    </>
  );
}
