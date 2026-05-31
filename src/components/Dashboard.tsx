/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Trophy,
  Zap,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
  CircleCheck,
  Compass,
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { UserStats, DailyChallenge, Badge, SubjectId, ChapterId } from '../types';

interface DashboardProps {
  stats: UserStats;
  dailyChallenges: DailyChallenge[];
  onToggleChallenge: (id: string) => void;
  onNavigateToChapter: (subject: SubjectId, chId: ChapterId) => void;
}

// Available Badges database
export const ALL_BADGES: Badge[] = [
  { id: 'first_steps', title: 'Petit Génie', description: 'Gagne tes 10 premiers points d\'apprentissage.', icon: 'Zap', requirement: '10 points' },
  { id: 'math_lord', title: 'As de Pythagore', description: 'Complète le niveau Brevet en Pythagore.', icon: 'GraduationCap', requirement: 'Niveau 4 de Pythagore' },
  { id: 'tesla', title: 'Maître Ampère', description: 'Complète le niveau Brevet en Électricité.', icon: 'Compass', requirement: 'Niveau 4 d\'Électricité' },
  { id: 'high_score', title: 'Major de Promo', description: 'Atteins un score total de 300 points.', icon: 'Trophy', requirement: '300 points' },
  { id: 'streak_3', title: 'Assidu du Brevet', description: 'Accumule une série de 3 résolutions correctes.', icon: 'Award', requirement: '3 séries consécutives' },
];

export default function Dashboard({ stats, dailyChallenges, onToggleChallenge, onNavigateToChapter }: DashboardProps) {
  // Calculate percentage of coverage
  // Total exercises count across math + physics = 11 chapters * 4 levels = 44 total quizzes
  const totalCompleted = Object.keys(stats.completedExercises).length;
  const overallPercentage = Math.min(100, Math.round((totalCompleted / 44) * 100));

  // Maths specific percentage (6 chapters)
  const mathIds = ['pythagore', 'trigonometrie', 'fonctions', 'thales', 'calcul-literal', 'statistiques'];
  const mathCompleted = Object.keys(stats.completedExercises).filter((id) =>
    mathIds.some((mId) => id.startsWith(mId))
  ).length;
  const mathPercentage = Math.min(100, Math.round((mathCompleted / 24) * 100));

  // Physics specific percentage (5 chapters)
  const physicsIds = ['electricite', 'mouvement', 'forces', 'energie', 'reactions-chimiques'];
  const physicsCompleted = Object.keys(stats.completedExercises).filter((id) =>
    physicsIds.some((pId) => id.startsWith(pId))
  ).length;
  const physicsPercentage = Math.min(100, Math.round((physicsCompleted / 20) * 100));

  // Format study timers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* MOTIVATING WELCOME HERO INTRO */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 rounded-[32px] p-8 text-white shadow-md relative overflow-hidden animate-fadeIn">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 select-none pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
        
        {/* Decorative laboratory colored dots */}
        <div className="absolute top-5 right-6 flex gap-1.5 select-none pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
        </div>

        <div className="relative z-10 space-y-4">
          <span className="inline-block bg-white/15 text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-opacity-20 backdrop-blur-xs">
            🎉 Objectif Brevet 2026 • Mention Très Bien
          </span>
          <h2 className="text-2xl md:text-4xl font-black font-sans tracking-tight leading-none">
            Prêt à réviser avec succès ?
          </h2>
          <p className="text-xs text-indigo-100 max-w-2xl leading-relaxed font-medium">
            Manipules les concepts physiques, simules les droites métriques et testes-toi sur des sujets officiels du brevet corrigés pas à pas. Tout le programme de 3ème est à ta portée avec nos laboratoires interactifs !
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            <div className="flex items-center gap-2 font-black text-yellow-350 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-xs">
              <Trophy className="w-4.5 h-4.5 text-yellow-350 shrink-0" />
              <span>NIVEAU : {stats.level}</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-100 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-xs">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{stats.points} XP cumulés</span>
            </div>
          </div>
        </div>

        {/* Floating geometric circles decoration */}
        <div className="absolute -right-16 -top-16 w-52 h-52 bg-white/5 rounded-full select-none" />
        <div className="absolute right-12 bottom-0 w-36 h-36 bg-violet-400/10 rounded-full blur-xl select-none" />
      </div>

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Experience XP */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-[24px] border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm hover:translate-y-[-2px] transition-all">
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-450">
            <Zap className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest font-mono">XP Accumulés</span>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-450 leading-none">{stats.points} XP</span>
          </div>
        </div>

        {/* Card 2: Streak info */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-[24px] border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm hover:translate-y-[-2px] transition-all">
          <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/20 text-orange-655">
            <TrendingUp className="w-6 h-6 text-orange-550" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest font-mono">Série de Jours</span>
            <span className="text-xl font-black text-orange-600 leading-none">{stats.streak} Jours</span>
          </div>
        </div>

        {/* Card 3: Study Clock timer */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-[24px] border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm hover:translate-y-[-2px] transition-all">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">
            <Clock className="w-6 h-6 text-emerald-550 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest font-mono">Temps de révision</span>
            <span className="text-xl font-black text-emerald-600 leading-none">{formatTime(stats.studyTimeSeconds)}</span>
          </div>
        </div>

        {/* Card 4: Master Ranking */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-[24px] border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm hover:translate-y-[-2px] transition-all">
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600">
            <GraduationCap className="w-6 h-6 text-rose-550" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest font-mono">Maîtrise Globale</span>
            <span className="text-sm font-black text-rose-600 mt-1 leading-tight block">
              {stats.level}
            </span>
          </div>
        </div>
      </div>

      {/* PROGRESS BAR GAUGES AND CHANNELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Card left side */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 flex gap-1 select-none pointer-events-none opacity-40">
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
          </div>

          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-indigo-500" /> Progression par Matière
          </h3>

          <div className="space-y-5">
            {/* Maths progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">📐 Mathématiques</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{mathPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${mathPercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block font-sans font-medium">
                {mathCompleted} sur 24 défis d'activités complétés
              </span>
            </div>

            {/* Physics progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-violet-600 dark:text-violet-400 flex items-center gap-1">🔬 Physique-Chimie</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{physicsPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-violet-600 h-full rounded-full transition-all"
                  style={{ width: `${physicsPercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block font-sans font-medium">
                {physicsCompleted} sur 20 défis d'activités complétés
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-xs text-slate-500 font-sans font-medium">
            <span>Exercices totaux réussis :</span>
            <span className="font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/45 px-3 py-1 rounded-full">{totalCompleted} / 44</span>
          </div>
        </div>

        {/* Daily Challenges Right Side */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm relative overflow-hidden">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500 animate-bounce" /> Défis Quotidiens (XP Bonus)
          </h3>

          <div className="space-y-3">
            {dailyChallenges.map((challenge) => (
              <div
                key={challenge.id}
                onClick={() => onToggleChallenge(challenge.id)}
                className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between cursor-pointer transition-all ${
                  challenge.completed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-400 shadow-3xs'
                    : 'bg-orange-50/40 dark:bg-slate-900/60 border-orange-100/60 dark:border-slate-804 hover:border-orange-200 text-slate-705 dark:text-slate-300 shadow-3xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    challenge.completed ? 'bg-emerald-200 dark:bg-emerald-950' : 'bg-orange-100 dark:bg-slate-800'
                  }`}>
                    <CircleCheck className={`w-4 h-4 ${challenge.completed ? 'text-emerald-600' : 'text-orange-500'}`} />
                  </div>
                  <div>
                    <span className={`block font-bold leading-tight ${challenge.completed ? 'line-through opacity-65 text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                      {challenge.title}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono mt-0.5">
                      {challenge.requirement}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-orange-500 text-white font-mono font-black rounded-full text-[9px] shadow-3xs">
                  +{challenge.points} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK SUGGESTIONS MODULE */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '15s' }} /> Suggestions de Travail Recommandées
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div
            onClick={() => onNavigateToChapter('maths', 'pythagore')}
            className="p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[24px] hover:border-indigo-500 hover:scale-[1.02] cursor-pointer text-left transition-all duration-300 group flex flex-col justify-between shadow-xs"
          >
            <div>
              <span className="text-[9px] font-black text-blue-500 font-mono tracking-widest block mb-2">📐 MATHÉMATIQUES</span>
              <h4 className="text-md font-extrabold text-slate-900 dark:text-slate-100 mt-1">Pythagore</h4>
              <p className="text-[11px] text-slate-500 mt-1 dark:text-slate-400 leading-relaxed font-medium">
                Testes le triangle à sommets étirables pour observer de façon géométrique que l'équation a² + b² = c² s'équilibre en temps réel !
              </p>
            </div>
            <span className="text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              S'entraîner <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => onNavigateToChapter('physique-chimie', 'electricite')}
            className="p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[24px] hover:border-indigo-500 hover:scale-[1.02] cursor-pointer text-left transition-all duration-300 group flex flex-col justify-between shadow-xs"
          >
            <div>
              <span className="text-[9px] font-black text-violet-500 font-mono tracking-widest block mb-2">🔬 PHYSIQUE-CHIMIE</span>
              <h4 className="text-md font-extrabold text-slate-900 dark:text-slate-100 mt-1">Électricité</h4>
              <p className="text-[11px] text-slate-500 mt-1 dark:text-slate-400 leading-relaxed font-medium">
                Ouvres et fermes le commutateur d'interrupteur et observes la loi d'Ohm en voyant les électrons marcher et l'ampoule briller.
              </p>
            </div>
            <span className="text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              S'entraîner <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => onNavigateToChapter('physique-chimie', 'reactions-chimiques')}
            className="p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[24px] hover:border-indigo-500 hover:scale-[1.02] cursor-pointer text-left transition-all duration-300 group flex flex-col justify-between shadow-xs"
          >
            <div>
              <span className="text-[9px] font-black text-violet-500 font-mono tracking-widest block mb-2">🧪 CHIMIE AMBIANTE</span>
              <h4 className="text-md font-extrabold text-slate-900 dark:text-slate-100 mt-1">Équations Chimiques</h4>
              <p className="text-[11px] text-slate-500 mt-1 dark:text-slate-400 leading-relaxed font-medium">
                Équilibres la combustion du méthane ou de l'eau avec les molécules en 3D visibles et résous les coefficients chimiques.
              </p>
            </div>
            <span className="text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              S'entraîner <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* BADGES GALLERY CARD */}
      <div className="bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 relative overflow-hidden">
        {/* Subtle grid layout ornament */}
        <div className="absolute inset-0 opacity-[0.015] select-none pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Award className="w-4.5 h-4.5 text-yellow-500 animate-pulse" /> Galerie des Badges Débloqués
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = stats.badges.includes(badge.id);
            // Dynamic Lucide icon resolution
            const IconComponent = (LucideIcons as any)[badge.icon] || Award;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-3xl border text-center flex flex-col items-center justify-center space-y-3 transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-slate-50/50 dark:bg-slate-900 border-indigo-200 dark:border-indigo-900 text-slate-850 dark:text-white shadow-3xs'
                    : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-105 dark:border-slate-800/80 text-slate-400 select-none opacity-40 grayscale'
                }`}
              >
                <div className={`p-3 rounded-full ${
                  isUnlocked ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 animate-scaleUp' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  <IconComponent className="w-6 h-6 shrink-0" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-extrabold leading-tight block">{badge.title}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-normal line-clamp-2">{badge.description}</span>
                  <span className="inline-block text-[8px] font-mono text-slate-400 font-bold uppercase tracking-wider mt-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {badge.requirement}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
