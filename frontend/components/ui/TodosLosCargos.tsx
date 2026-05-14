'use client';

import { useState } from 'react';

type Partido =
  | 'PSOE' | 'PP' | 'Vox' | 'Sumar' | 'Podemos'
  | 'PNV' | 'PSC' | 'Junts' | 'ERC' | 'Bildu' | 'CC'
  | 'Cs' | 'Foro' | 'Independiente' | 'NC';

type Categoria = 'sec_estado' | 'ccaa' | 'alcalde' | 'eurodiputado';

type Cargo = {
  nombre: string;
  cargo: string;
  partido: Partido;
  salario: number;
  categoria: Categoria;
  territorio?: string;
};

const PARTIDO_COLOR: Record<Partido, string> = {
  PSOE: '#d91c2b', PP: '#003d8a', Vox: '#5aac14',
  Sumar: '#8b1db6', Podemos: '#6c2fa5',
  PNV: '#178a3c', PSC: '#d91c2b', Junts: '#00aae4',
  ERC: '#f3a22f', Bildu: '#b5cf00', CC: '#f7941d',
  Cs: '#f47521', Foro: '#003d8a', NC: '#e30613',
  Independiente: '#555',
};

// ── SECRETARÍAS DE ESTADO (Sánchez III · 2024) ─────────────────────────────
const SECRETARIOS_ESTADO: Cargo[] = [
  { nombre: 'Pilar Sánchez Acera',       cargo: 'Sec. Estado de Comunicación',              partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Manuel Muñiz',              cargo: 'Sec. Estado de la España Global',           partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Diego Martínez Belío',      cargo: 'Sec. Estado de Política Exterior y UE',    partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Eva Granados Galiano',      cargo: 'Sec. Estado de Cooperación Internacional', partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Esperanza Casteleiro',      cargo: 'Sec. Estado de Defensa',                   partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Rafael Pérez Ruiz',         cargo: 'Sec. Estado de Seguridad (Interior)',       partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Jesús Gascón Catalán',      cargo: 'Sec. Estado de Hacienda',                  partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Patricia Yáñez Sánchez',    cargo: 'Sec. Estado de Presupuestos y Gastos',     partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'José A. Bonilla',           cargo: 'Sec. Estado de Función Pública',            partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Gonzalo García Andrés',     cargo: 'Sec. Estado de Economía',                  partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Xiana Méndez Bértolo',      cargo: 'Sec. Estado de Comercio',                  partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Gonzalo Serrano del Cerro', cargo: 'Sec. Estado de Industria',                 partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Rosana Morillo Pérez',      cargo: 'Sec. Estado de Turismo',                   partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Isabel Pardo de Vera',      cargo: 'Sec. Estado de Transportes',               partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'David Lucas Parrón',        cargo: 'Sec. Estado de Vivienda',                  partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Hugo Morán Fernández',      cargo: 'Sec. Estado de Medio Ambiente',            partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Joanna Czajkowski',         cargo: 'Sec. Estado de Energía',                   partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'José Manuel Bar Cendón',    cargo: 'Sec. Estado de Educación',                 partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'José Manuel Franco',        cargo: 'Sec. Estado de Deportes',                  partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'María Ángeles Heras',       cargo: 'Sec. Estado de Investigación',             partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Juan Manuel Vidal',         cargo: 'Sec. Estado de Universidades',             partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Joaquín Pérez Rey',         cargo: 'Sec. Estado de Empleo',                    partido: 'Sumar',        salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Borja Suárez Corujo',       cargo: 'Sec. Estado de Seguridad Social',          partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Pilar Cancela Rodríguez',   cargo: 'Sec. Estado de Migraciones',               partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Nacho Álvarez Peralta',     cargo: 'Sec. Estado de Derechos Sociales',         partido: 'Sumar',        salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Ángela Rodríguez Pam',      cargo: 'Sec. Estado de Igualdad',                  partido: 'Podemos',      salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Carme Artigas Brugal',      cargo: 'Sec. Estado de Digitalización e IA',       partido: 'Independiente', salario: 73_001, categoria: 'sec_estado' },
  { nombre: 'Víctor Francos Díaz',       cargo: 'Sec. Estado de Deporte',                   partido: 'PSOE',         salario: 73_001, categoria: 'sec_estado' },
];

// ── PRESIDENTES AUTONÓMICOS ──────────────────────────────────────────────────
const PRESIDENTES_CCAA: Cargo[] = [
  { nombre: 'Juanma Moreno Bonilla',      cargo: 'Presidente Junta de Andalucía',            partido: 'PP',    salario: 76_500, categoria: 'ccaa', territorio: 'Andalucía' },
  { nombre: 'Jorge Azcón Navarro',        cargo: 'Presidente Gobierno de Aragón',             partido: 'PP',    salario: 72_000, categoria: 'ccaa', territorio: 'Aragón' },
  { nombre: 'Adrián Barbón Rodríguez',    cargo: 'Presidente Principado de Asturias',         partido: 'PSOE',  salario: 72_000, categoria: 'ccaa', territorio: 'Asturias' },
  { nombre: 'Marga Prohens Font',         cargo: 'Presidenta Govern de les Illes Balears',   partido: 'PP',    salario: 70_000, categoria: 'ccaa', territorio: 'Baleares' },
  { nombre: 'Fernando Clavijo Batlle',    cargo: 'Presidente Gobierno de Canarias',           partido: 'CC',    salario: 72_000, categoria: 'ccaa', territorio: 'Canarias' },
  { nombre: 'Mª José Sáenz de Buruaga',   cargo: 'Presidenta Gobierno de Cantabria',          partido: 'PP',    salario: 70_000, categoria: 'ccaa', territorio: 'Cantabria' },
  { nombre: 'Emiliano García-Page',       cargo: 'Presidente Junta de Castilla-La Mancha',   partido: 'PSOE',  salario: 72_000, categoria: 'ccaa', territorio: 'Castilla-La Mancha' },
  { nombre: 'Alfonso Fdez. Mañueco',      cargo: 'Presidente Junta de Castilla y León',      partido: 'PP',    salario: 72_000, categoria: 'ccaa', territorio: 'Castilla y León' },
  { nombre: 'Salvador Illa Roca',         cargo: 'President de la Generalitat de Catalunya', partido: 'PSC',   salario: 87_000, categoria: 'ccaa', territorio: 'Cataluña' },
  { nombre: 'María Guardiola Sáez',       cargo: 'Presidenta Junta de Extremadura',          partido: 'PP',    salario: 70_000, categoria: 'ccaa', territorio: 'Extremadura' },
  { nombre: 'Alfonso Rueda Valenzuela',   cargo: 'Presidente Xunta de Galicia',              partido: 'PP',    salario: 72_000, categoria: 'ccaa', territorio: 'Galicia' },
  { nombre: 'Imanol Pradales',            cargo: 'Lehendakari — Gobierno Vasco',              partido: 'PNV',   salario: 80_000, categoria: 'ccaa', territorio: 'País Vasco' },
  { nombre: 'Gonzalo Capellán de Miguel', cargo: 'Presidente Gobierno de La Rioja',           partido: 'PP',    salario: 68_000, categoria: 'ccaa', territorio: 'La Rioja' },
  { nombre: 'Isabel Díaz Ayuso',          cargo: 'Presidenta Comunidad de Madrid',            partido: 'PP',    salario: 78_122, categoria: 'ccaa', territorio: 'Madrid' },
  { nombre: 'Fernando López Miras',       cargo: 'Presidente Región de Murcia',               partido: 'PP',    salario: 70_000, categoria: 'ccaa', territorio: 'Murcia' },
  { nombre: 'María Chivite Navascués',    cargo: 'Presidenta Gobierno de Navarra',            partido: 'PSOE',  salario: 72_000, categoria: 'ccaa', territorio: 'Navarra' },
  { nombre: 'Carlos Mazón Guixot',        cargo: 'President Generalitat Valenciana',          partido: 'PP',    salario: 72_000, categoria: 'ccaa', territorio: 'C. Valenciana' },
  { nombre: 'Juan Vivas Lara',            cargo: 'Presidente Ciudad Autónoma de Ceuta',       partido: 'PP',    salario: 68_000, categoria: 'ccaa', territorio: 'Ceuta' },
  { nombre: 'Juan José Imbroda Ortiz',    cargo: 'Presidente Ciudad Autónoma de Melilla',     partido: 'PP',    salario: 68_000, categoria: 'ccaa', territorio: 'Melilla' },
];

// ── ALCALDES GRANDES CIUDADES ────────────────────────────────────────────────
const ALCALDES: Cargo[] = [
  { nombre: 'J.L. Martínez-Almeida',  cargo: 'Alcalde de Madrid',          partido: 'PP',    salario: 100_032, categoria: 'alcalde', territorio: 'Madrid (3,3 M hab.)' },
  { nombre: 'Jaume Collboni',         cargo: 'Alcalde de Barcelona',       partido: 'PSC',   salario: 106_416, categoria: 'alcalde', territorio: 'Barcelona (1,6 M hab.)' },
  { nombre: 'María José Catalá',      cargo: 'Alcaldesa de Valencia',      partido: 'PP',    salario: 82_000,  categoria: 'alcalde', territorio: 'Valencia (791k hab.)' },
  { nombre: 'José Luis Sanz',         cargo: 'Alcalde de Sevilla',         partido: 'PP',    salario: 78_000,  categoria: 'alcalde', territorio: 'Sevilla (685k hab.)' },
  { nombre: 'Natalia Chueca',         cargo: 'Alcaldesa de Zaragoza',      partido: 'PP',    salario: 73_000,  categoria: 'alcalde', territorio: 'Zaragoza (675k hab.)' },
  { nombre: 'Francisco de la Torre',  cargo: 'Alcalde de Málaga',          partido: 'PP',    salario: 70_000,  categoria: 'alcalde', territorio: 'Málaga (579k hab.)' },
  { nombre: 'José Antonio Serrano',   cargo: 'Alcalde de Murcia',          partido: 'PSOE',  salario: 65_000,  categoria: 'alcalde', territorio: 'Murcia (459k hab.)' },
  { nombre: 'Carolina Darias',        cargo: 'Alcaldesa de Las Palmas de GC', partido: 'PSOE', salario: 62_000, categoria: 'alcalde', territorio: 'Las Palmas (379k hab.)' },
  { nombre: 'Jaime Martínez Llull',   cargo: 'Alcalde de Palma',           partido: 'PP',    salario: 62_000,  categoria: 'alcalde', territorio: 'Palma (416k hab.)' },
  { nombre: 'Luis Barcala Jorge',     cargo: 'Alcalde de Alicante',        partido: 'PP',    salario: 60_000,  categoria: 'alcalde', territorio: 'Alicante (334k hab.)' },
  { nombre: 'Juan Mari Aburto',       cargo: 'Alcalde de Bilbao',          partido: 'PNV',   salario: 63_000,  categoria: 'alcalde', territorio: 'Bilbao (345k hab.)' },
  { nombre: 'Abel Caballero Álvarez', cargo: 'Alcalde de Vigo',            partido: 'PSOE',  salario: 60_000,  categoria: 'alcalde', territorio: 'Vigo (295k hab.)' },
  { nombre: 'José María Bellido',     cargo: 'Alcalde de Córdoba',         partido: 'PP',    salario: 60_000,  categoria: 'alcalde', territorio: 'Córdoba (321k hab.)' },
  { nombre: 'Jesús Julio Carnero',    cargo: 'Alcalde de Valladolid',      partido: 'PP',    salario: 58_000,  categoria: 'alcalde', territorio: 'Valladolid (296k hab.)' },
  { nombre: 'Carmen Moriyón',         cargo: 'Alcaldesa de Gijón',         partido: 'Foro',  salario: 57_000,  categoria: 'alcalde', territorio: 'Gijón (264k hab.)' },
  { nombre: 'Begoña Villacís',        cargo: 'Alcaldesa de Alicante (hasta 2023)', partido: 'Cs', salario: 60_000, categoria: 'alcalde', territorio: 'Alicante' },
  { nombre: 'Eneko Goia',             cargo: 'Alcalde de San Sebastián',   partido: 'PNV',   salario: 59_000,  categoria: 'alcalde', territorio: 'Donostia (187k hab.)' },
  { nombre: 'Mikel Iparraguirre',     cargo: 'Alcaldesa de Vitoria-Gasteiz', partido: 'Bildu', salario: 58_000, categoria: 'alcalde', territorio: 'Vitoria (259k hab.)' },
];

// ── EURODIPUTADOS ESPAÑOLES (elecciones junio 2024) ─────────────────────────
const EURODIPUTADOS: Cargo[] = [
  // PP — 22 escaños
  { nombre: 'Dolors Montserrat',      cargo: 'MEP · Jefa Delegación PP', partido: 'PP', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Esteban González Pons',  cargo: 'MEP · Vicepresidente PE',  partido: 'PP', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Leopoldo López Gil',     cargo: 'MEP · PP',                 partido: 'PP', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Pilar del Castillo',     cargo: 'MEP · PP',                 partido: 'PP', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Javier Zarzalejos',      cargo: 'MEP · PP',                 partido: 'PP', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Rosa Estarás',           cargo: 'MEP · PP',                 partido: 'PP', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Otros 16 MEPs',          cargo: 'MEP · PP (16 escaños)',    partido: 'PP', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  // PSOE — 20 escaños
  { nombre: 'Iratxe García Pérez',    cargo: 'MEP · Presidenta grupo S&D', partido: 'PSOE', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Teresa Ribera',          cargo: 'MEP / Comisaria UE Competencia', partido: 'PSOE', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Juan F. López Aguilar',  cargo: 'MEP · PSOE',              partido: 'PSOE', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Nicolás González Casares', cargo: 'MEP · PSOE',            partido: 'PSOE', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Otros 16 MEPs',          cargo: 'MEP · PSOE (16 escaños)', partido: 'PSOE', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  // Vox — 6 escaños
  { nombre: 'Jorge Buxadé Villalba',  cargo: 'MEP · Jefe Delegación Vox', partido: 'Vox', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Mazaly Aguilar',         cargo: 'MEP · Vox',               partido: 'Vox', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Otros 4 MEPs',           cargo: 'MEP · Vox (4 escaños)',   partido: 'Vox', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  // Sumar — 3 escaños
  { nombre: 'Ernest Urtasun',         cargo: 'MEP · Sumar',             partido: 'Sumar', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Otros 2 MEPs',           cargo: 'MEP · Sumar (2 escaños)', partido: 'Sumar', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  // Podemos — 2 escaños
  { nombre: 'Irene Montero',          cargo: 'MEP · Podemos',           partido: 'Podemos', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'María Eugenia Rodríguez Palop', cargo: 'MEP · Podemos',   partido: 'Podemos', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  // Ahora Repúblicas — 4 escaños (ERC, Bildu, BNG, etc.)
  { nombre: 'Diana Riba',             cargo: 'MEP · ERC (Repúblicas)',  partido: 'ERC',   salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Pernando Barrena',       cargo: 'MEP · Bildu (Repúblicas)', partido: 'Bildu', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Otros 2 MEPs',           cargo: 'MEP · Repúblicas (2 escaños)', partido: 'ERC', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  // Junts — 2 escaños
  { nombre: 'Toni Comín',             cargo: 'MEP · Junts',             partido: 'Junts', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  { nombre: 'Carles Puigdemont',      cargo: 'MEP · Junts',             partido: 'Junts', salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
  // PNV — 1 escaño
  { nombre: 'Oihane Agirregoitia',    cargo: 'MEP · PNV',               partido: 'PNV',   salario: 115_000, categoria: 'eurodiputado', territorio: 'Parlamento Europeo' },
];

const TABS: { key: Categoria; label: string; datos: Cargo[] }[] = [
  { key: 'sec_estado',    label: `Secretarías de Estado (${SECRETARIOS_ESTADO.length})`,     datos: SECRETARIOS_ESTADO },
  { key: 'ccaa',          label: `Presidentes Autonómicos (${PRESIDENTES_CCAA.length})`,      datos: PRESIDENTES_CCAA },
  { key: 'alcalde',       label: `Alcaldes grandes ciudades (${ALCALDES.length})`,             datos: ALCALDES },
  { key: 'eurodiputado',  label: `Eurodiputados españoles (${EURODIPUTADOS.length})`,          datos: EURODIPUTADOS },
];

const ALL_PARTIDOS = [...new Set([
  ...SECRETARIOS_ESTADO.map(c => c.partido),
  ...PRESIDENTES_CCAA.map(c => c.partido),
  ...ALCALDES.map(c => c.partido),
  ...EURODIPUTADOS.map(c => c.partido),
])].sort();

export default function TodosLosCargos() {
  const [tab, setTab] = useState<Categoria>('ccaa');
  const [filtroPartido, setFiltroPartido] = useState<Partido | 'Todos'>('Todos');
  const [busqueda, setBusqueda] = useState('');

  const tabActual = TABS.find(t => t.key === tab)!;
  const datos = tabActual.datos.filter(c => {
    const okPartido = filtroPartido === 'Todos' || c.partido === filtroPartido;
    const okBusqueda = busqueda === '' ||
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.cargo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.territorio ?? '').toLowerCase().includes(busqueda.toLowerCase());
    return okPartido && okBusqueda;
  });

  const partidosEnTab = [...new Set(tabActual.datos.map(c => c.partido))].sort();

  return (
    <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Portal de Transparencia · BOE · 2024</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Todos los cargos públicos
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: 0 }}>
              Secretarías de Estado, presidentes autonómicos, alcaldes y eurodiputados españoles
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: 20, borderBottom: '1px solid var(--card-border)' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setFiltroPartido('Todos'); setBusqueda(''); }}
              style={{
                padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: 'none', borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
                background: 'transparent',
                color: tab === t.key ? 'var(--accent)' : 'var(--muted-strong)',
                marginBottom: -1,
                transition: 'color 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filtros partido + buscador */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar nombre o cargo..."
            style={{
              padding: '6px 12px', borderRadius: 4, fontSize: 13,
              border: '1px solid var(--card-border)', background: 'var(--background)',
              color: 'var(--foreground)', outline: 'none', minWidth: 200,
            }}
          />
          <button
            onClick={() => setFiltroPartido('Todos')}
            style={{
              padding: '6px 12px', borderRadius: 4, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              border: filtroPartido === 'Todos' ? '1px solid var(--foreground)' : '1px solid var(--card-border)',
              background: filtroPartido === 'Todos' ? 'var(--foreground)' : 'transparent',
              color: filtroPartido === 'Todos' ? 'var(--background)' : 'var(--muted-strong)',
            }}
          >
            Todos
          </button>
          {partidosEnTab.map(p => {
            const color = PARTIDO_COLOR[p] ?? '#666';
            const active = filtroPartido === p;
            return (
              <button
                key={p}
                onClick={() => setFiltroPartido(active ? 'Todos' : p as Partido)}
                style={{
                  padding: '5px 12px', borderRadius: 4, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                  border: `1px solid ${active ? color : `${color}55`}`,
                  background: active ? color : `${color}14`,
                  color: active ? '#fff' : color,
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Tabla */}
        <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--background)' }}>
                <th style={{ padding: '9px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left', borderBottom: '1px solid var(--card-border)' }}>Nombre</th>
                {tab === 'ccaa' && <th style={{ padding: '9px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left', borderBottom: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>CCAA</th>}
                {tab === 'alcalde' && <th style={{ padding: '9px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left', borderBottom: '1px solid var(--card-border)' }}>Ciudad</th>}
                <th style={{ padding: '9px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left', borderBottom: '1px solid var(--card-border)' }}>Cargo</th>
                <th style={{ padding: '9px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'center', borderBottom: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>Partido</th>
                <th style={{ padding: '9px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'right', borderBottom: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>Salario bruto/año</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((c, i) => {
                const color = PARTIDO_COLOR[c.partido] ?? '#666';
                return (
                  <tr key={`${c.nombre}-${i}`} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td style={{ padding: '10px 16px', fontSize: 13.5, fontWeight: 600, borderBottom: '1px solid var(--rule)' }}>{c.nombre}</td>
                    {tab === 'ccaa' && <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--muted-strong)', borderBottom: '1px solid var(--rule)', whiteSpace: 'nowrap' }}>{c.territorio}</td>}
                    {tab === 'alcalde' && <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--muted)', borderBottom: '1px solid var(--rule)' }}>{c.territorio}</td>}
                    <td style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--muted-strong)', borderBottom: '1px solid var(--rule)' }}>{c.cargo}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid var(--rule)' }}>
                      <span style={{
                        display: 'inline-block', fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                        textTransform: 'uppercase', padding: '2px 7px', borderRadius: 2,
                        border: `1px solid ${color}55`, color, background: `${color}14`,
                      }}>
                        {c.partido}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontWeight: 700, fontSize: 13.5, borderBottom: '1px solid var(--rule)', color: 'var(--bad)', whiteSpace: 'nowrap' }}>
                      {c.salario.toLocaleString('es-ES')} €
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {datos.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
              No hay resultados.
            </div>
          )}
        </div>

        <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: '14px 0 0', lineHeight: 1.55 }}>
          Datos 2024. Salarios brutos según BOE y presupuestos autonómicos. Los salarios de eurodiputados son el estipendio base del PE (9.000 €/mes brutos) sin contar las dietas por asistencia (~340 €/día) ni asignaciones de gastos generales (~4.520 €/mes). ·
          {' '}<a href="https://transparencia.gob.es" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Portal de Transparencia ↗</a>
        </p>
      </div>
    </section>
  );
}
