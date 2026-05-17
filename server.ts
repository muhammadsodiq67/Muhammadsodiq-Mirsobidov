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

  // Gemini API Initialization
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Personal AI Assistant Route (Muhammadsodiq's Assistant)
  app.post("/api/ai/assistant", async (req, res) => {
    try {
      const { message, isAdminAway } = req.body;
      
      const systemPrompt = isAdminAway 
        ? "Siz Muhammadsodiqning shaxsiy yordamchisiz. Muhammadsodiq hozir band, shuning uchun siz u uchun javob beryapsiz. Gapni 'Muhammadsodiqning hozir vaqti yo'q, men u bilan alohida gaplashaman' deb boshlang va foydalanuvchiga yordam bering."
        : "Siz Articraft platformasining aqlli yordamchisiz. Foydalanuvchilarga platformadan foydalanish, ish jarayonlari va boshqa texnik masalalarda yordam bering.";

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction: systemPrompt },
      });

      const result = await chat.sendMessage({ message });
      res.json({ text: result.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Basic in-memory store for demo (Clear on restart)
  let generalChatMessages: any[] = [];
  let userRequests: any[] = [];
  let users: any[] = [
    { id: '1', name: 'Ali', isPremium: false, isBanned: false },
    { id: '2', name: 'Vali', isPremium: true, isBanned: false }
  ];

  app.get("/api/admin/data", (req, res) => {
    res.json({ users, requests: userRequests });
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
