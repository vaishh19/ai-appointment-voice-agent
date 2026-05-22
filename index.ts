import Fastify from "fastify";
import { WebSocketServer } from "ws";
import OpenAI from "openai";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import http from "http";

// -------------------- SETUP --------------------

const app = Fastify();
const server = http.createServer(app.server); // 🔥 important

const redis = new Redis();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// -------------------- MEMORY --------------------

async function getSession(sessionId: string) {
  const data = await redis.get(sessionId);
  return data ? JSON.parse(data) : {};
}

async function setSession(sessionId: string, session: any) {
  await redis.set(sessionId, JSON.stringify(session), "EX", 1800);
}

// -------------------- LANGUAGE --------------------

function detectLanguage(text: string) {
  if (/[ऀ-ॿ]/.test(text)) return "Hindi";
  if (/[அ-ஹ]/.test(text)) return "Tamil";
  return "English";
}

// -------------------- MOCK DB --------------------

const appointments: any[] = [];

// -------------------- TOOLS --------------------

async function getAvailableSlots(doctorId: string) {
  const allSlots = ["10:00", "11:00", "12:00", "17:00", "18:00"];

  const booked = appointments
    .filter(a => a.doctorId === doctorId)
    .map(a => a.slot);

  return allSlots.filter(slot => !booked.includes(slot));
}

async function bookAppointment(
  patientId: string,
  doctorId: string,
  slot: string
) {
  const exists = appointments.find(
    a => a.doctorId === doctorId && a.slot === slot
  );

  if (exists) {
    return {
      error: "Slot unavailable",
      alternatives: await getAvailableSlots(doctorId),
    };
  }

  appointments.push({ doctorId, slot });

  return { success: true, message: `Booked at ${slot}` };
}

// -------------------- PROMPT --------------------

function buildPrompt(session: any) {
  return `
You are a multilingual healthcare assistant.

Language: ${session.language || "English"}

Rules:
- Respond only in this language
- Handle booking, rescheduling, cancellation
- Ask missing info
`;
}

// -------------------- AGENT --------------------

async function runAgent(userText: string, sessionId: string): Promise<string> {
  let session = await getSession(sessionId);

  if (!session.language) {
    session.language = detectLanguage(userText);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: buildPrompt(session) },
      { role: "user", content: userText },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "getAvailableSlots",
          parameters: {
            type: "object",
            properties: {
              doctorId: { type: "string" },
            },
            required: ["doctorId"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "bookAppointment",
          parameters: {
            type: "object",
            properties: {
              patientId: { type: "string" },
              doctorId: { type: "string" },
              slot: { type: "string" },
            },
            required: ["patientId", "doctorId", "slot"],
          },
        },
      },
    ],
  });

  const msg = response.choices[0].message;

  if (msg.tool_calls) {
    const call = msg.tool_calls[0];
    const args = JSON.parse(call.function.arguments);

    let result;

    if (call.function.name === "getAvailableSlots") {
      result = await getAvailableSlots(args.doctorId);
    }

    if (call.function.name === "bookAppointment") {
      result = await bookAppointment(
        args.patientId,
        args.doctorId,
        args.slot
      );
    }

    return runAgent(JSON.stringify(result), sessionId);
  }

  await setSession(sessionId, session);

  return msg.content || "";
}

// -------------------- STT / TTS --------------------

async function stt(audio: Buffer) {
  return "Book appointment tomorrow at 5pm";
}

async function tts(text: string) {
  return Buffer.from(text);
}

// -------------------- WEBSOCKET (SAME PORT) --------------------

const wss = new WebSocketServer({ server }); // 🔥 attach to same server

wss.on("connection", (ws) => {
  const sessionId = uuidv4();

  ws.on("message", async (audio: Buffer) => {
    console.time("latency");

    const text = await stt(audio);
    const reply = await runAgent(text, sessionId);
    const audioOut = await tts(reply);

    ws.send(audioOut);

    console.timeEnd("latency");
  });
});

// -------------------- HTTP --------------------

app.get("/", async () => {
  return { status: "Voice AI running" };
});

// -------------------- START SERVER --------------------

const PORT = 5500;

server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running on ${PORT}`);
});