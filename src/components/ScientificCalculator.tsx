/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Delete, HelpCircle, History, X, Sparkles, Sliders } from 'lucide-react';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isDegreeMode, setIsDegreeMode] = useState(true); // default angle unit

  const pressKey = (key: string) => {
    setDisplay((prev) => prev + key);
  };

  const clearAll = () => {
    setDisplay('');
  };

  const deleteLast = () => {
    setDisplay((prev) => prev.slice(0, -1));
  };

  const parseAndEvaluate = () => {
    try {
      let finalExpr = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI');

      // Expand custom functions: sin, cos, tan, sqrt
      // We map e.g., cos(30) to Math.cos(30 * Math.PI / 180) in degree mode
      const scaleStr = isDegreeMode ? '* Math.PI / 180' : '';

      finalExpr = finalExpr.replace(/sin\(([^)]+)\)/g, `Math.sin(($1) ${scaleStr})`);
      finalExpr = finalExpr.replace(/cos\(([^)]+)\)/g, `Math.cos(($1) ${scaleStr})`);
      finalExpr = finalExpr.replace(/tan\(([^)]+)\)/g, `Math.tan(($1) ${scaleStr})`);
      finalExpr = finalExpr.replace(/sqrt\(([^)]+)\)/g, `Math.sqrt($1)`);
      finalExpr = finalExpr.replace(/\^2/g, `**2`);

      // Safe evaluation using simple Function sandbox
      // Strictly prevent unsafe evaluations
      if (/[a-zA-Z]/.test(finalExpr.replace(/Math\.[a-zA-Z]+/g, ''))) {
        throw new Error('Expression invalide');
      }

      const res = new Function(`return (${finalExpr})`)();

      if (res === null || res === undefined || isNaN(res)) {
        setDisplay('Erreur');
      } else {
        const formattedRes = parseFloat(res.toFixed(6)).toString();
        setHistory((prev) => [...prev.slice(-4), `${display} = ${formattedRes}`]);
        setDisplay(formattedRes);
      }
    } catch (err) {
      setDisplay('Erreur');
    }
  };

  return (
    <div className="w-full bg-slate-900 text-white rounded-[24px] p-5 border border-slate-808 shadow-xl max-w-sm mx-auto">
      {/* Header modes */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] font-mono tracking-wider text-slate-400 font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
          CALCULATRICE SCIENTIFIQUE
        </span>
        <button
          onClick={() => setIsDegreeMode(!isDegreeMode)}
          className="text-[10px] font-sans font-bold px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors"
        >
          {isDegreeMode ? 'DEGRES (DEG)' : 'RADIANS (RAD)'}
        </button>
      </div>

      {/* Calculator Display screen */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-805 mb-3 text-right">
        <div className="h-6 overflow-x-auto text-[10px] text-slate-500 font-mono scrollbar-none whitespace-nowrap">
          {history.length > 0 ? history[history.length - 1] : 'Prête ...'}
        </div>
        <div className="text-xl font-mono truncate tracking-tight text-emerald-400 font-bold select-all min-h-[28px]">
          {display || '0'}
        </div>
      </div>

      {/* Core keypad grid layout */}
      <div className="grid grid-cols-5 gap-1.5 text-xs font-mono">
        {/* Row 1 Scientifics */}
        <button
          onClick={() => pressKey('sin(')}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-sky-400 text-center"
        >
          sin
        </button>
        <button
          onClick={() => pressKey('cos(')}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-sky-400 text-center"
        >
          cos
        </button>
        <button
          onClick={() => pressKey('tan(')}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-sky-400 text-center"
        >
          tan
        </button>
        <button
          onClick={() => pressKey('sqrt(')}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-sky-400 text-center"
        >
          √
        </button>
        <button
          onClick={() => pressKey('^2')}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-sky-400 text-center"
        >
          x²
        </button>

        {/* Row 2 Scientifics & clear */}
        <button
          onClick={() => pressKey('(')}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 text-center"
        >
          (
        </button>
        <button
          onClick={() => pressKey(')')}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 text-center"
        >
          )
        </button>
        <button
          onClick={() => pressKey('π')}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 text-center"
        >
          π
        </button>
        <button
          onClick={deleteLast}
          className="p-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 font-bold text-center flex justify-center items-center"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={clearAll}
          className="p-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-center"
        >
          C
        </button>

        {/* Row 3 Numbers */}
        <button
          onClick={() => pressKey('7')}
          className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-650 font-semibold text-center"
        >
          7
        </button>
        <button
          onClick={() => pressKey('8')}
          className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-650 font-semibold text-center"
        >
          8
        </button>
        <button
          onClick={() => pressKey('9')}
          className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-650 font-semibold text-center"
        >
          9
        </button>
        <button
          onClick={() => pressKey('÷')}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-center"
        >
          ÷
        </button>
        <div className="row-span-4 grid grid-cols-1 gap-1.5">
          <button
            onClick={() => pressKey('+')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-center"
          >
            +
          </button>
          <button
            onClick={() => pressKey('-')}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-center"
          >
            -
          </button>
          <button
            onClick={parseAndEvaluate}
            className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold text-white text-center flex-1 h-[78px] flex items-center justify-center text-sm"
          >
            =
          </button>
        </div>

        {/* Row 4 Numbers */}
        <button
          onClick={() => pressKey('4')}
          className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-650 font-semibold text-center"
        >
          4
        </button>
        <button
          onClick={() => pressKey('5')}
          className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-650 font-semibold text-center"
        >
          5
        </button>
        <button
          onClick={() => pressKey('6')}
          className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-650 font-semibold text-center"
        >
          6
        </button>
        <button
          onClick={() => pressKey('×')}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-center"
        >
          ×
        </button>

        {/* Row 5 Numbers */}
        <button
          onClick={() => pressKey('1')}
          className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-650 font-semibold text-center"
        >
          1
        </button>
        <button
          onClick={() => pressKey('2')}
          className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-650 font-semibold text-center"
        >
          2
        </button>
        <button
          onClick={() => pressKey('3')}
          className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-650 font-semibold text-center"
        >
          3
        </button>
        <button
          onClick={() => pressKey('/')}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-center"
        >
          /
        </button>

        {/* Row 6 Zero and Dot */}
        <button
          onClick={() => pressKey('0')}
          className="col-span-2 p-2.5 rounded-lg bg-slate-700 hover:bg-slate-650 font-semibold text-center"
        >
          0
        </button>
        <button
          onClick={() => pressKey('.')}
          className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-650 font-semibold text-center"
        >
          .
        </button>
        <button
          onClick={() => pressKey('/')}
          className="opacity-0 cursor-default"
          disabled
        >
          &nbsp;
        </button>
      </div>

      {/* Helper trigger tips */}
      <div className="mt-3 bg-slate-950 p-2 rounded-lg text-[9.5px] leading-relaxed text-slate-400 font-sans border border-slate-800">
        <span className="font-bold text-sky-400 block mb-0.5">💡 Astuce écriture :</span>
        Pour utiliser la racine, tape <code className="text-emerald-400">sqrt(16)</code> puis <code className="text-emerald-400">=</code>. Pour évaluer cosinus de d'un angle dans l'unité choisie, tape <code className="text-emerald-400">cos(30)</code>.
      </div>
    </div>
  );
}
