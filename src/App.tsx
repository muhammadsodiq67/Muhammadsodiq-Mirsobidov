import { useState, useEffect, useRef } from "react";
import { Message, User, ServiceRequest } from "./types";
import { 
  Home, 
  MessageCircle, 
  User as UserIcon, 
  Send,
  Loader2,
  Menu,
  X,
  Shield,
  Zap,
  Clock,
  Video,
  Check,
  Ban,
  Bell,
  Sparkles,
  MousePointer2,
  BookOpen,
  Calculator,
  Compass,
  Heart,
  Search,
  ArrowLeft,
  HelpCircle
} from "lucide-react";
import { schoolBooks, Book, Chapter } from "./booksData";
import { motion, AnimatePresence } from "motion/react";
import FallingKoala from "./components/FallingKoala";
import TypingToy from "./components/TypingToy";

// --- Floating AI Component ---

const FloatingAI = ({ user, isAdminAway }: { user: User, isAdminAway: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const aiRef = useRef<HTMLDivElement>(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/ai/history/${user.id}`);
      const data = await res.json();
      setMessages(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
      const interval = setInterval(fetchHistory, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user.id]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateRotation = () => {
    if (!aiRef.current) return { rotateX: 0, rotateY: 0 };
    const rect = aiRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angleX = (mousePos.y - centerY) / 20;
    const angleY = (mousePos.x - centerX) / 20;
    return { rotateX: -angleX, rotateY: angleY };
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input, senderName: user.nickname };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          userId: user.id, 
          nickname: user.nickname, 
          isAdminAway 
        }),
      });
      const data = await response.json();
      if (data.text) {
        // History will be refreshed by interval if open
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const { rotateX, rotateY } = calculateRotation();

  const getEyeOffset = () => {
    if (!aiRef.current) return { x: 0, y: 0 };
    const rect = aiRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxMove = 2.5;
    
    return {
      x: (dx / (dist || 1)) * Math.min(dist / 50, maxMove),
      y: (dy / (dist || 1)) * Math.min(dist / 50, maxMove)
    };
  };

  const eyeOffset = getEyeOffset();

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-brand-border mb-4 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-brand-border bg-slate-50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 Articraft Edu AI Assistant
              </span>
              <button onClick={() => setIsOpen(false)}><X size={14} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide text-[11px]">
              {messages.length === 0 && (
                <div className="text-center py-12 flex flex-col items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                      <Sparkles size={20} className="text-brand-primary" />
                   </div>
                   <div className="space-y-1">
                      <p className="font-bold text-slate-700">Qanday yordam bera olaman?</p>
                      <p className="text-slate-400">Men darslar, maktab fanlari va platforma haqida savollarga javob beraman.</p>
                   </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2.5 rounded-2xl max-w-[85%] shadow-sm ${m.role === 'user' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-800'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                   <div className="bg-slate-50 p-2 rounded-xl flex gap-1">
                      <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-brand-border flex gap-2 bg-slate-50/50">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-white border border-brand-border rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 ring-brand-primary shadow-inner" 
                placeholder="Xabar yozing..." 
              />
              <button onClick={sendMessage} className="bg-brand-primary text-white p-2.5 rounded-xl shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"><Send size={14}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={aiRef}
        style={{ perspective: 1000, rotateX, rotateY }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-4 border-brand-primary overflow-hidden relative group"
      >
        <div className="absolute inset-0 bg-indigo-50/30 group-hover:bg-indigo-100/50 transition-colors"></div>
        
        {/* Assistant Mascot */}
        <div className="w-10 h-8 bg-brand-primary rounded-xl relative z-10 flex flex-col items-center justify-center shadow-lg">
           <div className="w-8 h-1 bg-brand-secondary/40 absolute top-1 rounded-full"></div>
           {/* Eyes */}
           <div className="flex gap-1.5 mt-1">
              <div className="w-2.5 h-2.5 bg-white rounded-full relative overflow-hidden flex items-center justify-center">
                 <motion.div 
                    animate={{ x: eyeOffset.x, y: eyeOffset.y }}
                    className="w-1 h-1 bg-slate-900 rounded-full"
                 />
              </div>
              <div className="w-2.5 h-2.5 bg-white rounded-full relative overflow-hidden flex items-center justify-center">
                 <motion.div 
                    animate={{ x: eyeOffset.x, y: eyeOffset.y }}
                    className="w-1 h-1 bg-slate-900 rounded-full"
                 />
              </div>
           </div>
        </div>
        
        {/* Little antenna */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-brand-primary z-0">
           <div className="w-1.5 h-1.5 bg-brand-secondary rounded-full -mt-1 -ml-0.5 animate-pulse"></div>
        </div>
      </motion.div>
    </div>
  );
};

// --- General Chat Section ---

const GeneralChat = ({ user }: { user: User }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchGeneral = async () => {
      try {
        const res = await fetch('/api/chat/general');
        if (!res.ok) throw new Error('Chat catch error');
        const data = await res.json();
        setMessages(data || []);
      } catch (e) {
        console.warn("General chat fetch failed", e);
      }
    };
    fetchGeneral();
    const interval = setInterval(fetchGeneral, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !user.isPremium) return;
    const msg = { senderName: user.nickname, text: input, timestamp: new Date().toISOString() };
    try {
      const res = await fetch('/api/chat/general', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      if (!res.ok) throw new Error('Chat send error');
      setInput('');
    } catch (e) {
      console.warn("Failed to send chat message", e);
    }
  };

  if (!user.isPremium) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <Shield size={48} className="text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Umumiy Chat Faqat Premium Uchun</h3>
        <p className="text-sm text-slate-500 max-w-sm">Afsuski, siz umumiy chatga qo'shila olmaysiz. Muallifdan (Muhammadsodiqdan) premium status so'rang.</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex flex-col bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-sm">Umumiy Chat</h3>
        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Premium Faol</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-[10px] font-bold text-brand-primary">{m.senderName}</span>
            <div className="bg-slate-50 p-3 rounded-xl rounded-tl-none border border-slate-100 text-sm mt-1">
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Hammaga yozing..." 
          className="flex-1 bg-slate-50 px-4 py-2 rounded-xl text-sm outline-none border border-transparent focus:border-brand-primary"
        />
        <button onClick={sendMessage} className="bg-brand-primary text-white p-2 px-4 rounded-xl font-bold text-sm">Send</button>
      </div>
    </div>
  );
};

// --- Request Form Section ---

const RequestSection = ({ user }: { user: User }) => {
  const [type, setType] = useState<'general' | 'meet'>('general');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromUserId: user.id,
        fromUserName: user.name,
        type,
        message,
      }),
    });
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm mb-12">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Muhammadsodiqga Murojaat</h3>
      <div className="space-y-4">
        <div className="flex gap-4">
          <button 
            onClick={() => setType('general')}
            className={`flex-1 p-4 rounded-xl border transition-all text-sm font-bold flex flex-col items-center gap-2 ${type === 'general' ? 'border-brand-primary bg-indigo-50 text-brand-primary' : 'border-slate-100 hover:bg-slate-50'}`}
          >
            <Bell size={20} /> Iltimos/Taklif
          </button>
          <button 
            onClick={() => setType('meet')}
            className={`flex-1 p-4 rounded-xl border transition-all text-sm font-bold flex flex-col items-center gap-2 ${type === 'meet' ? 'border-brand-primary bg-indigo-50 text-brand-primary' : 'border-slate-100 hover:bg-slate-50'}`}
          >
            <Video size={20} /> Suhbat So'rovi
          </button>
        </div>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Murojaatingizni yozing..."
          className="w-full h-32 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-1 ring-brand-primary outline-none"
        />
        <button 
          onClick={handleSubmit}
          className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-brand-secondary transition-all flex items-center justify-center gap-2"
        >
          {sent ? <Check size={20} /> : <Send size={20} />}
          {sent ? 'Yuborildi!' : 'Yuborish'}
        </button>
      </div>
    </div>
  );
};

// --- Admin Dashboard (Only for Muhammadsodiq) ---

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [assistantChats, setAssistantChats] = useState<Record<string, any[]>>({});
  const [selectedUserChat, setSelectedUserChat] = useState<string | null>(null);
  const [adminReply, setAdminReply] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showLiveConfirm, setShowLiveConfirm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Admin data fetch error');
      const data = await res.json();
      setUsers(data.users || []);
      setRequests(data.requests || []);
      setAssistantChats(data.assistantChats || {});
    } catch (e) {
      console.warn("Failed to fetch admin data", e);
    }
  };

  const sendAdminReply = async () => {
    if (!selectedUserChat || !adminReply.trim()) return;
    await fetch('/api/admin/assistant-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUserChat, message: adminReply }),
    });
    setAdminReply('');
    fetchData();
  };

  useEffect(() => {
    fetchData();
    const int = setInterval(fetchData, 5000);
    return () => {
      clearInterval(int);
      stopStream();
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const startStream = async () => {
    console.log("Attempting to start live stream...");
    try {
      // Try with both video and audio first
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        videoRef.current.play().catch(e => console.warn("Auto-play failed:", e));
      }
    } catch (err) {
      console.warn("Retrying with video only due to:", err);
      try {
        // Fallback to video only
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsStreaming(true);
          videoRef.current.play().catch(e => console.warn("Auto-play fallback failed:", e));
        }
      } catch (fallbackErr) {
        console.error("Camera error:", fallbackErr);
        alert("Kameraga ruxsat berilmadi. Iltimos: \n1. Brauzer sozlamalaridan ruxsat bering.\n2. Saytni yangi tabda oching.");
      }
    }
  };

  const handleAction = async (action: string, id: string, extra?: any) => {
    try {
      const body: any = { action };
      if (action === 'premium' || action === 'ban') body.userId = id;
      if (action === 'request-reply') {
         body.requestId = id;
         body.response = extra;
      }
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Action failed');
      fetchData();
    } catch (e) {
      console.warn("Failed to perform admin action", e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-24 px-8 pb-10 space-y-12">
      <div className="flex items-center gap-4 mb-8">
        <Shield size={32} className="text-brand-primary" />
        <h2 className="text-3xl font-bold text-slate-800">So'rov Taxtachasi (Admin)</h2>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl min-h-[300px] flex flex-col">
            <div className="relative z-10 flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Video size={24} className="text-rose-400" /> Boshqaruv Markazi
                </h3>
                <p className="text-xs text-slate-400">Video muloqot va jonli suhbat seanslarini shu yerdan boshlang.</p>
              </div>
              {!isStreaming ? (
                <button 
                  onClick={() => setShowLiveConfirm(true)}
                  className="bg-rose-500 hover:bg-rose-600 px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-500/20"
                >
                  LIVE BOSHLASH
                </button>
              ) : (
                <button 
                  onClick={stopStream}
                  className="bg-slate-700 hover:bg-slate-800 px-6 py-3 rounded-xl text-xs font-bold transition-all"
                >
                  LIVE TO'XTATISH
                </button>
              )}
            </div>

            <div className="flex-1 relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 group">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover transition-opacity duration-700 ${isStreaming ? 'opacity-100' : 'opacity-0'}`}
              />
              {!isStreaming && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-4">
                  <Video size={48} className="opacity-20" />
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-600">Video Signal Yo'q</p>
                </div>
              )}
              {isStreaming && (
                <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  LIVE
                </div>
              )}
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
              {showLiveConfirm && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white text-slate-900 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl"
                  >
                    <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Video size={32} />
                    </div>
                    <h4 className="text-2xl font-bold mb-4">Google Kamera yoqilsinmi?</h4>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                      Jonli muloqotni boshlash uchun kamera va mikrofon tizimiga ruxsat berishingiz kerak.
                    </p>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => { setShowLiveConfirm(false); startStream(); }}
                        className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all border-none cursor-pointer"
                      >
                        Ha, Yoqilsin
                      </button>
                      <button 
                        onClick={() => setShowLiveConfirm(false)}
                        className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all border-none cursor-pointer"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Video size={120} />
            </div>
          </div>

          {/* AI Assistant Monitoring Section */}
          <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles size={20} className="text-brand-primary" /> AI Chats Monitoring
            </h3>
            
            <div className="flex gap-4 h-[400px]">
              {/* Users List */}
              <div className="w-1/3 border-r overflow-y-auto pr-4 space-y-2">
                {Object.keys(assistantChats).length === 0 && <p className="text-xs text-slate-400 italic">Hali chatlar yo'q...</p>}
                {Object.keys(assistantChats).map(uid => (
                  <button 
                    key={uid}
                    onClick={() => setSelectedUserChat(uid)}
                    className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all ${selectedUserChat === uid ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}
                  >
                    User: {uid.split('_')[0]}...
                  </button>
                ))}
              </div>

              {/* Chat View */}
              <div className="flex-1 flex flex-col bg-slate-50/50 rounded-2xl overflow-hidden">
                {selectedUserChat ? (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                      {assistantChats[selectedUserChat].map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-start' : 'items-end'}`}>
                          <span className="text-[10px] font-bold text-slate-400 mb-1">{m.senderName}</span>
                          <div className={`p-3 rounded-2xl max-w-[80%] text-[11px] shadow-sm ${m.role === 'user' ? 'bg-white text-slate-800 rounded-tl-none' : 'bg-brand-primary text-white rounded-tr-none'}`}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t bg-white flex gap-2">
                       <input 
                         value={adminReply}
                         onChange={e => setAdminReply(e.target.value)}
                         onKeyDown={e => e.key === 'Enter' && sendAdminReply()}
                         placeholder="Foydalanuvchiga javob yozing..."
                         className="flex-1 px-4 py-2 bg-slate-50 rounded-xl text-xs outline-none"
                       />
                       <button onClick={sendAdminReply} className="bg-slate-900 text-white p-2 rounded-xl shadow-md">
                         <Send size={14} />
                       </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-300 text-sm italic">
                    Monitoring uchun foydalanuvchini tanlang
                  </div>
                )}
              </div>
            </div>
          </div>

          <h3 className="font-bold text-lg text-slate-700">Tizim So'rovlari</h3>
          <div className="space-y-4">
            {requests.length === 0 && <p className="text-slate-400 italic">Hozircha so'rovlar yo'q...</p>}
            {requests.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${req.type === 'meet' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {req.type === 'meet' ? 'Suhbat' : 'Iltimos'}
                    </span>
                    <h4 className="font-bold mt-2 text-slate-800">{req.fromUserName}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400">{new Date(req.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-slate-600 mb-6 italic">"{req.message}"</p>
                {req.status === 'pending' ? (
                  <div className="space-y-3">
                    <input 
                      placeholder="Javob xabari (masalan: Soat 15:00 da gaplashamiz)" 
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-lg"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                    />
                    <div className="flex gap-2">
                       <button 
                        onClick={() => { handleAction('request-reply', req.id, { status: 'accepted', message: replyText }); setReplyText(''); }}
                        className="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold"
                       >Qabul qilish</button>
                       <button 
                         onClick={() => { handleAction('request-reply', req.id, { status: 'declined', message: 'Hozir iloji yo\'q' }); setReplyText(''); }}
                         className="flex-1 bg-rose-500 text-white py-2 rounded-lg text-xs font-bold"
                       >Rad etish</button>
                    </div>
                  </div>
                ) : (
                  <div className={`text-xs font-bold p-2 text-center rounded-lg ${req.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    Status: {req.status === 'accepted' ? 'Qabul qilingan' : 'Rad etilgan'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
          <h3 className="font-bold text-lg text-slate-700">Foydalanuvchilar</h3>
          <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-brand-border">
                <tr>
                  <th className="p-4 text-left">Ism</th>
                  <th className="p-4 text-center">Premium</th>
                  <th className="p-4 text-center">Amal</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className={`border-b border-slate-50 ${u.isBanned ? 'opacity-30' : ''}`}>
                    <td className="p-4 font-bold text-slate-700">{u.name}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleAction('premium', u.id)}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full ${u.isPremium ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                      >
                        {u.isPremium ? 'HA' : 'YO\'Q'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleAction('ban', u.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Ban size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  // Initial Identity Check
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginNickname, setLoginNickname] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(true);

  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User>({
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    name: "Mehmon",
    nickname: "Guest",
    email: "guest@example.com",
    avatar: "https://ui-avatars.com/api/?name=Guest&background=4f46e5&color=fff",
    bio: "Articraft Edu o'quvchisi",
    role: 'user',
    isPremium: false,
    isBanned: false,
    status: 'online'
  });

  const [selectedGrade, setSelectedGrade] = useState<number | null>(1);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAiAnalysis, setLoadingAiAnalysis] = useState(false);

  const askAiAboutChapter = async (book: Book, chapter: Chapter) => {
    setActiveChapter(chapter);
    setAiAnalysis('');
    setLoadingAiAnalysis(true);
    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `Siz bolalar uchun mehribon o'qituvchisiz. Menga ${book.grade}-sinf "${book.title}" kitobining "${chapter.title}" mavzusi haqida qisqacha va juda qiziqarli dars tushuntirib bering. Matn o'quvchi tez va oson tushunishi uchun oddiy, sodda va 3-4 gapdan iborat bo'lsin. Mavzuning qisqacha mazmuni: "${chapter.excerpt}". Ochiq-oydin va quvnoq tilda yozing!`,
          userId: user.id, 
          nickname: user.nickname, 
          isAdminAway: true 
        }),
      });
      const data = await response.json();
      if (data.text) {
        setAiAnalysis(data.text);
      } else {
        setAiAnalysis("Mavzu bo'yicha tushuntirish yuklanmadi. Iltimos qayta urinib ko'ring.");
      }
    } catch (err) {
      console.error(err);
      setAiAnalysis("Kechirasiz, sun'iy intellekt bilan bog'lanishda muammo yuz berdi. Internetni tekshiring.");
    } finally {
      setLoadingAiAnalysis(false);
    }
  };

  const updateAvatar = (newUrl: string) => {
    if (!user.isPremium) return;
    setUser(prev => ({ ...prev, avatar: newUrl }));
  };

  const handleLogin = () => {
    const name = loginName.trim();
    const nickname = loginNickname.trim() || name;
    if (!name) return;
    
    if (name === 'Mirsobidovlar') {
      setUser({
        id: 'admin_1',
        name: 'Mirsobidovlar',
        nickname: nickname,
        email: 'admin@articraft.uz',
        avatar: 'https://ui-avatars.com/api/?name=Mirsobidovlar&background=111827&color=fff',
        bio: "Articraft Edu yordamchisi va admin.",
        role: 'admin',
        isPremium: true,
        isBanned: false,
        status: 'online'
      });
      setIsAdminMode(true);
    } else {
      setUser({
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: name,
        nickname: nickname,
        email: 'user@example.com',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
        bio: "Articraft Edu o'quvchisi.",
        role: 'user',
        isPremium: false,
        isBanned: false,
        status: 'online'
      });
      setIsAdminMode(false);
    }
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-brand-border text-center"
        >
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
            <Zap size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Articraft Edu</h1>
          <p className="text-slate-500 mb-8 italic">Zamonaviy ta'lim platformasiga xush kelibsiz. Sinfingizni va ismingizni kiriting.</p>
          <div className="space-y-3 mb-6">
            <input 
              value={loginName}
              onChange={e => setLoginName(e.target.value)}
              placeholder="Ismingizni kiriting..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 ring-brand-primary outline-none transition-all"
            />
            <input 
              value={loginNickname}
              onChange={e => setLoginNickname(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Nik (Nickname) kiriting..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 ring-brand-primary outline-none transition-all"
            />
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-brand-secondary transition-all"
          >
            Kirish
          </button>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'home', label: 'Bosh sahifa', icon: Home },
    { id: 'chat', label: 'Chatlar', icon: MessageCircle },
    { id: 'profile', label: 'Profil', icon: UserIcon },
    ...(user.role === 'admin' && isAdminMode ? [{ id: 'admin', label: 'Admin', icon: Shield }] : [])
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-slate-900 overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-brand-border h-16 flex items-center shadow-sm px-8">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
             <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-white" />
             </div>
             <span className="text-xl font-bold tracking-tight text-slate-800">Articraft Edu</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-6 text-sm font-medium text-slate-500">
               {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`transition-colors py-1 ${activeTab === tab.id ? 'text-brand-primary border-b-2 border-brand-primary' : 'hover:text-slate-800'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <button 
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${isAdminMode ? 'bg-slate-900 text-white' : 'bg-brand-primary text-white'}`}
                >
                  {isAdminMode ? 'ADMIN REJIM' : 'USER REJIMIGA O\'TISH'}
                </button>
              )}
              {user.role !== 'admin' && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">USER</span>
              )}
              <button 
                onClick={() => { setIsLoggedIn(false); setLoginName(''); setActiveTab('home'); }}
                className="text-[10px] font-bold text-rose-500 hover:outline rounded p-1"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12">
               <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/50 text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles size={14} className="animate-spin-slow" /> EduBaza Platformasiga ulangan xizmat
                  </div>
                  <h1 className="text-5xl font-bold tracking-tight text-slate-900">Zamonaviy Maktab Ta'limi</h1>
                  <p className="text-lg text-slate-500 max-w-xl mx-auto">1-sinfdan 11-sinfgacha bo'lgan barcha maktab darsliklari, kitoblari va mavzulari bitta joyda.</p>
               </div>

               {/* Falling Koala holding bamboo (Minecraft Slime Block physical bounce) */}
               <FallingKoala />
               
               {/* Grade Selection */}
               <div className="space-y-4 bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="text-base font-bold text-slate-800">Sinfni Tanlang</h3>
                    {selectedGrade && (
                      <span className="text-xs font-black text-brand-primary bg-indigo-50 px-3 py-1 rounded-full">{selectedGrade}-Sinf tanlandi</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {Array.from({ length: 11 }, (_, i) => i + 1).map(grade => {
                      const isActive = selectedGrade === grade;
                      return (
                        <button 
                          key={grade}
                          onClick={() => {
                            setSelectedGrade(grade);
                            setSelectedBook(null);
                          }}
                          className={`p-4 rounded-2xl font-bold text-sm transition-all border cursor-pointer text-center flex flex-col items-center justify-center gap-1 ${
                            isActive 
                              ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-indigo-100 scale-[1.03]' 
                              : 'bg-slate-50/50 border-slate-100 text-slate-700 hover:bg-white hover:border-brand-primary/50'
                          }`}
                        >
                          <span className="text-xl">🎒</span>
                          <span>{grade}-Sinf</span>
                        </button>
                      );
                    })}
                  </div>
               </div>

               {/* Book Finder Search Bar */}
               <div className="relative flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`${selectedGrade ? `${selectedGrade}-sinf darsliklaridan` : "Barcha sinf kitoblaridan"} qidirish (Masalan: Matematika, Algebra, Alifbe)...`}
                      className="w-full bg-white border border-brand-border rounded-2xl pl-12 pr-6 py-4 text-sm outline-none focus:ring-2 ring-brand-primary shadow-inner transition-all"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
                      >
                        Tozalash
                      </button>
                    )}
                  </div>
               </div>

               {/* Textbooks List */}
               <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                       <BookOpen size={20} className="text-brand-primary" /> 
                       {selectedGrade ? `${selectedGrade}-Sinf Darslik va Kitoblari` : "Kitoblar To'plami"}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">Barchasi bepul va ochiq shaklda</span>
                 </div>

                 {(() => {
                   const filteredBooks = schoolBooks.filter(book => {
                     const matchesGrade = selectedGrade ? book.grade === selectedGrade : true;
                     const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                           book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
                     return matchesGrade && matchesSearch;
                   });

                   if (filteredBooks.length === 0) {
                     return (
                       <div className="text-center p-12 bg-white rounded-3xl border border-dashed border-slate-200">
                          <p className="text-slate-400 text-sm mb-2">Hech qanday darslik yoki kitob topilmadi.</p>
                          <button 
                            onClick={() => { setSearchQuery(''); setSelectedGrade(null); }}
                            className="text-xs font-bold text-brand-primary hover:underline"
                          >
                            Filtrlarni tozalash
                          </button>
                       </div>
                     );
                   }

                   return (
                     <div className="grid sm:grid-cols-2 gap-6">
                       {filteredBooks.map((book) => (
                         <motion.div 
                           key={book.id}
                           whileHover={{ y: -6, scale: 1.01 }}
                           onClick={() => {
                             setSelectedBook(book);
                             setActiveChapter(null);
                             setAiAnalysis('');
                           }}
                           className="bg-white border border-brand-border rounded-3xl p-5 flex gap-5 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group"
                         >
                           {/* Book Spine Simulation Graphic */}
                           <div className={`w-24 h-32 rounded-xl bg-gradient-to-br ${book.coverColor} flex-shrink-0 relative overflow-hidden shadow-md flex flex-col justify-between p-3 text-white`}>
                             <div className="absolute top-0 right-0 p-1 opacity-20">
                               <BookOpen size={48} />
                             </div>
                             <span className="text-[9px] uppercase tracking-widest font-bold opacity-80">{book.subject}</span>
                             <div className="space-y-1">
                               <h4 className="text-xs font-black line-clamp-2 leading-tight">{book.title}</h4>
                               <p className="text-[8px] opacity-75">{book.grade}-Sinf</p>
                             </div>
                             <div className="h-1 w-full bg-white/20 rounded-full"></div>
                           </div>

                           {/* Book Details */}
                           <div className="flex-1 flex flex-col justify-between py-1">
                             <div>
                               <div className="flex items-center gap-2 mb-1.5">
                                 <span className="text-[10px] font-bold uppercase py-0.5 px-2 rounded-full bg-slate-100 text-slate-600">
                                   {book.subject}
                                 </span>
                                 <span className="text-[10px] text-slate-400 font-bold">{book.year}-yil darsligi</span>
                               </div>
                               <h3 className="font-bold text-base text-slate-800 group-hover:text-brand-primary transition-colors line-clamp-1">{book.title}</h3>
                               <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{book.description}</p>
                             </div>
                             
                             <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10px] text-slate-400 font-mono">
                               <span>Yozuvchi: {book.author.split(',')[0]}</span>
                               <span className="font-bold text-brand-primary flex items-center gap-1">O'qish <ArrowLeft size={10} className="rotate-180" /></span>
                             </div>
                           </div>
                         </motion.div>
                       ))}
                     </div>
                   );
                 })()}
               </div>

               {/* Detailed Book Overlay Modal */}
               <AnimatePresence>
                 {selectedBook && (
                   <div className="fixed inset-0 z-[120] bg-black/60 p-4 sm:p-6 flex items-center justify-center backdrop-blur-sm overflow-y-auto">
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.95, y: 15 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95, y: 15 }}
                       className="bg-white rounded-[2.5rem] shadow-2xl border border-brand-border max-w-3xl w-full overflow-hidden flex flex-col md:flex-row my-auto max-h-[90vh]"
                     >
                       {/* Left Panel: Cover & Info */}
                       <div className="md:w-72 bg-slate-50 border-r border-brand-border p-8 flex flex-col items-center justify-between gap-6 overflow-y-auto min-h-[300px] md:min-h-0">
                         <div className="w-full">
                           <button 
                             onClick={() => setSelectedBook(null)}
                             className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 text-xs font-black mb-6 cursor-pointer"
                           >
                             <ArrowLeft size={14} /> ORQAGA QAYTISH
                           </button>

                           {/* Book Cover 3D style */}
                           <div className={`w-44 h-60 mx-auto rounded-2xl bg-gradient-to-br ${selectedBook.coverColor} p-6 text-white flex flex-col justify-between shadow-2xl relative select-none`}>
                             <div className="absolute top-0 right-0 p-3 opacity-10">
                               <BookOpen size={96} />
                             </div>
                             <div>
                               <span className="text-[10px] uppercase font-black tracking-widest opacity-90 block mb-1">{selectedBook.subject}</span>
                               <p className="text-xs font-bold opacity-75">{selectedBook.grade}-Sinf darsligi</p>
                             </div>
                             <div className="space-y-2">
                               <h2 className="text-xl font-extrabold leading-tight tracking-tight">{selectedBook.title}</h2>
                               <p className="text-[10px] opacity-80">{selectedBook.author}</p>
                             </div>
                             <div className="flex justify-between items-center pt-2 border-t border-white/20 text-[9px] font-mono select-none">
                               <span>{selectedBook.pages} bet</span>
                               <span>Nashr: {selectedBook.year}</span>
                             </div>
                           </div>
                         </div>

                         {/* Book stats */}
                         <div className="w-full bg-white p-4 rounded-2xl border border-brand-border/60 space-y-2.5 text-xs">
                           <div className="flex justify-between text-slate-500">
                             <span>Nashriyoti yili:</span>
                             <strong className="text-slate-800">{selectedBook.year}</strong>
                           </div>
                           <div className="flex justify-between text-slate-500">
                             <span>Fani turi:</span>
                             <strong className="text-slate-800">{selectedBook.subject}</strong>
                           </div>
                           <div className="flex justify-between text-slate-500">
                             <span>Varaqlar soni:</span>
                             <strong className="text-slate-800">{selectedBook.pages} bet</strong>
                           </div>
                           <div className="flex justify-between text-slate-500">
                             <span>Sinf darajasi:</span>
                             <strong className="text-slate-800">{selectedBook.grade}-Sinf</strong>
                           </div>
                         </div>
                       </div>

                       {/* Right Panel: Chapters & AI Assistant */}
                       <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-between gap-6 max-h-[90vh]">
                         <div className="space-y-6">
                           <div className="flex justify-between items-start">
                             <div>
                               <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedBook.title}</h2>
                               <p className="text-sm text-slate-400 mt-0.5">Muallif: {selectedBook.author}</p>
                             </div>
                             <button 
                               onClick={() => setSelectedBook(null)}
                               className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                             >
                               <X size={20} />
                             </button>
                           </div>

                           <p className="text-xs text-slate-500 leading-relaxed bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/30">
                             {selectedBook.description}
                           </p>

                           {/* Chapters section */}
                           <div className="space-y-3">
                             <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Darslik Kitob Mavzulari</h3>
                             <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                               {selectedBook.chapters.map((chapter, idx) => {
                                 const isCurrentlyActive = activeChapter?.title === chapter.title;
                                 return (
                                   <div 
                                     key={idx}
                                     onClick={() => askAiAboutChapter(selectedBook, chapter)}
                                     className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex justify-between items-center gap-4 ${
                                       isCurrentlyActive 
                                         ? 'bg-indigo-50 border-brand-primary text-brand-primary shadow-sm' 
                                         : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700'
                                     }`}
                                   >
                                     <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-bold text-slate-400">Mavzu {idx + 1}:</span>
                                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{chapter.title}</h4>
                                        </div>
                                        <p className="text-[10px] text-slate-400 line-clamp-1">{chapter.excerpt}</p>
                                     </div>
                                     <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[10px]">
                                        <span className="text-slate-400">{chapter.pages} bet</span>
                                        <div className="bg-indigo-500/10 text-brand-primary p-1 rounded-lg">
                                          <Sparkles size={12} />
                                        </div>
                                     </div>
                                   </div>
                                 );
                               })}
                             </div>
                           </div>
                         </div>

                         {/* Interactive AI Teacher helper section */}
                         <div className="bg-slate-50 rounded-2xl border border-brand-border p-5 relative overflow-hidden">
                           {activeChapter ? (
                             <div className="space-y-3 relative z-10">
                               <div className="flex gap-2 items-center text-xs font-bold text-brand-primary">
                                 <Sparkles size={14} className="animate-pulse" />
                                 <span>{activeChapter.title} - AI O'qituvchi yordamchi darsi</span>
                               </div>

                               {loadingAiAnalysis ? (
                                 <div className="flex items-center gap-2 py-4">
                                   <Loader2 size={16} className="animate-spin text-brand-primary" />
                                   <span className="text-xs text-slate-400 italic">Sun'iy intellekt tushuntirish yozmoqda...</span>
                                 </div>
                               ) : (
                                 <div className="space-y-3">
                                   <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-brand-border">
                                     {aiAnalysis}
                                   </p>
                                   <div className="text-[10px] text-slate-400 bg-emerald-50 text-emerald-700 p-2 rounded-lg font-bold">
                                      💡 Maslahat: Har qanday savolni ekrandagi robot yordamchisidan bemalol so'rashingiz mumkin!
                                    </div>
                                 </div>
                               )}
                             </div>
                           ) : (
                             <div className="text-center py-6 flex flex-col items-center gap-2">
                               <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-brand-primary">
                                 <HelpCircle size={20} />
                               </div>
                               <div>
                                 <h4 className="text-xs font-bold text-slate-700">Mavzuni Tushunmayapsizmi?</h4>
                                 <p className="text-[10px] text-slate-400 mt-0.5">Istalgan mavzuni bosing, sun'iy intellekt dars chiroyli qilib tushuntirib beradi.</p>
                               </div>
                             </div>
                           )}
                         </div>
                       </div>
                     </motion.div>
                   </div>
                 )}
               </AnimatePresence>

               {/* Standard feature cards */}
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm flex gap-4 items-start">
                     <div className="w-12 h-12 bg-indigo-50 text-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                       <Clock size={24} />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold mb-1 text-slate-800">Interaktiv Darslar</h3>
                       <p className="text-xs text-slate-500 leading-relaxed">Har bir sinf uchun maxsus tayyorlangan darsliklar, tushunchalar va materiallar to'plami.</p>
                     </div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm flex gap-4 items-start">
                     <div className="w-12 h-12 bg-indigo-50 text-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                       <Zap size={24} />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold mb-1 text-slate-800">Onlayn Konsultatsiya</h3>
                       <p className="text-xs text-slate-500 leading-relaxed font-medium">Platformada o'quvchilar umumiy chatlarda va AI O'qituvchi bilan bilim oshirishadi.</p>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-indigo-900 text-white rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">Edu Baza Bilimlar Hazinasi</h3>
                    <p className="text-slate-300 text-sm max-w-md">Bizning mutlaqo bepul platformamiz orqali siz istalgan sinf fani bo'yicha eng chuqur bilimlarni olishingiz va dars tayyorlashingiz mumkin.</p>
                  </div>
                  <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Shield size={120} />
                  </div>
               </div>
               <RequestSection user={user} />
            </motion.section>
          )}

          {activeTab === 'chat' && (
            <motion.section key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto">
               <GeneralChat user={user} />
            </motion.section>
          )}

          {activeTab === 'profile' && (
            <motion.section key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
               <div className={`relative p-10 rounded-3xl border flex flex-col md:flex-row items-center gap-8 transition-all duration-500 overflow-hidden ${user.isPremium ? 'bg-gradient-to-br from-amber-50 to-amber-200 border-amber-300 shadow-[0_0_40px_rgba(245,158,11,0.15)] text-amber-900' : 'bg-white border-brand-border text-slate-900'}`}>
                  {user.isPremium && (
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles size={120} className="text-amber-600" />
                    </div>
                  )}
                  
                  <div className="relative group">
                    <img 
                      src={user.avatar} 
                      className={`w-32 h-32 rounded-3xl object-cover transition-all ${user.isPremium ? 'border-4 border-amber-400 shadow-xl' : 'border-4 border-slate-50 shadow-md'}`} 
                    />
                    {user.isPremium && (
                      <button 
                        onClick={() => {
                          const url = prompt("Yangi rasm URL manzilini kiriting:");
                          if (url) updateAvatar(url);
                        }}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-3xl transition-opacity cursor-pointer"
                      >
                        <Sparkles size={24} className="text-white" />
                        <span className="text-[10px] text-white font-bold ml-1 uppercase">O'zgartirish</span>
                      </button>
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                      <h2 className="text-4xl font-black tracking-tight">{user.name}</h2>
                      {user.isPremium && (
                         <div className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-bounce shadow-lg shadow-amber-200">
                           PREMIUM GOLD
                         </div>
                      )}
                    </div>
                    <p className={`${user.isPremium ? 'text-amber-700/80' : 'text-slate-500'} italic text-lg`}>{user.bio}</p>
                    
                    <div className="pt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                       <span className={`text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-2 ${user.isPremium ? 'bg-amber-400/20 text-amber-800' : 'bg-slate-100 text-slate-400'}`}>
                          {user.isPremium ? <Shield size={12} /> : null}
                          {user.isPremium ? 'Daholik Status' : 'Standard Foydalanuvchi'}
                       </span>
                       <span className={`text-[10px] font-bold px-4 py-2 rounded-xl ${user.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100/50 text-slate-500'}`}>
                          ROLE: {user.role.toUpperCase()}
                       </span>
                    </div>

                    {!user.isPremium && (
                      <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                          Sizda hali Premium imkoniyatlar yo'q. Rasm o'zgartirish va oltin profil uchun Muhammadsodiqdan premium status so'rang!
                        </p>
                      </div>
                    )}
                  </div>
               </div>
            </motion.section>
          )}

          {activeTab === 'admin' && user.role === 'admin' && (
            <motion.section key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <AdminDashboard />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <FloatingAI user={user} isAdminAway={user.role !== 'admin'} />
      <TypingToy />
    </div>
  );
}
