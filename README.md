🩺 Real-Time Multilingual Voice AI Agent (TypeScript)

A real-time voice AI agent built entirely in TypeScript for clinical appointment booking.
It supports English, Hindi, and Tamil, and can handle booking, rescheduling, and cancellations through natural voice conversations.

🚀 Features
🎙 Real-time voice interaction (WebSocket-based)
🌐 Multilingual support (English, Hindi, Tamil)
🤖 LLM agent with tool calling (no hardcoding)
📅 Appointment booking & conflict handling
💾 Redis-based session memory (with TTL)
📞 Outbound call support using queues
⚡ Low latency design (<450 ms target)
🧱 Tech Stack (Only TypeScript)
Backend: Node.js + TypeScript + Fastify
Realtime: WebSockets
AI Agent: OpenAI (tool calling via TS)
Memory: Redis (ioredis)
Queue: BullMQ
Database: In-memory (for demo)
📁 Project Structure
src/
 ├── server.ts          # WebSocket server
 ├── agent.ts           # LLM agent logic
 ├── tools.ts           # Booking & scheduling tools
 ├── memory.ts          # Redis session memory
 ├── db.ts              # In-memory database
 ├── stt.ts             # Speech-to-text (mock/API)
 ├── tts.ts             # Text-to-speech (mock/API)
 ├── language.ts        # Language detection
 ├── scheduler.ts       # Outbound calls (BullMQ)
⚙️ Setup
1. Clone Repository
git clone https://github.com/your-username/realtime-multilingual-voice-ai-agent-ts.git
cd realtime-multilingual-voice-ai-agent-ts
2. Install Dependencies
npm install
3. Add Environment Variables

Create a .env file:

OPENAI_API_KEY=your_api_key
REDIS_URL=redis://localhost:6379
4. Run Server
npx ts-node-dev src/server.ts
🌐 Usage
WebSocket: ws://localhost:5500

Send audio input → receive AI-generated voice response.

🧠 How It Works
User sends voice input
STT converts speech → text
Language detection (EN / HI / TA)
LLM agent processes request
Agent calls tools (booking, slots, etc.)
Memory is updated (Redis + DB)
Response converted to speech (TTS)
Audio sent back to user
💾 Memory Design
🔹 Session Memory (Redis)
Language preference
Current intent
Conversation state
TTL: 30 minutes
🔹 Long-Term Memory (DB)
Patient details
Appointment history
📅 Scheduling Logic
Prevents double booking
Rejects past slots
Suggests alternative slots
Supports rescheduling & cancellation
📞 Outbound Campaigns
Built using BullMQ (TypeScript)
Supports:
appointment reminders
follow-ups
Queue → Worker → AI Agent → User
⚡ Latency Target

Goal: < 450 ms

Step	Time
STT	~120 ms
LLM	~150 ms
Tools	~50 ms
TTS	~100 ms
🎁 Bonus Features
Redis TTL-based sessions
Queue-based outbound calls
Modular TypeScript architecture
Scalable design
⚠️ Limitations
STT/TTS are mocked (can integrate real APIs)
In-memory DB (not persistent)
No frontend UI
📌 Future Improvements
Integrate real STT (Deepgram)
Integrate real TTS (ElevenLabs)
Add frontend voice interface
Deploy on cloud (AWS/GCP)v
