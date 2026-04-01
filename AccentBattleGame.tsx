import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Anchor, 
  Navigation, 
  Ship, 
  Trophy, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  XCircle,
  Waves,
  Compass,
  Wind,
  User,
  Sword,
  Star,
  Info
} from 'lucide-react';

// --- Types ---
interface WordItem {
  word: string;
  translation: string;
  correctOption: string;
  options: string[];
}

// --- Data ---
const WORDS: WordItem[] = [
  { word: 'Café', translation: 'Սուրճ', correctOption: 'Կա-ֆե՛', options: ['Կա՛-ֆե', 'Կա-ֆե՛'] },
  { word: 'Árbol', translation: 'Ծառ', correctOption: 'Ա՛ր-բոլ', options: ['Ա՛ր-բոլ', 'Ար-բո՛լ'] },
  { word: 'Música', translation: 'Երաժշտություն', correctOption: 'Մու՛-սի-կա', options: ['Մու-սի՛-կա', 'Մու-սի-կա՛', 'Մու՛-սի-կա'] },
  { word: 'Reloj', translation: 'Ժամացույց', correctOption: 'Ռե-լո՛խ', options: ['Ռե-լո՛խ', 'Ռե՛-լոխ'] },
  { word: 'Casa', translation: 'Տուն', correctOption: 'Կա՛-սա', options: ['Կա՛-սա', 'Կա-սա՛'] },
  { word: 'Pájaro', translation: 'Թռչուն', correctOption: 'Պա՛-խա-րո', options: ['Պա՛-խա-րո', 'Պա-խա՛-րո', 'Պա-խա-րո՛'] },
  { word: 'Canción', translation: 'Երգ', correctOption: 'Կան-սյո՛ն', options: ['Կան-սյո՛ն', 'Կա՛ն-սյոն'] },
  { word: 'Lápiz', translation: 'Մատիտ', correctOption: 'Լա՛-պիս', options: ['Լա՛-պիս', 'Լա-պի՛ս'] },
  { word: 'Plátano', translation: 'Բանան', correctOption: 'Պլա՛-տա-նո', options: ['Պլա՛-տա-նո', 'Պլա-տա՛-նո', 'Պլա-տա-նո՛'] },
  { word: 'Comer', translation: 'Ուտել', correctOption: 'Կո-մե՛ր', options: ['Կո-մե՛ր', 'Կո՛-մեր'] },
  { word: 'Mesa', translation: 'Սեղան', correctOption: 'Մե՛-սա', options: ['Մե՛-սա', 'Մե-սա՛'] },
  { word: 'Mágico', translation: 'Կախարդական', correctOption: 'Մա՛-խի-կո', options: ['Մա՛-խի-կո', 'Մա-խի՛-կո', 'Մա-խի-կո՛'] },
  { word: 'Sofá', translation: 'Բազմոց', correctOption: 'Սո-ֆա՛', options: ['Սո-ֆա՛', 'Սո՛-ֆա'] },
  { word: 'Examen', translation: 'Քննություն', correctOption: 'Էկ-սա՛-մեն', options: ['Էկ-սա՛-մեն', 'Է՛կ-սա-մեն', 'Էկ-սա-մե՛ն'] },
  { word: 'Teléfono', translation: 'Հեռախոս', correctOption: 'Տե-լե՛-ֆո-նո', options: ['Տե-լե՛-ֆո-նո', 'Տե՛-լե-ֆո-նո', 'Տե-լե-ֆո-նո՛'] },
];

const THEORY_STEPS = [
  {
    title: "1. Կանոն «N, S կամ Ձայնավոր»",
    content: "Եթե բառը վերջանում է ձայնավորով (a, e, i, o, u) կամ n, s տառերով, շեշտը ընկնում է նախավերջին վանկի վրա:\n\n* HOLA (Օ-լա) — Վերջանում է ձայնավորով:\n* JOVEN (Խո-վեն) — Վերջանում է n-ով:\n* ESTUDIANTE (Էս-տու-դիան-տե) — Վերջանում է ձայնավորով:"
  },
  {
    title: "2. Կանոն «Բաղաձայն»",
    content: "Եթե բառը վերջանում է ցանկացած բաղաձայնով (բացի n և s), շեշտը ընկնում է վերջին վանկի վրա:\n\n* ACTOR (Ակ-տո՛ր) — Վերջանում է r-ով:\n* MADRID (Մադ-րի՛դ) — Վերջանում է d-ով:\n* HOTEL (Օ-տե՛լ) — Վերջանում է l-ով:"
  },
  {
    title: "3. Կանոն «Գրավոր շեշտ» (Tilde)",
    content: "Եթե բառը չի ենթարկվում վերը նշված երկու կանոններին, ապա մենք դնում ենք գրավոր շեշտ (´), որը հուշում է, թե որտեղ պետք է շեշտել:\n\n* MÚSICA (Մու՛-սի-կա) — Շեշտը սկզբում է:\n* FÚTBOL (Ֆու՛տ-բոլ) — Չնայած վերջանում է l-ով, շեշտը սկզբում է:\n* CAFÉ (Կա-ֆե՛) — Չնայած վերջանում է ձայնավորով, շեշտը վերջում է:"
  }
];

export default function AccentBattleGame() {
  const [gameState, setGameState] = useState<'start' | 'theory' | 'playing' | 'finished'>('start');
  const [theoryStep, setTheoryStep] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showPirate, setShowPirate] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<WordItem[]>([]);

  useEffect(() => {
    if (gameState === 'start') {
      setShuffledItems([...WORDS].sort(() => Math.random() - 0.5));
    }
  }, [gameState]);

  const currentItem = shuffledItems[currentIndex];

  const handleChoice = (choice: string) => {
    if (feedback || gameState !== 'playing' || showPirate) return;

    if (choice === currentItem.correctOption) {
      setFeedback('correct');
      setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
      
      setTimeout(() => {
        setFeedback(null);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        if (currentIndex < shuffledItems.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setGameState('finished');
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setShowPirate(true);
      setTimeout(() => {
        setFeedback(null);
        setShowPirate(false);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        if (currentIndex < shuffledItems.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setGameState('finished');
        }
      }, 1500);
    }
  };

  const restart = () => {
    setGameState('start');
    setCurrentIndex(0);
    setScores({ 1: 0, 2: 0 });
    setCurrentPlayer(1);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ef4444] via-[#f97316] to-white text-slate-900 font-sans selection:bg-orange-500/30 overflow-hidden flex flex-col relative">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <Waves className="absolute top-20 left-10 w-20 h-20 text-white animate-bounce" />
        <Wind className="absolute top-40 right-20 w-16 h-16 text-white animate-pulse" />
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-4 border-orange-200 p-6 sticky top-0 z-50 shadow-xl">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-900/20">
              <Ship className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic text-orange-600">Batalla de Acentos</h1>
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.3em]">Շեշտադրման Ծովային Մարտ</p>
            </div>
          </div>

          <div className="flex gap-8">
            <div className={`flex flex-col items-center transition-all duration-500 ${currentPlayer === 1 ? 'scale-110' : 'opacity-50'}`}>
              <div className={`p-2 rounded-xl mb-1 ${currentPlayer === 1 ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-slate-200'}`}>
                <User className={`w-5 h-5 ${currentPlayer === 1 ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Նավապետ 1</p>
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-orange-500" />
                <span className="text-2xl font-black tabular-nums text-slate-800">{scores[1]}</span>
              </div>
            </div>

            <div className="w-[2px] bg-orange-200 self-stretch" />

            <div className={`flex flex-col items-center transition-all duration-500 ${currentPlayer === 2 ? 'scale-110' : 'opacity-50'}`}>
              <div className={`p-2 rounded-xl mb-1 ${currentPlayer === 2 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-200'}`}>
                <User className={`w-5 h-5 ${currentPlayer === 2 ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-red-600">Նավապետ 2</p>
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-red-500" />
                <span className="text-2xl font-black tabular-nums text-slate-800">{scores[2]}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col items-center justify-center gap-12 relative z-10">
        <AnimatePresence mode="wait">
          {gameState === 'start' ? (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-10"
            >
              <div className="relative inline-block">
                <div className="bg-white/20 p-12 rounded-[4rem] border-4 border-white/50 backdrop-blur-xl shadow-2xl">
                  <Compass className="w-32 h-32 text-white mx-auto animate-[spin_10s_linear_infinite]" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none text-white drop-shadow-lg">
                  Շեշտերի <br /> <span className="text-orange-200">Ակադեմիա</span>
                </h2>
                <p className="text-white/90 max-w-md mx-auto font-medium text-lg">
                  Սովորիր իսպաներենի շեշտադրման կանոնները և հաղթիր մարտում:
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setGameState('theory')}
                  className="px-12 py-5 bg-white text-orange-600 rounded-[2rem] font-black uppercase tracking-widest hover:bg-orange-50 transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  <Info className="w-5 h-5" />
                  Կարդալ Կանոնները
                </button>
                <button 
                  onClick={() => setGameState('playing')}
                  className="px-12 py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl flex items-center justify-center gap-3 border-b-4 border-orange-800"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Սկսել Մարտը
                </button>
              </div>
            </motion.div>
          ) : gameState === 'theory' ? (
            <motion.div 
              key="theory"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/95 backdrop-blur-xl p-10 rounded-[3rem] border-4 border-orange-200 max-w-2xl w-full space-y-8 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-orange-600 uppercase italic">{THEORY_STEPS[theoryStep].title}</h2>
                <span className="text-xs font-black text-orange-400">{theoryStep + 1} / {THEORY_STEPS.length}</span>
              </div>
              
              <div className="bg-orange-50 p-8 rounded-3xl border-2 border-orange-100 min-h-[250px] flex items-center">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line font-medium text-lg">
                  {THEORY_STEPS[theoryStep].content}
                </p>
              </div>

              <div className="flex gap-4">
                {theoryStep > 0 && (
                  <button 
                    onClick={() => setTheoryStep(prev => prev - 1)}
                    className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Հետ
                  </button>
                )}
                {theoryStep < THEORY_STEPS.length - 1 ? (
                  <button 
                    onClick={() => setTheoryStep(prev => prev + 1)}
                    className="flex-[2] py-5 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg"
                  >
                    Հաջորդը
                  </button>
                ) : (
                  <button 
                    onClick={() => setGameState('playing')}
                    className="flex-[2] py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg"
                  >
                    Սկսել Մարտը
                  </button>
                )}
              </div>
            </motion.div>
          ) : gameState === 'playing' ? (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full space-y-12"
            >
              {/* Turn Indicator */}
              <div className="flex justify-center">
                <div className={`px-8 py-3 rounded-2xl border-2 flex items-center gap-4 transition-all duration-500 shadow-lg ${currentPlayer === 1 ? 'bg-orange-500/20 border-orange-500 text-orange-600' : 'bg-red-500/20 border-red-500 text-red-600'}`}>
                  <Sword className={`w-5 h-5 ${currentPlayer === 1 ? 'rotate-45' : '-rotate-45'}`} />
                  <span className="font-black uppercase tracking-widest text-sm">
                    Նավապետ {currentPlayer}-ի հերթն է
                  </span>
                </div>
              </div>

              {/* Word Card */}
              <div className="relative flex justify-center">
                {/* Funny Pirate Animation */}
                <AnimatePresence>
                  {showPirate && (
                    <motion.div
                      initial={{ x: '-100vw', y: 0, rotate: 0, scale: 0.5 }}
                      animate={{ 
                        x: '100vw', 
                        y: [0, -100, 0, -100, 0],
                        rotate: [0, 20, -20, 20, 0],
                        scale: [0.5, 1.2, 1.2, 1.2, 0.5]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="absolute top-0 left-0 z-50 flex flex-col items-center"
                    >
                      <div className="bg-white text-slate-900 px-6 py-3 rounded-[2rem] font-black text-sm mb-4 shadow-2xl relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[12px] after:border-transparent after:border-t-white">
                        ¡Arrr! ¡Casi lo logras!
                      </div>
                      <img 
                        src="https://picsum.photos/seed/pirate/200/200" 
                        alt="Funny Pirate" 
                        className="w-40 h-40 rounded-full border-8 border-white shadow-2xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentItem.word}
                    initial={{ opacity: 0, x: 100, rotate: 5 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, x: -100, rotate: -5 }}
                    className={`
                      bg-white/90 backdrop-blur-2xl p-16 rounded-[4rem] border-4 flex flex-col items-center gap-8 min-w-[350px] shadow-2xl relative
                      ${feedback === 'correct' ? 'border-emerald-500 shadow-emerald-500/20' : feedback === 'wrong' ? 'border-red-500 shadow-red-500/20 animate-shake' : 'border-orange-200'}
                    `}
                  >
                    <div className="p-8 rounded-full bg-orange-500/10 border-2 border-orange-500/20">
                      <Anchor className={`w-16 h-16 ${feedback === 'correct' ? 'text-emerald-500' : feedback === 'wrong' ? 'text-red-500' : 'text-orange-500'}`} />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-6xl font-black tracking-tight italic text-slate-800">{currentItem.word}</h3>
                      <p className="text-xl font-bold text-orange-600/70 uppercase tracking-widest">({currentItem.translation})</p>
                    </div>

                    {/* Feedback Overlay */}
                    <AnimatePresence>
                      {feedback === 'correct' && (
                        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} className="absolute -top-8 -right-8 bg-emerald-500 p-6 rounded-full shadow-2xl border-4 border-white">
                          <CheckCircle2 className="w-10 h-10 text-white" />
                        </motion.div>
                      )}
                      {feedback === 'wrong' && (
                        <motion.div initial={{ scale: 0, rotate: 20 }} animate={{ scale: 1, rotate: 0 }} className="absolute -top-8 -right-8 bg-red-500 p-6 rounded-full shadow-2xl border-4 border-white">
                          <XCircle className="w-10 h-10 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Choices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
                {currentItem.options.map((choice) => (
                  <motion.button
                    key={choice}
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChoice(choice)}
                    className="py-8 rounded-[2rem] font-black text-2xl uppercase tracking-widest transition-all shadow-2xl border-b-8 bg-orange-600 border-orange-800 text-white hover:bg-orange-500"
                  >
                    {choice}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="finished"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12"
            >
              <div className="relative inline-block">
                <Trophy className="w-40 h-40 text-yellow-400 mx-auto drop-shadow-[0_0_50px_rgba(250,204,21,0.5)]" />
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-6 -right-6 bg-orange-500 p-6 rounded-full shadow-2xl border-4 border-white"
                >
                  <Star className="w-10 h-10 text-white fill-current" />
                </motion.div>
              </div>

              <div className="space-y-4">
                <h2 className="text-6xl font-black tracking-tighter uppercase italic text-white drop-shadow-lg">
                  {scores[1] === scores[2] ? 'Ոչ-ոքի' : `Հաղթեց Նավապետ ${scores[1] > scores[2] ? '1' : '2'}-ը`}
                </h2>
                <p className="text-2xl font-medium text-white/80">Մարտը ավարտվեց: Դուք իսկական լեզվաբան-նավապետներ եք:</p>
              </div>

              <div className="flex gap-8 justify-center">
                <div className="bg-white/90 p-10 rounded-[3rem] border-4 border-orange-500 shadow-2xl min-w-[200px]">
                  <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-2">Նավապետ 1</p>
                  <p className="text-6xl font-black text-slate-800">{scores[1]}</p>
                </div>
                <div className="bg-white/90 p-10 rounded-[3rem] border-4 border-red-500 shadow-2xl min-w-[200px]">
                  <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-2">Նավապետ 2</p>
                  <p className="text-6xl font-black text-slate-800">{scores[2]}</p>
                </div>
              </div>

              <button 
                onClick={restart}
                className="px-16 py-6 bg-white text-orange-600 rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-2xl flex items-center gap-4 mx-auto border-b-4 border-orange-200"
              >
                <RefreshCw className="w-6 h-6" />
                Նոր Մարտ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Mascot */}
      <footer className="bg-white/50 backdrop-blur-md border-t-4 border-orange-200 p-8">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-10">
          <div className="bg-orange-600 p-6 rounded-[2rem] shadow-2xl shadow-orange-900/20 relative">
            <Ship className="w-10 h-10 text-white" />
          </div>
          <div className="max-w-md">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 mb-2">Նավապետի Խորհուրդը</p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Հիշիր. եթե բառը վերջանում է ձայնավորով կամ n, s տառերով, շեշտը սովորաբար նախավերջին վանկի վրա է:
            </p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-15px); }
          75% { transform: translateX(15px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  );
}
