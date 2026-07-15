import { resumeData } from "./data/resumeData";
import { prebuiltQuestions, getLocalAnswer } from "./data/chatbotData";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";
const TIMEOUT_MS = 2500;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function normalizeResumePayload(payload) {
  if (payload?.profile) return payload;
  if (payload?.data?.profile) return payload.data;
  if (payload?.resume?.profile) return payload.resume;
  return resumeData;
}

/** Resolves with live backend data, or the bundled local copy if the API is unreachable. */
export async function getResume() {
  try {
    return normalizeResumePayload(await fetchWithTimeout(`${API_BASE}/resume`));
  } catch {
    return resumeData;
  }
}

export async function getPrebuiltQuestions() {
  try {
    return await fetchWithTimeout(`${API_BASE}/chatbot/questions`);
  } catch {
    return prebuiltQuestions;
  }
}

export async function askQuestion(questionId) {
  try {
    return await fetchWithTimeout(`${API_BASE}/chatbot/ask/${questionId}`);
  } catch {
    return getLocalAnswer(questionId);
  }
}
