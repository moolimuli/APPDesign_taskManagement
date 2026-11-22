import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-ai.js";
import { app } from "./firebase.js";

const AI_MODEL = "gemini-3.8-flash";

const systemInstruction = `你是「日序」App 的行程小幫手，一律用繁體中文回答。
只能根據使用者提供的任務資料回答；資料裡沒有的就說沒有，不要編造。
你不能新增、修改或刪除任務；使用者要求時，說明目前只能查詢，請他自己在 App 中操作。
回答使用純文字，不要使用 Markdown 符號（例如 **、#）。列舉時每項一行，開頭用「・」。時間用 24 小時制。
找空檔時，以 08:00–22:00 為可安排時段，排除已有開始時間的未完成任務。`;

const ai = app
  ? getAI(app, {
      backend: new GoogleAIBackend(),
      useLimitedUseAppCheckTokens: true
    })
  : null;
const model = ai
  ? getGenerativeModel(ai, { model: AI_MODEL, systemInstruction })
  : null;

let chat = null;

export function startConversation() {
  if (!model) throw new Error("Firebase 尚未設定，無法啟動 AI 小幫手。");
  chat = model.startChat();
  return chat;
}

export function clearConversation() {
  chat = null;
}

export async function askAssistant(question, tasks, todayString) {
  if (!chat) startConversation();

  const todayDate = new Date(`${todayString}T12:00:00`);
  const weekday = Number.isNaN(todayDate.getTime())
    ? "星期不明"
    : new Intl.DateTimeFormat("zh-TW", { weekday: "long" }).format(todayDate);
  const taskData = (Array.isArray(tasks) ? tasks : []).map(task => ({
    title: task.title ?? "",
    category: task.category || "未分類",
    date: task.date ?? "",
    start: task.start ?? "",
    end: task.end ?? "",
    priority: task.priority ?? "",
    done: Boolean(task.done),
    note: task.note ?? ""
  }));
  const prompt = `今天日期與星期：${todayString}（${weekday}）
任務清單 JSON：
${JSON.stringify(taskData)}

使用者問題：
${question}`;
  const result = await chat.sendMessage(prompt);
  return result.response.text();
}
