/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Clock,
  BookOpen,
  Sparkles,
  Zap,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { ChapterId, Exercise, ExerciseLevel } from '../types';

interface ExerciseManagerProps {
  chapterId: ChapterId;
  onPointsGained: (points: number, success: boolean, level: ExerciseLevel) => void;
}

// Full database of rich educational exercises for each French 3eme Brevet Chapter
const EXERCISES_DATABASE: Partial<Record<ChapterId, Exercise[]>> = {
  pythagore: [
    {
      id: 'pyth-l1',
      level: 1,
      type: 'vrai-faux',
      question: "Le théorème de Pythagore s'applique-t-il dans un triangle équilatéral ?",
      options: ["Vrai (Oui)", "Faux (Non, uniquement rectangle)"],
      correctAnswer: "Faux (Non, uniquement rectangle)",
      explanation: "Le théorème de Pythagore ne s'applique que dans un triangle rectangle ! C'est sa condition fondamentale d'existence.",
      hint: "Pense à la définition de l'angle droit."
    },
    {
      id: 'pyth-l2',
      level: 2,
      type: 'numeric',
      question: "Soit un triangle ABC rectangle en B. Si AB = 3 cm et BC = 4 cm, combien mesure l'hypoténuse AC (en cm) ?",
      correctAnswer: 5,
      explanation: "D'après Pythagore : AC² = AB² + BC² = 3² + 4² = 9 + 16 = 25. Donc AC = √25 = 5 cm.",
      hint: "Calcule la somme des carrés de 3 et 4."
    },
    {
      id: 'pyth-l3',
      level: 3,
      type: 'numeric',
      question: "Soit un triangle DEF rectangle en E. Si DF = 10 cm (hypoténuse) et EF = 8 cm, combien mesure le côté DE (en cm) ?",
      correctAnswer: 6,
      explanation: "D'après Pythagore : DF² = DE² + EF² => 10² = DE² + 8² => 100 = DE² + 64 => DE² = 100 - 64 = 36. Donc DE = √36 = 6 cm.",
      hint: "Soustrais le carré du côté connu au carré de l'hypoténuse."
    },
    {
      id: 'pyth-l4',
      level: 4,
      type: 'qcm',
      question: "Sujet Brevet : Un skateur veut construire un tremplin. Il dispose d'une planche de 2.5 m (qui fera l'hypoténuse) et souhaite que la hauteur verticale fasse 1.5 m. Quelle doit être la longueur au sol (en m) de son tremplin ?",
      options: ["1.8 m", "2.0 m", "1.2 m", "2.2 m"],
      correctAnswer: "2.0 m",
      explanation: "C'est une application de Pythagore : Sol² + Hauteur² = Planche² => Sol² + 1.5² = 2.5² => Sol² + 2.25 = 6.25 => Sol² = 4. Donc Sol = √4 = 2.0 mètres.",
      hint: "Applique Pythagore en soustrayant 1.5² à 2.5²."
    }
  ],
  trigonometrie: [
    {
      id: 'trig-l1',
      level: 1,
      type: 'qcm',
      question: "Quelle formule mémotechnique permet de retrouver facilement les rapports trigonométriques ?",
      options: ["SOH CAH TOA", "PYTHAGORE", "THALES", "VITE DIST TIME"],
      correctAnswer: "SOH CAH TOA",
      explanation: "SOH (Sin = Opp/Hyp), CAH (Cos = Adj/Hyp) et TOA (Tan = Opp/Adj) est le mémo universel.",
      hint: "Prends les initiales de Sinus, Cosinus, Tangente et des côtés."
    },
    {
      id: 'trig-l2',
      level: 2,
      type: 'numeric',
      question: "Dans un triangle rectangle, si le côté adjacent à un angle de 60° mesure 5 cm, quelle est la longueur de l'hypoténuse (en cm) ? (Rappel : cos(60°) = 0.5)",
      correctAnswer: 10,
      explanation: "On sait que Cos(60°) = Adjacent / Hypoténuse => 0.5 = 5 / Hypoténuse => Hypoténuse = 5 / 0.5 = 10 cm.",
      hint: "Pose l'équation : cos(60°) = 5 / x."
    },
    {
      id: 'trig-l3',
      level: 3,
      type: 'numeric',
      question: "Dans un triangle rectangle, le côté opposé à l'angle fait 3 cm, et le côté adjacent fait 3 cm. Quelle est la valeur de l'angle aigu (en degrés) ?",
      correctAnswer: 45,
      explanation: "Tan(Angle) = Opposé / Adjacent = 3 / 3 = 1. L'angle dont la tangente vaut 1 est 45° (triangle rectangle isocèle).",
      hint: "Quel est l'angle aigu d'un triangle rectangle isocèle ?"
    },
    {
      id: 'trig-l4',
      level: 4,
      type: 'qcm',
      question: "Sujet Brevet : Un géomètre vise le sommet d'une tour avec un théodolite placé à 50 mètres de la base. Son appareil mesure un angle d'élévation de 31°. Sachant que tan(31°) ≈ 0.60, quelle est la hauteur approximative de la tour (en mètres) ?",
      options: ["15 m", "30 m", "25 m", "50 m"],
      correctAnswer: "30 m",
      explanation: "Tan(31°) = Hauteur / Distance => Hauteur = Distance * Tan(31°) = 50 * 0.60 = 30 mètres.",
      hint: "Utilise la tangente : Opposé (hauteur) = Adjacent (distance) * tan(angle)."
    }
  ],
  fonctions: [
    {
      id: 'func-l1',
      level: 1,
      type: 'vrai-faux',
      question: "La courbe représentative de la fonction affine f(x) = 3x - 4 est-elle une droite qui passe par l'origine ?",
      options: ["Vrai (Oui)", "Faux (Non, uniquement si b = 0)"],
      correctAnswer: "Faux (Non, uniquement si b = 0)",
      explanation: "La fonction f(x) = 3x - 4 possède une ordonnée à l'origine b = -4. C'est une droite, mais elle ne passe pas par l'origine. Seules les fonctions linéaires (b=0) passent par l'origine !",
      hint: "Calcule f(0)."
    },
    {
      id: 'func-l2',
      level: 2,
      type: 'numeric',
      question: "Soit la fonction linéaire f(x) = 4.5x. Quelle est l'image du nombre 2 par la fonction f ?",
      correctAnswer: 9,
      explanation: "L'image de 2 s'obtient en remplaçant x par 2 : f(2) = 4.5 * 2 = 9.",
      hint: "Multiplie simplement 4.5 par le paramètre."
    },
    {
      id: 'func-l3',
      level: 3,
      type: 'numeric',
      question: "Soit la fonction affine g(x) = 3x + 2. Trouve l'antécédent de 17 par g (trouve la valeur de x telle que g(x) = 17).",
      correctAnswer: 5,
      explanation: "On résout l'équation : 3x + 2 = 17 => 3x = 15 => x = 15 / 3 = 5.",
      hint: "Pose l'équation g(x) = 17 et cherche x."
    },
    {
      id: 'func-l4',
      level: 4,
      type: 'qcm',
      question: "Sujet Brevet : Un abonnement de cinéma propose un forfait de 12 € par mois plus 3 € par séance. Quelle est la fonction modélisant le prix payé y (en €) pour x séances ?",
      options: ["f(x) = 12x + 3", "f(x) = 3x + 12", "f(x) = 15x", "f(x) = 3x"],
      correctAnswer: "f(x) = 3x + 12",
      explanation: "Le prix comprend une part variable de 3 € par séance (3 * x) et une part fixe d'abonnement de 12 €. Donc la formule est g(x) = 3x + 12. C'est une fonction affine.",
      hint: "La part variable est proportionnelle à x."
    }
  ],
  thales: [
    {
      id: 'thales-l1',
      level: 1,
      type: 'vrai-faux',
      question: "Pour appliquer le théorème de Thalès, faut-il impérativement avoir deux droites parallèles ?",
      options: ["Vrai (Oui)", "Faux (Non)"],
      correctAnswer: "Vrai (Oui)",
      explanation: "La présence de deux droites parallèles coupant deux droites séquantes est la condition requise indispensable de Thalès.",
      hint: "Pense aux lignes orange et bleue de notre simulation !"
    },
    {
      id: 'thales-l2',
      level: 2,
      type: 'numeric',
      question: "Dans un triangle ABC, D est sur [AB] et E est sur [AC] tels que (DE) est parallèle à (BC). Si AD = 2 cm, AB = 6 cm, et AE = 3 cm, calcule AC (en cm).",
      correctAnswer: 9,
      explanation: "D'après Thalès : AD / AB = AE / AC => 2 / 6 = 3 / AC => AC = (6 * 3) / 2 = 9 cm.",
      hint: "Fais un produit en croix : AC = (AB * AE) / AD."
    },
    {
      id: 'thales-l3',
      level: 3,
      type: 'numeric',
      question: "Avec les données précédentes (AD/AB = 2/6 = 1/3), si la base BC mesure 15 cm, quelle est la longueur du segment parallèle DE (en cm) ?",
      correctAnswer: 5,
      explanation: "Thalès lie tous les rapports : DE / BC = AD / AB => DE / 15 = 1/3 => DE = 15 / 3 = 5 cm.",
      hint: "AD/AB représente un coefficient de réduction de 1/3."
    },
    {
      id: 'thales-l4',
      level: 4,
      type: 'qcm',
      question: "Sujet Brevet : Un bâton vertical de 1.2 m planté dans le sol projette une ombre de 1.6 m. Au même moment, un poteau électrique projette une ombre de 12 m. Quelle est la hauteur (en m) de ce poteau électrique ?",
      options: ["9 m", "8 m", "10 m", "15 m"],
      correctAnswer: "9 m",
      explanation: "La configuration des ombres paralleles forme une configuration de Thalès. Ratio : HauteurPoteau / HauteurBaton = OmbrePoteau / OmbreBaton => HP / 1.2 = 12 / 1.6 => HP = (1.2 * 12) / 1.6 = 9 mètres.",
      hint: "Compare les rapports Hauteur / Ombre des deux objets."
    }
  ],
  'calcul-literal': [
    {
      id: 'literal-l1',
      level: 1,
      type: 'qcm',
      question: "Quelle est la forme développée de l'expression : 3x × (2x + 5) ?",
      options: ["6x² + 15x", "6x + 15", "5x² + 8x", "6x² + 5"],
      correctAnswer: "6x² + 15x",
      explanation: "Par simple distributivité : 3x * 2x + 3x * 5 = 6x² + 15x.",
      hint: "Distribue 3x sur chaque terme à l'intérieur des parenthèses."
    },
    {
      id: 'literal-l2',
      level: 2,
      type: 'qcm',
      question: "Laquelle de ces expressions est la factorisation correcte de : x² - 25 ?",
      options: ["(x - 5)(x + 5)", "(x - 5)²", "(x + 5)²", "x(x - 25)"],
      correctAnswer: "(x - 5)(x + 5)",
      explanation: "On utilise l'identité remarquable de la différence de deux carrés : a² - b² = (a-b)(a+b) avec a=x et b=5.",
      hint: "Reconnais la forme a² - b²."
    },
    {
      id: 'literal-l3',
      level: 3,
      type: 'numeric',
      question: "Résous l'équation : 4x - 7 = 2x + 5. Quelle est la valeur de x ?",
      correctAnswer: 6,
      explanation: "On rassemble les x à gauche et les chiffres à droite : 4x - 2x = 5 + 7 => 2x = 12 => x = 12 / 2 = 6.",
      hint: "Soustrais 2x et ajoute 7 des deux côtés."
    },
    {
      id: 'literal-l4',
      level: 4,
      type: 'qcm',
      question: "Sujet Brevet : Quelles sont les deux solutions de l'équation-produit : (2x - 8)(3x + 15) = 0 ?",
      options: ["4 et -5", "-4 et 5", "8 et 15", "x = 4 uniquement"],
      correctAnswer: "4 et -5",
      explanation: "Un produit est nul si et seulement si l'un au moins des facteurs est nul. Soit 2x - 8 = 0 => 2x = 8 => x = 4. Soit 3x + 15 = 0 => 3x = -15 => x = -5. Les solutions sont donc 4 et -5.",
      hint: "Annule le premier facteur, puis annule le second."
    }
  ],
  statistiques: [
    {
      id: 'stats-l1',
      level: 1,
      type: 'numeric',
      question: "Quelle est la moyenne de la série de notes suivantes : 10, 12, 14, 16 ?",
      correctAnswer: 13,
      explanation: "Somme des notes = 10 + 12 + 14 + 16 = 52. Nombre de valeurs = 4. Moyenne = 52 / 4 = 13.",
      hint: "Additionne tout et divise par 4."
    },
    {
      id: 'stats-l2',
      level: 2,
      type: 'numeric',
      question: "On lance un dé équilibré à 6 faces. Quelle est la probabilité d'obtenir un nombre pair ? Donne le résultat sous forme de pourcentage (sans le symbole %, ex: 50).",
      correctAnswer: 50,
      explanation: "Les nombres pairs sur le dé sont 2, 4, 6 (3 issues favorables). Les issues possibles sont 6. Probabilité = 3 / 6 = 0.5 soit 50 %.",
      hint: "Rapport issues favorables sur issues totales."
    },
    {
      id: 'stats-l3',
      level: 3,
      type: 'numeric',
      question: "Soit la série ordonnée de tailles : 140, 145, 150, 165, 170, 180, 195. Quelle est la médiane de cette série ?",
      correctAnswer: 165,
      explanation: "La série est déjà ordonnée et compte 7 valeurs. La valeur du milieu (la 4ème) est 165 car il y a 3 valeurs avant et 3 valeurs après.",
      hint: "Trouve la valeur centrale de la série triée."
    },
    {
      id: 'stats-l4',
      level: 4,
      type: 'qcm',
      question: "Sujet Brevet : Une urne contient 4 boules rouges, 3 boules vertes et 5 boules jaunes. On tire une boule au hasard. Quelle est la probabilité de NE PAS tirer de boule rouge ?",
      options: ["2/3 (ou 8/12)", "1/3", "1/4", "5/12"],
      correctAnswer: "2/3 (ou 8/12)",
      explanation: "Effectif total = 4 + 3 + 5 = 12 boules. 'Ne pas tirer de rouge' signifie tirer une verte ou une jaune. Nombre de boules vertes + jaunes = 3 + 5 = 8. Probabilité = 8 / 12 = 2 / 3.",
      hint: "Calcule la probabilité des boules vertes et jaunes cumulées."
    }
  ],

  // PHYSICS
  electricite: [
    {
      id: 'elec-l1',
      level: 1,
      type: 'vrai-faux',
      question: "L'intensité du courant électrique (I) se mesure-t-elle à l'aide d'un voltmètre branché en dérivation ?",
      options: ["Vrai (Oui)", "Faux (Non, avec un ampèremètre en série)"],
      correctAnswer: "Faux (Non, avec un ampèremètre en série)",
      explanation: "L'intensité s'exprime en Ampères et se mesure obligatoirement avec un AMPEREMETRE branché en SERIE.",
      hint: "Relis le rôle de l'ampèremètre dans notre circuit."
    },
    {
      id: 'elec-l2',
      level: 2,
      type: 'numeric',
      question: "D'après la loi d'Ohm, si on applique une tension de 12 V aux bornes d'un dipôle de résistance 4 Ω, quelle est l'intensité du courant (en Ampères) ?",
      correctAnswer: 3,
      explanation: "Loi d'Ohm : U = R * I => I = U / R. Donc I = 12 / 4 = 3 Ampères.",
      hint: "Divise la tension par la résistance."
    },
    {
      id: 'elec-l3',
      level: 3,
      type: 'numeric',
      question: "Un radiateur électrique de résistance R = 50 Ω est traversé par un courant d'intensité I = 4 A. Quelle tension (en Volts) l'alimente ?",
      correctAnswer: 200,
      explanation: "Loi d'Ohm : U = R * I = 50 * 4 = 200 Volts.",
      hint: "Multiplie simplement R et I."
    },
    {
      id: 'elec-l4',
      level: 4,
      type: 'qcm',
      question: "Sujet Brevet : Une lampe de poche consomme 0.25 A sous une tension de 4 V. Quelle est sa puissance électrique (en Watts) ? (Formule : P = U × I)",
      options: ["1 W", "16 W", "1.5 W", "2 W"],
      correctAnswer: "1 W",
      explanation: "Puissance P = U * I = 4 * 0.25 = 1 Watt.",
      hint: "Formule clé : P = Tension × Intensité."
    }
  ],
  mouvement: [
    {
      id: 'mov-l1',
      level: 1,
      type: 'qcm',
      question: "Comment qualifie-t-on un mouvement dont la trajectoire est une ligne droite et dont la vitesse augmente ?",
      options: ["Rectiligne accéléré", "Rectiligne uniforme", "Circulaire uniforme", "Curviligne ralenti"],
      correctAnswer: "Rectiligne accéléré",
      explanation: "Trajectoire en ligne droite = Rectiligne. Vitesse qui augmente = Accéléré.",
      hint: "Combine la forme de la trajectoire et l'évolution de la vitesse."
    },
    {
      id: 'mov-l2',
      level: 2,
      type: 'numeric',
      question: "Une voiture parcourt une distance d = 150 km en un temps t = 2 heures. Quelle est sa vitesse moyenne (en km/h) ?",
      correctAnswer: 75,
      explanation: "Calcul de la vitesse : v = d / t = 150 / 2 = 75 km/h.",
      hint: "Vitesse = Distance / Temps."
    },
    {
      id: 'mov-l3',
      level: 3,
      type: 'numeric',
      question: "Convertis une vitesse de 20 m/s en km/h.",
      correctAnswer: 72,
      explanation: "Pour passer des m/s aux km/h, on multiplie par 3.6 : 20 * 3.6 = 72 km/h.",
      hint: "Astuce : multiplie la valeur par 3.6."
    },
    {
      id: 'mov-l4',
      level: 4,
      type: 'qcm',
      question: "Sujet Brevet : Un TGV roule à une vitesse de 300 km/h. Combien de temps mettra-t-il (en minutes) pour parcourir une distance d = 50 km ? (Pense à convertir le temps t = d/v)",
      options: ["10 min", "15 min", "20 min", "30 min"],
      correctAnswer: "10 min",
      explanation: "Le temps d'un trajet vaut t = d / v = 50 / 300 = 1/6 d'heure. Sachant qu'une heure comporte 60 minutes, t = 60 * (1/6) = 10 minutes.",
      hint: "Calcule la fraction d'heure, puis multiplie par 60."
    }
  ],
  forces: [
    {
      id: 'forc-l1',
      level: 1,
      type: 'vrai-faux',
      question: "Le Poids et la Masse désignent-ils exactement la même notion physique ?",
      options: ["Vrai (Oui)", "Faux (Non, Masse en kg et Poids en Newton)"],
      correctAnswer: "Faux (Non, Masse en kg et Poids en Newton)",
      explanation: "Le poids désigne une force d'attraction (en Newtons), la masse mesure la quantité de matière contenue (en kg).",
      hint: "Notre astronaute pèse moins lourd sur la Lune mais garde la même masse !"
    },
    {
      id: 'forc-l2',
      level: 2,
      type: 'numeric',
      question: "Calcule le Poids (en Newtons) sur Terre d'un colis contenant 10 kg de manuels scolaires. (Prendre g = 10 N/kg)",
      correctAnswer: 100,
      explanation: "P = m * g = 10 kg * 10 N/kg = 100 Newtons.",
      hint: "Formule d'interaction gravitationnelle : P = m × g."
    },
    {
      id: 'forc-l3',
      level: 3,
      type: 'numeric',
      question: "Un astronaute pèse 120 Newtons sur la Lune alors que sa masse est de 75 kg. Quelle est l'intensité de la pesanteur lunaire (g_lune en N/kg) ?",
      correctAnswer: 1.6,
      explanation: "P = m * g => g = P / m = 120 / 75 = 1.6 N/kg.",
      hint: "Divise le poids par la masse."
    },
    {
      id: 'forc-l4',
      level: 4,
      type: 'qcm',
      question: "Sujet Brevet : Un cycliste roule à vitesse constante en ligne droite. D'après le principe d'inertie, que peut-on dire des forces qui s'exercent sur lui ?",
      options: [
        "Les forces se compensent (leur somme est nulle)",
        "Les forces ne se compensent pas",
        "Aucune force ne s'applique",
        "La force motrice est infiniment supérieure"
      ],
      correctAnswer: "Les forces se compensent (leur somme est nulle)",
      explanation: "D'après la première loi de Newton ou principe d'inertie : si le mouvement est rectiligne et uniforme, alors les forces appliquées au système s'annulent/se compensent.",
      hint: "Le mouvement uniforme implique un équilibre parfait."
    }
  ],
  energie: [
    {
      id: 'nrg-l1',
      level: 1,
      type: 'qcm',
      question: "Dans le vide (sans frottements), pendant la chute d'une pomme, comment varie l'énergie mécanique totale de celle-ci ?",
      options: ["Elle reste constante", "Elle augmente", "Elle diminue", "Elle s'annule totalement"],
      correctAnswer: "Elle reste constante",
      explanation: "Sans frottement, la somme EP + EK = EM est rigoureusement conservée, donc constante !",
      hint: "Pense au principe fondamental de conservation."
    },
    {
      id: 'nrg-l2',
      level: 2,
      type: 'numeric',
      question: "Quelle est l'énergie potentielle (en Joules) d'une bille de 2 kg perchée sur une armoire de 2 m de haut ? (Prendre g = 10 N/kg)",
      correctAnswer: 40,
      explanation: "Ep = m * g * h = 2 kg * 10 N/kg * 2 m = 40 Joules.",
      hint: "Formule : Ep = m × g × h."
    },
    {
      id: 'nrg-l3',
      level: 3,
      type: 'numeric',
      question: "Une luge de masse m = 10 kg glisse à une vitesse v = 2 m/s. Quelle est son énergie cinétique (en Joules) ? (Formule : Ec = 0.5 × m × v²)",
      correctAnswer: 20,
      explanation: "Ec = 0.5 * m * v² = 0.5 * 10 * 2² = 5 * 4 = 20 Joules.",
      hint: "N'oublie pas d'élever la vitesse au carré (2² = 4) avant de multiplier."
    },
    {
      id: 'nrg-l4',
      level: 4,
      type: 'qcm',
      question: "Sujet Brevet : Une skieuse de 60 kg s'élance sans vitesse d'un sommet à h = 45 m. Quelle sera son énergie cinétique (en Joules) en atteignant le bas de la piste (altitude h = 0 m) en supposant les frottements négligeables ? (g = 10 N/kg)",
      options: ["27000 J", "13500 J", "45000 J", "6000 J"],
      correctAnswer: "27000 J",
      explanation: "Par conservation de l'énergie, l'énergie potentielle initiale au sommet se transforme entièrement en énergie cinétique en bas. Ep_sommet = m * g * h = 60 * 10 * 45 = 27 000 Joules. Donc Ec_bas = 27 000 Joules.",
      hint: "Le transfert d'énergie est total : Ep (sommet) = Ec (bas)."
    }
  ],
  'reactions-chimiques': [
    {
      id: 'chem-l1',
      level: 1,
      type: 'qcm',
      question: "Qui a formulé la célèbre maxime : 'Rien ne se perd, rien ne se crée, tout se transforme' ?",
      options: ["Antoine Lavoisier", "Dimitri Mendeleïev", "Isaac Newton", "Albert Einstein"],
      correctAnswer: "Antoine Lavoisier",
      explanation: "Lavoisier est le père de la chimie moderne et de l'affirmation de la conservation des atomes.",
      hint: "Chimiste français du XVIIIème siècle."
    },
    {
      id: 'chem-l2',
      level: 2,
      type: 'vrai-faux',
      question: "Lors d'une réaction chimique, le nombre d'atomes de chaque élément reste-t-il rigoureusement le même à gauche (réactifs) et à droite (produits) ?",
      options: ["Vrai (Oui)", "Faux (Non)"],
      correctAnswer: "Vrai (Oui)",
      explanation: "C'est la règle d'or : conservation stricte des éléments et de la masse.",
      hint: "Réfère-toi à notre balance de la simulation."
    },
    {
      id: 'chem-l3',
      level: 3,
      type: 'numeric',
      question: "Dans l'équation de la synthèse de l'eau : x H₂ + O₂ -> 2 H₂O. Quel coefficient 'x' permet d'équilibrer parfaitement cette réaction ?",
      correctAnswer: 2,
      explanation: "À droite, on a 2 molécules d'H₂O soit 4 Atomes d'Hydrogène. Pour équilibrer à gauche, il faut donc placer x = 2 molécules d'H₂.",
      hint: "Il faut 4 hydrogènes de chaque côté."
    },
    {
      id: 'chem-l4',
      level: 4,
      type: 'qcm',
      question: "Sujet Brevet : Soit l'équation non équilibrée de combustion du butane : 2 C₄H₁₀ + 13 O₂  → x CO₂ + 10 H₂O. Quel doit être le coefficient 'x' devant CO₂ pour conserver les atomes de carbone ?",
      options: ["8", "4", "10", "13"],
      correctAnswer: "8",
      explanation: "À gauche, on a 2 molécules de C₄H₁₀ soit 2 × 4 = 8 atomes de carbone. Pour conserver les atomes au cours de la réaction, il faut donc fabriquer x = 8 molécules de CO₂.",
      hint: "Multiplie l'indice du butane par son coefficient."
    }
  ]
};

export default function ExerciseManager({ chapterId, onPointsGained }: ExerciseManagerProps) {
  const [currentLevel, setCurrentLevel] = useState<ExerciseLevel>(1);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1); // Step workflow

  // User input answers
  const [selectedOption, setSelectedOption] = useState('');
  const [numericAnswer, setNumericAnswer] = useState('');
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Time tracker for gamified motivations
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes quiz-level timers
  const [streakCount, setStreakCount] = useState(0);

  // Load exercises according to selected chapter and level
  const exercises = EXERCISES_DATABASE[chapterId] || [];
  const exercise = exercises.find((ex) => ex.level === currentLevel);

  useEffect(() => {
    // Reset answers when changing levels or chapters
    setSelectedOption('');
    setNumericAnswer('');
    setHasChecked(false);
    setIsCorrect(false);
    setStep(1); // restart step workflow
    setTimeRemaining(120);
  }, [chapterId, currentLevel]);

  // Handle timer
  useEffect(() => {
    let timer: number;
    if (step === 4 && !hasChecked && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, hasChecked, timeRemaining]);

  const handleVerify = () => {
    if (!exercise) return;
    setHasChecked(true);

    let check = false;
    if (exercise.type === 'qcm' || exercise.type === 'vrai-faux') {
      check = selectedOption === exercise.correctAnswer;
    } else if (exercise.type === 'numeric') {
      const uVal = parseFloat(numericAnswer.trim());
      const cVal = parseFloat(exercise.correctAnswer.toString());
      check = !isNaN(uVal) && Math.abs(uVal - cVal) < 0.15; // tolerance
    }

    setIsCorrect(check);
    setStep(5); // Go to step 5 (Vérifier)

    // Calculate points gained
    // Base 50 pts, extra 10 pts if solved under 60 seconds!
    const pointsGained = check ? (timeRemaining > 60 ? 55 : 45) : 10;
    onPointsGained(pointsGained, check, currentLevel);
  };

  const handleNextLevel = () => {
    if (currentLevel < 4) {
      setCurrentLevel((prev) => (prev + 1) as ExerciseLevel);
    } else {
      // Reached limit
      alert('Félicitations ! Tu as complété tous les niveaux de ce chapitre. Champion du Brevet ! 🏆');
    }
  };

  const handleRetry = () => {
    setSelectedOption('');
    setNumericAnswer('');
    setHasChecked(false);
    setIsCorrect(false);
    setStep(4);
    setTimeRemaining(120);
  };

  if (!exercise) {
    return (
      <div className="p-6 text-center bg-white dark:bg-slate-950 rounded-2xl border">
        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">Pas d'exercices disponibles pour ce chapitre.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Level Header Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-950 p-5 rounded-[24px] border border-slate-205 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-indigo-650 block dark:text-indigo-400" />
          <div className="space-y-0.5">
            <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">Progression d'Exercices</h4>
            <p className="text-[10px] text-slate-500 font-sans font-medium">Réponds correctement pour élever ton rang de maîtrise !</p>
          </div>
        </div>
 
        {/* Levels selection tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl gap-1 border border-slate-200 dark:border-slate-800/80">
          {([1, 2, 3, 4] as ExerciseLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setCurrentLevel(lvl)}
              className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                currentLevel === lvl
                  ? lvl === 1
                    ? 'bg-blue-600 text-white shadow-xs'
                    : lvl === 2
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : lvl === 3
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-red-650 text-white shadow-xs'
                  : 'text-slate-505 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {lvl === 1 && 'Niveau 1 : Découverte'}
              {lvl === 2 && 'Niveau 2 : Application'}
              {lvl === 3 && 'Niveau 3 : Approf.'}
              {lvl === 4 && 'Niveau 4 : Brevet 🏆'}
            </button>
          ))}
        </div>
      </div>

      {/* STEPPER STEP-BY-STEP WORKFLOW METHOD BAR */}
      <div className="grid grid-cols-5 gap-1 items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Step 1 */}
        <button
          onClick={() => setStep(1)}
          disabled={hasChecked}
          className={`flex-1 text-center py-2 px-1 rounded-xl text-[9px] md:text-[10px] font-bold transition-all relative ${
            step === 1 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-200/50'
          }`}
        >
          1. COMPRENDRE
        </button>
        {/* Step 2 */}
        <button
          onClick={() => setStep(2)}
          disabled={hasChecked}
          className={`flex-1 text-center py-2 px-1 rounded-xl text-[9px] md:text-[10px] font-bold transition-all relative ${
            step === 2 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-200/50'
          }`}
        >
          2. OBSERVER
        </button>
        {/* Step 3 */}
        <button
          onClick={() => setStep(3)}
          disabled={hasChecked}
          className={`flex-1 text-center py-2 px-1 rounded-xl text-[9px] md:text-[10px] font-bold transition-all relative ${
            step === 3 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-200/50'
          }`}
        >
          3. MANIPULER
        </button>
        {/* Step 4 */}
        <button
          onClick={() => setStep(4)}
          disabled={hasChecked}
          className={`flex-1 text-center py-2 px-1 rounded-xl text-[9px] md:text-[10px] font-bold transition-all relative ${
            step === 4 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-200/50'
          }`}
        >
          4. REPONDRE
        </button>
        {/* Step 5 */}
        <button
          disabled
          className={`flex-1 text-center py-2 px-1 rounded-xl text-[9px] md:text-[10px] font-bold transition-all ${
            step === 5 ? 'bg-emerald-600 text-white shadow' : 'text-slate-400'
          }`}
        >
          5. VERIFIER
        </button>
      </div>

      {/* STEP CONTENT SWITCHBOARD MODULES */}
      <div className="bg-white dark:bg-slate-950 rounded-[32px] p-6 md:p-8 border border-slate-205 dark:border-slate-800 shadow-sm min-h-[220px] flex flex-col justify-between">
        {/* STEP 1: COMPRENDRE */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex gap-2 items-center text-indigo-600 dark:text-indigo-400">
              <Zap className="w-5 h-5 text-amber-500 animate-bounce" />
              <h5 className="text-sm font-bold uppercase tracking-wider font-sans">Étape 1 : Assimile la notion</h5>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Chaque règle repose sur une observation logique. Avant de répondre, assure-toi d'avoir lu la <strong>Mémofiche</strong> ou la <strong>Formulaire de révision</strong> située sur les panneaux complémentaires de notre plateforme, ou d'expérimenter la physique avec l'animation.
            </p>
            <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-indigo-750 dark:text-indigo-400 block mb-1">Clé du succès :</strong>
              Consacre une minute à tester le simulateur dynamique en haut de la page. C'est en manipulant qu'on comprend l'équilibre des forces ou les variations trigonométriques !
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
              >
                Passer à l'étape suivante <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OBSERVER */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex gap-2 items-center text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <h5 className="text-sm font-bold uppercase tracking-wider font-sans">Étape 2 : Observe l'Animation</h5>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Regarde comment les objets bougent, comment les grandeurs changent de couleur de concert d'un élément à l'autre. La tension alternative fait s'illuminer la lampe, la résultante de la force de gravité change l'inclinaison.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded text-[11px] font-mono text-slate-500">
              💡 Indice visuel pour ce chapitre : <span className="text-indigo-500 font-bold">{exercise.hint}</span>
            </div>
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-medium text-slate-400 hover:text-slate-600"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
              >
                Prêt à manipuler <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MANIPULER */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex gap-2 items-center text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-5 h-5 text-emerald-500" />
              <h5 className="text-sm font-bold uppercase tracking-wider font-sans">Étape 3 : Fais tes réglages</h5>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Déplace les curseurs, glisse les points directeurs, observe les aires des carrés s'étirer ou l'intensitée en Ampères changer d'intensité. C'est l'expérimentation concrète d'une équation qui valide l'apprentissage !
            </p>
            <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
              <span>Génial ! Tu as manipulé l'animation. Tu es maintenant prêt à répondre au défi ci-dessous.</span>
            </div>
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-medium text-slate-400 hover:text-slate-600"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-indigo-100"
              >
                Défier la question <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REPONDRE (THE ACTIVE CHALLENGE INTERACTION) */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">
                Défi Actif : Niveau {currentLevel}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-orange-600">
                <Clock className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                <span>Chronomètre : {timeRemaining}s</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold leading-relaxed text-slate-800 dark:text-slate-100 font-sans">
                {exercise.question}
              </p>

              {/* INPUT TYPE 1: QCM or Vrai/Faux options */}
              {(exercise.type === 'qcm' || exercise.type === 'vrai-faux') && exercise.options && (
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {exercise.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                        selectedOption === opt
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* INPUT TYPE 2: Numeric value input */}
              {exercise.type === 'numeric' && (
                <div className="pt-2">
                  <div className="max-w-[200px] relative">
                    <input
                      type="number"
                      placeholder="Ta réponse"
                      value={numericAnswer}
                      onChange={(e) => setNumericAnswer(e.target.value)}
                      className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-bold font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Arrondis à 1 chiffre après la virgule si nécessaire (ex: 2.5).
                  </span>
                </div>
              )}
            </div>

            {/* Hint toggler */}
            <div className="text-[10.5px] leading-relaxed text-slate-500 flex gap-1 items-start">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span><strong>Astuce :</strong> {exercise.hint}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-900">
              <button
                onClick={() => setStep(3)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Vérifier l'animation
              </button>
              <button
                onClick={handleVerify}
                disabled={
                  (exercise.type === 'numeric' && !numericAnswer.trim()) ||
                  ((exercise.type === 'qcm' || exercise.type === 'vrai-faux') && !selectedOption)
                }
                className="px-5 py-2 text-xs font-bold leading-none bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg shadow-sm font-sans transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Vérifier ma réponse
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: VERIFIER (SHOW SMART EXPLANATION & MOTIVATIONAL HIGHLIGHTS) */}
        {step === 5 && (
          <div className="space-y-4 animate-scaleUp">
            {/* Success Card layout */}
            {isCorrect ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-800 dark:text-emerald-400 space-y-2 relative">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-550 animate-bounce" />
                  <span className="font-sans text-sm font-extrabold uppercase tracking-wide">Excellent Travail ! Réponse Correcte.</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Tu as parfaitement modélisé le problème ! Tu as gagné <strong className="font-mono text-emerald-600">+{timeRemaining > 60 ? '55' : '45'} points</strong> d'expérience d'affilée.
                </p>
                {/* Micro decorations */}
                <span className="absolute top-2 right-2 text-xl font-bold animate-pulse text-yellow-405">🌟</span>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-rose-800 dark:text-rose-450 space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-rose-500 animate-pulse" />
                  <span className="font-sans text-sm font-bold uppercase tracking-wide">Oups ! Ce n'est pas tout à fait ça.</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Pas d'inquiétude ! Chaque erreur est une opportunité d'apprendre. Tu gagnes tout de même <strong className="font-mono text-indigo-500">+10 points</strong> pour l'effort d'entraînement !
                </p>
              </div>
            )}

            {/* Smart Intelligent Step-By-Step Solution Correction */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl space-y-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                <Award className="w-4 h-4 text-yellow-500" /> Resolution progressive étape par étape :
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                {exercise.explanation}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-900">
              {/* Reset to re-train */}
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-lg transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Réessayer la question
              </button>

              {/* Progress to next levels keys */}
              {currentLevel < 4 ? (
                <button
                  onClick={handleNextLevel}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all font-sans"
                >
                  Niveau Suivant <ArrowRight className="w-4 h-4 font-bold" />
                </button>
              ) : (
                <div className="text-xs font-bold text-center text-violet-650 bg-violet-100 dark:bg-violet-950 dark:text-violet-400 px-3 py-1.5 rounded-full flex gap-1 items-center">
                  🏆 Tu as complété l'exercice final de niveau Brevet !
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
