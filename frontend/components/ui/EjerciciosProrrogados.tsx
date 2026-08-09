'use client';

import { useState, useEffect } from 'react';

// Último PGE aprobado por las Cortes: ejercicio 2023 — Ley 31/2022, de 23 de diciembre.
// Los ejercicios posteriores se rigen por prórroga automática (art. 134.4 CE).
export const ULTIMO_EJERCICIO_APROBADO = 2023;

function calcEjercicios() {
  return Math.max(0, new Date().getFullYear() - ULTIMO_EJERCICIO_APROBADO);
}

export default function EjerciciosProrrogados({ style }: { style?: React.CSSProperties }) {
  const [n, setN] = useState(calcEjercicios);

  useEffect(() => {
    const id = setInterval(() => setN(calcEjercicios()), 60_000 * 60 * 24);
    return () => clearInterval(id);
  }, []);

  return <span style={style}>{n}</span>;
}
