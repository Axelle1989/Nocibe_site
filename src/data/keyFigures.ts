export interface KeyFigure {
  id: string;
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  description: string;
}

export const KEY_FIGURES: KeyFigure[] = [
  {
    id: 'capacite',
    value: 2.1,
    decimals: 1,
    suffix: ' M',
    label: 'Tonnes / an',
    description: 'Capacité de production annuelle de ciments certifiés EN 197-1.',
  },
  {
    id: 'investissements',
    value: 100,
    decimals: 0,
    suffix: ' Md',
    label: 'FCFA investis',
    description: 'Premier complexe cimentier 100% intégré à Massé (Plateau).',
  },
  {
    id: 'emplois',
    value: 500,
    decimals: 0,
    suffix: '+',
    label: 'Emplois créés',
    description: 'Ingénieurs, techniciens et logisticiens engagés au Bénin.',
  },
  {
    id: 'annees',
    value: 13,
    decimals: 0,
    suffix: ' ans',
    label: 'D\'ancrage national',
    description: 'Depuis 2013, au cœur des grands chantiers d\'infrastructures.',
  },
];

