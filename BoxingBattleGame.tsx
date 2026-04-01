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
  Info,
  Zap,
  Heart,
  Shield
} from 'lucide-react';

// --- Types ---
interface WordItem {
  word: string;
  translation: string;
  category: 'Aguda' | 'Grave' | 'Esdrújula';
  options: string[];
}

// --- Data ---
const WORDS: WordItem[] = [
  { word: 'Café', translation: 'Սուրճ', category: 'Aguda', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Árbol', translation: 'Ծառ', category: 'Grave', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Música', translation: 'Երաժշտություն', category: 'Esdrújula', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Reloj', translation: 'Ժամացույց', category: 'Aguda', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Casa', translation: 'Տուն', category: 'Grave', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Pájaro', translation: 'Թռչուն', category: 'Esdrújula', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Canción', translation: 'Երգ', category: 'Aguda', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Lápiz', translation: 'Մատիտ', category: 'Grave', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Plátano', translation: 'Բանան', category: 'Esdrújula', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Comer', translation: 'Ուտել', category: 'Aguda', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Mesa', translation: 'Սեղան', category: 'Grave', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Mágico', translation: 'Կախարդական', category: 'Esdrújula', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Sofá', translation: 'Բազմոց', category: 'Aguda', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Examen', translation: 'Քննություն', category: 'Grave', options: ['Aguda', 'Grave', 'Esdrújula'] },
  { word: 'Teléfono', translation: 'Հեռախոս', category: 'Esdrújula', options: ['Aguda', 'Grave', 'Esdrújula'] },
];

export default function BoxingBattleGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [health, setHealth] = useState({ 1: 100, 2: 100 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shuffledItems, setShuffledItems] = useState<WordItem[]>([]);
  const [punching, setPunching] = useState<1 | 2 | null>(null);

  useEffect(() => {
    if (gameState === 'start') {
      setShuffledItems([...WORDS].sort(() => Math.random() - 0.5));
      setHealth({ 1: 100, 2: 100 });
      setCurrentIndex(0);
      setCurrentPlayer(1);
    }
  }, [gameState]);

  const currentItem = shuffledItems[currentIndex];

  const handleChoice = (choice: string) => {
    if (feedback || gameState !== 'playing' || punching) return;

    const isCorrect = choice === currentItem.category;
    
    if (isCorrect) {
      setFeedback('correct');
      setPunching(currentPlayer);
      
      // Deal damage to opponent
      const opponent = currentPlayer === 1 ? 2 : 1;
      setTimeout(() => {
        setHealth(prev => {
          const newHealth = { ...prev, [opponent]: Math.max(0, prev[opponent] - 20) };
          if (newHealth[opponent] === 0) {
            setGameState('finished');
          }
          return newHealth;
        });
      }, 500);

      setTimeout(() => {
        setFeedback(null);
        setPunching(null);
        nextTurn();
      }, 1500);
    } else {
      setFeedback('wrong');
      // Miss punch animation? Or just switch turn
      setTimeout(() => {
        setFeedback(null);
        nextTurn();
      }, 1500);
    }
  };

  const nextTurn = () => {
    setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
    setCurrentIndex(prev => (prev + 1) % shuffledItems.length);
  };

  const restart = () => {
    setGameState('start');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden flex flex-col items-center justify-center p-4 relative">
      {/* Boxing Ring Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[20px] border-white rounded-full rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[10px] border-white rounded-full -rotate-12" />
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
              <div className="bg-red-600 p-8 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-pulse">
                <Zap className="w-24 h-24 text-white fill-current" />
              </div>
              <div className="absolute -top-4 -right-4 bg-blue-600 p-4 rounded-full shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
              Boxing Quiz Battle
            </h1>
            <p className="text-xl text-slate-400 mb-12 max-w-md mx-auto">
              Հաղթիր մրցակցին՝ ճիշտ գուշակելով իսպաներեն բառերի շեշտադրումը:
            </p>

            <button 
              onClick={() => setGameState('playing')}
              className="group relative px-16 py-6 bg-white text-slate-900 rounded-full font-black text-2xl uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Play className="w-8 h-8 fill-current" />
                Սկսել Մենամարտը
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl flex flex-col gap-8 z-10"
          >
            {/* Health Bars */}
            <div className="flex justify-between items-center gap-8 px-4">
              {/* Player 1 Health */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black">1</div>
                    <span className="font-black uppercase tracking-widest text-blue-400">Blue Boxer</span>
                  </div>
                  <span className="font-mono text-xl">{health[1]} HP</span>
                </div>
                <div className="h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${health[1]}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                  />
                </div>
              </div>

              <div className="text-4xl font-black italic text-slate-700">VS</div>

              {/* Player 2 Health */}
              <div className="flex-1 space-y-2 text-right">
                <div className="flex justify-between items-end flex-row-reverse">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black">2</div>
                    <span className="font-black uppercase tracking-widest text-red-400">Red Boxer</span>
                  </div>
                  <span className="font-mono text-xl">{health[2]} HP</span>
                </div>
                <div className="h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${health[2]}%` }}
                    className="h-full bg-gradient-to-l from-red-600 to-orange-400"
                  />
                </div>
              </div>
            </div>

            {/* Arena */}
            <div className="relative h-[400px] flex items-center justify-center">
              {/* Boxer 1 */}
              <motion.div 
                animate={punching === 1 ? { x: 100, scale: 1.1 } : { x: 0, scale: 1 }}
                className="absolute left-20 bottom-0 flex flex-col items-center"
              >
                <div className="relative">
                  <div className={`w-32 h-32 bg-blue-600 rounded-full border-8 border-blue-400 flex items-center justify-center shadow-2xl ${health[1] < 40 ? 'animate-pulse' : ''}`}>
                    <User className="w-16 h-16 text-white" />
                  </div>
                  {/* Glove 1 */}
                  <motion.div 
                    animate={punching === 1 ? { x: 150, rotate: 45 } : { x: 0, rotate: 0 }}
                    className="absolute -right-4 top-1/2 w-12 h-12 bg-blue-500 rounded-xl border-4 border-white shadow-lg"
                  />
                </div>
              </motion.div>

              {/* Boxer 2 */}
              <motion.div 
                animate={punching === 2 ? { x: -100, scale: 1.1 } : { x: 0, scale: 1 }}
                className="absolute right-20 bottom-0 flex flex-col items-center"
              >
                <div className="relative">
                  <div className={`w-32 h-32 bg-red-600 rounded-full border-8 border-red-400 flex items-center justify-center shadow-2xl ${health[2] < 40 ? 'animate-pulse' : ''}`}>
                    <User className="w-16 h-16 text-white" />
                  </div>
                  {/* Glove 2 */}
                  <motion.div 
                    animate={punching === 2 ? { x: -150, rotate: -45 } : { x: 0, rotate: 0 }}
                    className="absolute -left-4 top-1/2 w-12 h-12 bg-red-500 rounded-xl border-4 border-white shadow-lg"
                  />
                </div>
              </motion.div>

              {/* Question Card */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`
                    bg-white p-10 rounded-[3rem] shadow-2xl text-slate-900 text-center min-w-[400px] border-8
                    ${currentPlayer === 1 ? 'border-blue-500' : 'border-red-500'}
                  `}
                >
                  <div className="mb-2">
                    <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${currentPlayer === 1 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                      Player {currentPlayer}'s Turn
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
                          ${feedback === 'correct' && opt === currentItem.category ? 'bg-emerald-500 border-emerald-700 text-white' : 
                            feedback === 'wrong' && opt !== currentItem.category ? 'opacity-50' :
                            'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'}
                        `}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* Feedback Icons */}
                  <AnimatePresence>
                    {feedback === 'correct' && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-6 -right-6 bg-emerald-500 p-4 rounded-full shadow-xl border-4 border-white">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </motion.div>
                    )}
                    {feedback === 'wrong' && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-6 -right-6 bg-red-500 p-4 rounded-full shadow-xl border-4 border-white">
                        <XCircle className="w-8 h-8 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
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
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-yellow-500/30 rounded-full scale-125"
              />
            </div>
            
            <h2 className="text-6xl font-black italic uppercase mb-2">
              {health[1] === 0 ? 'Red Boxer Wins!' : 'Blue Boxer Wins!'}
            </h2>
            <p className="text-2xl text-slate-400 mb-12">Knockout! Դուք իսկական չեմպիոն եք:</p>

            <button 
              onClick={restart}
              className="px-16 py-6 bg-white text-slate-900 rounded-full font-black text-2xl uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-2xl flex items-center gap-4 mx-auto"
            >
              <RefreshCw className="w-8 h-8" />
              Նոր Մենամարտ
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crowd Effect */}
      <div className="fixed bottom-0 left-0 right-0 h-20 flex items-end justify-around pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 + Math.random(), delay: Math.random() }}
            className="w-8 h-12 bg-slate-700 rounded-t-lg"
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background: #0f172a; }
      `}} />
    </div>
  );
}
