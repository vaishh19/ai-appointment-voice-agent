A TypeScript-based real-time voice AI agent for clinical appointment booking.
It supports multilingual conversations (English, Hindi, Tamil) and handles booking, rescheduling, and cancellations with intelligent reasoning.

🚀 Features
🎙 Real-time voice interaction (STT → AI → TTS)
🌐 Multilingual support (English, Hindi, Tamil)
🧠 Agent-based reasoning with tool calling
📅 Appointment booking & conflict handling
💾 Session memory using Redis (with TTL)
⚡ Low-latency pipeline (<450ms target)
📞 Outbound call support (queue-based)
🧱 Tech Stack
Backend: Node.js + TypeScript + Fastify
AI: OpenAI (tool calling)
Memory: Redis
Realtime: WebSockets
Queue: BullMQ
📁 Project Structure
src/
 ├── server.ts
 ├── realtime/
 ├── agent/
 ├── memory/
 ├── services/
 ├── scheduler/
 ├── db/
⚙️ Setup
1. Clone repo
git clone https://github.com/your-username/realtime-multilingual-voice-ai-agent.git
cd realtime-multilingual-voice-ai-agent
2. Install dependencies
npm install
3. Add environment variables

Create .env file:

OPENAI_API_KEY=your_api_key_here
4. Run project
npx ts-node-dev src/server.ts
🌐 Usage
HTTP: http://localhost:5500
WebSocket: ws://localhost:5500

Send audio input → get AI voice response.

🧠 How It Works
User speaks (audio input)
Speech → Text (STT)
Language detection
AI agent processes request
Tool execution (booking, slots, etc.)
Response → converted to speech (TTS)
💾 Memory Design
Session Memory (Redis):
Language
Current intent
Pending actions
TTL: 30 minutes
Long-term Memory (DB):
Patient history
Previous bookings
📅 Scheduling Logic
Prevents double booking
Rejects past time slots
Suggests alternative slots
Handles rescheduling and cancellations
⚡ Latency

Target: < 450 ms

Breakdown:

STT: ~120 ms
LLM: ~150 ms
Tool calls: ~50 ms
TTS: ~100 ms
🎁 Bonus Features
Redis TTL-based session expiry
Queue-based outbound calls
Modular agent design
Scalable architecture
⚠️ Limitations
STT/TTS are mocked (can be replaced with real APIs)
In-memory DB used for demo
No UI (backend-focused system)
📌 Future Improvements
Integrate Deepgram (STT)
Integrate ElevenLabs (TTS)
Add frontend voice UI
Deploy on cloud (AWS/GCP)
