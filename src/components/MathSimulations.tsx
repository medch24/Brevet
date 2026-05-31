/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, HelpCircle, Hash, Sparkles, ArrowRight, ChevronRight, ChevronLeft, Lightbulb, CheckCircle2, RefreshCw } from 'lucide-react';
// @ts-ignore
import remarkableIdentitiesImg from '../assets/images/remarkable_identities_geometry_1780253073996.png';

interface MathSimulationsProps {
  simulationId: string;
}

export default function MathSimulations({ simulationId }: MathSimulationsProps) {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800 shadow-inner">
      {simulationId === 'pythagore' && <PythagoreSimulation />}
      {simulationId === 'calcul-literal' && <CalculLiteralSimulation />}
      {simulationId === 'trigonometrie' && <TrigonometrieSimulation />}
      {simulationId === 'fonctions' && <FonctionsSimulation />}
      {simulationId === 'thales' && <ThalesSimulation />}
      {!['pythagore', 'calcul-literal', 'trigonometrie', 'fonctions', 'thales'].includes(simulationId) && (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <HelpCircle className="w-12 h-12 mb-2 animate-bounce text-violet-500" />
          <p className="font-sans text-sm">Simulation interactive à venir pour ce chapitre !</p>
        </div>
      )}
    </div>
  );
}

// 1. PYTHAGORE SIMULATION
function PythagoreSimulation() {
  const [abY, setAbY] = useState(120); // vertical height of A above B
  const [bcX, setBcX] = useState(160); // horizontal length of C from B

  const containerRef = useRef<SVGSVGElement>(null);
  const [isDraggingA, setIsDraggingA] = useState(false);
  const [isDraggingC, setIsDraggingC] = useState(false);

  // Position of points on a 420x420 coordinates grid:
  // Right angle point B is at constant (100, 300)
  const bX = 140;
  const bY = 280;

  const aX = bX;
  const aY = bY - abY; // A is strictly above B

  const cX = bX + bcX; // C is strictly right of B
  const cY = bY;

  // Calculs lengths
  const lenAB = parseFloat((Math.abs(bY - aY) / 20).toFixed(1));
  const lenBC = parseFloat((Math.abs(cX - bX) / 20).toFixed(1));
  const lenAC = parseFloat(Math.sqrt(lenAB * lenAB + lenBC * lenBC).toFixed(1));

  // Areas
  const areaAB = parseFloat((lenAB * lenAB).toFixed(1));
  const areaBC = parseFloat((lenBC * lenBC).toFixed(1));
  const areaAC = parseFloat((lenAC * lenAC).toFixed(1));

  const handlePointerDown = (point: 'A' | 'C') => {
    if (point === 'A') setIsDraggingA(true);
    if (point === 'C') setIsDraggingC(true);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingA && !isDraggingC) return;
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      // Calculate normalized X and Y inside the SVG coordinates
      const scaleX = 440 / rect.width;
      const scaleY = 440 / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      if (isDraggingA) {
        // Drag A vertically
        const deltaY = Math.max(30, Math.min(220, bY - y));
        setAbY(deltaY);
      } else if (isDraggingC) {
        // Drag C horizontally
        const deltaX = Math.max(30, Math.min(220, x - bX));
        setBcX(deltaX);
      }
    };

    const handlePointerUp = () => {
      setIsDraggingA(false);
      setIsDraggingC(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingA, isDraggingC]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-7 flex justify-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <svg
          ref={containerRef}
          viewBox="0 0 440 440"
          className="w-full max-w-[380px] h-[380px] select-none touch-none"
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid-math" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-100 dark:text-slate-900" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-math)" />

          {/* Right Angle Symbol at B */}
          <rect x={bX} y={bY - 12} width="12" height="12" fill="none" stroke="#64748b" strokeWidth="1.5" />

          {/* Squares construction */}
          {/* Square BC (horizontal bottom side) */}
          <rect
            x={bX}
            y={bY}
            width={bcX}
            height={bcX}
            fill="rgba(14, 165, 233, 0.15)"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* Square AB (vertical left side) */}
          <rect
            x={bX - abY}
            y={aY}
            width={abY}
            height={abY}
            fill="rgba(244, 63, 94, 0.15)"
            stroke="#f43f5e"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Square AC (Hypotenuse representation) */}
          {(() => {
            // Calculate vector AC: (bcX, -abY)
            // A perpendicular vector is (abY, bcX) or (-abY, -bcX)
            // Square points from C and A outward:
            // C = (cX, cY)
            // C_outer = C + (abY, bcX)
            // A_outer = A + (abY, bcX)
            const cOuterX = cX + abY;
            const cOuterY = cY - bcX;
            const aOuterX = aX + abY;
            const aOuterY = aY - bcX;

            return (
              <polygon
                points={`${aX},${aY} ${cX},${cY} ${cOuterX},${cOuterY} ${aOuterX},${aOuterY}`}
                fill="rgba(139, 92, 246, 0.18)"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
            );
          })()}

          {/* Triangle Main Lines */}
          <polygon
            points={`${aX},${aY} ${bX},${bY} ${cX},${cY}`}
            fill="rgba(100, 116, 139, 0.1)"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
            className="dark:stroke-slate-200"
          />

          {/* Side labels */}
          <text x={bX - abY / 2} y={aY + abY / 2 + 5} textAnchor="middle" className="text-xs font-mono font-bold fill-rose-600 dark:fill-rose-400">
            {lenAB}
          </text>
          <text x={bX + bcX / 2} y={bY + 16} textAnchor="middle" className="text-xs font-mono font-bold fill-sky-600 dark:fill-sky-400">
            {lenBC}
          </text>
          {/* Hypotenuse label */}
          <text x={bX + bcX / 2 - 15} y={bY - abY / 2 - 15} textAnchor="middle" className="text-xs font-mono font-bold fill-violet-600 dark:fill-violet-400">
            {lenAC}
          </text>

          {/* Areas labels in squares */}
          <text x={bX - abY / 2} y={aY + abY / 2 + 25} textAnchor="middle" className="text-[10px] fill-rose-700 bg-white dark:fill-rose-300 font-sans">
            A₁ = {areaAB} cm²
          </text>
          <text x={bX + bcX / 2} y={bY + bcX / 2 + 5} textAnchor="middle" className="text-[10px] fill-sky-700 dark:fill-sky-300 font-sans">
            A₂ = {areaBC} cm²
          </text>
          <text x={bX + bcX / 2 + abY / 2} y={bY - abY / 2 - bcX / 2} textAnchor="middle" className="text-[11px] font-semibold fill-violet-700 dark:fill-violet-300 font-sans">
            A₃ = {areaAC} cm²
          </text>

          {/* Points B (Corner) */}
          <circle cx={bX} cy={bY} r="5" fill="#475569" stroke="#fff" strokeWidth="2" />
          <text x={bX - 12} y={bY + 14} className="text-xs font-semibold fill-slate-800 dark:fill-slate-200">B</text>

          {/* Interactive Point A (draggable) */}
          <g
            className="cursor-ns-resize"
            onPointerDown={() => handlePointerDown('A')}
          >
            <circle cx={aX} cy={aY} r="10" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="1.5" />
            <circle cx={aX} cy={aY} r="6" fill="#f43f5e" stroke="#fff" strokeWidth="2" />
          </g>
          <text x={aX - 16} y={aY - 4} className="text-xs font-bold fill-rose-600 dark:fill-rose-400">A</text>

          {/* Interactive Point C (draggable) */}
          <g
            className="cursor-ew-resize"
            onPointerDown={() => handlePointerDown('C')}
          >
            <circle cx={cX} cy={cY} r="10" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9" strokeWidth="1.5" />
            <circle cx={cX} cy={cY} r="6" fill="#0ea5e9" stroke="#fff" strokeWidth="2" />
          </g>
          <text x={cX + 12} y={cY + 14} className="text-xs font-bold fill-sky-600 dark:fill-sky-400">C</text>
        </svg>

        {/* Dynamic Drag Guide instructions */}
        <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1 font-sans">
          <Sparkles className="w-3 h-3 text-yellow-400 animate-spin" /> Glisse les points A ou C !
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
            Observation en Temps Réel
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            D'après le théorème de Pythagore, dans un triangle rectangle, la somme des aires des carrés construits sur les côtés de l'angle droit est égale à l'aire du grand carré de l'hypoténuse.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-900">
            {/* Visual Sum equation bar */}
            <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-300 font-mono">
              <span className="text-rose-500 font-semibold">AB² (A₁)</span>
              <span>+</span>
              <span className="text-sky-500 font-semibold">BC² (A₂)</span>
              <span>=</span>
              <span className="text-violet-600 dark:text-violet-400 font-bold">AC² (A₃)</span>
            </div>

            <div className="flex justify-between items-center text-sm font-mono font-bold bg-slate-50 dark:bg-slate-900 p-2 rounded">
              <span className="text-rose-500">{areaAB}</span>
              <span className="text-slate-400">+</span>
              <span className="text-sky-500">{areaBC}</span>
              <span className="text-slate-400">=</span>
              <span className="text-violet-600 dark:text-violet-400">
                {(areaAB + areaBC).toFixed(1)} <span className="text-[10px] font-sans text-slate-500">({areaAC} mesuré)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Sliders for auxiliary support */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl space-y-2">
          <h5 className="text-xs font-semibold text-slate-600 dark:text-slate-400">Ajustement manuel :</h5>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-rose-500">Hauteur AB : {lenAB} cm</span>
              </div>
              <input
                type="range"
                min="30"
                max="220"
                value={abY}
                onChange={(e) => setAbY(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-sky-500">Base BC : {lenBC} cm</span>
              </div>
              <input
                type="range"
                min="30"
                max="220"
                value={bcX}
                onChange={(e) => setBcX(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. TRIGONOMETRIE SIMULATION
function TrigonometrieSimulation() {
  const [angleDegree, setAngleDegree] = useState(37);

  const angleRad = (angleDegree * Math.PI) / 180;
  const sinVal = Math.sin(angleRad);
  const cosVal = Math.cos(angleRad);
  const tanVal = angleDegree < 80 ? Math.tan(angleRad) : 999; // cap to avoid infinite line

  // Circle dimensions and center
  const cx = 160;
  const cy = 200;
  const r = 110;

  // Circle outer coordinate for the slider angle
  const px = cx + r * cosVal;
  const py = cy - r * sinVal;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-7 flex justify-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
        <svg viewBox="0 0 340 340" className="w-full max-w-[325px] h-[325px] overflow-visible">
          {/* Main Unit Circle */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="2" className="dark:stroke-slate-800" />

          {/* Sub-circle quadrants */}
          <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

          {/* Draggable angular sector fill */}
          <path
            d={`M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${px} ${py} Z`}
            fill="rgba(139, 92, 246, 0.08)"
          />

          {/* Angle arc representation */}
          {angleDegree > 5 && (
            <path
              d={`M ${cx + 25} ${cy} A 25 25 0 0 0 ${cx + 25 * cosVal} ${cy - 25 * sinVal}`}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
            />
          )}
          <text x={cx + 30} y={cy - 12} className="text-[10px] font-bold fill-violet-600 dark:fill-violet-400">
            {angleDegree}°
          </text>

          {/* PROJECTIONS DRAWING */}
          {/* Cosine line (Horizontal adjacent) */}
          <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#3b82f6" strokeWidth="4.5" strokeLinecap="round" />
          {/* Sine line (Vertical opposite) */}
          <line x1={px} y1={cy} x2={px} y2={py} stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
          {/* Main Hypotenuse line */}
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="#1e293b" strokeWidth="2.5" className="dark:stroke-slate-200" />

          {/* Tangent line at x = 1 */}
          <line x1={cx + r} y1={cy} x2={cx + r} y2={cy - r * tanVal} stroke="#d946ef" strokeWidth="2.5" />
          <line x1={cx} y1={cy} x2={cx + r} y2={cy - r * tanVal} stroke="#d946ef" strokeWidth="1" strokeDasharray="2 2" />

          {/* Points labels */}
          <circle cx={cx} cy={cy} r="4" fill="#64748b" />
          <circle cx={px} cy={py} r="5" fill="#ca8a04" stroke="#fff" strokeWidth="1.5" />

          {/* Axis markers */}
          <text x={cx + r + 15} y={cy + 13} className="text-[9px] fill-slate-400">x=1</text>
          <text x={cx - 10} y={cy - r - 8} className="text-[9px] fill-slate-400">y=1</text>

          {/* Value callouts labels directly on the drawing */}
          <text x={cx + (r * cosVal) / 2} y={cy + 14} textAnchor="middle" className="text-[9px] font-mono font-bold fill-blue-600 dark:fill-blue-400 bg-white">
            cos
          </text>
          <text x={px + 8} y={cy - (r * sinVal) / 2} textAnchor="start" className="text-[9px] font-mono font-bold fill-emerald-600 dark:fill-emerald-400">
            sin
          </text>
          <text x={cx + r + 8} y={cy - (r * tanVal) / 2} textAnchor="start" className="text-[9px] font-mono font-bold fill-fuchsia-600 dark:fill-fuchsia-400">
            tan
          </text>
        </svg>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Formules & Proportions
          </h4>

          {/* SOH CAH TOA Memo card */}
          <div className="p-2 border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900 rounded-lg text-[11px] leading-relaxed">
            <span className="font-bold text-emerald-800 dark:text-emerald-400">Mémo SOH-CAH-TOA :</span>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600 dark:text-slate-300">
              <li><strong className="text-emerald-600">S</strong>in = <strong className="text-emerald-600">O</strong>pposé / <strong className="text-emerald-600">H</strong>ypoténuse</li>
              <li><strong className="text-blue-600">C</strong>os = <strong className="text-blue-600">A</strong>djacent / <strong className="text-blue-600">H</strong>ypoténuse</li>
              <li><strong className="text-fuchsia-600">T</strong>an = <strong className="text-fuchsia-600">O</strong>pposé / <strong className="text-fuchsia-600">A</strong>djacent</li>
            </ul>
          </div>

          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="flex justify-between items-center p-1.5 border-b border-dashed border-slate-100 dark:border-slate-800">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Sinus (Vert) :</span>
              <span className="font-bold bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400">
                {sinVal.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between items-center p-1.5 border-b border-dashed border-slate-100 dark:border-slate-800">
              <span className="text-blue-600 dark:text-blue-400 font-bold">Cosinus (Bleu) :</span>
              <span className="font-bold bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400">
                {cosVal.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between items-center p-1.5">
              <span className="text-fuchsia-600 dark:text-fuchsia-400 font-bold">Tangente (Rose) :</span>
              <span className="font-bold bg-fuchsia-50 dark:bg-fuchsia-950/30 px-1.5 py-0.5 rounded text-fuchsia-600 dark:text-fuchsia-400">
                {tanVal > 10 ? 'Infini' : tanVal.toFixed(3)}
              </span>
            </div>
          </div>
        </div>

        {/* Slider input */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Angle α (Degrés) :</span>
            <span className="px-2 py-0.5 bg-violet-600 text-white font-bold rounded-full font-mono text-[11px]">
              {angleDegree}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="89"
            value={angleDegree}
            onChange={(e) => setAngleDegree(Number(e.target.value))}
            className="w-full accent-violet-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
            <span>0° (Cos=1, Sin=0)</span>
            <span>45°</span>
            <span>90° (Cos=0, Sin=1)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. FONCTIONS SIMULATION
function FonctionsSimulation() {
  const [funcType, setFuncType] = useState<'lineaire' | 'affine' | 'carre'>('affine');
  const [coefA, setCoefA] = useState(1);
  const [coefB, setCoefB] = useState(0);
  const [cursorX, setCursorX] = useState(2); // value in units between -5 and 5

  // Grid coordinates math mapping
  // Grid size: 300x300, center at (150, 150)
  // Scale: 1 unit = 25 pixels (meaning x from -6 to +6, y from -6 to +6)
  const mapX = (gx: number) => 150 + gx * 25;
  const mapY = (gy: number) => 150 - gy * 25; // invert Y for Cartesian

  // Compute points of the curve to render:
  const getCurveY = (x: number): number => {
    if (funcType === 'lineaire') return coefA * x;
    if (funcType === 'affine') return coefA * x + coefB;
    if (funcType === 'carre') return coefA * (x * x);
    return 0;
  };

  const generatePathD = (): string => {
    let d = '';
    const pointsCount = 60;
    for (let i = 0; i <= pointsCount; i++) {
      // gx ranges from -6 to +6
      const gx = -6 + (12 * i) / pointsCount;
      const gy = getCurveY(gx);
      const px = mapX(gx);
      const py = mapY(gy);

      if (i === 0) {
        d += `M ${px} ${py}`;
      } else {
        d += ` L ${px} ${py}`;
      }
    }
    return d;
  };

  // Draggable cursor details
  const cursorY = getCurveY(cursorX);
  const pxCursor = mapX(cursorX);
  const pyCursor = mapY(cursorY);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-7 flex flex-col items-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
        {/* Toggle types of functions */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg w-full mb-3 self-stretch">
          <button
            onClick={() => { setFuncType('lineaire'); setCoefB(0); }}
            className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded transition-all ${
              funcType === 'lineaire'
                ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Linéaire (ax)
          </button>
          <button
            onClick={() => setFuncType('affine')}
            className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded transition-all ${
              funcType === 'affine'
                ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Affine (ax + b)
          </button>
          <button
            onClick={() => { setFuncType('carre'); setCoefB(0); }}
            className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded transition-all ${
              funcType === 'carre'
                ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Carré (ax²)
          </button>
        </div>

        <svg viewBox="0 0 300 300" className="w-full max-w-[280px] h-[280px] overflow-hidden select-none border border-slate-100 dark:border-slate-900 rounded bg-slate-50/50 dark:bg-slate-900/10">
          {/* Coordinate horizontal lines */}
          {Array.from({ length: 13 }).map((_, i) => {
            const val = -6 + i;
            const p = 150 + val * 25;
            return (
              <React.Fragment key={i}>
                {/* Horizontal line */}
                <line x1={0} y1={p} x2={300} y2={p} stroke="currentColor" strokeWidth={val === 0 ? "1.5" : "0.4"} className="text-slate-200 dark:text-slate-800" />
                {/* Vertical line */}
                <line x1={p} y1={0} x2={p} y2={300} stroke="currentColor" strokeWidth={val === 0 ? "1.5" : "0.4"} className="text-slate-200 dark:text-slate-800" />

                {/* Legend on grid */}
                {val !== 0 && (
                  <>
                    <text x={p + 2} y={160} className="text-[7.5px] fill-slate-400 font-mono">{val}</text>
                    <text x={138} y={p + 3} className="text-[7.5px] fill-slate-400 font-mono">{val}</text>
                  </>
                )}
              </React.Fragment>
            );
          })}

          {/* Render Curve */}
          <path
            d={generatePathD()}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Coordinate projections for the tracking cursor */}
          {pxCursor >= 0 && pxCursor <= 300 && pyCursor >= 0 && pyCursor <= 300 && (
            <>
              {/* Projection dashed to X Axis */}
              <line x1={pxCursor} y1={pyCursor} x2={pxCursor} y2={150} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
              {/* Projection dashed to Y Axis */}
              <line x1={pxCursor} y1={pyCursor} x2={150} y2={pyCursor} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />

              {/* Cursor Point */}
              <circle cx={pxCursor} cy={pyCursor} r="6" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />

              {/* Floating equation tag near point */}
              <g transform={`translate(${pxCursor < 150 ? pxCursor + 10 : pxCursor - 62}, ${pyCursor < 150 ? pyCursor + 15 : pyCursor - 8})`}>
                <rect width="52" height="15" rx="3" fill="#1e293b" className="opacity-80" />
                <text x="26" y="11" textAnchor="middle" className="text-[8px] font-mono font-bold fill-white">
                  M({cursorX.toFixed(1)}, {cursorY.toFixed(1)})
                </text>
              </g>
            </>
          )}
        </svg>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span>
            Équation Courante
          </h4>

          <div className="p-3 text-center rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900">
            <span className="font-mono text-base font-bold text-violet-700 dark:text-violet-400">
              {funcType === 'lineaire' && `f(x) = ${coefA}x`}
              {funcType === 'affine' && `f(x) = ${coefA}x ${coefB >= 0 ? `+ ${coefB}` : `- ${Math.abs(coefB)}`}`}
              {funcType === 'carre' && `f(x) = ${coefA}x²`}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {funcType === 'lineaire' && "Une fonction linéaire représente une situation de proportionnalité. Sa courbe est une droite passant par l'origine."}
            {funcType === 'affine' && "La courbe d'une fonction affine est une droite. 'a' est le coefficient directeur (la pente) et 'b' est l'ordonnée à l'origine."}
            {funcType === 'carre' && "La fonction carré modélise des paraboles symétriques. La valeur augmente exponentiellement loin de l'axe."}
          </p>
        </div>

        {/* Sliders for coefficients */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl space-y-3 text-xs">
          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>Pente / Coefficient directeur (a) : {coefA}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.5"
              value={coefA}
              onChange={(e) => setCoefA(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
          </div>

          {funcType === 'affine' && (
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Ordonnée à l'origine (b) : {coefB}</span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={coefB}
                onChange={(e) => setCoefB(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>
          )}

          {/* Interactive cursor slider */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
            <div className="flex justify-between font-medium mb-1 text-slate-600 dark:text-slate-400">
              <span>Position du point (x) : {cursorX.toFixed(1)}</span>
              <span>f(x) = {cursorY.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.2"
              value={cursorX}
              onChange={(e) => setCursorX(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. THALES SIMULATION
function ThalesSimulation() {
  const [bcLength, setBcLength] = useState(150); // represents dragging point
  // We represent the Thales configuration (Tête-à-tête or Emboîtés)
  // Two parallel lines intersected by two intersecting lines.
  // Triangle ABC, and dynamic line DE parallel to BC.
  // A is at (170, 40)
  // B is at (40, 260), C is at (300, 260)
  // D lies on AB, E lies on AC.
  // Ratio AD/AB is controlled by a slider.
  const [ratio, setRatio] = useState(0.65);

  const ax = 170;
  const ay = 50;

  const bx = 60;
  const by = 250;

  const cx = 280;
  const cy = 250;

  // D is at proportion along AB
  const dx = ax + (bx - ax) * ratio;
  const dy = ay + (by - ay) * ratio;

  // E is at proportion along AC
  const ex = ax + (cx - ax) * ratio;
  const ey = ay + (cy - ay) * ratio;

  // Real-world representative dimensions
  const realAB = 10;
  const realAC = 12;
  const realBC = 8;

  const realAD = parseFloat((realAB * ratio).toFixed(1));
  const realAE = parseFloat((realAC * ratio).toFixed(1));
  const realDE = parseFloat((realBC * ratio).toFixed(1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-7 flex justify-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
        <svg viewBox="0 0 340 300" className="w-full max-w-[300px] h-[260px] overflow-visible">
          {/* Grid lines */}
          <line x1={dx - 40} y1={dy} x2={ex + 40} y2={ey} stroke="#fb923c" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={bx - 20} y1={by} x2={cx + 20} y2={cy} stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-slate-800" />

          {/* Intersecting rays AB and AC prolonged */}
          <line x1={ax} y1={ay} x2={bx - 10} y2={by + 15} stroke="#64748b" strokeWidth="1.5" />
          <line x1={ax} y1={ay} x2={cx + 10} y2={cy + 15} stroke="#64748b" strokeWidth="1.5" />

          {/* Triangle ABC Sides */}
          <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="none" stroke="#334155" strokeWidth="1" className="dark:stroke-slate-600" />

          {/* Parallel lines markers */}
          {/* DE parallel segment */}
          <line x1={dx} y1={dy} x2={ex} y2={ey} stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          {/* BC parallel segment */}
          <line x1={bx} y1={by} x2={cx} y2={cy} stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />

          {/* Points markers with custom beautiful letters */}
          <circle cx={ax} cy={ay} r="4.5" fill="#1e293b" className="dark:fill-slate-200" />
          <text x={ax} y={ay - 10} textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-200">A</text>

          <circle cx={bx} cy={by} r="4.5" fill="#3b82f6" />
          <text x={bx - 12} y={by + 16} className="text-xs font-bold fill-blue-600 dark:fill-blue-400">B</text>

          <circle cx={cx} cy={cy} r="4.5" fill="#3b82f6" />
          <text x={cx + 5} y={cy + 16} className="text-xs font-bold fill-blue-600 dark:fill-blue-400">C</text>

          <circle cx={dx} cy={dy} r="4.5" fill="#f97316" />
          <text x={dx - 14} y={dy + 4} className="text-xs font-bold fill-orange-600 dark:fill-orange-400">D</text>

          <circle cx={ex} cy={ey} r="4.5" fill="#f97316" />
          <text x={ex + 10} y={ey + 4} className="text-xs font-bold fill-orange-600 dark:fill-orange-400">E</text>

          {/* Visual ratio scale value */}
          <text x={170} y={by - 12} textAnchor="middle" className="text-[10px] font-semibold fill-blue-600 dark:fill-blue-400 bg-white">
            (BC = {realBC} cm)
          </text>
          <text x={170} y={dy - 8} textAnchor="middle" className="text-[10px] font-bold fill-orange-500 bg-white">
            (DE = {realDE} cm)
          </text>
        </svg>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            Thalès : Ratios Parfaits
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Puisque les droites <span className="text-orange-500 font-bold">(DE)</span> et <span className="text-blue-500 font-bold">(BC)</span> sont parallèles, les rapports des côtés correspondants sont égaux :
          </p>

          <div className="p-3 bg-orange-50/50 dark:bg-orange-950/15 rounded-lg border border-orange-100 dark:border-orange-900/50 space-y-1">
            <div className="flex justify-around items-center text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              <div className="text-center">
                <div className="border-b border-slate-400 pb-0.5 text-orange-600">AD</div>
                <div className="pt-0.5 text-blue-600">AB</div>
              </div>
              <span>=</span>
              <div className="text-center">
                <div className="border-b border-slate-400 pb-0.5 text-orange-600">AE</div>
                <div className="pt-0.5 text-blue-600">AC</div>
              </div>
              <span>=</span>
              <div className="text-center">
                <div className="border-b border-slate-400 pb-0.5 text-orange-600">DE</div>
                <div className="pt-0.5 text-blue-600">BC</div>
              </div>
            </div>

            <div className="flex justify-around items-center text-xs font-mono pt-3 border-t border-dashed border-orange-200 dark:border-orange-900 text-slate-500 dark:text-slate-400">
              <div>{realAD} / {realAB}</div>
              <span>=</span>
              <div>{realAE} / {realAC}</div>
              <span>=</span>
              <div>{realDE} / {realBC}</div>
            </div>

            <div className="text-center text-sm font-mono font-bold text-orange-500 mt-2">
              Rapport constant = {ratio.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Proportions Slider control */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Facteur de réduction (AD/AB) :</span>
            <span className="px-2 py-0.5 bg-orange-500 text-white font-bold rounded-full font-mono text-[11px]">
              {ratio.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.30"
            max="0.90"
            step="0.05"
            value={ratio}
            onChange={(e) => setRatio(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>
      </div>
    </div>
  );
}

// 5. CALCUL LITTERAL (DEVELOPPEMENT, FACTORISATION & IDENTITES REMARQUABLES)
function CalculLiteralSimulation() {
  const [activeSubTab, setActiveSubTab] = useState<'developpement' | 'factorisation' | 'identites'>('developpement');
  
  // 1. Developpement states
  const [devMode, setDevMode] = useState<'simple' | 'double'>('double');
  const [devA, setDevA] = useState(2);
  const [devB, setDevB] = useState(3);
  const [devC, setDevC] = useState(1);
  const [devD, setDevD] = useState(-4);
  const [devStep, setDevStep] = useState(0);
  
  // 2. Factorisation states
  const [factMode, setFactMode] = useState<'commun' | 'remarquable'>('commun');
  const [factA, setFactA] = useState(3); // Common factor multiplier
  const [factB, setFactB] = useState(2); // x multiplier
  const [factC, setFactC] = useState(5); // constant
  const [factStep, setFactStep] = useState(0);

  // 3. Identites states
  const [identMode, setIdentMode] = useState<'somme' | 'difference' | 'carres'>('somme');
  const [identA, setIdentA] = useState(2); // Ax
  const [identB, setIdentB] = useState(3); // B
  const [identStep, setIdentStep] = useState(0);

  // Auto-play interval state
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalPlaybackRef = useRef<number | null>(null);

  // Helper formatter for terms with sign
  const formatTerm = (coef: number, label: string, isFirst: boolean = false) => {
    if (coef === 0) return '';
    const sign = coef > 0 ? '+' : '-';
    const absVal = Math.abs(coef);
    const valStr = absVal === 1 && label !== '' ? '' : absVal.toString();
    
    if (isFirst) {
      return coef > 0 ? `${valStr}${label}` : `-${valStr}${label}`;
    } else {
      return ` ${sign} ${valStr}${label}`;
    }
  };

  // Preset selectors to quickly load Brevet exercises
  const applyPreset = (type: 'ex1' | 'ex2' | 'ex3' | 'ex4') => {
    if (type === 'ex1') {
      // (2x + 3)(x - 4)
      setDevMode('double');
      setDevA(2); setDevB(3); setDevC(1); setDevD(-4);
      setDevStep(0);
    } else if (type === 'ex2') {
      // 3(2x + 5)
      setDevMode('simple');
      setDevA(3); setDevB(2); setDevC(5);
      setDevStep(0);
    } else if (type === 'ex3') {
      // 5x(x + 2) -> (commun factor)
      setFactMode('commun');
      setFactA(5); setFactB(1); setFactC(2);
      setFactStep(0);
    } else if (type === 'ex4') {
      // (3x - 5)^2
      setActiveSubTab('identites');
      setIdentMode('difference');
      setIdentA(3); setIdentB(5);
      setIdentStep(0);
    }
  };

  // Play/Pause Auto player handling
  useEffect(() => {
    if (isPlaying) {
      const maxSteps = activeSubTab === 'developpement' 
        ? (devMode === 'double' ? 5 : 3) 
        : activeSubTab === 'factorisation' ? 4 : 4;

      intervalPlaybackRef.current = window.setInterval(() => {
        if (activeSubTab === 'developpement') {
          setDevStep((prev) => (prev < maxSteps ? prev + 1 : 0));
        } else if (activeSubTab === 'factorisation') {
          setFactStep((prev) => (prev < 4 ? prev + 1 : 0));
        } else {
          setIdentStep((prev) => (prev < 4 ? prev + 1 : 0));
        }
      }, 2500); // 2.5 seconds loop per step
    } else {
      if (intervalPlaybackRef.current) clearInterval(intervalPlaybackRef.current);
    }

    return () => {
      if (intervalPlaybackRef.current) clearInterval(intervalPlaybackRef.current);
    };
  }, [isPlaying, activeSubTab, devMode]);

  // Restart steps on mode/tab changes
  useEffect(() => {
    setDevStep(0);
    setFactStep(0);
    setIdentStep(0);
    setIsPlaying(false);
  }, [activeSubTab, devMode, factMode, identMode]);

  return (
    <div className="space-y-6">
      {/* Dynamic Style Injection for animated dashed marching arrows */}
      <style>{`
        @keyframes flow-dash {
          to { stroke-dashoffset: -24; }
        }
        .marching-math-arrow {
          stroke-dasharray: 8, 4;
          animation: flow-dash 1.2s linear infinite;
        }
        .pulse-math-term {
          animation: pulse-bold 1.5s ease-in-out infinite;
        }
        @keyframes pulse-bold {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.2); }
        }
      `}</style>

      {/* Hero Header bar */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 rounded-[24px] p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <span className="bg-white/25 text-white text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full font-black">
            📊 Simulateur de calcul littéral
          </span>
          <h3 className="text-xl md:text-3xl font-black tracking-tight leading-none">
            Observe le chemin des flèches algébriques !
          </h3>
          <p className="text-xs text-emerald-50 max-w-xl font-medium">
            Manipule les coefficients et regarde les étapes se construire de manière animée en couleur avec de grands caractères pour tout retenir !
          </p>
        </div>
        <div className="flex gap-2 relative z-10">
          <button
            onClick={() => applyPreset('ex1')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[11px] font-bold transition-all text-white"
          >
            Forme (2x + 3)(x - 4)
          </button>
          <button
            onClick={() => applyPreset('ex4')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[11px] font-bold transition-all text-white"
          >
            Sujet Brevet (3x - 5)²
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-205 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab('developpement')}
          className={`flex items-center justify-center gap-2 py-2 px-1 text-center rounded-xl text-xs md:text-sm font-black tracking-wide uppercase transition-all ${
            activeSubTab === 'developpement'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <RefreshCw className="w-4 h-4" /> Développement
        </button>
        <button
          onClick={() => setActiveSubTab('factorisation')}
          className={`flex items-center justify-center gap-2 py-2 px-1 text-center rounded-xl text-xs md:text-sm font-black tracking-wide uppercase transition-all ${
            activeSubTab === 'factorisation'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <Hash className="w-4 h-4" /> Factorisation
        </button>
        <button
          onClick={() => setActiveSubTab('identites')}
          className={`flex items-center justify-center gap-2 py-2 px-1 text-center rounded-xl text-xs md:text-sm font-black tracking-wide uppercase transition-all ${
            activeSubTab === 'identites'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <Sparkles className="w-4 h-4 animate-pulse" /> Identités Remarquables
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Visual interactive and SVG mathematical animation */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-950 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between min-h-[360px] relative overflow-hidden">
          {/* Header Indicators of Step */}
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-900 pb-3">
            <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest">
              L'Animation Algébrique
            </span>
            <div className="flex gap-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-bold font-mono">
                Étape : {activeSubTab === 'developpement' ? devStep : activeSubTab === 'factorisation' ? factStep : identStep}
              </span>
            </div>
          </div>

          {/* SVG Canvas drawing steps */}
          {activeSubTab === 'developpement' && (
            <div className="flex flex-col items-center justify-center py-6">
              {devMode === 'double' ? (
                // Double Distributivity SVG (Ax + B)(Cx + D)
                <svg viewBox="0 0 400 130" className="w-full max-w-[380px] h-[130px] select-none overflow-visible">
                  {/* Arrows marker definitions */}
                  <defs>
                    <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#10b981" />
                    </marker>
                    <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#3b82f6" />
                    </marker>
                    <marker id="arrow-orange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#f59e0b" />
                    </marker>
                    <marker id="arrow-pink" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#ec4899" />
                    </marker>
                  </defs>

                  {/* Flow Arrows Paths based on Step state */}
                  {/* Step 1: Ax -> Cx (Green) */}
                  {(devStep === 1 || devStep === 5) && (
                    <path
                      d="M 68,52 Q 155,5 235,52"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={devStep === 1 ? "3" : "1.5"}
                      className={devStep === 1 ? "marching-math-arrow" : "opacity-40"}
                      markerEnd="url(#arrow-green)"
                    />
                  )}
                  {/* Step 2: Ax -> D (Blue) */}
                  {(devStep === 2 || devStep === 5) && (
                    <path
                      d="M 68,45 Q 185,-18 315,52"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth={devStep === 2 ? "3" : "1.5"}
                      className={devStep === 2 ? "marching-math-arrow" : "opacity-40"}
                      markerEnd="url(#arrow-blue)"
                    />
                  )}
                  {/* Step 3: B -> Cx (Orange) */}
                  {(devStep === 3 || devStep === 5) && (
                    <path
                      d="M 145,108 Q 192,143 235,110"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth={devStep === 3 ? "3" : "1.5"}
                      className={devStep === 3 ? "marching-math-arrow" : "opacity-40"}
                      markerEnd="url(#arrow-orange)"
                    />
                  )}
                  {/* Step 4: B -> D (Pink) */}
                  {(devStep === 4 || devStep === 5) && (
                    <path
                      d="M 145,112 Q 225,160 315,110"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth={devStep === 4 ? "3" : "1.5"}
                      className={devStep === 4 ? "marching-math-arrow" : "opacity-40"}
                      markerEnd="url(#arrow-pink)"
                    />
                  )}

                  {/* Mathematical Characters rendering */}
                  {/* Expression format: (Ax + B)(Cx + D) */}
                  <g className="text-2xl md:text-3xl font-black font-sans fill-slate-800 dark:fill-slate-100" transform="translate(0, 85)">
                    {/* ( */}
                    <text x="15" y="0">(</text>
                    
                    {/* Term A (Ax) */}
                    <text 
                      x="68" 
                      y="0" 
                      textAnchor="middle" 
                      className={`fill-indigo-600 dark:fill-indigo-400 transition-all font-mono ${(devStep === 1 || devStep === 2) ? 'scale-110 font-black text-rose-500 pulse-math-term' : ''}`}
                    >
                      {devA === 1 ? 'x' : devA === -1 ? '-x' : `${devA}x`}
                    </text>
                    
                    {/* Sign B */}
                    <text x="110" y="0" textAnchor="middle" className="text-xl fill-slate-400">
                      {devB >= 0 ? '+' : '-'}
                    </text>
                    
                    {/* Term B */}
                    <text 
                      x="145" 
                      y="0" 
                      textAnchor="middle" 
                      className={`fill-amber-600 transition-all font-mono ${(devStep === 3 || devStep === 4) ? 'scale-110 font-black text-rose-500 pulse-math-term' : ''}`}
                    >
                      {Math.abs(devB)}
                    </text>
                    
                    {/* )( */}
                    <text x="185" y="0" textAnchor="middle">)</text>
                    <text x="198" y="0" textAnchor="middle">(</text>

                    {/* Term C (Cx) */}
                    <text 
                      x="235" 
                      y="0" 
                      textAnchor="middle" 
                      className={`fill-emerald-600 transition-all font-mono ${(devStep === 1 || devStep === 3) ? 'scale-110 font-black pulse-math-term' : ''}`}
                    >
                      {devC === 1 ? 'x' : devC === -1 ? '-x' : `${devC}x`}
                    </text>

                    {/* Sign D */}
                    <text x="278" y="0" textAnchor="middle" className="text-xl fill-slate-400">
                      {devD >= 0 ? '+' : '-'}
                    </text>

                    {/* Term D */}
                    <text 
                      x="315" 
                      y="0" 
                      textAnchor="middle" 
                      className={`fill-pink-600 transition-all font-mono ${(devStep === 2 || devStep === 4) ? 'scale-110 font-black pulse-math-term' : ''}`}
                    >
                      {Math.abs(devD)}
                    </text>

                    {/* ) */}
                    <text x="350" y="0">)</text>
                  </g>
                </svg>
              ) : (
                // Simple Distributivity SVG: A(Bx + C)
                <svg viewBox="0 0 320 130" className="w-full max-w-[300px] h-[130px] select-none overflow-visible">
                  <defs>
                    <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#3b82f6" />
                    </marker>
                    <marker id="arrow-pink" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#ec4899" />
                    </marker>
                  </defs>

                  {/* Step 1: A -> Bx (Blue) */}
                  {(devStep === 1 || devStep === 3) && (
                    <path
                      d="M 50,45 Q 115,0 178,45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth={devStep === 1 ? "3" : "1.5"}
                      className={devStep === 1 ? "marching-math-arrow" : "opacity-40"}
                      markerEnd="url(#arrow-blue)"
                    />
                  )}
                  {/* Step 2: A -> C (Pink) */}
                  {(devStep === 2 || devStep === 3) && (
                    <path
                      d="M 50,40 Q 150,-18 250,45"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth={devStep === 2 ? "3" : "1.5"}
                      className={devStep === 2 ? "marching-math-arrow" : "opacity-40"}
                      markerEnd="url(#arrow-pink)"
                    />
                  )}

                  {/* Math Characters simple distributivity */}
                  <g className="text-2xl md:text-3xl font-black font-sans fill-slate-800 dark:fill-slate-100" transform="translate(0, 80)">
                    {/* Factor A */}
                    <text 
                      x="50" 
                      y="0" 
                      textAnchor="middle" 
                      className={`fill-indigo-650 dark:fill-indigo-450 transition-all font-mono ${(devStep === 1 || devStep === 2) ? 'scale-110 font-black pulse-math-term text-rose-500' : ''}`}
                    >
                      {devA}
                    </text>
                    <text x="85" y="0" textAnchor="middle">(</text>

                    {/* Factor Bx */}
                    <text 
                      x="178" 
                      y="0" 
                      textAnchor="middle" 
                      className={`fill-emerald-600 transition-all font-mono ${devStep === 1 ? 'scale-110 font-black pulse-math-term' : ''}`}
                    >
                      {devB === 1 ? 'x' : devB === -1 ? '-x' : `${devB}x`}
                    </text>

                    {/* Sign C */}
                    <text x="215" y="0" textAnchor="middle" className="text-xl fill-slate-400">
                      {devC >= 0 ? '+' : '-'}
                    </text>

                    {/* Term C */}
                    <text 
                      x="250" 
                      y="0" 
                      textAnchor="middle" 
                      className={`fill-pink-600 transition-all font-mono ${devStep === 2 ? 'scale-110 font-black pulse-math-term' : ''}`}
                    >
                      {Math.abs(devC)}
                    </text>

                    <text x="285" y="0" textAnchor="middle">)</text>
                  </g>
                </svg>
              )}
            </div>
          )}

          {activeSubTab === 'factorisation' && (
            <div className="flex flex-col items-center justify-center py-6">
              {factMode === 'commun' ? (
                // Common Factor visual extraction
                <svg viewBox="0 0 360 120" className="w-full max-w-[340px] h-[120px] select-none overflow-visible">
                  <defs>
                    <marker id="arrow-gold" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 Z" fill="#d97706" />
                    </marker>
                  </defs>

                  {/* Extracting animation arrow to front */}
                  {factStep === 3 && (
                    <>
                      <path
                        d="M 125,50 Q 80,-10 32,50"
                        fill="none"
                        stroke="#d97706"
                        strokeWidth="3.2"
                        className="marching-math-arrow"
                        markerEnd="url(#arrow-gold)"
                      />
                      <path
                        d="M 235,50 Q 140,-25 32,45"
                        fill="none"
                        stroke="#d97706"
                        strokeWidth="2.5"
                        className="marching-math-arrow"
                        markerEnd="url(#arrow-gold)"
                      />
                    </>
                  )}

                  <g className="text-2xl md:text-3xl font-black font-sans fill-slate-800 dark:fill-slate-100" transform="translate(0, 80)">
                    {/* Pulsating extracted result factor at x=32 on Step 3 and 4 */}
                    {(factStep >= 3) ? (
                      <g className="fill-amber-650 font-black translate-y-[-2px] scale-105">
                        <text x="32" y="0" textAnchor="middle" className="pulse-math-term fill-amber-600 dark:fill-yellow-500">{factA}</text>
                        <text x="55" y="0" textAnchor="middle" className="text-xl">(</text>
                      </g>
                    ) : (
                      <text x="25" y="0" className="opacity-0">.</text>
                    )}

                    {/* A.Bx */}
                    {/* First common factor A */}
                    {factStep < 3 && (
                      <text 
                        x="90" 
                        y="0" 
                        textAnchor="middle" 
                        className={`font-mono transition-all ${factStep >= 1 ? 'fill-amber-600 font-bold scale-110' : 'fill-slate-400'}`}
                      >
                        {factA}
                      </text>
                    )}
                    
                    {/* Separator dot */}
                    {factStep < 3 && <text x="110" y="0" textAnchor="middle" className="text-xs fill-slate-300">•</text>}
                    
                    {/* Bx */}
                    <text x="135" y="0" textAnchor="middle" className="fill-blue-600 font-mono">
                      {factB === 1 ? 'x' : `${factB}x`}
                    </text>

                    {/* + sign */}
                    <text x="180" y="0" textAnchor="middle" className="text-xl fill-slate-400">
                      +
                    </text>

                    {/* A.C */}
                    {/* Second common factor A */}
                    {factStep < 3 && (
                      <text 
                        x="225" 
                        y="0" 
                        textAnchor="middle" 
                        className={`font-mono transition-all ${factStep >= 1 ? 'fill-amber-600 font-bold scale-110' : 'fill-slate-400'}`}
                      >
                        {factA}
                      </text>
                    )}
                    
                    {/* Separator dot */}
                    {factStep < 3 && <text x="245" y="0" textAnchor="middle" className="text-xs fill-slate-300">•</text>}
                    
                    {/* Term C */}
                    <text x="270" y="0" textAnchor="middle" className="fill-pink-600 font-mono">
                      {factC}
                    </text>

                    {/* Closing parenthes if factored */}
                    {factStep >= 3 && (
                      <>
                        <text x="175" y="0" textAnchor="middle" className="fill-slate-400 text-xl">+</text>
                        <text x="260" y="0" textAnchor="middle" className="text-xl">)</text>
                      </>
                    )}
                  </g>
                </svg>
              ) : (
                // Remarkable Difference of Squares: A²x² - B²
                <svg viewBox="0 0 360 110" className="w-full max-w-[340px] h-[110px] select-none overflow-visible">
                  <g className="text-2xl md:text-3xl font-black font-sans fill-slate-800 dark:fill-slate-100" transform="translate(0, 75)">
                    {factStep === 0 && (
                      <g className="animate-fadeIn">
                        <text x="180" y="0" textAnchor="middle" className="font-mono text-center">
                          <tspan className="fill-indigo-600">{factA * factA}x²</tspan>
                          <tspan className="fill-slate-400"> - </tspan>
                          <tspan className="fill-pink-600">{factB * factB}</tspan>
                        </text>
                      </g>
                    )}
                    
                    {factStep === 1 && (
                      <g className="animate-fadeIn">
                        <text x="180" y="0" textAnchor="middle" className="font-mono text-center">
                          <tspan className="fill-indigo-600">({factA}x)²</tspan>
                          <tspan className="fill-slate-400"> - </tspan>
                          <tspan className="fill-pink-600">{factB}²</tspan>
                        </text>
                        <text x="180" y="30" textAnchor="middle" className="text-xs font-sans fill-slate-400 font-bold uppercase tracking-widest">
                          Mise en évidence des carrés (a² - b²)
                        </text>
                      </g>
                    )}

                    {factStep >= 2 && (
                      <g className="animate-fadeIn">
                        <text x="180" y="0" textAnchor="middle" className="font-mono text-center text-xl md:text-2xl font-black">
                          <tspan className="fill-slate-400">(</tspan>
                          <tspan className="fill-indigo-600">{factA}x</tspan>
                          <tspan className="fill-slate-400"> + </tspan>
                          <tspan className="fill-pink-600">{factB}</tspan>
                          <tspan className="fill-slate-400">)(</tspan>
                          <tspan className="fill-indigo-600">{factA}x</tspan>
                          <tspan className="fill-slate-400"> - </tspan>
                          <tspan className="fill-pink-600">{factB}</tspan>
                          <tspan className="fill-slate-400">)</tspan>
                        </text>
                        <text x="180" y="28" textAnchor="middle" className="text-[10px] font-sans fill-emerald-600 dark:fill-emerald-400 font-black uppercase tracking-widest">
                          Produit conjugué : (a + b)(a - b) !
                        </text>
                      </g>
                    )}
                  </g>
                </svg>
              )}
            </div>
          )}

          {activeSubTab === 'identites' && (
            <div className="flex flex-col items-center justify-center py-6">
              {/* Animated identites display */}
              <svg viewBox="0 0 380 120" className="w-full max-w-[360px] h-[120px] select-none overflow-visible">
                <g className="text-xl md:text-2xl font-black font-sans fill-slate-800 dark:fill-slate-100" transform="translate(0, 75)">
                  {identStep === 0 && (
                    <g className="animate-fadeIn text-center">
                      <text x="180" y="0" textAnchor="middle" className="font-mono">
                        {identMode === 'somme' && `(${identA}x + ${identB})²`}
                        {identMode === 'difference' && `(${identA}x - ${identB})²`}
                        {identMode === 'carres' && `(${identA}x + ${identB})(${identA}x - ${identB})`}
                      </text>
                    </g>
                  )}

                  {identStep === 1 && (
                    <g className="animate-fadeIn text-center">
                      <text x="180" y="0" textAnchor="middle" className="font-mono fill-indigo-600 pulse-math-term">
                        ({identA}x)² = {identA * identA}x²
                      </text>
                      <text x="180" y="28" textAnchor="middle" className="text-[10px] font-sans fill-slate-400 font-bold uppercase tracking-widest">
                        Terme a² : Carré du premier terme
                      </text>
                    </g>
                  )}

                  {identStep === 2 && (
                    <g className="animate-fadeIn text-center">
                      <text x="180" y="0" textAnchor="middle" className="font-mono fill-emerald-600 pulse-math-term">
                        {identMode === 'carres' ? 'Pas de double produit' : `2 × (${identA}x) × (${identB}) = ${2 * identA * identB}x`}
                      </text>
                      <text x="180" y="28" textAnchor="middle" className="text-[10px] font-sans fill-slate-400 font-bold uppercase tracking-widest">
                        {identMode === 'carres' ? 'Les produits croisés s\'annulent !' : 'Terme 2ab : Double produit (en vert)'}
                      </text>
                    </g>
                  )}

                  {identStep === 3 && (
                    <g className="animate-fadeIn text-center">
                      <text x="180" y="0" textAnchor="middle" className="font-mono fill-pink-600 pulse-math-term">
                        {identB}² = {identB * identB}
                      </text>
                      <text x="180" y="28" textAnchor="middle" className="text-[10px] font-sans fill-slate-400 font-bold uppercase tracking-widest">
                        Terme b² : Carré du second terme (positif !)
                      </text>
                    </g>
                  )}

                  {identStep === 4 && (
                    <g className="animate-fadeIn text-center">
                      <text x="180" y="0" textAnchor="middle" className="font-mono text-lg md:text-xl font-extrabold leading-none">
                        {identMode === 'somme' && (
                          <tspan>
                            <tspan className="fill-indigo-600">{identA * identA}x²</tspan>
                            <tspan className="fill-emerald-650"> + {2 * identA * identB}x</tspan>
                            <tspan className="fill-pink-600"> + {identB * identB}</tspan>
                          </tspan>
                        )}
                        {identMode === 'difference' && (
                          <tspan>
                            <tspan className="fill-indigo-600">{identA * identA}x²</tspan>
                            <tspan className="fill-emerald-650"> - {2 * identA * identB}x</tspan>
                            <tspan className="fill-pink-600"> + {identB * identB}</tspan>
                          </tspan>
                        )}
                        {identMode === 'carres' && (
                          <tspan>
                            <tspan className="fill-indigo-600">{identA * identA}x²</tspan>
                            <tspan className="fill-pink-650"> - {identB * identB}</tspan>
                          </tspan>
                        )}
                      </text>
                      <text x="180" y="28" textAnchor="middle" className="text-[9px] font-sans fill-indigo-600 font-black uppercase tracking-widest">
                        Expression finale parfaitement simplifiée !
                      </text>
                    </g>
                  )}
                </g>
              </svg>
            </div>
          )}

          {/* Player controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border gap-3 mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (activeSubTab === 'developpement') {
                    setDevStep((prev) => Math.max(0, prev - 1));
                  } else if (activeSubTab === 'factorisation') {
                    setFactStep((prev) => Math.max(0, prev - 1));
                  } else {
                    setIdentStep((prev) => Math.max(0, prev - 1));
                  }
                  setIsPlaying(false);
                }}
                className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-xl border font-bold text-xs flex items-center gap-1"
                disabled={activeSubTab === 'developpement' ? devStep === 0 : activeSubTab === 'factorisation' ? factStep === 0 : identStep === 0}
              >
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>
              
              <button
                onClick={() => {
                  const maxSteps = activeSubTab === 'developpement' 
                    ? (devMode === 'double' ? 5 : 3) 
                    : activeSubTab === 'factorisation' ? 4 : 4;
                    
                  if (activeSubTab === 'developpement') {
                    setDevStep((prev) => (prev < maxSteps ? prev + 1 : 0));
                  } else if (activeSubTab === 'factorisation') {
                    setFactStep((prev) => (prev < 4 ? prev + 1 : 0));
                  } else {
                    setIdentStep((prev) => (prev < 4 ? prev + 1 : 0));
                  }
                  setIsPlaying(false);
                }}
                className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-xl border font-bold text-xs flex items-center gap-1"
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper text explanation box */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 font-black text-xs uppercase rounded-xl transition-all shadow-xs flex items-center gap-1.5 text-white ${
                isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Play className="w-4 h-4" /> {isPlaying ? 'Arrêter l\'Autoplay' : 'Lancer l\'Autoplay (Boucle)'}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Parameter tuners / Interactive controls / Explanations */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Mathematical step detail CARD - LARGE WRITING SIZES */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-[28px] border border-slate-205 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" /> Explication Textuelle de l'Étape
            </h4>

            {activeSubTab === 'developpement' && (
              <div className="space-y-3 font-sans">
                {devStep === 0 && (
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                    🚀 <span className="text-indigo-600 dark:text-indigo-400">Énoncé à développer :</span> Nous allons multiplier l'expression pas à pas. Utilise le bouton <strong className="text-indigo-600 font-black">"Suivant"</strong> ou l'Autoplay pour animer les étapes une par une !
                  </p>
                )}
                {devStep === 1 && (
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                    👉 <span className="text-emerald-600">Étape 1 (Vert) :</span> Multiplier le premier terme de gauche <span className="text-indigo-605">({devA}x)</span> par le premier de droite <span className="text-emerald-600">({devC === 1 ? 'x' : `${devC}x`})</span>. 
                    <br />
                    <span className="font-mono text-base bg-emerald-50 dark:bg-slate-900 border px-2 py-0.5 mt-2 rounded block">
                      {devA}x × {devC === 1 ? 'x' : `${devC}x`} = <span className="text-emerald-600 font-extrabold">{devA * devC}x²</span>
                    </span>
                  </p>
                )}
                {devStep === 2 && (
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                    👉 <span className="text-blue-600">Étape 2 (Bleu) :</span> Multiplier le premier terme de gauche <span className="text-indigo-605">({devA}x)</span> par le second terme de droite <span className="text-pink-600">({devD})</span>. Attention à la règle des signes !
                    <br />
                    <span className="font-mono text-base bg-blue-50 dark:bg-slate-900 border px-2 py-0.5 mt-2 rounded block">
                      {devA}x × ({devD}) = <span className="text-blue-600 font-extrabold">{devA * devD}x</span>
                    </span>
                  </p>
                )}
                {devStep === 3 && (
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                    👉 <span className="text-amber-600">Étape 3 (Orange) :</span> Multiplier le second terme de gauche <span className="text-amber-600">({devB})</span> par le premier terme de droite <span className="text-emerald-600">({devC === 1 ? 'x' : `${devC}x`})</span>. 
                    <br />
                    <span className="font-mono text-base bg-amber-50 dark:bg-slate-900 border px-2 py-0.5 mt-2 rounded block">
                      {devB} × {devC === 1 ? 'x' : `${devC}x`} = <span className="text-amber-600 font-extrabold">{devB * devC}x</span>
                    </span>
                  </p>
                )}
                {devStep === 4 && (
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                    👉 <span className="text-pink-600">Étape 4 (Rose) :</span> Multiplier les deux constantes entre elles <span className="text-amber-600">({devB})</span> × <span className="text-pink-600">({devD})</span>.
                    <br />
                    <span className="font-mono text-base bg-pink-50 dark:bg-slate-900 border px-2 py-0.5 mt-2 rounded block">
                      {devB} × ({devD}) = <span className="text-pink-600 font-extrabold">{devB * devD}</span>
                    </span>
                  </p>
                )}
                {devStep === 5 && (
                  <div className="space-y-2">
                    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                      🎉 <span className="text-indigo-650">Simplification Finale :</span> On rassemble les termes de même nature (les $x^2$ ensemble, les $x$ ensemble et les constantes ensemble) :
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-900 border p-3 rounded-2xl text-md font-mono font-black space-y-1">
                      <div className="text-slate-500 text-xs">Somme complète :</div>
                      <div className="text-sm">
                        {devA * devC}x² {formatTerm(devA * devD, 'x')} {formatTerm(devB * devC, 'x')} {formatTerm(devB * devD, '')}
                      </div>
                      <div className="text-slate-500 text-xs mt-2 border-t pt-1">Résultat réduit :</div>
                      <div className="text-indigo-600 dark:text-indigo-400 text-lg">
                        {formatTerm(devA * devC, 'x²', true)} {formatTerm(devA * devD + devB * devC, 'x')} {formatTerm(devB * devD, '')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'factorisation' && (
              <div className="space-y-3 font-sans text-sm md:text-base">
                {factMode === 'commun' ? (
                  <>
                    {factStep === 0 && (
                      <p className="text-slate-750 dark:text-slate-300 leading-relaxed font-bold">
                        👉 <span className="text-emerald-600">Expression non factorisée :</span> {factA * factB}x + {factA * factC}. Notre but est de trouver un nombre ou une variable identique masquée qui divise chaque membre.
                      </p>
                    )}
                    {factStep === 1 && (
                      <p className="text-slate-750 dark:text-slate-300 leading-relaxed font-bold">
                        👉 <span className="text-amber-600">Étape 1 - Mise en évidence :</span> On récrit les termes pour faire apparaître le diviseur commun <strong className="text-amber-600">{factA}</strong> en évidence :
                        <span className="font-mono text-base bg-amber-50 dark:bg-slate-900 border px-3 py-1.5 mt-2 rounded block">
                          <span className="text-amber-600 font-black">{factA}</span> × {factB}x &nbsp;+&nbsp; <span className="text-amber-600 font-black">{factA}</span> × {factC}
                        </span>
                      </p>
                    )}
                    {factStep === 2 && (
                      <p className="text-slate-750 dark:text-slate-300 leading-relaxed font-bold">
                        👉 <span className="text-indigo-650">Étape 2 - Extraction :</span> D'après la distributivité simple inversée: $k \cdot a + k \cdot b = k(a + b)$. Notre facteur $k$ est <strong className="text-amber-600 font-bold">{factA}</strong>.
                      </p>
                    )}
                    {factStep === 3 && (
                      <p className="text-slate-755 dark:text-slate-300 leading-relaxed font-bold">
                        👉 <span className="text-emerald-605">Étape 3 - Factorisation :</span> On place le facteur commun devant la parenthèse et on recueille ce qu'il reste à l'intérieur !
                        <span className="font-mono text-md bg-emerald-50 dark:bg-slate-900 border p-2 mt-2 rounded block text-emerald-600 font-black text-center">
                          {factA}({factB === 1 ? 'x' : `${factB}x`} + {factC})
                        </span>
                      </p>
                    )}
                    {factStep === 4 && (
                      <p className="text-slate-750 dark:text-slate-300 leading-relaxed font-bold text-emerald-650">
                        🎉 <span className="font-black">Félicitations !</span> L'expression est maintenant factorisée sous forme d'un produit compact. C'est l'outil idéal pour résoudre les équations de type produit nul !
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {factStep === 0 && (
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                        👉 <span className="text-indigo-600">Reconnaître l'Identité :</span> L'expression a la forme d'une différence de deux carrés parfaits : <span className="text-indigo-600 font-black">{factA * factA}x²</span> (le carré de {factA}x) et <span className="text-pink-600 font-black">{factB * factB}</span> (le carré de {factB}).
                      </p>
                    )}
                    {factStep === 1 && (
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                        👉 <span className="text-indigo-650">Écrire sous la forme a² - b² :</span> 
                        <br />
                        <span className="font-mono text-base bg-indigo-50 dark:bg-slate-900 border px-3 py-1 mt-2 rounded block text-center">
                          a² - b² = ({factA}x)² - {factB}²
                        </span>
                        Ici, le terme <strong className="text-indigo-605">a = {factA}x</strong> et le terme <strong className="text-pink-600">b = {factB}</strong>.
                      </p>
                    )}
                    {factStep >= 2 && (
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                        👉 <span className="text-emerald-600">Appliquer a² - b² = (a + b)(a - b) :</span> 
                        <br />
                        Nous injectons simplement nos termes $a$ et $b$ dans la formule classique :
                        <span className="font-mono text-md bg-emerald-50 dark:bg-slate-900 border px-2 py-3 mt-2 rounded block text-center text-emerald-650 font-black">
                          ({factA}x + {factB})({factA}x - {factB})
                        </span>
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {activeSubTab === 'identites' && (
              <div className="space-y-2 font-sans font-bold text-sm md:text-base">
                {identStep === 0 && (
                  <p className="text-slate-705 dark:text-slate-300">
                    🎯 <span className="text-violet-600 font-black">La formule de rechange :</span> Au lieu de développer manuellement en faisant $(Ax+B)(Ax+B)$, nous utilisons la formule de l'identité remarquable pour aller 3 fois plus vite !
                  </p>
                )}
                {identStep === 1 && (
                  <p className="text-slate-705 dark:text-slate-300">
                    👉 <span className="text-indigo-600">Calcul du terme a² :</span> On prend le premier terme <span className="text-indigo-650">({identA}x)</span> et on l'élève entièrement au carré :
                    <span className="font-mono text-base bg-indigo-50 dark:bg-slate-900 border px-3 py-1.5 mt-2 rounded block text-center">
                      ({identA}x)² = <span className="font-black text-indigo-600">{identA * identA}x²</span>
                    </span>
                  </p>
                )}
                {identStep === 2 && (
                  <p className="text-slate-705 dark:text-slate-300">
                    👉 <span className="text-emerald-600">Calcul du Double Produit (2ab) :</span> Multiplier les deux termes entre eux, puis multiplier le tout par 2 :
                    <span className="font-mono text-base bg-emerald-50 dark:bg-slate-900 border px-3 py-1.5 mt-2 rounded block text-center">
                      2 × ({identA}x) × {identB} = <span className="font-black text-emerald-600">{2 * identA * identB}x</span>
                    </span>
                  </p>
                )}
                {identStep === 3 && (
                  <p className="text-slate-705 dark:text-slate-300">
                    👉 <span className="text-pink-600">Calcul du terme b² :</span> On élève le second terme <span className="text-pink-600">({identB})</span> au carré :
                    <span className="font-mono text-base bg-pink-50 dark:bg-slate-900 border px-3 py-1.5 mt-2 rounded block text-center">
                      {identB}² = <span className="font-black text-pink-600">{identB * identB}</span>
                    </span>
                  </p>
                )}
                {identStep === 4 && (
                  <p className="text-slate-705 dark:text-slate-300 text-emerald-650">
                    🎉 <span className="font-black">Somme Finale :</span> On rassemble tous nos résultats intermédiaires selon la formule pour l'écriture raccourcie définitive !
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Coefficient controls parameter card */}
          <div className="bg-slate-100 dark:bg-slate-950 p-5 rounded-[24px] border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest font-mono">
              🧪 Ajustement Dynamique des Coefficients
            </h4>

            {activeSubTab === 'developpement' && (
              <div className="space-y-3 text-xs font-sans">
                {/* Mode toggle */}
                <div className="flex gap-1.5 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl mb-2">
                  <button
                    onClick={() => setDevMode('simple')}
                    className={`flex-1 py-1.5 rounded-lg font-black uppercase text-[10px] transition-all ${devMode === 'simple' ? 'bg-white dark:bg-slate-800 text-indigo-650 shadow-3xs' : 'text-slate-500'}`}
                  >
                    Simple Distributivité
                  </button>
                  <button
                    onClick={() => setDevMode('double')}
                    className={`flex-1 py-1.5 rounded-lg font-black uppercase text-[10px] transition-all ${devMode === 'double' ? 'bg-white dark:bg-slate-800 text-indigo-650 shadow-3xs' : 'text-slate-500'}`}
                  >
                    Double Distributivité
                  </button>
                </div>

                {/* Coefficient a */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                    <span>Coefficient directeur (a) : {devA}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={devA}
                    onChange={(e) => setDevA(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Coefficient b */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                    <span>Constante de gauche (b) : {devB}</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={devB}
                    onChange={(e) => setDevB(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                {/* If double, show C and D */}
                {devMode === 'double' && (
                  <>
                    {/* Coefficient c */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>Coefficient directeur de droite (c) : {devC}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={devC}
                        onChange={(e) => setDevC(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    {/* Coefficient d */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>Constante de droite (d) : {devD}</span>
                      </div>
                      <input
                        type="range"
                        min="-5"
                        max="5"
                        step="1"
                        value={devD}
                        onChange={(e) => setDevD(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeSubTab === 'factorisation' && (
              <div className="space-y-3 text-xs font-sans">
                {/* Factorisation Mode selection */}
                <div className="flex gap-1.5 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl mb-2">
                  <button
                    onClick={() => setFactMode('commun')}
                    className={`flex-1 py-1.5 rounded-lg font-black uppercase text-[10px] transition-all ${factMode === 'commun' ? 'bg-white dark:bg-slate-800 text-emerald-650 shadow-3xs' : 'text-slate-500'}`}
                  >
                    Facteur Commun Simple
                  </button>
                  <button
                    onClick={() => setFactMode('remarquable')}
                    className={`flex-1 py-1.5 rounded-lg font-black uppercase text-[10px] transition-all ${factMode === 'remarquable' ? 'bg-white dark:bg-slate-800 text-emerald-650 shadow-3xs' : 'text-slate-500'}`}
                  >
                    Différence de Carrés (a² - b²)
                  </button>
                </div>

                {factMode === 'commun' ? (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>Facteur commun à extraire (A) : {factA}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="8"
                        step="1"
                        value={factA}
                        onChange={(e) => setFactA(Number(e.target.value))}
                        className="w-full accent-amber-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>Multiplicateur restant (B) : {factB}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={factB}
                        onChange={(e) => setFactB(Number(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>Constante restante (C) : {factC}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={factC}
                        onChange={(e) => setFactC(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>Terme à mettre au carré (a) : {factA}x &rarr; ({factA * factA}x²)</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="6"
                        step="1"
                        value={factA}
                        onChange={(e) => setFactA(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                        <span>Constante à mettre au carré (b) : {factB} &rarr; ({factB * factB})</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={factB}
                        onChange={(e) => setFactB(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeSubTab === 'identites' && (
              <div className="space-y-3 text-xs font-sans">
                {/* Method selector */}
                <div className="flex flex-col gap-1.5 bg-slate-200/60 dark:bg-slate-900 p-1.5 rounded-xl mb-2">
                  <button
                    onClick={() => setIdentMode('somme')}
                    className={`py-1.5 px-2 rounded-lg font-black uppercase text-[10px] text-left transition-all ${identMode === 'somme' ? 'bg-white dark:bg-slate-800 text-violet-650 shadow-3xs' : 'text-slate-500'}`}
                  >
                    1. Carré d'une Somme (a + b)²
                  </button>
                  <button
                    onClick={() => setIdentMode('difference')}
                    className={`py-1.5 px-2 rounded-lg font-black uppercase text-[10px] text-left transition-all ${identMode === 'difference' ? 'bg-white dark:bg-slate-800 text-violet-650 shadow-3xs' : 'text-slate-500'}`}
                  >
                    2. Carré d'une Différence (a - b)²
                  </button>
                  <button
                    onClick={() => setIdentMode('carres')}
                    className={`py-1.5 px-2 rounded-lg font-black uppercase text-[10px] text-left transition-all ${identMode === 'carres' ? 'bg-white dark:bg-slate-800 text-violet-650 shadow-3xs' : 'text-slate-500'}`}
                  >
                    3. Produit de Somme-Différence (a + b)(a - b)
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                    <span>Terme coefficient (a) : {identA}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={identA}
                    onChange={(e) => setIdentA(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                    <span>Terme constant (b) : {identB}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={identB}
                    onChange={(e) => setIdentB(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>

                {/* Geometric Illustration section */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-3">
                  <span className="font-bold text-slate-500 text-[10px] uppercase block mb-1">
                    📖 Illustration de l'Identité (a + b)² :
                  </span>
                  <img 
                    src={remarkableIdentitiesImg} 
                    alt="Illustration géométrique identités remarquables"
                    className="w-full h-auto bg-white rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-800/80"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-[10px] text-slate-400 leading-normal mt-1.5 font-bold">
                    La surface du grand carré vaut (a + b)², qui est précisément égale à la somme des 4 sous-aires : les carrés jaune (a²) et rouge (b²), plus les deux rectangles orange (ab + ab = 2ab) !
                  </p>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
