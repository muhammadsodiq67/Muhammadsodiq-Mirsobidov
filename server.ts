import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Basic in-memory store for demo (Clear on restart)
  let generalChatMessages: any[] = [];
  let userRequests: any[] = [];
  let assistantChats: Record<string, any[]> = {}; // { userId: [{ role, text, senderName }] }
  let users: any[] = [
    { id: '1', name: 'Ali', nickname: 'Ali67', isPremium: false, isBanned: false },
    { id: '2', name: 'Vali', nickname: 'Vali_PRO', isPremium: true, isBanned: false }
  ];

  // Gemini API Initialization (Lazy)
  let _ai: any = null;
  const getAI = () => {
    if (!_ai) {
      if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing");
        return null;
      }
      _ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return _ai;
  };

  // Personal AI Assistant Route (Muhammadsodiq's Assistant)
  app.post("/api/ai/assistant", async (req, res) => {
    try {
      const ai = getAI();
      if (!ai) throw new Error("AI initialized failed - check API key");
      
      const { message, userId, nickname, isAdminAway } = req.body;
      
      if (!assistantChats[userId]) assistantChats[userId] = [];
      
      // Save user message
      assistantChats[userId].push({ role: 'user', text: message, senderName: nickname, timestamp: new Date().toISOString() });

      const systemPrompt = isAdminAway 
        ? "Siz Muhammadsodiqning shaxsiy ta'lim yordamchisiz. Muhammadsodiq hozir darsda yoki band, shuning uchun siz o'quvchilarga u uchun javob beryapsiz. Gapni 'Muhammadsodiq hozir darsda, men sizga o'qishda yordam beraman' deb boshlang va foydalanuvchiga fanlar, darslar yoki platforma bo'yicha yordam bering."
        : "Siz Articraft Edu platformasining aqlli o'qituvchi yordamchisiz. Foydalanuvchilarga (o'quvchilarga) platformadan foydalanish, darslar, maktab fanlari va ta'limiy masalalarda yordam bering.";

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction: systemPrompt },
        history: assistantChats[userId]
          .filter(m => !m.isFromAdmin) // Admin messages aren't 'user' or 'model' roles in Gemini terms usually, simplified here
          .map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
      });

      const result = await chat.sendMessage({ message });
      const aiResponse = result.text;
      
      // Save AI response
      assistantChats[userId].push({ role: 'model', text: aiResponse, senderName: 'Articraft AI', timestamp: new Date().toISOString() });

      res.json({ text: aiResponse });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/ai/history/:userId", (req, res) => {
    res.json(assistantChats[req.params.userId] || []);
  });

  app.get("/api/admin/data", (req, res) => {
    res.json({ users, requests: userRequests, assistantChats });
  });

  app.post("/api/admin/assistant-reply", (req, res) => {
    const { userId, message } = req.body;
    if (!assistantChats[userId]) assistantChats[userId] = [];
    
    assistantChats[userId].push({ 
      role: 'model',
      text: message, 
      senderName: 'Muhammadsodiq (Admin)', 
      isFromAdmin: true,
      timestamp: new Date().toISOString() 
    });
    
    res.json({ success: true });
  });

  app.post("/api/admin/action", (req, res) => {
    const { action, userId, requestId, response } = req.body;
    if (action === 'premium') {
      const user = users.find(u => u.id === userId);
      if (user) user.isPremium = !user.isPremium;
    } else if (action === 'ban') {
      const user = users.find(u => u.id === userId);
      if (user) user.isBanned = true;
    } else if (action === 'request-reply') {
      const reqIdx = userRequests.findIndex(r => r.id === requestId);
      if (reqIdx !== -1) {
        userRequests[reqIdx].status = response.status;
        userRequests[reqIdx].replyMessage = response.message;
      }
    }
    res.json({ success: true, users, requests: userRequests });
  });

  app.post("/api/requests", (req, res) => {
    const newRequest = { ...req.body, id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString() };
    userRequests.push(newRequest);
    res.json(newRequest);
  });

  app.get("/api/chat/general", (req, res) => {
    res.json(generalChatMessages);
  });

  app.post("/api/chat/general", (req, res) => {
    generalChatMessages.push(req.body);
    if (generalChatMessages.length > 50) generalChatMessages.shift();
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
