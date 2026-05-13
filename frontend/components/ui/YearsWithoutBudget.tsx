'use client';

import { useState, useEffect } from 'react';

// Ley 6/2018 de Presupuestos Generales del Estado — BOE 4 de julio 2018
const ULTIMO_PGE = new Date('2018-07-03T00:00:00');

function calcYears() {
  const ms = Date.now() - ULTIMO_PGE.getTime();
  return Math.floor(ms / (365.25 * 24 * 3600 * 1000));
}

export default function YearsWithoutBudget({ style }: { style?: React.CSSProperties }) {
  const [years, setYears] = useState(calcYears);

  useEffect(() => {
    const id = setInterval(() => setYears(calcYears()), 60_000 * 60 * 24);
    return () => clearInterval(id);
  }, []);

  return <span style={style}>{years}</span>;
}
