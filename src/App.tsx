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
  MousePointer2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Floating AI Component ---

const FloatingAI = ({ isAdminAway }: { isAdminAway: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const aiRef = useRef<HTMLDivElement>(null);

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
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, isAdminAway }),
      });
      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const { rotateX, rotateY } = calculateRotation();

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
              <span className="text-xs font-bold text-slate-800">AI Yordamchi</span>
              <button onClick={() => setIsOpen(false)}><X size={14} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide text-[11px]">
              {messages.length === 0 && (
                <div className="text-center py-10 opacity-50">
                   <p>Qanday yordam bera olaman?</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 rounded-xl max-w-[80%] ${m.role === 'user' ? 'bg-brand-primary text-white' : 'bg-slate-100'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && <Loader2 size={12} className="animate-spin text-brand-primary" />}
            </div>
            <div className="p-2 border-t border-brand-border flex gap-1">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-xs outline-none" 
                placeholder="Savol yozing..." 
              />
              <button onClick={sendMessage} className="bg-brand-primary text-white p-2 rounded-lg"><Send size={12}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={aiRef}
        style={{ perspective: 1000, rotateX, rotateY }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-primary rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-4 border-white overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-secondary to-indigo-400 opacity-50"></div>
        <Sparkles size={28} className="text-white relative z-10" />
        {/* Looking Eyes animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 z-20">
           <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
           <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
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
      const res = await fetch('/api/chat/general');
      const data = await res.json();
      setMessages(data);
    };
    fetchGeneral();
    const interval = setInterval(fetchGeneral, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !user.isPremium) return;
    const msg = { senderName: user.name, text: input, timestamp: new Date().toISOString() };
    await fetch('/api/chat/general', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    setInput('');
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
  const [replyText, setReplyText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showLiveConfirm, setShowLiveConfirm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fetchData = async () => {
    const res = await fetch('/api/admin/data');
    const data = await res.json();
    setUsers(data.users);
    setRequests(data.requests);
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Kameraga ruxsat berilmadi yoki xatolik yuz berdi.");
    }
  };

  const handleAction = async (action: string, id: string, extra?: any) => {
    const body: any = { action };
    if (action === 'premium' || action === 'ban') body.userId = id;
    if (action === 'request-reply') {
       body.requestId = id;
       body.response = extra;
    }
    await fetch('/api/admin/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    fetchData();
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
                        className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all"
                      >
                        Ha, Yoqilsin
                      </button>
                      <button 
                        onClick={() => setShowLiveConfirm(false)}
                        className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
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
  const [isAdminMode, setIsAdminMode] = useState(true);

  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User>({
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    name: "Mehmon",
    email: "guest@example.com",
    avatar: "https://ui-avatars.com/api/?name=Guest&background=4f46e5&color=fff",
    bio: "Platforma foydalanuvchisi",
    role: 'user',
    isPremium: false,
    isBanned: false,
    status: 'online'
  });

  const updateAvatar = (newUrl: string) => {
    if (!user.isPremium) return;
    setUser(prev => ({ ...prev, avatar: newUrl }));
  };

  const handleLogin = () => {
    const name = loginName.trim();
    if (!name) return;
    
    if (name === '67 Best BrainRot') {
      setUser({
        id: 'admin_1',
        name: '67 Best BrainRot',
        email: 'admin@articraft.uz',
        avatar: 'https://ui-avatars.com/api/?name=67+Best+BrainRot&background=111827&color=fff',
        bio: 'Articraft platformasi yaratuvchisi va yagona admin.',
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
        email: 'user@example.com',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
        bio: 'Articraft foydalanuvchisi.',
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Xush Kelibsiz!</h1>
          <p className="text-slate-500 mb-8 italic">Articraft Work platformasiga kirish uchun ismingizni yozing.</p>
          <input 
            value={loginName}
            onChange={e => setLoginName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Ismingizni kiriting..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 mb-4 focus:ring-2 ring-brand-primary outline-none transition-all"
          />
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
             <span className="text-xl font-bold tracking-tight text-slate-800">Articraft Work</span>
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
                  <h1 className="text-5xl font-bold tracking-tight text-slate-900">Ish va Xizmatlar Platformasi</h1>
                  <p className="text-lg text-slate-500 italic">Oddiy, tez va xavfsiz ish tartibi.</p>
               </div>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm">
                     <Clock size={32} className="text-brand-primary mb-4" />
                     <h3 className="text-xl font-bold mb-2">Vaqtni Tejang</h3>
                     <p className="text-sm text-slate-500 leading-relaxed">Barchasini bitta joyda boshqaring. Muhammadsodiq bilan bog'lanish uchun so'rovlar yuboring.</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm">
                     <Zap size={32} className="text-brand-primary mb-4" />
                     <h3 className="text-xl font-bold mb-2">Premium Imkoniyatlar</h3>
                     <p className="text-sm text-slate-500 leading-relaxed">Premium statusga ega bo'ling va umumiy chat orqali hamjamiyat bilan muloqot qiling.</p>
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

      <FloatingAI isAdminAway={user.role !== 'admin'} />
    </div>
  );
}
