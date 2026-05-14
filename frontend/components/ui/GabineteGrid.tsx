'use client';

import { useState } from 'react';

type Partido = 'PSOE' | 'Sumar' | 'PP' | 'Vox' | 'Independiente';
type Rol = 'gobierno' | 'oposicion' | 'ccaa';

export type Politico = {
  nombre: string;
  cargo: string;
  partido: Partido;
  salario: number;
  rol: Rol;
};

export const POLITICOS: Politico[] = [
  // ── GOBIERNO · PSOE ────────────────────────────────────────────────────
  { nombre: 'Pedro Sánchez',          cargo: 'Presidente del Gobierno',              partido: 'PSOE', salario: 96_179, rol: 'gobierno' },
  { nombre: 'María J. Montero',       cargo: '1ª Vicepresidenta · Hacienda',         partido: 'PSOE', salario: 83_394, rol: 'gobierno' },
  { nombre: 'Félix Bolaños',          cargo: 'Presidencia · Justicia · Cortes',      partido: 'PSOE', salario: 79_380, rol: 'gobierno' },
  { nombre: 'José M. Albares',        cargo: 'Asuntos Exteriores · UE',              partido: 'PSOE', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Margarita Robles',       cargo: 'Defensa',                              partido: 'PSOE', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Fernando G.-Marlaska',   cargo: 'Interior',                             partido: 'PSOE', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Óscar Puente',           cargo: 'Transportes · Movilidad',              partido: 'PSOE', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Pilar Alegría',          cargo: 'Educación · FP · Portavoz',            partido: 'PSOE', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Diana Morant',           cargo: 'Ciencia · Innovación · Universidades', partido: 'PSOE', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Luis Planas',            cargo: 'Agricultura · Pesca',                  partido: 'PSOE', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Elma Saiz',              cargo: 'Inclusión · Seguridad Social',         partido: 'PSOE', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Isabel Rodríguez',       cargo: 'Vivienda · Agenda Urbana',             partido: 'PSOE', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Ana Redondo',            cargo: 'Igualdad',                             partido: 'PSOE', salario: 79_380, rol: 'gobierno' },
  // ── GOBIERNO · SUMAR ───────────────────────────────────────────────────
  { nombre: 'Yolanda Díaz',           cargo: '2ª Vicepresidenta · Trabajo',          partido: 'Sumar', salario: 83_394, rol: 'gobierno' },
  { nombre: 'Mónica García',          cargo: 'Sanidad',                              partido: 'Sumar', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Pablo Bustinduy',        cargo: 'Derechos Sociales · Consumo',          partido: 'Sumar', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Ángeles Moreno',         cargo: 'Cultura y Deporte',                    partido: 'Sumar', salario: 79_380, rol: 'gobierno' },
  // ── GOBIERNO · INDEPENDIENTE ────────────────────────────────────────────
  { nombre: 'José Luis Escrivá',      cargo: 'Transformación Digital · Función Pública', partido: 'Independiente', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Jordi Hereu',            cargo: 'Industria · Turismo',                  partido: 'Independiente', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Carlos Cuerpo',          cargo: 'Economía · Comercio · Empresa',        partido: 'Independiente', salario: 79_380, rol: 'gobierno' },
  { nombre: 'Sara Aagesen',           cargo: 'Transición Ecológica · Reto Demográfico', partido: 'Independiente', salario: 79_380, rol: 'gobierno' },
  // ── OPOSICIÓN · PP ─────────────────────────────────────────────────────
  { nombre: 'Alberto N. Feijóo',      cargo: 'Presidente PP · Jefe oposición',        partido: 'PP', salario: 85_000, rol: 'oposicion' },
  { nombre: 'Cuca Gamarra',           cargo: 'Secretaria General PP · Portavoz Congreso', partido: 'PP', salario: 44_500, rol: 'oposicion' },
  { nombre: 'Isabel Díaz Ayuso',      cargo: 'Presidenta Comunidad de Madrid',        partido: 'PP', salario: 78_122, rol: 'ccaa' },
  { nombre: 'Juanma Moreno',          cargo: 'Presidente Junta de Andalucía',         partido: 'PP', salario: 76_500, rol: 'ccaa' },
  { nombre: 'Alfonso Rueda',          cargo: 'Presidente Xunta de Galicia',           partido: 'PP', salario: 72_000, rol: 'ccaa' },
  { nombre: 'Carlos Mazón',           cargo: 'President Generalitat Valenciana',      partido: 'PP', salario: 72_000, rol: 'ccaa' },
  // ── OPOSICIÓN · VOX ────────────────────────────────────────────────────
  { nombre: 'Santiago Abascal',       cargo: 'Presidente de Vox',                    partido: 'Vox', salario: 85_000, rol: 'oposicion' },
  { nombre: 'Pepa Millán',            cargo: 'Portavoz Vox en el Congreso',           partido: 'Vox', salario: 44_500, rol: 'oposicion' },
];

const PARTIDO_CFG: Record<Partido, { color: string; bg: string; border: string; label: string }> = {
  PSOE:          { color: '#d91c2b', bg: 'rgba(217,28,43,0.1)',   border: 'rgba(217,28,43,0.35)',   label: 'PSOE' },
  Sumar:         { color: '#8b1db6', bg: 'rgba(139,29,182,0.1)', border: 'rgba(139,29,182,0.35)', label: 'Sumar' },
  PP:            { color: '#003d8a', bg: 'rgba(0,61,138,0.1)',    border: 'rgba(0,61,138,0.35)',    label: 'PP' },
  Vox:           { color: '#5aac14', bg: 'rgba(90,172,20,0.1)',   border: 'rgba(90,172,20,0.35)',   label: 'Vox' },
  Independiente: { color: '#555',    bg: 'rgba(85,85,85,0.1)',    border: 'rgba(85,85,85,0.3)',     label: 'Independiente' },
};

const TODOS_LOS_PARTIDOS = ['PSOE', 'Sumar', 'PP', 'Vox', 'Independiente'] as const;

function iniciales(nombre: string): string {
  return nombre.split(' ').filter(w => w.length > 1 && !['de','del','la','el','y'].includes(w.toLowerCase())).slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function avatarFallback(p: Politico): string {
  const cfg = PARTIDO_CFG[p.partido];
  const bg = cfg.color.replace('#', '');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(iniciales(p.nombre))}&background=${bg}&color=fff&size=200&bold=true&font-size=0.45`;
}

interface Props {
  fotos: Record<string, string>;
}

export default function GabineteGrid({ fotos }: Props) {
  const [filtroPartido, setFiltroPartido] = useState<Partido | 'Todos'>('Todos');
  const [filtroRol, setFiltroRol] = useState<Rol | 'todos'>('todos');

  const partidosCount = POLITICOS.reduce<Record<string, number>>((acc, p) => {
    acc[p.partido] = (acc[p.partido] ?? 0) + 1;
    return acc;
  }, {});

  const visibles = POLITICOS.filter(p => {
    const okPartido = filtroPartido === 'Todos' || p.partido === filtroPartido;
    const okRol = filtroRol === 'todos' || p.rol === filtroRol;
    return okPartido && okRol;
  });

  return (
    <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Gobierno de España · Sánchez III · BOE 2024</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Ministros, vicepresidentes y líderes de oposición
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: 0 }}>
              {visibles.length} cargos · Salarios brutos anuales según BOE
            </p>
          </div>
        </div>

        {/* Filtros partido */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <button
            onClick={() => setFiltroPartido('Todos')}
            style={{
              padding: '6px 14px', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: filtroPartido === 'Todos' ? '1px solid var(--foreground)' : '1px solid var(--card-border)',
              background: filtroPartido === 'Todos' ? 'var(--foreground)' : 'var(--card)',
              color: filtroPartido === 'Todos' ? 'var(--background)' : 'var(--muted-strong)',
            }}
          >
            Todos ({POLITICOS.length})
          </button>
          {TODOS_LOS_PARTIDOS.map(p => {
            const cfg = PARTIDO_CFG[p];
            const active = filtroPartido === p;
            return (
              <button
                key={p}
                onClick={() => setFiltroPartido(active ? 'Todos' : p)}
                style={{
                  padding: '6px 14px', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${active ? cfg.color : cfg.border}`,
                  background: active ? cfg.color : cfg.bg,
                  color: active ? '#fff' : cfg.color,
                }}
              >
                {cfg.label} ({partidosCount[p] ?? 0})
              </button>
            );
          })}
        </div>

        {/* Filtros rol */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
          {([['todos', 'Todos los roles'], ['gobierno', 'Gobierno'], ['oposicion', 'Oposición'], ['ccaa', 'Presidentes CCAA']] as [string, string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFiltroRol(val as Rol | 'todos')}
              style={{
                padding: '4px 12px', borderRadius: 3, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                border: '1px solid var(--card-border)',
                background: filtroRol === val ? 'var(--accent)' : 'transparent',
                color: filtroRol === val ? '#fff' : 'var(--muted-strong)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid de cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: 12 }}>
          {visibles.map(p => {
            const cfg = PARTIDO_CFG[p.partido];
            const fotoSrc = fotos[p.nombre] ?? avatarFallback(p);
            return (
              <div
                key={p.nombre}
                style={{
                  background: 'var(--card)', border: '1px solid var(--card-border)',
                  borderRadius: 6, padding: '20px 16px 16px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = cfg.color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; }}
              >
                {/* Foto */}
                <div style={{ position: 'relative', width: 88, height: 88, flexShrink: 0 }}>
                  <img
                    src={fotoSrc}
                    alt={p.nombre}
                    width={88}
                    height={88}
                    style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: `2.5px solid ${cfg.color}`, display: 'block' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).src = avatarFallback(p); }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 1, right: 1,
                    width: 22, height: 22, borderRadius: '50%',
                    background: cfg.color, border: '2px solid var(--card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 7.5, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em',
                  }}>
                    {cfg.label.slice(0, 4).toUpperCase()}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, width: '100%' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.25, marginBottom: 5 }}>{p.nombre}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.35, marginBottom: 8 }}>{p.cargo}</div>
                  <span style={{
                    display: 'inline-block', fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
                    textTransform: 'uppercase', padding: '2px 7px', borderRadius: 2,
                    border: `1px solid ${cfg.border}`, color: cfg.color, background: cfg.bg,
                  }}>
                    {cfg.label}
                  </span>
                </div>

                {/* Salario */}
                <div style={{ width: '100%', paddingTop: 10, borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Salario bruto</span>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', color: 'var(--bad)' }}>
                    {p.salario.toLocaleString('es-ES')} €
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {visibles.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            No hay cargos con ese filtro.
          </div>
        )}

        <p style={{ fontSize: 12, color: 'var(--muted)', margin: '20px 0 0', lineHeight: 1.5 }}>
          Composición del Gobierno Sánchez III (desde noviembre 2023). Salarios según BOE — Real Decreto 451/2012 actualizado.
          Salarios de líderes de oposición estimados incluyendo asignaciones de grupo parlamentario.
          Fotos: Wikipedia Commons · CC BY-SA. Fuente: Portal de Transparencia · BOE · Congreso de los Diputados.
        </p>
      </div>
    </section>
  );
}
