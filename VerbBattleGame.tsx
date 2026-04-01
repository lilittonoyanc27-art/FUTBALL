import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Anchor, 
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
  Info,
  BookOpen
} from 'lucide-react';

// --- Types ---
interface Question {
  sentence: string;
  verb: string;
  tense: string;
  correctOption: string;
  options: string[];
  translation: string;
}

// --- Data ---
const QUESTIONS: Question[] = [
  // Presente
  { sentence: "Yo ___ español muy bien.", verb: "Hablar", tense: "Presente", correctOption: "hablo", options: ["hablo", "hablas", "habla"], translation: "Ես շատ լավ խոսում եմ իսպաներեն:" },
  { sentence: "Nosotros ___ pizza los viernes.", verb: "Comer", tense: "Presente", correctOption: "comemos", options: ["como", "comen", "comemos"], translation: "Մենք պիցցա ենք ուտում ուրբաթ օրերին:" },
  { sentence: "¿Dónde ___ tú?", verb: "Vivir", tense: "Presente", correctOption: "vives", options: ["vivo", "vives", "vive"], translation: "Որտե՞ղ ես դու ապրում:" },
  { sentence: "Él ___ en una oficina.", verb: "Hablar", tense: "Presente", correctOption: "habla", options: ["hablo", "hablas", "habla"], translation: "Նա խոսում է գրասենյակում:" },
  { sentence: "Ellos ___ mucho pan.", verb: "Comer", tense: "Presente", correctOption: "comen", options: ["como", "comen", "comemos"], translation: "Նրանք շատ հաց են ուտում:" },
  { sentence: "Nosotros ___ en Ereván.", verb: "Vivir", tense: "Presente", correctOption: "vivimos", options: ["vivo", "vivimos", "viven"], translation: "Մենք ապրում ենք Երևանում:" },
];

const THEORY_STEPS = [
  {
    title: "Իսպաներեն Բայերի Խոնարհում (Presente)",
    content: "Իսպաներենում բայերը լինում են 3 տեսակի՝ վերջավորությունից կախված. **-AR**, **-ER** և **-IR**:\n\nԵկեք տեսնենք յուրաքանչյուրի խոնարհումը **Ներկա ժամանակում (Presente)**:",
    icon: <BookOpen className="w-12 h-12 text-orange-500" />
  },
  {
    title: "1. HABLAR (Խոսել) - AR",
    content: "**Presente (Ներկա):**\n\nYo **hablo**\nTú **hablas**\nÉl/Ella **habla**\nNosotros **hablamos**\nVosotros **habláis**\nEllos/Ellas **hablan**",
    icon: <Star className="w-12 h-12 text-yellow-500" />
  },
  {
    title: "2. COMER (Ուտել) - ER",
    content: "**Presente (Ներկա):**\n\nYo **como**\nTú **comes**\nÉl/Ella **come**\nNosotros **comemos**\nVosotros **coméis**\nEllos/Ellas **comen**",
    icon: <Anchor className="w-12 h-12 text-blue-500" />
  },
  {
    title: "3. VIVIR (Ապրել) - IR",
    content: "**Presente (Ներկա):**\n\nYo **vivo**\nTú **vives**\nÉl/Ella **vive**\nNosotros **vivimos**\nVosotros **vivís**\nEllos/Ellas **viven**",
    icon: <Compass className="w-12 h-12 text-red-500" />
  }
];


export default function VerbBattleGame() {
  const [gameState, setGameState] = useState<'start' | 'theory' | 'playing' | 'finished'>('start');
  const [theoryStep, setTheoryStep] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showPirate, setShowPirate] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (gameState === 'start') {
      setShuffledQuestions([...QUESTIONS].sort(() => Math.random() - 0.5));
    }
  }, [gameState]);

  const currentQuestion = shuffledQuestions[currentIndex];

  const handleChoice = (choice: string) => {
    if (feedback || gameState !== 'playing' || showPirate) return;

    if (choice === currentQuestion.correctOption) {
      setFeedback('correct');
      setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
      
      setTimeout(() => {
        setFeedback(null);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        if (currentIndex < shuffledQuestions.length - 1) {
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
        if (currentIndex < shuffledQuestions.length - 1) {
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
    setTheoryStep(0);
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
              <h1 className="text-2xl font-black tracking-tighter uppercase italic text-orange-600">Batalla de Verbos</h1>
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.3em]">Բայերի Ծովային Մարտ</p>
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
                  Բայերի <br /> <span className="text-orange-200">Ակադեմիա</span>
                </h2>
                <p className="text-white/90 max-w-md mx-auto font-medium text-lg">
                  Սովորիր Hablar, Comer և Vivir բայերի խոնարհումը և հաղթիր մարտում:
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setGameState('theory')}
                  className="px-12 py-5 bg-white text-orange-600 rounded-[2rem] font-black uppercase tracking-widest hover:bg-orange-50 transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  <Info className="w-5 h-5" />
                  Կարդալ Տեսությունը
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
                <div className="flex items-center gap-3">
                  {THEORY_STEPS[theoryStep].icon}
                  <h2 className="text-3xl font-black text-orange-600 uppercase italic">{THEORY_STEPS[theoryStep].title}</h2>
                </div>
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
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100, rotate: 5 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, x: -100, rotate: -5 }}
                    className={`
                      bg-white/90 backdrop-blur-2xl p-12 rounded-[4rem] border-4 flex flex-col items-center gap-6 min-w-[450px] shadow-2xl relative
                      ${feedback === 'correct' ? 'border-emerald-500 shadow-emerald-500/20' : feedback === 'wrong' ? 'border-red-500 shadow-red-500/20 animate-shake' : 'border-orange-200'}
                    `}
                  >
                    <div className="flex items-center gap-4 mb-2">
                       <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest">
                         {currentQuestion.verb}
                       </span>
                       <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest">
                         {currentQuestion.tense}
                       </span>
                    </div>

                    <div className="text-center space-y-4">
                      <h3 className="text-3xl font-black tracking-tight text-slate-800 leading-relaxed">
                        {currentQuestion.sentence}
                      </h3>
                      <p className="text-lg font-bold text-orange-600/70 italic">({currentQuestion.translation})</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
                {currentQuestion.options.map((choice) => (
                  <motion.button
                    key={choice}
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChoice(choice)}
                    className="py-6 rounded-[2rem] font-black text-2xl uppercase tracking-widest transition-all shadow-2xl border-b-8 bg-orange-600 border-orange-800 text-white hover:bg-orange-500"
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
              Հիշիր. Ապառնի ժամանակը (Futuro) ամենահեշտն է. պարզապես ավելացրու վերջավորությունը բայի վերջում:
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
