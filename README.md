# 🤖 Avira – AI Conversational Chatbot

**Avira** is a full-stack AI chatbot with secure authentication, built using Next.js and powered by LLM APIs. Users can sign in and have intelligent, context-aware conversations in real time.

🔗 **Live Demo:** [avira-chatbot1-lrt9.vercel.app](https://avira-chatbot1-lrt9.vercel.app)

---

## 🎥 Demo

[![Watch Demo](https://img.youtube.com/vi/ta58T15jEdo/0.jpg)](https://youtu.be/ta58T15jEdo)

---

## 🧠 Features

- 💬 Real-time AI conversations powered by LLM
- 🔐 Secure user authentication with NextAuth.js
- 💾 Chat history stored in MongoDB
- ⚡ Serverless architecture with Next.js API routes
- 🌐 Deployed on Vercel

---

## 🛠️ Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Frontend | Next.js, Tailwind |
| Auth     | NextAuth.js       |
| Database | MongoDB           |
| AI       | OpenAI / Gemini   |
| Deploy   | Vercel            |

---

## 🚀 Getting Started

```bash
git clone https://github.com/hina-ali651/AviraChatbot1.git
cd AviraChatbot1
npm install
cp .env.example .env.local
npm run dev
```

---

## 📌 Environment Variables

`.env.local` file banao aur yeh add karo:

```env
NEXTAUTH_SECRET=your_secret
MONGODB_URI=your_mongodb_uri
OPENAI_API_KEY=your_api_key
```
