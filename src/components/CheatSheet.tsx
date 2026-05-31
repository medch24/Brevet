/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, Info, Award, Calendar, Hash, HelpCircle } from 'lucide-react';
import { SubjectId, Chapter, ChapterId } from '../types';

export const ALL_REVISION_CHAPTERS: Chapter[] = [
  // MATHS
  {
    id: 'pythagore',
    title: 'Théorème de Pythagore',
    subject: 'maths',
    description: "Calculer des longueurs de côtés et démontrer qu'un triangle est rectangle.",
    summary: [
      "Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés : AC² = AB² + BC².",
      "La réciproque du théorème : Si la relation est vraie, alors le triangle est rectangle.",
      "La contraposée : Si la relation est fausse, alors le triangle n'est pas rectangle."
    ],
    tips: [
      "L'hypoténuse est TOUJOURS le plus grand côté opposé à l'angle droit.",
      "Rédaction Brevet type : 'Dans le triangle ABC, le plus grand côté est... On compare d'une part... et d'autre part...'"
    ],
    formulas: [
      { label: "Formule de Pythagore", formula: "AC² = AB² + BC²", explanation: "Calculer le plus grand côté (hypoténuse)" },
      { label: "Détournement (Côté court)", formula: "AB² = AC² - BC²", explanation: "Calculer un côté de l'angle droit" }
    ],
    difficulty: 1
  },
  {
    id: 'trigonometrie',
    title: 'Trigonométrie',
    subject: 'maths',
    description: "Relation entre les angles et les longueurs dans un triangle rectangle.",
    summary: [
      "Le Cosinus d'un angle aigu est égal au rapport : Côté Adjacent / Hypoténuse.",
      "Le Sinus d'un angle aigu est égal au rapport : Côté Opposé / Hypoténuse.",
      "La Tangente d'un angle aigu est égale au rapport : Côté Opposé / Côté Adjacent."
    ],
    tips: [
      "Utilise le mémo magique SOH CAH TOA.",
      "Vérifie que ta calculatrice scientifique est bien en mode DEGRES (DEG), sinon les résultats seront faux !!"
    ],
    formulas: [
      { label: "Cosinus (Cos)", formula: "Cos(Angle) = Adjacent / Hypoténuse", explanation: "Sert à calculer l'adjacent ou l'hypoténuse" },
      { label: "Sinus (Sin)", formula: "Sin(Angle) = Opposé / Hypoténuse", explanation: "Sert à calculer l'opposé ou l'hypoténuse" },
      { label: "Tangente (Tan)", formula: "Tan(Angle) = Opposé / Adjacent", explanation: "Sert à calculer l'opposé ou l'adjacent" }
    ],
    difficulty: 2
  },
  {
    id: 'fonctions',
    title: 'Fonctions',
    subject: 'maths',
    description: "Comprendre les processus mathématiques, images, antécédents et graphiques.",
    summary: [
      "Une fonction f est un processus qui associe à un nombre x un unique nombre f(x). f(x) est l'IMAGE de x, et x est l'ANTECEDENT de f(x).",
      "Fonction linéaire : f(x) = ax. Représentée par une droite passant par l'origine. Modélise la proportionnalité.",
      "Fonction affine : f(x) = ax + b. Représentée par une droite. 'a' est la pente, 'b' est l'ordonnée à l'origine (où la droite coupe l'axe vertical)."
    ],
    tips: [
      "Astuce Brevet : Pour lire l'image graphiquement, pars de l'axe des abscisses (horizontal) vers la courbe puis lis l'axe des ordonnées. Pour l'antécédent, fais l'inverse."
    ],
    formulas: [
      { label: "Linéaire", formula: "f(x) = a × x", explanation: "Situation de proportionnalité parfaite" },
      { label: "Affine", formula: "f(x) = a × x + b", explanation: "'a' est le coefficient directeur, 'b' est l'ordonnée à l'origine" },
      { label: "Calcul de la pente 'a'", formula: "a = (f(x₂) - f(x₁)) / (x₂ - x₁)", explanation: "Calculer le coefficient directeur à partir de deux points" }
    ],
    difficulty: 2
  },
  {
    id: 'thales',
    title: 'Théorème de Thalès',
    subject: 'maths',
    description: "Proportions de droites parallèles coupées par des sécantes.",
    summary: [
      "Si deux droites coupées par deux droites parallèles forment une configuration en triangle emboîté ou en papillon, alors les rapports de longueurs sont égaux.",
      "Réciproque : Utile pour prouver que deux droites sont parallèles.",
      "Contraposée : Utile pour prouver que deux droites ne sont pas parallèles."
    ],
    tips: [
      "Vérifie toujours l'alignement des points dans le bon ordre lors de la rédaction de ton raisonnement.",
      "Utilise le produit en croix pour isoler et calculer la longueur manquante rapidement."
    ],
    formulas: [
      { label: "Égalité de Thalès", formula: "AD / AB = AE / AC = DE / BC", explanation: "Équivalence des rapports correspondants" }
    ],
    difficulty: 2
  },
  {
    id: 'calcul-literal',
    title: 'Calcul Littéral & Équations',
    subject: 'maths',
    description: "Manipuler des expressions algébriques, factoriser, développer, et résoudre des équations.",
    summary: [
      "Développer : transformer un produit en somme (simple et double distributivité).",
      "Factoriser : transformer une somme en produit (recherche d'un facteur commun ou identités remarquables).",
      "Équations-produits nuls : Un produit de facteurs est nul si et seulement si l'un des facteurs est nul. Exemple : (ax+b)(cx+d) = 0."
    ],
    tips: [
      "Prends garde aux changements de signes '-' devant les parenthèses lors de la double distributivité !",
      "Au Brevet, l'équation-produit est très récurrente. Pense à séparer les deux solutions : 'soit ... = 0, soit ... = 0'"
    ],
    formulas: [
      { label: "Simple distributivité", formula: "k(a + b) = ka + kb", explanation: "Développer au premier degré" },
      { label: "Double distributivité", formula: "(a + b)(c + d) = ac + ad + bc + bd", explanation: "Développer des binômes compliqués" },
      { label: "Équation-produit", formula: "A × B = 0  ⇒  A = 0 OU B = 0", explanation: "Résolution par séparation des membres" }
    ],
    difficulty: 3
  },
  {
    id: 'statistiques',
    title: 'Statistiques & Probabilités',
    subject: 'maths',
    description: "Calculer des indicateurs de séries de données et estimer les chances d'événements.",
    summary: [
      "Moyenne : Somme de toutes les valeurs divisée par l'effectif total.",
      "Médiane : Valeur qui partage la série en deux groupes d'effectifs égaux.",
      "Probabilité : Nombre d'issues favorables divisé par le nombre total d'issues équitables."
    ],
    tips: [
      "Pour calculer la médiane, commence impérativement par ranger les valeurs dans l'ordre croissant !",
      "La probabilité d'un événement est toujours comprise entre 0 (impossible) et 1 (certain)."
    ],
    formulas: [
      { label: "Moyenne pondérée", formula: "M = Σ(Valeur × Effectif) / Effectif Total", explanation: "Calculer une moyenne avec coefficients" },
      { label: "Probabilité simple", formula: "P(A) = Issues favorables / Issues totales", explanation: "Estimer la probabilité théorique fine" }
    ],
    difficulty: 1
  },

  // PHYSIQUE
  {
    id: 'electricite',
    title: 'Électricité (Loi d\'Ohm)',
    subject: 'physique-chimie',
    description: "Calculer la tension, la résistance, et l'intensité dans un circuit.",
    summary: [
      "La tension alternative ou continue s'exprime en Volts (V) et se mesure avec un Voltmètre branché en dérivation.",
      "La résistance électrique s'exprime en Ohms (Ω) et limite le passage du courant.",
      "L'intensité est le débit de courant, elle s'exprime en Ampères (A) et se mesure en série avec un ampèremètre.",
      "La loi d'Ohm lie la tension aux bornes d'un conducteur ohmique à l'intensité qui le traverse via sa résistance."
    ],
    tips: [
      "Excellente astuce pour interchanger les formules : place U, R, I dans un triangle magique. U est au sommet, R et I sont en bas. Pour trouver R, fais U divisé par I."
    ],
    formulas: [
      { label: "Loi d'Ohm", formula: "U = R × I", explanation: "Calculer la Tension (U) en Volts" },
      { label: "Intensité", formula: "I = U / R", explanation: "Calculer l'Intensité (I) en Ampères" },
      { label: "Résistance", formula: "R = U / I", explanation: "Calculer la Résistance (R) en Ohms" },
      { label: "Puissance Électrique", formula: "P = U × I", explanation: "Puissance consommée ou dissipée (W)" }
    ],
    difficulty: 1
  },
  {
    id: 'mouvement',
    title: 'Mouvement & Trajectoires',
    subject: 'physique-chimie',
    description: "Caractériser des trajectoires rectilignes, circulaires, et calculer la vitesse.",
    summary: [
      "Le mouvement est toujours relatif à un référentiel choisi (généralement le référentiel terrestre).",
      "Trajectoire : l'ensemble des positions successives d'un mobile (Rectiligne, Circulaire, Curviligne).",
      "Évolution de la vitesse : Uniforme (vitesse constante), Accéléré (vitesse augmente), Décéléré/Ralenti (vitesse diminue)."
    ],
    tips: [
      "N'oublie pas de convertir les unités si besoin ! Pour passer des m/s aux km/h, multiplie par 3,6. Pour passer des km/h aux m/s, divise par 3,6 !"
    ],
    formulas: [
      { label: "Vitesse moyenne", formula: "v = d / t", explanation: "Vitesse moyenne (m/s ou km/h)" },
      { label: "Calcul distance", formula: "d = v × t", explanation: "Distance parcourue à vitesse constante" },
      { label: "Calcul du temps", formula: "t = d / v", explanation: "Durée d'un trajet" }
    ],
    difficulty: 1
  },
  {
    id: 'forces',
    title: 'Forces & Interactions',
    subject: 'physique-chimie',
    description: "Modéliser des actions mécaniques par des vecteurs forces d'intensité en Newton.",
    summary: [
      "Une action mécanique exercée par un objet sur un autre est modélisée par une Force.",
      "Une force est représentée par un segment fléché (vecteur) possédant : point d'application, direction, sens, et valeur.",
      "La valeur de la force se mesure avec un dynamomètre et s'exprime en Newtons (N)."
    ],
    tips: [
      "Le poids et la masse sont deux grandeurs bien différentes. La masse (kg) ne change jamais d'une planète à l'autre, tandis que le poids (N) dépend de la gravité 'g' !"
    ],
    formulas: [
      { label: "Relation Poids-Masse", formula: "P = m × g", explanation: "P : Poids (N), m : Masse (kg), g : Intensité pesanteur (9.81 N/kg sur Terre)" }
    ],
    difficulty: 2
  },
  {
    id: 'energie',
    title: 'Énergies & Transformations',
    subject: 'physique-chimie',
    description: "Calculer l'énergie cinétique, potentielle et comprendre la conservation de l'énergie.",
    summary: [
      "Énergie cinétique : liée à la vitesse du mobile. Proportionnelle au carré de la vitesse : Ec = 0.5 * m * v².",
      "Énergie potentielle de pesanteur : liée à l'altitude. Ep = m * g * h.",
      "Énergie mécanique totale : Em = Ec + Ep.",
      "L'énergie ne peut ni être créée ni être détruite. Dans un système idéal sans frottements, l'énergie mécanique totale est CONSTANTE."
    ],
    tips: [
      "La vitesse dans la formule de l'énergie cinétique DOIT obligatoirement être convertie en mètres par seconde (m/s) d'abord, avant d'être élevée au carré !"
    ],
    formulas: [
      { label: "Énergie Cinétique", formula: "Ec = 0.5 × m × v²", explanation: "m en kg, v en m/s. Ec en Joules (J)" },
      { label: "Énergie Potentielle", formula: "Ep = m × g × h", explanation: "m en kg, h en m. Ep en Joules (J)" },
      { label: "Énergie Mécanique", formula: "Em = Ec + Ep", explanation: "Énergie mécanique totale du système" }
    ],
    difficulty:3
  },
  {
    id: 'reactions-chimiques',
    title: 'Transformations Chimiques',
    subject: 'physique-chimie',
    description: "Comprendre les molécules, réactions chimiques, et l'équilibre des équations.",
    summary: [
      "Lors d'une transformation chimique, les réactifs réagissent entre eux pour donner des produits.",
      "Règle de Lavoisier : 'Rien ne se perd, rien ne se crée, tout se transforme'. Les atomes se réarrangent mais aucun ne disparaît ou n'apparaît.",
      "Une équation chimique doit toujours être équilibrée en comptant séparément chaque type d'atome."
    ],
    tips: [
      "Pour équilibrer, tu n'as le droit de modifier que les COEFFICIENTS devant les formules. Ne change jamais les indices sous les formules (comme le 2 de H₂O) !"
    ],
    formulas: [
      { label: "Combustion complète du carbone", formula: "C + O₂  →  CO₂", explanation: "Le carbone brûle dans le dioxygène" },
      { label: "Synthèse de l'eau", formula: "2 H₂ + O₂  →  2 H₂O", explanation: "Combustion explosive d'hydrogène" },
      { label: "Combustion complète du méthane", formula: "CH₄ + 2 O₂  →  CO₂ + 2 H₂O", explanation: "Conservation stricte des atomes de C, H et O" }
    ],
    difficulty: 3
  }
];

export default function CheatSheet() {
  const [activeSubject, setActiveSubject] = useState<'all' | SubjectId>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChapters = ALL_REVISION_CHAPTERS.filter((ch) => {
    const matchesSubject = activeSubject === 'all' || ch.subject === activeSubject;
    const matchesSearch =
      ch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Intro visual banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-[32px] p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="bg-white/20 text-white font-mono text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Fiches de révision Brevet
          </span>
          <h2 className="text-xl md:text-2xl font-black font-sans tracking-tight">Formulaires & Mémos Express</h2>
          <p className="text-xs text-indigo-150 max-w-xl font-medium">
            Tous les résumés de cours, formules incontournables et astuces de correction pour maximiser tes points au Brevet des Collèges !
          </p>
        </div>
        {/* Artistic background lines */}
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center translate-x-12 select-none pointer-events-none">
          <BookOpen className="w-64 h-64" />
        </div>
      </div>

      {/* Grid controllers & Filter inputs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-2 border-b border-slate-205 dark:border-slate-800">
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg gap-1 border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveSubject('all')}
            className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-1.5 rounded-md transition-all ${
              activeSubject === 'all'
                ? 'bg-white dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Toutes les matières
          </button>
          <button
            type="button"
            onClick={() => setActiveSubject('maths')}
            className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-1.5 rounded-md transition-all ${
              activeSubject === 'maths'
                ? 'bg-white dark:bg-slate-850 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-705'
            }`}
          >
            Mathématiques
          </button>
          <button
            type="button"
            onClick={() => setActiveSubject('physique-chimie')}
            className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-1.5 rounded-md transition-all ${
              activeSubject === 'physique-chimie'
                ? 'bg-white dark:bg-slate-850 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-705'
            }`}
          >
            Physique-Chimie
          </button>
        </div>

        {/* Searching field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une notion/formule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Chapters list layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChapters.map((ch) => (
          <div
            key={ch.id}
            className="bg-white dark:bg-slate-950 rounded-[28px] p-6 border border-slate-205 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-900 transition-all hover:-translate-y-1 hover:shadow-md duration-300"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  ch.subject === 'maths'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400'
                }`}>
                  {ch.subject === 'maths' ? 'Mathématiques' : 'Physique-Chimie'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 font-bold">
                  🌟 Difficulté : {ch.difficulty === 1 ? 'Apprenti' : ch.difficulty === 2 ? 'Expert' : 'Champion'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
                {ch.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {ch.description}
              </p>
            </div>

            {/* Revision cards summary bullets */}
            <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-900 pt-3">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide block mb-1">Résumé Express :</span>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                {ch.summary.map((sum, i) => (
                  <li key={i} className="leading-relaxed">
                    {sum}
                  </li>
                ))}
              </ul>
            </div>

            {/* Live Equations card with special aesthetic box */}
            {ch.formulas.length > 0 && (
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-105 dark:border-slate-900">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Formules Clés :</span>
                <div className="space-y-2">
                  {ch.formulas.map((form, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between items-center font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-950 px-2 py-1 rounded shadow-3xs border border-slate-200/50 dark:border-slate-800">
                        <span>{form.label}</span>
                        <span className="text-slate-800 dark:text-slate-100 font-extrabold">{form.formula}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 ml-1">
                        → {form.explanation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Brevet tips box */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs leading-relaxed text-slate-700 dark:text-amber-400/90 flex gap-2">
              <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-700 dark:text-amber-300 font-semibold block mb-0.5">Astuce Brevet :</strong>
                {ch.tips[0]}
              </div>
            </div>
          </div>
        ))}

        {filteredChapters.length === 0 && (
          <div className="md:col-span-2 text-center p-12 bg-white dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-2 animate-bounce" />
            <p className="text-slate-500 text-sm">Aucune notion trouvée pour "{searchTerm}" !</p>
          </div>
        )}
      </div>
    </div>
  );
}
