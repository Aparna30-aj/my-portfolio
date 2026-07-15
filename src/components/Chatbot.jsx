import { useEffect, useRef, useState } from "react";
import { getPrebuiltQuestions, askQuestion } from "../api";
import "./Chatbot.css";

const BOOT_MSG = {
  id: "boot",
  role: "bot",
  text: "Hello! I am Aparna's AI Assistant.\nAsk me about her experience, engineering approach, skills, or how to get in touch.",
};

const TYPING_DELAY = 650;
const FEATURED_QUESTION_IDS = ["why-hire", "ai-experience", "skills", "contact"];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [messages, setMessages] = useState([BOOT_MSG]);
  const [typing, setTyping] = useState(false);
  const [askedIds, setAskedIds] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => { getPrebuiltQuestions().then(setQuestions); }, []);
  const featuredQuestions = questions.filter((question) => FEATURED_QUESTION_IDS.includes(question.id));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing]);

  async function sendQuestion(q) {
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: q.question }]);
    setTyping(true);
    setAskedIds((prev) => [...prev, q.id]);
    const result = await askQuestion(q.id);
    await new Promise((r) => setTimeout(r, TYPING_DELAY));
    setTyping(false);
    setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: result.answer }]);
  }

  return (
    <>
      {/* Backdrop */}
      {open && <div className="cb-backdrop" onClick={() => setOpen(false)} />}

      {/* Side drawer */}
      <div className={`cb-drawer ${open ? "cb-drawer--open" : ""}`}>
        {/* Drawer title bar */}
        <div className="cb-drawer__bar">
          <span className="cb-dot cb-dot--r" />
          <span className="cb-dot cb-dot--y" />
          <span className="cb-dot cb-dot--g" />
          <span className="cb-drawer__title">Aparna AI Assistant</span>
          <span className="cb-drawer__status">
            <span className="cb-ping" />ONLINE
          </span>
          <button className="cb-drawer__close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        </div>

        {/* Messages */}
        <div className="cb-log">
          {messages.map((m) => <Message key={m.id} msg={m} />)}
          {typing && <TypingBubble />}
          <div ref={bottomRef} />
        </div>

        {/* Quick chips */}
        <div className="cb-chips">
          {featuredQuestions.map((q) => (
            <button
              key={q.id}
              className={`cb-chip ${askedIds.includes(q.id) ? "cb-chip--used" : ""}`}
              onClick={() => !askedIds.includes(q.id) && sendQuestion(q)}
              disabled={askedIds.includes(q.id) || typing}
            >
              {q.question}
            </button>
          ))}
        </div>

      </div>

      {/* FAB trigger */}
      <button
        className={`cb-fab ${open ? "cb-fab--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle AI assistant"
      >
        <span className="cb-fab__icon">{open ? "✕" : "⚡"}</span>
        {!open && <span className="cb-fab__label">Ask AI</span>}
        <span className="cb-fab__ping" />
      </button>
    </>
  );
}

function Message({ msg }) {
  const isBot = msg.role === "bot";
  return (
    <div className={`cb-msg cb-msg--${msg.role}`}>
      {isBot && <div className="cb-avatar">AP</div>}
      <div className="cb-bubble">
        {msg.text.split("\n").map((line, i, arr) => (
          <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
        ))}
      </div>
      {!isBot && <div className="cb-avatar cb-avatar--user">YOU</div>}
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="cb-msg cb-msg--bot">
      <div className="cb-avatar">AP</div>
      <div className="cb-bubble cb-bubble--typing">
        <span /><span /><span />
      </div>
    </div>
  );
}
