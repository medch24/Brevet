/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, AlertCircle, ToggleLeft, Activity, Compass, Flame } from 'lucide-react';
// @ts-ignore
import chemicalReactionAtomsImg from '../assets/images/chemical_reaction_atoms_1780253095971.png';

interface PhysicsSimulationsProps {
  simulationId: string;
}

export default function PhysicsSimulations({ simulationId }: PhysicsSimulationsProps) {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800 shadow-inner">
      {simulationId === 'electricite' && <ElectriciteSimulation />}
      {simulationId === 'mouvement' && <MouvementSimulation />}
      {simulationId === 'energie' && <EnergieSimulation />}
      {simulationId === 'reactions-chimiques' && <ReactionsChimiquesSimulation />}
      {!['electricite', 'mouvement', 'energie', 'reactions-chimiques'].includes(simulationId) && (
        <div className="h-64 flex flex-col items-center justify-center text-slate-405">
          <Activity className="w-12 h-12 mb-2 animate-pulse text-violet-500" />
          <p className="font-sans text-sm text-slate-400">Simulation physique interactive à venir !</p>
        </div>
      )}
    </div>
  );
}

// 1. ELEC SIMULATION
function ElectriciteSimulation() {
  const [tension, setTension] = useState(6); // Volts
  const [resistance, setResistance] = useState(12); // Ohms
  const [isOpen, setIsOpen] = useState(false); // Switch is closed (ON) or open (OFF). Note: French "fermé" means circuit active. Let's write "Circuit Fermé (ON)" & "Circuit Ouvert (OFF)" for precise wording.

  const current = isOpen ? 0 : parseFloat((tension / resistance).toFixed(3)); // Ampere
  const power = isOpen ? 0 : parseFloat((tension * current).toFixed(2)); // Watts

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {/* Style injection for dash movement simulation */}
        <style>{`
          @keyframes march {
            to { stroke-dashoffset: -20; }
          }
          .marching-electrons {
            stroke-dasharray: 8, 8;
            animation: march 0.8s linear infinite;
          }
        `}</style>

        <svg viewBox="0 0 340 240" className="w-full max-w-[300px] h-[220px] select-none">
          {/* Circuit wires skeleton */}
          <rect x="50" y="40" width="240" height="150" rx="6" fill="opacity-0" stroke="#475569" strokeWidth="3" />

          {/* Generator / Voltmeter (Left boundary) */}
          <g transform="translate(50, 115)">
            <circle cx="0" cy="0" r="18" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
            <text x="0" y="5" textAnchor="middle" className="text-xs font-bold fill-sky-800">
              {tension}V
            </text>
            <text x="-32" y="4" className="text-[10px] text-slate-400">Générateur</text>
          </g>

          {/* Switch (Top boundary) */}
          <g transform="translate(170, 40)" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            {/* Draw gap */}
            <rect x="-15" y="-10" width="30" height="20" fill="#fff" className="dark:fill-slate-950" />
            {isOpen ? (
              /* Opened connection curve (No current) */
              <line x1="-15" y1="0" x2="15" y2="-18" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            ) : (
              /* Closed contact line (Current flows) */
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
            )}
            {/* Contact nodes */}
            <circle cx="-15" cy="0" r="4.5" fill="#475569" />
            <circle cx="15" cy="0" r="4.5" fill="#475569" />
            <text x="0" y="-18" textAnchor="middle" className="text-[9px] font-bold fill-slate-500 whitespace-nowrap">
              Interrupteur : {isOpen ? 'Ouvert (OFF)' : 'Fermé (ON)'}
            </text>
          </g>

          {/* Light bulb (Right boundary) */}
          <g transform="translate(290, 115)">
            <rect x="-12" y="-20" width="24" height="40" fill="#fff" className="dark:fill-slate-950" />
            {/* Glowing effect proportional is power */}
            {!isOpen && current > 0 && (
              <circle
                cx="0"
                cy="0"
                r={15 + current * 12}
                fill="url(#glow-bulb)"
                className="opacity-70"
              />
            )}
            <circle cx="0" cy="0" r="14" fill="none" stroke="#475569" strokeWidth="2.5" />
            {/* Symbol cross 'X' inside bulb */}
            <line x1="-9" y1="-9" x2="9" y2="9" stroke="#475569" strokeWidth="2" />
            <line x1="9" y1="-9" x2="-9" y2="9" stroke="#475569" strokeWidth="2" />

            {/* Glowing rays */}
            {!isOpen && current > 0 && (
              <g className="stroke-yellow-400 select-all" strokeWidth="2" strokeLinecap="round">
                <line x1="0" y1="-20" x2="0" y2="-26" />
                <line x1="0" y1="20" x2="0" y2="26" />
                <line x1="-20" y1="0" x2="-26" y2="0" />
                <line x1="20" y1="0" x2="26" y2="0" />
                <line x1="-15" y1="-15" x2="-20" y2="-20" />
                <line x1="15" y1="-15" x2="20" y2="-20" />
                <line x1="-15" y1="15" x2="-20" y2="20" />
                <line x1="15" y1="15" x2="20" y2="20" />
              </g>
            )}
            <text x="30" y="4" className="text-[10px] text-slate-400">Lampe</text>
          </g>

          {/* Resistor / Ammeter element (Bottom boundary) */}
          <g transform="translate(170, 190)">
            <rect x="-24" y="-12" width="48" height="24" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" className="text-[10px] font-mono font-bold fill-rose-700">
              {resistance} Ω
            </text>
            <text x="0" y="22" textAnchor="middle" className="text-[9px] text-slate-400">Résistance (R)</text>
          </g>

          {/* Electron marching animation overlay on top of wires */}
          {!isOpen && current > 0 && (
            <path
              d="M 50 115 L 50 40 L 290 40 L 290 190 L 50 190 Z"
              fill="none"
              stroke="#ebc124"
              strokeWidth="4.5"
              strokeLinecap="round"
              className="marching-electrons cursor-pointer"
            />
          )}

          {/* Digital Ammeter Value Overlay */}
          <g transform="translate(250, 160)">
            <rect x="-35" y="-10" width="70" height="20" rx="3" fill="#1e293b" />
            <text x="0" y="4" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-400">
              I = {current.toFixed(3)} A
            </text>
          </g>

          {/* Gradients definition for bulb glow */}
          <defs>
            <radialGradient id="glow-bulb" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1 font-sans">
          <ToggleLeft className="w-3.5 h-3.5 text-yellow-400" /> Clique l'interrupteur pour l'action !
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Loi d'Ohm en Action
          </h4>

          {/* Formula banner */}
          <div className="p-3 text-center rounded-lg bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900">
            <span className="font-mono text-base font-bold text-sky-700 dark:text-sky-400">
              U = R × I &nbsp;→&nbsp; I = U / R
            </span>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded">
              <span>Tension du générateur (U) :</span>
              <span className="font-mono font-bold text-sky-600">{tension} V</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded">
              <span>Résistance de l'ampoule (R) :</span>
              <span className="font-mono font-bold text-rose-500">{resistance} Ω</span>
            </div>
            <div className="flex justify-between items-center bg-green-500/10 p-1.5 rounded text-green-700 dark:text-green-400">
              <span>Intensité mesurée (I) :</span>
              <span className="font-mono font-bold">{current.toFixed(3)} A</span>
            </div>
            <div className="flex justify-between items-center bg-yellow-500/10 p-1.5 rounded text-yellow-800 dark:text-yellow-400">
              <span>Puissance dissipée (P = U×I) :</span>
              <span className="font-mono font-bold">{power} W</span>
            </div>
          </div>
        </div>

        {/* Sliders for Tension and Resistance */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl space-y-3 text-xs">
          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>U - Tension : {tension} Volts</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={tension}
              onChange={(e) => setTension(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>R - Résistance : {resistance} Ohms</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              step="1"
              value={resistance}
              onChange={(e) => setResistance(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. MOUVEMENT SIMULATION (Racing Car Kinematics and forces)
function MouvementSimulation() {
  const [initSpeed, setInitSpeed] = useState(1); // m/s
  const [acceleration, setAcceleration] = useState(1.5); // m/s²
  const [friction, setFriction] = useState(0.5); // opposing deceleration
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0); // time in seconds

  const intervalRef = useRef<number | null>(null);

  // Net acceleration = thrust acceleration - friction opposition
  const activeAcc = Math.max(0, acceleration - friction);

  // Current physics values based on kinematics formulas
  // x(t) = 0.5 * a * t^2 + v0 * t
  // v(t) = a * t + v0
  const currentSpeed = isPlaying ? initSpeed + activeAcc * elapsed : initSpeed;
  const currentPos = isPlaying ? 0.5 * activeAcc * (elapsed * elapsed) + initSpeed * elapsed : 5;

  // Render scaling: map logical pos (0 -> 100 meters) to pixel coordinates (10 -> 240 pixels)
  const logicalToPixel = (pos: number) => {
    return 30 + Math.min(270, pos * 3);
  };
  const carX = logicalToPixel(currentPos);

  // Triggers simulation play or reverse
  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setElapsed(0);
    }
  };

  const resetSim = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setElapsed(0);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 0.05;
          // cap simulation at 8 seconds or when car reaches end representing 90 meters
          if (next >= 8 || currentPos >= 90) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, 50);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentPos]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-7 flex flex-col items-stretch bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs font-mono font-bold text-slate-500">Écoulement : {elapsed.toFixed(2)}s</span>
          <span className="text-xs font-mono font-bold text-orange-500">Position : {currentPos.toFixed(1)} m</span>
          <span className="text-xs font-mono font-bold text-emerald-500 font-sans">Vitesse : {currentSpeed.toFixed(1)} m/s ({(currentSpeed * 3.6).toFixed(0)} km/h)</span>
        </div>

        <svg viewBox="0 0 340 180" className="w-full h-[155px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded">
          {/* Roadbed */}
          <rect x="0" y="115" width="340" height="15" fill="#475569" />
          <line x1="0" y1="125" x2="340" y2="125" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="8 6" />

          {/* Distance ticks */}
          {Array.from({ length: 11 }).map((_, i) => {
            const pX = 30 + i * 27;
            return (
              <g key={i} transform={`translate(${pX}, 138)`}>
                <line x1="0" y1="0" x2="0" y2="5" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="0" y="14" textAnchor="middle" className="text-[7.5px] font-mono fill-slate-400">{i * 10}m</text>
              </g>
            );
          })}

          {/* Racing car body at dynamic carX */}
          <g transform={`translate(${carX}, 115)`}>
            {/* Draw Forces Vectors overlaid on target car (Only when active) */}
            {/* Weight Vector P (downwards) */}
            <g className="text-rose-500">
              <line x1="0" y1="-8" x2="0" y2="15" stroke="currentColor" strokeWidth="1.8" markerEnd="url(#arrow-red)" />
              <text x="6" y="14" className="text-[8px] font-bold fill-rose-500">P⃑</text>
            </g>
            {/* Support Lift force R (upwards) */}
            <g className="text-emerald-500">
              <line x1="0" y1="-8" x2="0" y2="-32" stroke="currentColor" strokeWidth="1.8" markerEnd="url(#arrow-green)" />
              <text x="6" y="-26" className="text-[8px] font-bold fill-emerald-500">R⃑</text>
            </g>
            {/* Engine Thrust acceleration vector F (rightwards) */}
            {acceleration > 0 && (
              <g className="text-blue-500">
                <line x1="5" y1="-8" x2={5 + acceleration * 12} y2="-8" stroke="currentColor" strokeWidth="1.8" markerEnd="url(#arrow-blue)" />
                <text x={5 + acceleration * 12 + 2} y="-12" className="text-[8px] font-bold fill-blue-500">F⃑</text>
              </g>
            )}
            {/* Friction vector f (leftwards) */}
            {friction > 0 && (
              <g className="text-slate-400">
                <line x1="-5" y1="-8" x2={-5 - friction * 12} y2="-8" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow-gray)" />
                <text x={-5 - friction * 12 - 10} y="-12" className="text-[8px] font-bold fill-slate-400">f⃑</text>
              </g>
            )}

            {/* Car Chassis graphics */}
            <rect x="-18" y="-14" width="36" height="8" rx="2" fill="#3b82f6" />
            <path d="M -10 -14 L -6 -20 L 8 -20 L 12 -14 Z" fill="#1d4ed8" />
            <circle cx="-10" cy="-6" r="5" fill="#1e293b" stroke="#fff" strokeWidth="1" />
            <circle cx="10" cy="-6" r="5" fill="#1e293b" stroke="#fff" strokeWidth="1" />
          </g>

          {/* Marker declarations for vector arrows */}
          <defs>
            <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L6,3 Z" fill="#ef4444" />
            </marker>
            <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L6,3 Z" fill="#10b981" />
            </marker>
            <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L6,3 Z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-gray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L6,3 Z" fill="#94a3b8" />
            </marker>
          </defs>
        </svg>

        {/* Buttons tray */}
        <div className="flex gap-2 mt-3 justify-center">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow transition-all ${
              isPlaying ? 'bg-red-500 hover:bg-red-630' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Lancer la voiture'}
          </button>
          <button
            onClick={resetSim}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            Principe d'Inertie & Forces
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            La résultante des forces détermine le mouvement. Les forces montrées sont le Poids <strong className="text-rose-500 font-bold">P⃑</strong>, la réaction du sol <strong className="text-emerald-500 font-bold">R⃑</strong>, la force motrice <strong className="text-blue-500 font-bold">F⃑</strong> et les frottements <strong className="text-slate-400 font-bold">f⃑</strong> opposing the acceleration.
          </p>

          <div className="p-3 bg-violet-50/50 dark:bg-violet-950/15 rounded-lg border border-violet-100 dark:border-violet-900/50 space-y-1 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Formules cinématiques du Brevet :</span>
            <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <div>Vitesse moyenne : v = d / t</div>
              <div>Accélération effective : a = {activeAcc.toFixed(2)} m/s²</div>
              <div>Forces equilibrées verticalement : P⃑ + R⃑ = 0⃑</div>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl space-y-3 text-xs">
          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>Force motrice / Accélération : {acceleration} m/s²</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="0.2"
              value={acceleration}
              onChange={(e) => setAcceleration(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>Frottements / Résistance : {friction} m/s²</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={friction}
              onChange={(e) => setFriction(Number(e.target.value))}
              className="w-full accent-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. ENERGIE SIMULATION (Conservation de l'énergie mécanique)
function EnergieSimulation() {
  const [mass, setMass] = useState(20); // Kilograms
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // goes 0 -> 100 representing position along parabola

  const timerRef = useRef<number | null>(null);

  // Parabolic track equation: U-shape U(x)
  // x-coordinate from -5 to +5 maps to logical coordinates
  // Width: 260px, Height: 120px
  // Parabolic curve: Y = X² normalized
  // The skater slides back & forth periodically:
  // Speed is maximum at bottom (pos 0), Potential energy is maximum at peaks
  const period = 3; // 3 seconds full cycle
  const currentT = (progress / 100) * Math.PI * 2;
  const skaterX = Math.sin(currentT); // oscillates -1 to +1

  // Height of skater (0 below to 1 at edges)
  const relativeHeight = skaterX * skaterX;

  // Potential Energy: Ep = m * g * h
  // Kinematic Energy: Ek = 0.5 * m * v²
  // Total Mechanical Energy: Em = Ep + Ek = Constant!
  const g = 9.81;
  const totalMechY = mass * g * 5; // potential at 5m
  const potEnergy = totalMechY * relativeHeight;
  const kinEnergy = totalMechY - potEnergy;

  // Speed derived: 0.5 * m * v² = Ek  => v = sqrt(2 * Ek / m)
  const currentSpeed = Math.sqrt((2 * kinEnergy) / mass);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setProgress((p) => (p + 1.2) % 100);
      }, 30);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Center is cx = 150, ground cy = 150
  // Skateboard x range = -100 to +100 px from center
  const pxCar = 150 + skaterX * 100;
  // Parabolic y: cy - height (scale factor 60)
  const pyCar = 160 - relativeHeight * 60;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-7 flex flex-col items-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
        <svg viewBox="0 0 300 210" className="w-full max-w-[270px] h-[200px] overflow-visible">
          {/* Parabolic slide line path */}
          <path d="M 50 100 Q 150 170 250 100" fill="none" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
          {/* Ground anchor */}
          <line x1="20" y1="162" x2="280" y2="162" stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-slate-800" />

          {/* Skateboarder ball */}
          <g transform={`translate(${pxCar}, ${pyCar})`}>
            <circle cx="0" cy="-6" r="8.5" fill="#a855f7" stroke="#fff" strokeWidth="1.5" className="shadow-lg" />
            <line x1="-5" y1="2" x2="5" y2="2" stroke="#475569" strokeWidth="2.5" />
            {/* Speed vector arrow horizontally based on direction */}
            {currentSpeed > 0.5 && (
              <line
                x1="0"
                y1="-6"
                x2={Math.cos(currentT) > 0 ? currentSpeed * 2.5 : -currentSpeed * 2.5}
                y2="-6"
                stroke="#10b981"
                strokeWidth="1.8"
                markerEnd="url(#arrow-green)"
              />
            )}
          </g>

          {/* Energy Bargraph Bars on RHS context */}
          <g transform="translate(25, 40)">
            {/* Ep bar */}
            <rect x="0" y="0" width="10" height="70" fill="#e2e8f0" rx="1" className="dark:fill-slate-800" />
            <rect x="0" y={70 - relativeHeight * 70} width="10" height={relativeHeight * 70} fill="#ef4444" rx="1" />
            <text x="5" y="82" textAnchor="middle" className="text-[7.5px] fill-rose-500 font-bold">EP</text>

            {/* Ek bar */}
            <rect x="18" y="0" width="10" height="70" fill="#e2e8f0" rx="1" className="dark:fill-slate-800" />
            <rect x="18" y={70 - (1 - relativeHeight) * 70} width="10" height={(1 - relativeHeight) * 70} fill="#10b981" rx="1" />
            <text x="23" y="82" textAnchor="middle" className="text-[7.5px] fill-emerald-500 font-bold">EK</text>

            {/* Em Total bar */}
            <rect x="36" y="0" width="10" height="70" fill="#e2e8f0" rx="1" className="dark:fill-slate-800" />
            <rect x="36" y="0" width="10" height="70" fill="#8b5cf6" rx="1" />
            <text x="41" y="82" textAnchor="middle" className="text-[7.5px] fill-violet-500 font-bold">EM</text>
          </g>
        </svg>

        {/* Buttons */}
        <div className="flex gap-2 justify-center mt-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-xs transition-all"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isPlaying ? 'Arrêter' : 'Lancer'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            Transfert d'Énergie
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pendant le balancement, l'énergie potentielle de pesanteur <strong className="text-rose-500">(EP)</strong> en hauteur se convertit en énergie cinétique <strong className="text-emerald-500">(EK)</strong> à vitesse maximale. L'énergie mécanique totale <strong className="text-violet-500">(EM)</strong> reste rigoureusement conservée !
          </p>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 bg-rose-500/5 p-1 rounded">
              <span>Potential (EP) :</span>
              <span>{potEnergy.toFixed(0)} J</span>
            </div>
            <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 p-1 rounded">
              <span>Cinétique (EK) :</span>
              <span>{kinEnergy.toFixed(0)} J</span>
            </div>
            <div className="flex justify-between items-center text-violet-600 dark:text-violet-400 bg-violet-500/10 p-1 rounded font-bold">
              <span>Mécanique (EM) :</span>
              <span>{totalMechY.toFixed(0)} J</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 border-t border-dashed mt-2 pt-1">
              <span>Vitesse instantanée :</span>
              <span className="text-emerald-600">{currentSpeed.toFixed(1)} m/s</span>
            </div>
          </div>
        </div>

        {/* Mass configuration widget */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Masse du mobile (m) :</span>
            <span className="px-2 py-0.5 bg-violet-600 text-white font-bold rounded-full font-mono text-[11px]">
              {mass} kg
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="45"
            step="1"
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="w-full accent-violet-600"
          />
        </div>
      </div>
    </div>
  );
}

// 4. CHEMICAL REACTIONS SIMULATION
function ReactionsChimiquesSimulation() {
  const [equationMode, setEquationMode] = useState<'methane' | 'water'>('methane');
  // Reactant coefficients user selection
  const [coef1, setCoef1] = useState(1); // Methane (CH4) or Hydrogen (H2)
  const [coef2, setCoef2] = useState(1); // Oxygen (O2)
  // Product coefficients user selection
  const [coefO1, setCoefO1] = useState(1); // Carbon Dioxide (CO2) or Water (H2O)
  const [coefO2, setCoefO2] = useState(1); // Water (H2O) (Only useful in methane mode)

  // Verify elements count logic
  // Mode Methane: CH4 + 2 O2 -> CO2 + 2 H2O
  // Atoms Left: Carbon = coef1, Hydrogen = 4 * coef1, Oxygen = 2 * coef2
  // Atoms Right: Carbon = coefO1, Hydrogen = 2 * coefO2, Oxygen = 2 * coefO1 + coefO2
  // Mode Water: 2 H2 + O2 -> 2 H2O
  // Atoms Left: Hydrogen = 2 * coef1, Oxygen = 2 * coef2
  // Atoms Right: Hydrogen = 2 * coefO1, Oxygen = coefO1

  let cLeft = 0, hLeft = 0, oLeft = 0;
  let cRight = 0, hRight = 0, oRight = 0;

  if (equationMode === 'methane') {
    cLeft = coef1;
    hLeft = coef1 * 4;
    oLeft = coef2 * 2;

    cRight = coefO1;
    hRight = coefO2 * 2;
    oRight = coefO1 * 2 + coefO2;
  } else {
    // Water
    hLeft = coef1 * 2;
    oLeft = coef2 * 2;

    hRight = coefO1 * 2;
    oRight = coefO1;
  }

  const isBalanced =
    equationMode === 'methane'
      ? cLeft === cRight && hLeft === hRight && oLeft === oRight
      : hLeft === hRight && oLeft === oRight;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-7 flex flex-col items-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Toggle equations */}
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg w-full mb-3">
          <button
            onClick={() => {
              setEquationMode('methane');
              setCoef1(1); setCoef2(1); setCoefO1(1); setCoefO2(1);
            }}
            className={`flex-1 text-[11px] font-semibold py-1 px-2 rounded transition-all ${
              equationMode === 'methane' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Combustion du Méthane
          </button>
          <button
            onClick={() => {
              setEquationMode('water');
              setCoef1(1); setCoef2(1); setCoefO1(1);
            }}
            className={`flex-1 text-[11px] font-semibold py-1 px-2 rounded transition-all ${
              equationMode === 'water' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Synthèse de l'Eau
          </button>
        </div>

        {/* Dynamic visual molecular representations */}
        <div className="w-full flex items-center justify-around py-4 border border-dashed border-slate-100 dark:border-slate-900 rounded-lg bg-slate-50/40 dark:bg-slate-950/20 mb-3 min-h-[90px]">
          {/* Reactants container */}
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Réactifs (Gauche)</span>
            <div className="flex items-center gap-2">
              {/* Reactant 1 */}
              <div className="p-1 px-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold font-mono">
                  {coef1} × {equationMode === 'methane' ? 'CH₄' : 'H₂'}
                </span>
                {/* Visual atom model */}
                <div className="flex gap-0.5 justify-center mt-1">
                  {Array.from({ length: Math.min(4, coef1) }).map((_, r) => (
                    <div key={r} className="relative w-7 h-7 flex items-center justify-center">
                      {equationMode === 'methane' ? (
                        <>
                          {/* Carbon as center dark dot */}
                          <div className="w-4.5 h-4.5 rounded-full bg-slate-800 text-white border border-slate-700 text-[6px] flex items-center justify-center font-bold font-mono">C</div>
                          {/* Hydrogen circles clustered around */}
                          <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-400 text-[5px] flex items-center justify-center font-bold">H</div>
                          <div className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-400 text-[5px] flex items-center justify-center font-bold">H</div>
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-400 text-[5px] flex items-center justify-center font-bold">H</div>
                          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-400 text-[5px] flex items-center justify-center font-bold">H</div>
                        </>
                      ) : (
                        <>
                          {/* Hydrogen molecules H2 */}
                          <div className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-400 text-[6px] flex items-center justify-center font-bold absolute left-px">H</div>
                          <div className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-400 text-[6px] flex items-center justify-center font-bold absolute right-px">H</div>
                        </>
                      )}
                    </div>
                  ))}
                  {coef1 > 4 && <span className="text-[9px] text-slate-400 mt-2">...</span>}
                </div>
              </div>

              <span className="text-slate-400 font-bold font-sans">+</span>

              {/* Reactant 2 (O2) */}
              <div className="p-1 px-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold font-mono">
                  {coef2} × O₂
                </span>
                <div className="flex gap-0.5 justify-center mt-1">
                  {Array.from({ length: Math.min(4, coef2) }).map((_, r) => (
                    <div key={r} className="relative w-6 h-6 flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-600 border border-red-500 text-[6px] flex items-center justify-center font-semibold text-white absolute left-px">O</div>
                      <div className="w-3.5 h-3.5 rounded-full bg-red-600 border border-red-500 text-[6px] flex items-center justify-center font-semibold text-white absolute right-px">O</div>
                    </div>
                  ))}
                  {coef2 > 4 && <span className="text-[9px] text-slate-400 mt-2">...</span>}
                </div>
              </div>
            </div>
          </div>

          <span className="text-xl font-bold text-slate-500">→</span>

          {/* Products container */}
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Produits (Droite)</span>
            <div className="flex items-center gap-2">
              {/* Product 1 */}
              <div className="p-1 px-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold font-mono">
                  {coefO1} × {equationMode === 'methane' ? 'CO₂' : 'H₂O'}
                </span>
                <div className="flex gap-0.5 justify-center mt-1">
                  {Array.from({ length: Math.min(4, coefO1) }).map((_, r) => (
                    <div key={r} className="relative w-7 h-7 flex items-center justify-center">
                      {equationMode === 'methane' ? (
                        <>
                          <div className="w-4 h-4 rounded-full bg-slate-800 text-white text-[6px] font-bold font-mono flex items-center justify-center">C</div>
                          <div className="w-3 h-3 rounded-full bg-red-600 text-white text-[5px] font-semibold flex items-center justify-center absolute left-0">O</div>
                          <div className="w-3 h-3 rounded-full bg-red-600 text-white text-[5px] font-semibold flex items-center justify-center absolute right-0">O</div>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 rounded-full bg-red-600 text-white text-[6px] font-semibold flex items-center justify-center">O</div>
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border text-[5px] font-bold flex items-center justify-center absolute top-0.5 left-0">H</div>
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border text-[5px] font-bold flex items-center justify-center absolute top-0.5 right-0">H</div>
                        </>
                      )}
                    </div>
                  ))}
                  {coefO1 > 4 && <span className="text-[9px] text-slate-400 mt-2">...</span>}
                </div>
              </div>

              {equationMode === 'methane' && (
                <>
                  <span className="text-slate-400 font-bold font-sans">+</span>

                  {/* Product 2 Water for methane */}
                  <div className="p-1 px-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold font-mono">
                      {coefO2} × H₂O
                    </span>
                    <div className="flex gap-0.5 justify-center mt-1">
                      {Array.from({ length: Math.min(4, coefO2) }).map((_, r) => (
                        <div key={r} className="relative w-6 h-6 flex items-center justify-center">
                          <div className="w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[6px] font-semibold flex items-center justify-center">O</div>
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border text-[5px] font-bold flex items-center justify-center absolute top-px left-0">H</div>
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border text-[5px] font-bold flex items-center justify-center absolute top-px right-0">H</div>
                        </div>
                      ))}
                      {coefO2 > 4 && <span className="text-[9px] text-slate-400 mt-2">...</span>}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Balance Scales diagram */}
        <div className={`w-full p-2.5 rounded-lg flex items-center justify-center gap-2 border text-[11px] font-sans font-bold shadow-xs ${
          isBalanced
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
        }`}>
          {isBalanced ? (
            <span className="flex items-center gap-1">
              🎉 Équation équilibrée ! Conservation des atomes respectée.
            </span>
          ) : (
            <span className="flex items-center gap-1">
              ⚠️ Équation déséquilibrée. Ajuste les coefficients à l'aide des boutons ci-dessous !
            </span>
          )}
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        {/* Core controllers */}
        <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            Ajuster le Coefficients
          </h4>

          <div className="space-y-3 font-sans">
            {/* Reactant 1 button */}
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {equationMode === 'methane' ? 'Méthane (CH₄)' : 'Dihydrogène (H₂)'} :
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCoef1(Math.max(1, coef1 - 1))}
                  className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200"
                >
                  -
                </button>
                <span className="font-mono font-bold text-center w-4">{coef1}</span>
                <button
                  type="button"
                  onClick={() => setCoef1(coef1 + 1)}
                  className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Reactant 2 button */}
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Dioxygène (O₂) :</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCoef2(Math.max(1, coef2 - 1))}
                  className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200"
                >
                  -
                </button>
                <span className="font-mono font-bold text-center w-4">{coef2}</span>
                <button
                  type="button"
                  onClick={() => setCoef2(coef2 + 1)}
                  className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Product 1 button */}
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {equationMode === 'methane' ? 'Dioxyde de carbone (CO₂)' : 'Eau (H₂O)'} :
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCoefO1(Math.max(1, coefO1 - 1))}
                  className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200"
                >
                  -
                </button>
                <span className="font-mono font-bold text-center w-4">{coefO1}</span>
                <button
                  type="button"
                  onClick={() => setCoefO1(coefO1 + 1)}
                  className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Product 2 button (Methane only) */}
            {equationMode === 'methane' && (
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Eau (H₂O) :</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCoefO2(Math.max(1, coefO2 - 1))}
                    className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-center w-4">{coefO2}</span>
                  <button
                    type="button"
                    onClick={() => setCoefO2(coefO2 + 1)}
                    className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live inventory counters */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl space-y-2 text-xs">
          <span className="font-semibold text-slate-500">Bilan des Atomes :</span>
          <div className="grid grid-cols-2 gap-2 text-center text-[11px] pt-1">
            <div className="p-1 px-2 border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/25 rounded-md space-y-1">
              <span className="font-bold text-blue-700 dark:text-blue-400">Atomes de Gauche</span>
              <div className="font-mono text-slate-600 dark:text-slate-400">
                {equationMode === 'methane' && <div>Carbome (C) : {cLeft}</div>}
                <div>Hydrogène (H) : {hLeft}</div>
                <div>Oxygène (O) : {oLeft}</div>
              </div>
            </div>

            <div className="p-1 px-2 border border-orange-100 dark:border-orange-900/40 bg-orange-50/40 dark:bg-orange-950/25 rounded-md space-y-1">
              <span className="font-bold text-orange-700 dark:text-orange-400">Atomes de Droite</span>
              <div className="font-mono text-slate-600 dark:text-slate-400">
                {equationMode === 'methane' && <div>Carbone (C) : {cRight}</div>}
                <div>Hydrogène (H) : {hRight}</div>
                <div>Oxygène (O) : {oRight}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reaction Illustration card */}
        {equationMode === 'water' && (
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-205 dark:border-slate-800 space-y-2">
            <span className="font-semibold text-slate-500 text-xs block">Schéma de la réaction de synthèse :</span>
            <img 
              src={chemicalReactionAtomsImg} 
              alt="Schéma de synthèse de l'eau" 
              className="w-full h-auto rounded-lg shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="text-[10px] text-slate-400 block text-center leading-relaxed font-bold">
              Brevet Express : 2 H₂ + O₂ &rarr; 2 H₂O. Les atomes ne se perdent pas, ils se réorganisent !
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
