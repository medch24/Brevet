/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  GraduationCap,
  Trophy,
  Zap,
  Clock,
  BookOpen,
  Compass,
  Calculator,
  Menu,
  Moon,
  Sun,
  ArrowLeft,
  Award,
  ChevronRight,
  CheckCircle2,
  X,
  Sliders,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { SubjectId, Chapter, ChapterId, UserStats, DailyChallenge, ExerciseLevel } from './types';
import Dashboard, { ALL_BADGES } from './components/Dashboard';
import MathSimulations from './components/MathSimulations';
import PhysicsSimulations from './components/PhysicsSimulations';
import ExerciseManager from './components/ExerciseManager';
import ScientificCalculator from './components/ScientificCalculator';
import CheatSheet, { ALL_REVISION_CHAPTERS } from './components/CheatSheet';

const DEFAULT_STATS: UserStats = {
  points: 0,
  streak: 1,
  level: 'Débutant',
  completedExercises: {},
  studyTimeSeconds: 0,
  badges: [],
  history: []
};

const INITIAL_CHALLENGES: DailyChallenge[] = [
  { id: 'sim-elec', title: 'Faire éclater l\'ampoule', points: 15, completed: false, type: 'sim', requirement: 'Ouvre/ferme l\'interrupteur d\'électricité' },
  { id: 'math-pyth', title: 'Calculateur d\'Aires', points: 20, completed: false, type: 'math', requirement: 'Manipule le théorème de Pythagore' },
  { id: 'brev-challenge', title: 'Esprit Supérieur', points: 30, completed: false, type: 'brevet', requirement: 'Résous n\'importe quel quiz de niveau Brevet' },
];

export default function App() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // App Layout tabs State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'maths' | 'physique-chimie' | 'revisions' | 'calculatrice'>('dashboard');
  const [selectedChapterId, setSelectedChapterId] = useState<ChapterId | null>(null);

  // User Stats & progression tracking
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(INITIAL_CHALLENGES);

  // Rewards notifications
  const [congratsModal, setCongratsModal] = useState<{ show: boolean; title: string; desc: string; type: 'level' | 'badge' | 'points' } | null>(null);
  const [pointsFloat, setPointsFloat] = useState<{ show: boolean; text: string } | null>(null);

  // Mobile menu slide-in state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Font Size Accessibility State (default is large for high readability as requested!)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');

  // 1. Initial State Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('brevet_reussite_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats(parsed);
      } catch (err) {
        console.error("Échec de chargement des statistiques", err);
      }
    }

    const savedChallenges = localStorage.getItem('brevet_reussite_challenges');
    if (savedChallenges) {
      try {
        setDailyChallenges(JSON.parse(savedChallenges));
      } catch {
        // use default state
      }
    }

    const savedFontSize = localStorage.getItem('brevet_fontsize');
    if (savedFontSize === 'normal' || savedFontSize === 'large' || savedFontSize === 'huge') {
      setFontSize(savedFontSize);
    }

    // Default look and feel - set light theme by default as specified in Mood guidelines
    const pref = localStorage.getItem('brevet_theme');
    if (pref === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // 2. State Auto-save on updates
  useEffect(() => {
    localStorage.setItem('brevet_reussite_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('brevet_reussite_challenges', JSON.stringify(dailyChallenges));
  }, [dailyChallenges]);

  // 3. Simulated Active study timer (1 second interval)
  useEffect(() => {
    const clock = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        studyTimeSeconds: prev.studyTimeSeconds + 1
      }));
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  // Compute levels brackets based on points
  const checkRankLevel = (pts: number): string => {
    if (pts >= 500) return '🎓 Champion du Brevet';
    if (pts >= 300) return '🔥 Expert du Brevet';
    if (pts >= 150) return '🚀 Confirmé';
    if (pts >= 50) return '🌟 Apprenti';
    return '👶 Débutant';
  };

  // Toggle dynamic challenges manually
  const handleToggleChallenge = (id: string) => {
    setDailyChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const nextState = !ch.completed;
          if (nextState) {
            // Give points
            toastPoints(`+${ch.points} XP`);
            addProgressPoints(ch.points);
          } else {
            // Deduct if untoggled
            addProgressPoints(-ch.points);
          }
          return { ...ch, completed: nextState };
        }
        return ch;
      })
    );
  };

  // Trigger brief points animation overlay
  const toastPoints = (msg: string) => {
    setPointsFloat({ show: true, text: msg });
    setTimeout(() => {
      setPointsFloat(null);
    }, 2200);
  };

  // Add points to student stats + recalculate boundaries & unlocks
  const addProgressPoints = (amount: number) => {
    setStats((prev) => {
      const nextPoints = Math.max(0, prev.points + amount);
      const nextLevelStr = checkRankLevel(nextPoints);

      let triggeredModal = null;

      // 1. Check Level-up unlock alert
      if (nextLevelStr !== prev.level && amount > 0) {
        triggeredModal = {
          show: true,
          title: `Nouveau Rang : ${nextLevelStr} !`,
          desc: `Félicitations pour tes progrès assidus ! Ton niveau de maîtrise générale s'améliore. Continue tes efforts !`,
          type: 'level' as const
        };
      }

      // 2. Check Badge unlocks logic based on points & conditions
      const unlockedBadges = [...prev.badges];

      // "Petit Génie" Badge
      if (nextPoints >= 10 && !unlockedBadges.includes('first_steps')) {
        unlockedBadges.push('first_steps');
        triggeredModal = {
          show: true,
          title: `Badge Débloqué : Petit Génie 👶`,
          desc: `Tu as gagné tes 10 premiers points d'expérience d'apprentissage.`,
          type: 'badge' as const
        };
      }

      // "Major de Promo" Badge
      if (nextPoints >= 300 && !unlockedBadges.includes('high_score')) {
        unlockedBadges.push('high_score');
        triggeredModal = {
          show: true,
          title: `Badge Débloqué : Major de Promo 🏆`,
          desc: `Félicitations ! Tu as accumulé un score de 300 points d'expérience de révision.`,
          type: 'badge' as const
        };
      }

      if (triggeredModal) {
        setCongratsModal(triggeredModal);
      }

      return {
        ...prev,
        points: nextPoints,
        level: nextLevelStr,
        badges: unlockedBadges
      };
    });
  };

  // Handle callback when student submits a valid quiz answer
  const handlePointsGained = (points: number, success: boolean, exerciseLevel: ExerciseLevel) => {
    // Save answer to completed list
    const exKey = `${selectedChapterId}_l${exerciseLevel}`;

    toastPoints(success ? `+${points} XP` : `+10 XP Révision`);

    setStats((prev) => {
      const nextCompleted = { ...prev.completedExercises };
      if (success) {
        nextCompleted[exKey] = true;
      }

      // Check consecutive correct streak incrementation
      let nextStreak = prev.streak;
      if (success) {
        nextStreak += 1;
      } else {
        nextStreak = Math.max(1, nextStreak - 1); // reduce streak but keep alive
      }

      // Check "Assidu du Brevet" Badge (unlocked with streak >= 3)
      const unlockedBadges = [...prev.badges];
      if (nextStreak >= 3 && !unlockedBadges.includes('streak_3')) {
        unlockedBadges.push('streak_3');
        setCongratsModal({
          show: true,
          title: `Badge Débloqué : Assidu du Brevet 🚀`,
          desc: `Tu as réussi 3 réponses correctes de suite !`,
          type: 'badge'
        });
      }

      // Check lesson-specific badge triggers
      if (selectedChapterId === 'pythagore' && exerciseLevel === 4 && success && !unlockedBadges.includes('math_lord')) {
        unlockedBadges.push('math_lord');
        setCongratsModal({
          show: true,
          title: `Badge Débloqué : As de Pythagore 📐`,
          desc: `Tu as accompli l'exercice final de niveau Brevet en Pythagore.`,
          type: 'badge'
        });
      }

      if (selectedChapterId === 'electricite' && exerciseLevel === 4 && success && !unlockedBadges.includes('tesla')) {
        unlockedBadges.push('tesla');
        setCongratsModal({
          show: true,
          title: `Badge Débloqué : Maître Ampère ⚡`,
          desc: `Tu as accompli l'exercice final de niveau Brevet en Électricité.`,
          type: 'badge'
        });
      }

      return {
        ...prev,
        completedExercises: nextCompleted,
        streak: nextStreak,
        badges: unlockedBadges
      };
    });

    // Feed to XP state calculator
    addProgressPoints(points);

    // If level 4 is correct, auto-resolve "Esprit Supérieur" daily challenge if not completed
    if (exerciseLevel === 4 && success) {
      setDailyChallenges((prev) =>
        prev.map((ch) => {
          if (ch.id === 'brev-challenge' && !ch.completed) {
            toastPoints(`+${ch.points} XP Défi`);
            addProgressPoints(ch.points);
            return { ...ch, completed: true };
          }
          return ch;
        })
      );
    }
  };

  // Navigates securely from Suggestion cards inside dashboard
  const handleNavigateToChapter = (subject: SubjectId, chId: ChapterId) => {
    setActiveTab(subject === 'maths' ? 'maths' : 'physique-chimie');
    setSelectedChapterId(chId);
  };

  // Switch look & feel theme
  const toggleTheme = () => {
    setIsDarkMode((prevTheme) => {
      const nextTheme = !prevTheme;
      if (nextTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('brevet_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('brevet_theme', 'light');
      }
      return nextTheme;
    });
  };

  // Load chapters based on subjects tabs
  const mathChapters = ALL_REVISION_CHAPTERS.filter((ch) => ch.subject === 'maths');
  const physicsChapters = ALL_REVISION_CHAPTERS.filter((ch) => ch.subject === 'physique-chimie');

  const currentChapter = ALL_REVISION_CHAPTERS.find((ch) => ch.id === selectedChapterId);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col transition-colors ${
      fontSize === 'large' ? 'app-font-large' : fontSize === 'huge' ? 'app-font-huge' : ''
    }`}>
      
      {/* Dynamic accessibility font resizing styles block */}
      <style>{`
        .app-font-large {
          font-size: 15.5px !important;
        }
        .app-font-large p {
          font-size: 14px !important;
          line-height: 1.625 !important;
        }
        .app-font-large h2 {
          font-size: 1.75rem !important;
        }
        .app-font-large h3 {
          font-size: 1.35rem !important;
        }

        .app-font-huge {
          font-size: 17px !important;
        }
        .app-font-huge p {
          font-size: 16px !important;
          line-height: 1.7 !important;
        }
        .app-font-huge h2 {
          font-size: 2.1rem !important;
        }
        .app-font-huge h3 {
          font-size: 1.65rem !important;
        }
        .app-font-huge .text-xs {
          font-size: 13.5px !important;
        }
        .app-font-huge .text-[10px], .app-font-huge .text-[9px] {
          font-size: 11px !important;
        }
      `}</style>
      
      {/* GLOBAL BACKGROUND NOISE TOAST POINTS FLOATING FEEDBACK */}
      {pointsFloat?.show && (
        <div className="fixed top-20 right-4 bg-emerald-500 text-white rounded-xl px-4 py-2 text-xs font-mono font-extrabold shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-350 animate-spin" />
          <span>{pointsFloat.text}</span>
        </div>
      )}

      {/* MULTILAYERED HEADER NAVIGATION BAR */}
      <header className="sticky top-0 bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md z-40 select-none">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Main Menu burger toggle on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 sm:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 border"
            >
              <Menu className="w-5 h-5 text-slate-500" />
            </button>

            {/* Logo platform */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('dashboard'); setSelectedChapterId(null); }}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                🎓
              </div>
              <div>
                <span className="font-sans font-black tracking-tight bg-gradient-to-r from-indigo-605 via-indigo-600 to-violet-600 bg-clip-text text-transparent text-sm md:text-base">
                  BREVET MASTER
                </span>
                <span className="text-[9px] text-indigo-500 block leading-none font-bold uppercase font-mono tracking-wider">
                  PREPARATION 3ème
                </span>
              </div>
            </div>
          </div>

          {/* Core desktop Tabs Link */}
          <nav className="hidden sm:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('dashboard'); setSelectedChapterId(null); }}
              className={`px-3 py-2 rounded-lg transition-all ${
                activeTab === 'dashboard' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-805'
              }`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => { setActiveTab('maths'); setSelectedChapterId('pythagore'); }}
              className={`px-3 py-2 rounded-lg transition-all ${
                activeTab === 'maths' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-805'
              }`}
            >
              Mathématiques
            </button>
            <button
              onClick={() => { setActiveTab('physique-chimie'); setSelectedChapterId('electricite'); }}
              className={`px-3 py-2 rounded-lg transition-all ${
                activeTab === 'physique-chimie' ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400' : 'text-slate-500 hover:text-slate-805'
              }`}
            >
              Physique-Chimie
            </button>
            <button
              onClick={() => { setActiveTab('revisions'); setSelectedChapterId(null); }}
              className={`px-3 py-2 rounded-lg transition-all ${
                activeTab === 'revisions' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-805'
              }`}
            >
              Fiches Révisions
            </button>
            <button
              onClick={() => setActiveTab('calculatrice')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'calculatrice' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" /> Calculatrice
            </button>
          </nav>

          {/* Auxiliary utilities: Font Size Selector / High contrast / Theme switch */}
          <div className="flex items-center gap-1.5">
            {/* Font size selectors */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 gap-0.5 items-center mr-1">
              <button
                type="button"
                onClick={() => { setFontSize('normal'); localStorage.setItem('brevet_fontsize', 'normal'); }}
                className={`px-2 py-1 rounded-md text-[10px] font-black transition-all ${fontSize === 'normal' ? 'bg-indigo-650 text-white shadow-3xs' : 'text-slate-550 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'}`}
                title="Taille de texte normale"
              >
                aA
              </button>
              <button
                type="button"
                onClick={() => { setFontSize('large'); localStorage.setItem('brevet_fontsize', 'large'); }}
                className={`px-2 py-1 rounded-md text-[11px] font-black transition-all ${fontSize === 'large' ? 'bg-indigo-650 text-white shadow-3xs' : 'text-slate-555 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'}`}
                title="Taille de texte grande (Défaut)"
              >
                AA
              </button>
              <button
                type="button"
                onClick={() => { setFontSize('huge'); localStorage.setItem('brevet_fontsize', 'huge'); }}
                className={`px-2 py-1 rounded-md text-xs font-black transition-all ${fontSize === 'huge' ? 'bg-indigo-650 text-white shadow-3xs' : 'text-slate-555 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900'}`}
                title="Taille de texte géante"
              >
                AA+
              </button>
            </div>

            {/* Quick Stats bubble */}
            <div className="hidden md:flex items-center bg-yellow-500/10 text-yellow-650 dark:text-yellow-400 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border border-yellow-500/20">
              🏆 {stats.points} XP
            </div>

            {/* Dark mode switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border text-slate-550 dark:text-slate-350 transition-colors"
              title="Changer de thème"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-yellow-405" /> : <Moon className="w-4 h-4 text-violet-650" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE CONNECTOR NAVIGATION SIDEBAR DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 sm:hidden flex">
          <div className="bg-white dark:bg-slate-950 w-64 h-full p-5 flex flex-col justify-between border-r shadow-2xl animate-slideLeft">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-extrabold text-sm text-slate-805 dark:text-white">Académie Brevet</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <button
                  onClick={() => { setActiveTab('dashboard'); setSelectedChapterId(null); setIsMobileMenuOpen(false); }}
                  className={`px-3 py-2.5 rounded-lg text-left font-bold ${activeTab === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'}`}
                >
                  Dashboard d'accueil
                </button>
                <button
                  onClick={() => { setActiveTab('maths'); setSelectedChapterId('pythagore'); setIsMobileMenuOpen(false); }}
                  className={`px-3 py-2.5 rounded-lg text-left font-bold ${activeTab === 'maths' ? 'bg-blue-105 text-blue-700' : 'text-slate-600'}`}
                >
                  Mathématiques
                </button>
                <button
                  onClick={() => { setActiveTab('physique-chimie'); setSelectedChapterId('electricite'); setIsMobileMenuOpen(false); }}
                  className={`px-3 py-2.5 rounded-lg text-left font-bold ${activeTab === 'physique-chimie' ? 'bg-violet-100 text-violet-750' : 'text-slate-600'}`}
                >
                  Physique-Chimie
                </button>
                <button
                  onClick={() => { setActiveTab('revisions'); setSelectedChapterId(null); setIsMobileMenuOpen(false); }}
                  className={`px-3 py-2.5 rounded-lg text-left font-bold ${activeTab === 'revisions' ? 'bg-emerald-100 text-emerald-850' : 'text-slate-605'}`}
                >
                  Fiches Révisions
                </button>
                <button
                  onClick={() => { setActiveTab('calculatrice'); setIsMobileMenuOpen(false); }}
                  className={`px-3 py-2.5 rounded-lg text-left font-bold ${activeTab === 'calculatrice' ? 'bg-slate-900 text-white' : 'text-slate-605'}`}
                >
                  Calculatrice
                </button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rang Éducation :</span>
              <span className="font-bold text-xs text-yellow-500">{stats.level}</span>
            </div>
          </div>
        </div>
      )}

      {/* UNLOCKED BADGES CONGRATULATIONS DIALOG OVERLAY */}
      {congratsModal?.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border max-w-sm text-center space-y-4 animate-scaleUp shadow-2xl relative">
            <button
              onClick={() => setCongratsModal(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-105 text-slate-400"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm mx-auto animate-bounce">
              {congratsModal.type === 'level' ? '🏆' : '🏅'}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                {congratsModal.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {congratsModal.desc}
              </p>
            </div>

            <button
              onClick={() => setCongratsModal(null)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs font-sans transition-all"
            >
              Continuer l'aventure !
            </button>
          </div>
        </div>
      )}

      {/* CORE PORTAL VIEW CONTAINER */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans">
        
        {/* VIEW 1: INTERACTIVE STUDENT DASHBOARD */}
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            dailyChallenges={dailyChallenges}
            onToggleChallenge={handleToggleChallenge}
            onNavigateToChapter={handleNavigateToChapter}
          />
        )}

        {/* VIEW 2 & 3: MATHEMATICS AND PHYSICS CHAPTER PORTALS */}
        {(activeTab === 'maths' || activeTab === 'physique-chimie') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* SUB-PANEL Left: Chapter Selector list sidebar */}
            <div className="lg:col-span-3 space-y-2 select-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block ml-1 mb-1">
                Chapitres requis :
              </span>
              <div className="flex flex-col gap-1.5 bg-white dark:bg-slate-950 p-3 rounded-[24px] border border-slate-205 dark:border-slate-800 shadow-sm">
                {(activeTab === 'maths' ? mathChapters : physicsChapters).map((ch) => {
                  const chExCompleted = Object.keys(stats.completedExercises).filter((key) =>
                    key.startsWith(ch.id)
                  ).length;
                  const scoreLabel = `${chExCompleted}/4`;

                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setSelectedChapterId(ch.id);
                        // Trigger daily challenge completions if applicable
                        if (ch.id === 'pythagore') {
                          // Complete "Calculateur d'Aires"
                          setDailyChallenges((prev) =>
                            prev.map((c) => (c.id === 'math-pyth' && !c.completed ? { ...c, completed: true } : c))
                          );
                        }
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                        selectedChapterId === ch.id
                          ? activeTab === 'maths'
                            ? 'bg-blue-600 text-white shadow-xs font-bold ring-2 ring-blue-500/20'
                            : 'bg-violet-600 text-white shadow-xs font-bold ring-2 ring-violet-500/20'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <span className="truncate pr-1">{ch.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono ${
                        selectedChapterId === ch.id
                          ? 'bg-white/20 text-white font-extrabold'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-550'
                      }`}>
                        {scoreLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Auxiliary scientific calculator slot in sidebar */}
              <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-[24px] border border-slate-200 dark:border-slate-800 space-y-3 mt-4 text-center shadow-xs">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-mono">Boîte à Outils</span>
                <p className="text-[10.5px] text-slate-505 dark:text-slate-400 leading-normal font-medium">
                  Besoin d'évaluer une racine carrée ou un cosinus ? Utilise la calculatrice intégrée !
                </p>
                <button
                  onClick={() => setActiveTab('calculatrice')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-[11px] flex justify-center items-center gap-1.5 transition-all shadow-xs"
                >
                  <Calculator className="w-3.5 h-3.5 text-sky-400 animate-pulse" /> Ouvrir la Calculatrice
                </button>
              </div>
            </div>

            {/* SUB-PANEL Right: Interactive Simulated Lesson & Stepper quiz */}
            <div className="lg:col-span-9 space-y-6">
              {currentChapter ? (
                <>
                  {/* Chapter Visual Intro Card */}
                  <div className="bg-white dark:bg-slate-950 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div>
                      <span className={`text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase ${
                        activeTab === 'maths'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/55 dark:text-blue-400'
                          : 'bg-violet-100 text-violet-750 dark:bg-violet-950/55 dark:text-violet-400'
                      }`}>
                        {activeTab === 'maths' ? 'Mathématiques 📐' : 'Physique-Chimie 🔬'}
                      </span>
                      <h2 className="text-xl font-black text-slate-905 dark:text-white mt-3 font-sans tracking-tight">
                        {currentChapter.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 max-w-xl dark:text-slate-400 leading-normal font-medium">
                        {currentChapter.description}
                      </p>
                    </div>

                    {/* Return back home hook link */}
                    <button
                      onClick={() => { setActiveTab('dashboard'); setSelectedChapterId(null); }}
                      className="text-xs font-bold text-indigo-650 dark:text-indigo-400 flex items-center gap-1 hover:translate-x-1 transition-transform self-end"
                    >
                      Retourner à l'accueil <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* SIMULATION GRAPHICS CONTAINER (MATHEMATICS OR PHYSICS ACCORDING TO CHAPTER ID) */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">
                      Simulateur Interactif Réactif :
                    </span>
                    {activeTab === 'maths' ? (
                      <MathSimulations simulationId={currentChapter.id} />
                    ) : (
                      <PhysicsSimulations simulationId={currentChapter.id} />
                    )}
                  </div>

                  {/* PROGRESSIVE STEPPER EXERCISE MANAGER */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">
                      Résolution et Entraînement :
                    </span>
                    <ExerciseManager
                      chapterId={currentChapter.id}
                      onPointsGained={handlePointsGained}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center p-12 bg-white rounded-2xl border">
                  <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-slate-505 font-medium mt-2">Choisis un chapitre dans la liste latérale pour commencer !</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: COMPREHENSIVE CHEAT SHEET FORMULARIUM */}
        {activeTab === 'revisions' && (
          <CheatSheet />
        )}

        {/* VIEW 5: SCIENTIFIC CALCULATOR VIEW */}
        {activeTab === 'calculatrice' && (
          <div className="py-6 flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-bounce" />
              Calculatrice Scientifique Autonome
            </h3>
            <p className="text-xs text-slate-500 max-w-sm text-center mb-6 leading-relaxed">
              Utile pour vérifier tes calculs d'aires, de vitesse, d'intensité ou de trigonométrie sans quitter notre plateforme !
            </p>
            <ScientificCalculator />
          </div>
        )}
      </main>

      {/* COMPREHENSIVE FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-slate-400 text-xs font-sans mt-12">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <span className="font-bold text-white tracking-wide">Académie Brevet Réussite</span>
            <p className="text-[10.5px] text-slate-500 leading-normal">
              Conçu pour le programme de 3ème de l'Éducation Nationale. Comprendre par l'expérience visuelle.
            </p>
          </div>
          <div className="flex gap-4 font-mono font-bold text-[10px] text-slate-500">
            <span>TERRE GRAPHS v1.8</span>
            <span>PROG: 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
