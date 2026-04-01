import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  XCircle,
  User,
  Star,
  Zap,
  Target,
  BookOpen,
  ChevronRight,
  ChevronLeft
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
  { word: 'Libro', translation: 'Գիրք', correctOption: 'Libro', options: ['Libro', 'Libró'] },
  { word: 'Papel', translation: 'Թուղթ', correctOption: 'Papel', options: ['Papel', 'Pápel'] },
  { word: 'Hablar', translation: 'Խոսել', correctOption: 'Hablar', options: ['Hablar', 'Háblar'] },
  { word: 'Carmen', translation: 'Կարմեն', correctOption: 'Carmen', options: ['Carmen', 'Carmén'] },
  { word: 'Lunes', translation: 'Երկուշաբթի', correctOption: 'Lunes', options: ['Lunes', 'Lunés'] },
  { word: 'Ciudad', translation: 'Քաղաք', correctOption: 'Ciudad', options: ['Ciudad', 'Ciúdad'] },
  { word: 'Doctor', translation: 'Բժիշկ', correctOption: 'Doctor', options: ['Doctor', 'Dóctor'] },
  { word: 'Perro', translation: 'Շուն', correctOption: 'Perro', options: ['Perro', 'Perró'] },
  { word: 'Cantar', translation: 'Երգել', correctOption: 'Cantar', options: ['Cantar', 'Cántar'] },
  { word: 'Madrid', translation: 'Մադրիդ', correctOption: 'Madrid', options: ['Madrid', 'Mádrid'] },
  { word: 'Hotel', translation: 'Հյուրանոց', correctOption: 'Hotel', options: ['Hotel', 'Hótel'] },
  { word: 'Joven', translation: 'Երիտասարդ', correctOption: 'Joven', options: ['Joven', 'Jovén'] },
  { word: 'Crisis', translation: 'Ճգնաժամ', correctOption: 'Crisis', options: ['Crisis', 'Crisís'] },
  { word: 'Mesa', translation: 'Սեղան', correctOption: 'Mesa', options: ['Mesa', 'Mésa'] },
  { word: 'Amigo', translation: 'Ընկեր', correctOption: 'Amigo', options: ['Amigo', 'Amigó'] },
];

const THEORY_STEPS = [
  {
    title: "Կանոն 1: «N, S կամ Ձայնավոր»",
    content: "Եթե բառը վերջանում է ձայնավորով (a, e, i, o, u) կամ n, s տառերով, շեշտը ընկնում է նախավերջին վանկի վրա:\n\n* **HOLA** (Օ-լա) — Վերջանում է ձայնավորով:\n* **JOVEN** (Խո-վեն) — Վերջանում է n-ով:\n* **ESTUDIANTE** (Էս-տու-դիան-տե) — Վերջանում է ձայնավորով:",
    color: "bg-orange-500"
  },
  {
    title: "Կանոն 2: «Բաղաձայն»",
    content: "Եթե բառը վերջանում է ցանկացած բաղաձայնով (բացի n և s), շեշտը ընկնում է վերջին վանկի վրա:\n\n* **ACTOR** (Ակ-տո՛ր) — Վերջանում է r-ով:\n* **MADRID** (Մադ-րի՛դ) — Վերջանում է d-ով:\n* **HOTEL** (Օ-տե՛լ) — Վերջանում է l-ով:",
    color: "bg-red-500"
  },
  {
    title: "Կանոն 3: «Գրավոր շեշտ» (Tilde)",
    content: "Եթե բառը չի ենթարկվում վերը նշված երկու կանոններին, ապա մենք դնում ենք գրավոր շեշտ (´) այն վանկի վրա, որը հնչում է շեշտված:\n\n* **CAFÉ** (Կա-ֆե՛)\n* **ÁRBOL** (Ա՛ր-բոլ)\n* **MÚSICA** (Մո՛ւ-զի-կա)",
    color: "bg-blue-500"
  }
];

export default function FootballBattleGame() {
  const [gameState, setGameState] = useState<'start' | 'theory' | 'playing' | 'finished'>('start');
  const [theoryStep, setTheoryStep] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong', choice: string } | null>(null);
  const [shuffledItems, setShuffledItems] = useState<WordItem[]>([]);
  const [ballPosition, setBallPosition] = useState<'center' | 'goal1' | 'goal2'>('center');

  useEffect(() => {
    if (gameState === 'start') {
      setShuffledItems([...WORDS].sort(() => Math.random() - 0.5));
      setScores({ 1: 0, 2: 0 });
      setCurrentIndex(0);
      setCurrentPlayer(1);
      setBallPosition('center');
      setTheoryStep(0);
    }
  }, [gameState]);

  const currentItem = shuffledItems[currentIndex];

  const handleChoice = (choice: string) => {
    if (feedback || gameState !== 'playing') return;

    const isCorrect = choice === currentItem.correctOption;
    
    if (isCorrect) {
      setFeedback({ type: 'correct', choice });
      const targetGoal = currentPlayer === 1 ? 'goal2' : 'goal1';
      setBallPosition(targetGoal);
      
      setTimeout(() => {
        setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
      }, 500);

      setTimeout(() => {
        setFeedback(null);
        setBallPosition('center');
        nextTurn();
      }, 1500);
    } else {
      setFeedback({ type: 'wrong', choice });
      setTimeout(() => {
        setFeedback(null);
        nextTurn();
      }, 1500);
    }
  };

  const nextTurn = () => {
    if (currentIndex < shuffledItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
    } else {
      setGameState('finished');
    }
  };

  const restart = () => {
    setGameState('start');
  };

  return (
    <div className="min-h-screen bg-emerald-800 text-white font-sans overflow-hidden flex flex-col items-center justify-center p-4 relative">
      {/* Football Field Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-10 border-4 border-white" />
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white rounded-full" />
        {/* Penalty Areas */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-40 border-4 border-white border-t-0" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-40 border-4 border-white border-b-0" />
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="text-center z-10"
          >
            <div className="mb-8 relative inline-block">
              <div className="bg-white p-8 rounded-full shadow-2xl">
                <Zap className="w-24 h-24 text-emerald-600 fill-current" />
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 p-4 rounded-full shadow-lg">
                <Star className="w-8 h-8 text-white fill-current" />
              </div>
            </div>
            
            <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-4 text-white drop-shadow-2xl">
              Football Accent Battle
            </h1>
            <p className="text-xl text-emerald-100 mb-12 max-w-md mx-auto font-medium">
              Խփիր գոլեր՝ ճիշտ գուշակելով իսպաներեն բառերի շեշտադրումը:
            </p>

            <div className="flex flex-col gap-4 items-center">
              <button 
                onClick={() => setGameState('playing')}
                className="group relative px-16 py-6 bg-white text-emerald-900 rounded-full font-black text-2xl uppercase tracking-widest hover:bg-yellow-400 hover:text-emerald-950 transition-all shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Play className="w-8 h-8 fill-current" />
                  Սկսել Խաղը
                </span>
              </button>

              <button 
                onClick={() => setGameState('theory')}
                className="flex items-center gap-2 text-white/80 hover:text-white font-bold uppercase tracking-widest transition-colors"
              >
                <BookOpen className="w-6 h-6" />
                Տեսություն
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'theory' && (
          <motion.div 
            key="theory"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="z-10 w-full max-w-2xl bg-white rounded-[3rem] p-12 text-slate-900 shadow-2xl border-8 border-emerald-500"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-emerald-600">
                {THEORY_STEPS[theoryStep].title}
              </h2>
              <div className={`w-12 h-12 rounded-2xl ${THEORY_STEPS[theoryStep].color} flex items-center justify-center text-white font-black`}>
                {theoryStep + 1}
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-12">
              <p className="text-xl leading-relaxed whitespace-pre-wrap font-medium">
                {THEORY_STEPS[theoryStep].content}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={() => theoryStep > 0 ? setTheoryStep(theoryStep - 1) : setGameState('start')}
                className="flex items-center gap-2 font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
                {theoryStep === 0 ? "Հետ" : "Նախորդ"}
              </button>

              <div className="flex gap-2">
                {THEORY_STEPS.map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i === theoryStep ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                ))}
              </div>

              <button 
                onClick={() => theoryStep < THEORY_STEPS.length - 1 ? setTheoryStep(theoryStep + 1) : setGameState('playing')}
                className="flex items-center gap-2 font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {theoryStep === THEORY_STEPS.length - 1 ? "Խաղալ" : "Հաջորդ"}
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl flex flex-col gap-8 z-10"
          >
            {/* Scoreboard */}
            <div className="flex justify-between items-center gap-8 px-4 bg-emerald-900/50 backdrop-blur-md p-6 rounded-[2rem] border-2 border-white/20 shadow-2xl">
              <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${currentPlayer === 1 ? 'scale-110' : 'opacity-50'}`}>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30">
                  <User className="w-10 h-10 text-white" />
                </div>
                <span className="font-black uppercase tracking-widest text-xs">Գոռ</span>
                <span className="text-5xl font-black tabular-nums">{scores[1]}</span>
              </div>

              <div className="text-4xl font-black italic text-white/30">VS</div>

              <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${currentPlayer === 2 ? 'scale-110' : 'opacity-50'}`}>
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30">
                  <User className="w-10 h-10 text-white" />
                </div>
                <span className="font-black uppercase tracking-widest text-xs">Գայանե</span>
                <span className="text-5xl font-black tabular-nums">{scores[2]}</span>
              </div>
            </div>

            {/* Field Area */}
            <div className="relative h-[300px] w-full flex items-center justify-center">
              {/* Ball */}
              <motion.div 
                animate={{ 
                  y: ballPosition === 'center' ? 0 : ballPosition === 'goal1' ? -150 : 150,
                  scale: ballPosition === 'center' ? 1 : 0.5,
                  rotate: ballPosition === 'center' ? 0 : 720
                }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                className="z-20 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-slate-200"
              >
                <div className="w-full h-full rounded-full border-4 border-dashed border-slate-400" />
              </motion.div>

              {/* Goal 1 (Top) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-10 border-4 border-white border-t-0 rounded-b-xl bg-white/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-white/20" />
              </div>

              {/* Goal 2 (Bottom) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-10 border-4 border-white border-b-0 rounded-t-xl bg-white/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-white/20" />
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`
                  bg-white p-10 rounded-[3rem] shadow-2xl text-slate-900 text-center mx-auto min-w-[450px] border-8 relative
                  ${currentPlayer === 1 ? 'border-blue-500' : 'border-red-500'}
                `}
              >
                <div className="mb-2">
                  <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${currentPlayer === 1 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                    {currentPlayer === 1 ? 'Գոռ' : 'Գայանե'}'s Turn
                  </span>
                </div>
                <h2 className="text-6xl font-black mb-2 tracking-tight">{currentItem.word}</h2>
                <p className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-8">({currentItem.translation})</p>
                
                <div className="grid grid-cols-3 gap-4">
                    {currentItem.options.map((opt) => (
                      <button
                        key={opt}
                        disabled={!!feedback}
                        onClick={() => handleChoice(opt)}
                        className={`
                          py-4 rounded-2xl font-black uppercase tracking-widest transition-all border-b-4
                          ${feedback?.type === 'correct' && opt === currentItem.correctOption ? 'bg-emerald-500 border-emerald-700 text-white' : 
                            feedback?.type === 'wrong' && opt === feedback.choice ? 'bg-red-500 border-red-700 text-white' :
                            feedback?.type === 'wrong' && opt === currentItem.correctOption ? 'bg-emerald-200 border-emerald-400 text-emerald-800' :
                            feedback ? 'opacity-50' :
                            'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'}
                        `}
                      >
                        {opt}
                      </button>
                    ))}
                </div>

                {/* Feedback Icons */}
                <AnimatePresence>
                  {feedback?.type === 'correct' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-6 -right-6 bg-emerald-500 p-4 rounded-full shadow-xl border-4 border-white">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                  {feedback?.type === 'wrong' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-6 -right-6 bg-red-500 p-4 rounded-full shadow-xl border-4 border-white">
                      <XCircle className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div 
            key="finished"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10"
          >
            <div className="relative inline-block mb-8">
              <Trophy className="w-48 h-48 text-yellow-400 drop-shadow-[0_0_50px_rgba(250,204,21,0.5)]" />
            </div>
            
            <h2 className="text-6xl font-black italic uppercase mb-2 text-white drop-shadow-lg">
              {scores[1] === scores[2] ? "Ոչ-ոքի!" : scores[1] > scores[2] ? 'Գոռը հաղթեց!' : 'Գայանեն հաղթեց!'}
            </h2>
            
            {scores[1] !== scores[2] && (
              <p className="text-3xl font-black text-yellow-300 mb-6 uppercase tracking-widest drop-shadow-md">
                {scores[1] > scores[2] ? 'Գոռը' : 'Գայանեն'} գնում է մրցաշարի: 🏆
              </p>
            )}

            <p className="text-2xl text-emerald-100 mb-12 font-medium">Final Score: {scores[1]} - {scores[2]}</p>

            <button 
              onClick={restart}
              className="px-16 py-6 bg-white text-emerald-900 rounded-full font-black text-2xl uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-2xl flex items-center gap-4 mx-auto"
            >
              <RefreshCw className="w-6 h-6" />
              Նոր Խաղ
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background: #064e3b; }
      `}} />
    </div>
  );
}
