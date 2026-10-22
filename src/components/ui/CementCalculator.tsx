import React, { useState } from 'react';
import { Calculator, Sparkle } from '@phosphor-icons/react';
import { IconCementBag } from '../icons/IndustryIcons';

type WorkType = 'dalle' | 'fondation' | 'poteaux' | 'chape' | 'maconnerie';

interface WorkConfig {
  label: string;
  recommendedCement: string;
  dosagePerM3: number; // kg per m3
  sandRatio: number; // m3 of sand per m3 of concrete
  gravelRatio: number; // m3 of gravel per m3 of concrete
  description: string;
}

const WORK_CONFIGS: Record<WorkType, WorkConfig> = {
  dalle: {
    label: 'Dalle de compression / Plancher',
    recommendedCement: 'NOCIBÉ CPJ 45',
    dosagePerM3: 350,
    sandRatio: 0.4,
    gravelRatio: 0.8,
    description: 'Béton armé standard pour dalles et planchers d\'étage R+1/R+2.'
  },
  fondation: {
    label: 'Semelles & Fondations',
    recommendedCement: 'NOCIBÉ CPJ 45',
    dosagePerM3: 350,
    sandRatio: 0.45,
    gravelRatio: 0.85,
    description: 'Béton de semelle filante ou isolée en contact avec le sol.'
  },
  poteaux: {
    label: 'Poteaux, Poutres & Chaînages',
    recommendedCement: 'NOCIBÉ CPJ 45 / CPA 55',
    dosagePerM3: 400,
    sandRatio: 0.4,
    gravelRatio: 0.8,
    description: 'Béton de structure porteuse haute résistance au flambement.'
  },
  chape: {
    label: 'Chape de lissage & Mortier de sol',
    recommendedCement: 'NOCIBÉ CPJ 35',
    dosagePerM3: 300,
    sandRatio: 0.9,
    gravelRatio: 0,
    description: 'Mortier de pose et ragréage sans gravier.'
  },
  maconnerie: {
    label: 'Montage d\'agglos / Enduits extérieurs',
    recommendedCement: 'NOCIBÉ CPJ 35',
    dosagePerM3: 250,
    sandRatio: 0.85,
    gravelRatio: 0,
    description: 'Mortier de liaison pour parpaings pleins ou creux.'
  }
};

export const CementCalculator: React.FC = () => {
  const [workType, setWorkType] = useState<WorkType>('dalle');
  
  // Dimensions in meters
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(6);
  const [thickness, setThickness] = useState<number>(0.12); // e.g. 12 cm

  const config = WORK_CONFIGS[workType];
  const volumeM3 = Math.max(0.01, length * width * thickness);
  const totalCementKg = volumeM3 * config.dosagePerM3;
  const bagCount = Math.ceil(totalCementKg / 50);
  const sandVolume = (volumeM3 * config.sandRatio).toFixed(1);
  const gravelVolume = (volumeM3 * config.gravelRatio).toFixed(1);

  return (
    <div className="card-nocibe p-6 md:p-8 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#0B1F3A] flex items-center justify-center">
          <Calculator size={26} weight="duotone" />
        </div>
        <div>
          <span className="eyebrow text-[#0B1F3A]">Aide au Chantier</span>
          <h3 className="text-xl md:text-2xl font-bold font-playfair text-[#0B1F3A]">
            Calculateur de Béton & Ciment
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Type d'ouvrage à réaliser
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(WORK_CONFIGS) as WorkType[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setWorkType(key)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                    workType === key
                      ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white shadow'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {WORK_CONFIGS[key].label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2 italic">{config.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Longueur (m)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-[#0B1F3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Largeur (m)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-[#0B1F3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Épaisseur (m)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={thickness}
                onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-[#0B1F3A]"
              />
              <span className="text-[10px] text-slate-400">ex: 0.12 = 12cm</span>
            </div>
          </div>
        </div>

        {/* Right Results Card */}
        <div className="lg:col-span-5 bg-[#0B1F3A] text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 border-b border-white/10 pb-3">
              <span>Volume théorique estimé :</span>
              <span className="font-bold text-lg text-[#00CCFF]">{volumeM3.toFixed(2)} m³</span>
            </div>

            <div className="my-5 text-center bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xs uppercase tracking-wider text-slate-300 font-medium block">
                Quantité de Ciment Recommandée
              </span>
              <div className="text-4xl font-extrabold text-white mt-2 flex items-center justify-center gap-2">
                <IconCementBag size={36} className="text-[#00CCFF]" />
                <span>{bagCount}</span>
                <span className="text-xl font-normal text-slate-300">sacs de 50 kg</span>
              </div>
              <div className="text-xs text-[#16A34A] font-bold mt-2 flex items-center justify-center gap-1">
                <Sparkle size={14} weight="fill" />
                <span>Grade conseillé : {config.recommendedCement}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Dosage préconisé :</span>
                <span className="font-semibold text-white">{config.dosagePerM3} kg / m³</span>
              </div>
              <div className="flex justify-between">
                <span>Sable requis :</span>
                <span className="font-semibold text-white">{sandVolume} m³</span>
              </div>
              {parseFloat(gravelVolume) > 0 && (
                <div className="flex justify-between">
                  <span>Gravier concassé requis :</span>
                  <span className="font-semibold text-white">{gravelVolume} m³</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-slate-400">
            * Les ratios sont donnés à titre indicatif selon les règles professionnelles du BTP au Bénin.
          </div>
        </div>
      </div>
    </div>
  );
};

