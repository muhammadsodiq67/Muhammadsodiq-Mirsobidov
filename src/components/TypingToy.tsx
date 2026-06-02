import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Keyboard, X, RotateCcw, AlertCircle, Award, Sparkles } from "lucide-react";

// Categorized school vocabulary
const WORD_POOLS = {
  sodda: [
    "maktab", "daftar", "kitob", "sinf", "parta", "ustoz", "dars", "olim", "bilim", "qalam", "taxta", "talaba", "uyga", "vazifa", "bahor", "yoz", "kuz", "qish", "oila", "vatan", "do'st", "mehnat", "yulduz", "quyosh", "oy", "shahar", "qishloq", "daryo", "tog'", "gullar", "shirin", "olma", "anor", "uzum"
  ],
  science: [
    "matematika", "fizika", "kimyo", "biologiya", "tarix", "geografiya", "botanika", "algebra", "geometriya", "formula", "teorema", "hujayra", "element", "atom", "molekula", "tajriba", "xarita", "imperiya", "kosmos", "sayyora", "teleskop", "mikroskop", "inersiya", "bosim", "temperatura"
  ],
  it: [
    "informatika", "kompyuter", "dastur", "kod", "interfeys", "sayt", "brauzer", "tarmoq", "kiberxavfsizlik", "algoritm", "python", "javascript", "html", "react", "loyha", "baza", "ekran", "klaviatura", "internet", "drayver", "tizim", "provayder", "xosting", "server", "fayl"
  ]
};

type Mode = "sodda" | "science" | "it";

export default function TypingToy() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("sodda");
  const [timeLeft, setTimeLeft] = useState(15);
  const [maxTime, setMaxTime] = useState(15); // Default 15s selector
  const [isActive, setIsActive] = useState(false);
  
  // Game state
  const [words, setWords] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [typedChars, setTypedChars] = useState<string[]>([]); // Current word status
  
  // Accumulated performance states
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [accuracyHistory, setAccuracyHistory] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // References
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate words based on chosen pool
  const generateWordsList = (selectedMode: Mode) => {
    const pool = WORD_POOLS[selectedMode];
    // Mix and select 40 random words
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = Array.from({ length: 45 }).map(() => shuffled[Math.floor(Math.random() * shuffled.length)]);
    setWords(selected);
    setCurrentWordIdx(0);
    setInputVal("");
    setTypedChars([]);
  };

  const resetGame = (newMaxTime = maxTime, selectedMode = mode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(newMaxTime);
    setMaxTime(newMaxTime);
    setTotalCorrectChars(0);
    setTotalTypedChars(0);
    setWpmHistory([]);
    setAccuracyHistory([]);
    generateWordsList(selectedMode);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Start timer on initial keypress
  const startTimer = () => {
    setIsActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsActive(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle typing input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const val = e.target.value;

    if (!isActive && val.length > 0) {
      startTimer();
    }

    const currentWord = words[currentWordIdx];

    // If space represents submission of current word
    if (val.endsWith(" ")) {
      const typedWord = val.trim();
      
      // Calculate hits and accuracy
      let correctCount = 0;
      for (let i = 0; i < Math.min(typedWord.length, currentWord.length); i++) {
        if (typedWord[i] === currentWord[i]) correctCount++;
      }

      setTotalCorrectChars(prev => prev + correctCount + 1); // +1 for the spaces
      setTotalTypedChars(prev => prev + Math.max(typedWord.length, currentWord.length) + 1);

      // Move to next word
      setCurrentWordIdx(prev => prev + 1);
      setInputVal("");
      setTypedChars([]);

      // If finished list, add some more
      if (currentWordIdx >= words.length - 2) {
        setWords(prev => [...prev, ...[...WORD_POOLS[mode]].sort(() => Math.random() - 0.5).slice(0, 20)]);
      }
      return;
    }

    setInputVal(val);
    setTypedChars(val.split(""));
  };

  // Calculate live WPM and Accuracy
  const calculateStats = () => {
    const elapsedSeconds = maxTime - timeLeft;
    const timeFactor = elapsedSeconds > 0 ? elapsedSeconds / 60 : 1 / 60;
    
    // Average word has 5 letters
    const rawWpm = Math.round((totalCorrectChars / 5) / timeFactor);
    const accuracy = totalTypedChars > 0 ? Math.round((totalCorrectChars / totalTypedChars) * 100) : 100;

    return {
      wpm: rawWpm,
      accuracy: Math.min(accuracy, 100)
    };
  };

  // Focus trigger on window click or box focus
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Setup game on modal mount or switch mode
  useEffect(() => {
    if (isOpen) {
      resetGame(maxTime, mode);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, mode]);

  const { wpm, accuracy } = calculateStats();

  return (
    <>
      {/* Floating Monkeytype Corner Badge Trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-32 right-8 z-[90] flex items-center justify-center p-4 bg-slate-905 bg-slate-900 border-2 border-amber-400 hover:border-amber-300 text-amber-400 font-bold hover:shadow-lg hover:shadow-amber-500/10 rounded-full cursor-pointer shadow-md select-none group focus:outline-none"
      >
        <div className="relative">
          <Keyboard size={24} className="group-hover:rotate-6 transition-all" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-mono tracking-wider whitespace-nowrap">
          TEEZ YOOZISH (MONKEYTYPE)
        </span>
      </motion.button>

      {/* Full Monkeytype Dark Game Canvas Sandbox overlay popup */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[140] bg-black/85 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#1e1e20] rounded-[2rem] border border-[#2c2d30] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col p-8 text-[#e2b714]"
              onClick={focusInput}
            >
              
              {/* Monkeytype Header Navigation selectors */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-[#2c2d30] pb-6 mb-8 gap-4">
                
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/20">
                    <Keyboard size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-wide text-[#e2b714] font-mono">monkeytype.edu</h2>
                    <p className="text-[9px] text-slate-500 font-mono">Tezkor barmoqlar va so'z poygasi</p>
                  </div>
                </div>

                {/* Duration Configurator */}
                <div className="flex items-center gap-6 bg-[#2c2d30]/40 px-5 py-2.5 rounded-2xl border border-[#2c2d30]/60 max-w-sm">
                  
                  {/* Category words style */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fikr:</span>
                    {(["sodda", "science", "it"] as Mode[]).map(categ => (
                      <button
                        key={categ}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMode(categ);
                        }}
                        className={`px-2.5 py-1 rounded-lg uppercase text-[10px] tracking-wide font-black transition-all cursor-pointer ${
                          mode === categ 
                            ? 'bg-[#e2b714] text-[#1e1e20] shadow-md' 
                            : 'hover:text-amber-400/80 text-slate-400'
                        }`}
                      >
                        {categ}
                      </button>
                    ))}
                  </div>

                  <div className="h-4 w-[1px] bg-slate-700"></div>

                  {/* Time Selector */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Vaqt:</span>
                    {[15, 30, 60].map(sec => (
                      <button
                        key={sec}
                        onClick={(e) => {
                          e.stopPropagation();
                          resetGame(sec, mode);
                        }}
                        className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
                          maxTime === sec 
                            ? 'text-[#e2b714] border-b-2 border-[#e2b714]' 
                            : 'hover:text-amber-400/80 text-slate-400'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="p-2 border border-[#2c2d30] text-slate-500 hover:text-white rounded-xl hover:bg-[#2c2d30] transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Central Typing Area */}
              <div className="flex-1 min-h-[180px] flex flex-col justify-center relative my-6">
                
                {/* Real-time stats display during game */}
                <div className="flex justify-start items-center gap-8 mb-6 font-mono text-sm h-10 select-none">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Timer</span>
                    <span className="text-xl font-bold text-white tracking-wider">{timeLeft}s</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">WPM (Tezlik)</span>
                    <span className="text-xl font-bold text-[#e2b714] tracking-wider">{wpm}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Anqilik</span>
                    <span className="text-xl font-bold text-emerald-400 tracking-wider">{accuracy}%</span>
                  </div>
                </div>

                {/* Secret Hidden input that holds keypresses */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  className="absolute opacity-0 pointer-events-none w-1 h-1"
                  autoFocus
                  disabled={isFinished}
                  placeholder="Yozishni boshlang..."
                />

                {/* Live Monkeytype Word Sandbox Panel Rendering */}
                <AnimatePresence mode="wait">
                  {!isFinished ? (
                    <motion.div
                      key="active-typing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-lg sm:text-2xl font-mono leading-relaxed select-text outline-none relative overflow-wrap pr-1 max-h-40 overflow-y-auto cursor-text text-justify"
                      onClick={focusInput}
                    >
                      {/* Interactive Cursor hint */}
                      {!isActive && (
                        <div className="absolute top-0 left-0 bg-amber-500/10 text-[#e2b714] p-3 rounded-xl border border-amber-500/20 text-xs font-bold w-full select-none flex items-center justify-center gap-2 mb-4 animate-pulse">
                          <AlertCircle size={14} />
                          <span>Yozishni boshlash uchun istalgan tugmani bosing va diqqatni jamlang!</span>
                        </div>
                      )}

                      <div className={`flex flex-wrap gap-x-4 gap-y-2 mt-8 ${!isActive ? 'opacity-35 transition-opacity' : ''}`}>
                        {words.map((word, wIdx) => {
                          const isCurrent = wIdx === currentWordIdx;
                          const isBefore = wIdx < currentWordIdx;

                          return (
                            <span 
                              key={wIdx} 
                              className={`relative py-0.5 px-1 rounded-sm ${
                                isCurrent ? 'bg-[#2c2d30] border-b-2 border-amber-500' : ''
                              }`}
                            >
                              {word.split("").map((char, cIdx) => {
                                let charColor = "text-slate-500"; // Default untouched
                                
                                if (isBefore) {
                                  // Past words are fully complete successfully styled
                                  charColor = "text-slate-300";
                                } else if (isCurrent) {
                                  if (cIdx < typedChars.length) {
                                    // Typed character analysis matching index
                                    const isCorrect = typedChars[cIdx] === char;
                                    charColor = isCorrect ? "text-[#e2b714] font-black" : "text-[#ca4754] underline decoration-pink-500 decoration-2";
                                  } else if (cIdx === typedChars.length) {
                                    // Current pending letter showing flashing cursor caret
                                    charColor = "text-white underline decoration-amber-400 decoration-wavy animate-pulse";
                                  }
                                }

                                return (
                                  <span key={cIdx} className={`${charColor} transition-all`}>
                                    {char}
                                  </span>
                                );
                              })}
                              
                              {/* If typed extra chars inside the current word, display those as mistakes */}
                              {isCurrent && typedChars.length > word.length && (
                                <span className="text-[#ca4754] opacity-80 pl-0.5">
                                  {typedChars.slice(word.length).join("")}
                                </span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : (
                    /* Finished Performance Results dashboard block */
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#2c2d30]/30 border border-[#2c2d30] rounded-3xl p-8 text-center space-y-6 flex flex-col items-center justify-center py-10"
                    >
                      <div className="w-16 h-16 bg-amber-500/10 text-[#e2b714] rounded-full flex items-center justify-center border border-amber-500/20 shadow-lg animate-bounce">
                        <Award size={36} />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black tracking-tight text-white font-mono">Mashg'ulot Tugadi!</h3>
                        <p className="text-xs text-slate-400">O'zbek o'quvchilari orasida yangi yuqori natija!</p>
                      </div>

                      <div className="grid grid-cols-3 gap-6 max-w-md w-full bg-[#1e1e20] p-6 rounded-2xl border border-[#2c2d30]/80">
                        <div className="text-center">
                          <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Tezlik (WPM)</p>
                          <p className="text-3xl font-black text-[#e2b714] font-mono mt-1">{wpm}</p>
                          <span className="text-[8px] text-slate-500 block leading-tight">so'z / daqiqa</span>
                        </div>
                        <div className="text-center border-x border-[#2c2d30]">
                          <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Anqiqlik</p>
                          <p className="text-3xl font-black text-emerald-400 font-mono mt-1">{accuracy}%</p>
                          <span className="text-[8px] text-slate-500 block leading-tight">xatolarsiz</span>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Varaqli muddat</p>
                          <p className="text-3xl font-black text-sky-400 font-mono mt-1">{maxTime}s</p>
                          <span className="text-[8px] text-slate-500 block leading-tight">gacha hisob</span>
                        </div>
                      </div>

                      {/* Rank feedback */}
                      <p className="text-xs bg-indigo-500/10 text-amber-300 font-medium px-4 py-2 rounded-xl flex items-center gap-2 border border-amber-500/10">
                        <Sparkles size={14} className="text-amber-400" />
                        🏆 Sizning rutingiz: {
                          wpm > 60 ? "Uzun barmoqli master! ⚡️" : 
                          wpm > 40 ? "Tezkor Yozuvchi 📖" : 
                          wpm > 20 ? "O'quvchi boshlovchi 🌱" : "Sinf topshirig'i bajarilmoqda!"
                        }
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetGame(maxTime, mode);
                        }}
                        className="flex items-center gap-2 bg-[#e2b714] text-[#1e1e20] px-6 py-3.5 rounded-2xl font-black text-sm cursor-pointer shadow-lg hover:shadow-amber-500/20 select-none hover:bg-amber-400 transition-all active:scale-95 mx-auto"
                      >
                        <RotateCcw size={16} />
                        <span>Yana bir bor urinib ko'rish</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Keyboard shortcuts & instructions footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center text-slate-500 border-t border-[#2c2d30] pt-6 gap-4 text-[10px] font-mono select-none">
                <span className="flex items-center gap-1.5 leading-none">
                   <KeyTip label="Space" /> so'zni topshirish 
                   <span className="text-slate-600">|</span> 
                   <KeyTip label="W, A, S, D" /> kabi o'zbek alifbosi
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); resetGame(maxTime, mode); }}
                  className="flex items-center gap-1 text-[11px] underline text-[#e2b714] hover:text-[#f2d044] transition-all cursor-pointer font-bold"
                >
                  <RotateCcw size={12} /> O'yinni noldan boshlash
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

const KeyTip = ({ label }: { label: string }) => (
  <span className="px-1.5 py-0.5 rounded bg-[#2c2d30] border border-[#3e3f42] text-slate-400 font-bold tracking-tight text-[9px] uppercase shadow-sm">
    {label}
  </span>
);
