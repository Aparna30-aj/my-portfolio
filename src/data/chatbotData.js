import { resumeData } from "./resumeData";

// Mirrors backend/.../service/ChatbotService.java so the chat console still
// works if the API is unreachable.

export const prebuiltQuestions = [
  { id: "why-hire", question: "Why should we hire Aparna?" },
  { id: "ai-experience", question: "How does she use AI in production?" },
  { id: "skills", question: "What is her tech stack?" },
  { id: "contact", question: "How can I contact her?" },
];

function buildAboutAnswer() {
  return resumeData.profile.about.join("\n\n");
}

function buildSkillsAnswer() {
  return Object.entries(resumeData.skills)
    .map(([category, items]) => `• ${category}: ${items.join(", ")}`)
    .join("\n");
}

function buildProjectAnswer(projectIndex) {
  const company = resumeData.experience[0];
  const project = company.projects[projectIndex];
  const topThree = project.highlights
    .slice(0, 3)
    .map((h) => `• ${h}`)
    .join("\n");
  return `${project.name} (${project.duration}) at ${company.company}, working on ${project.domain}.\n\n${topThree}`;
}

function buildAchievementsAnswer() {
  return [
    "• Got incident alerts to the ops team about 70% faster by replacing polling with a RabbitMQ + React notification pipeline",
    "• Shaved ~64% off response times on the busiest endpoints by moving blocking calls to CompletableFuture and Spring @Async",
    "• Brought inconsistent error handling across 8+ microservices down by ~40% with one shared exception framework",
    "• Cut recurring production incidents by ~35% through cross-service root-cause work with onshore and AMS teams",
    "• Took query and report generation time down by up to 50% and 40% respectively through targeted SQL and JasperReports tuning",
    "• Dropped page load time 53% migrating a legacy RichFaces UI to PrimeFaces",
  ].join("\n");
}

function buildAiAnswer() {
  return "The most concrete example is an AI help desk I built by wiring Spring AI into Azure OpenAI — it triages incoming issues and drafts resolution suggestions automatically, so it acts as a first responder before a human ever looks at the ticket. Outside of that I've worked with RAG pipelines and VectorDB, and experimented with the OpenAI and Gemini APIs directly.";
}

function buildEducationAnswer() {
  const edu = resumeData.education[0];
  return `${edu.school} — ${edu.degree} (${edu.duration}), ${edu.location}. ${edu.gpa}`;
}

function buildAwardsAnswer() {
  return resumeData.awards.map((a) => `• ${a}`).join("\n");
}

function buildContactAnswer() {
  const { email, phone } = resumeData.profile;
  return `Email me at ${email}, call/text ${phone}, or find me on LinkedIn and GitHub — links are in the header.`;
}

const answerBuilders = {
  "why-hire": () => "Aparna brings hands-on experience building and improving enterprise systems where reliability matters. She combines strong Java and Spring Boot foundations with microservices, event-driven design, performance tuning, and practical AI work — backed by measurable outcomes such as 64% faster APIs, 70% faster alerts, and fewer recurring incidents.",
  who: () => resumeData.profile.summary,
  about: buildAboutAnswer,
  skills: buildSkillsAnswer,
  "current-project": () => buildProjectAnswer(0),
  "previous-project": () => buildProjectAnswer(1),
  achievements: buildAchievementsAnswer,
  "ai-experience": buildAiAnswer,
  education: buildEducationAnswer,
  awards: buildAwardsAnswer,
  contact: buildContactAnswer,
};

export function getLocalAnswer(questionId) {
  const question = prebuiltQuestions.find((q) => q.id === questionId);
  const builder = answerBuilders[questionId];
  if (!question || !builder) return null;
  return { questionId, question: question.question, answer: builder() };
}
