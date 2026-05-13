'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Menu, X, ChevronDown } from 'lucide-react';
import NavSearch from '@/components/ui/NavSearch';

type NavItem = { href: string; label: string };
type NavGroup = { label: string; items: NavItem[] };
type NavEntry = NavItem | NavGroup;

function isGroup(e: NavEntry): e is NavGroup {
  return 'items' in e;
}

const NAV: NavEntry[] = [
  { href: '/impuestometro', label: 'Impuestómetro' },
  {
    label: 'Gasto público',
    items: [
      { href: '/presupuesto', label: 'Presupuesto' },
      { href: '/contratos', label: 'Contratos' },
      { href: '/subvenciones', label: 'Subvenciones' },
      { href: '/deuda', label: 'Deuda pública' },
    ],
  },
  {
    label: 'España hoy',
    items: [
      { href: '/vivienda', label: 'Vivienda' },
      { href: '/paro', label: 'Paro' },
      { href: '/pensiones', label: 'Pensiones' },
      { href: '/sanidad', label: 'Sanidad' },
      { href: '/educacion', label: 'Educación' },
      { href: '/seguridad', label: 'Seguridad' },
    ],
  },
  { href: '/gobierno', label: 'Gobierno' },
  {
    label: 'Datos',
    items: [
      { href: '/datasets', label: 'Datasets' },
      { href: '/alertas', label: 'Alertas' },
    ],
  },
];

// All flat links for mobile
const ALL_LINKS: NavItem[] = NAV.flatMap(e => (isGroup(e) ? e.items : [e]));

// Groups for mobile section headers
const MOBILE_GROUPS: { label: string | null; items: NavItem[] }[] = NAV.map(e =>
  isGroup(e) ? { label: e.label, items: e.items } : { label: null, items: [e] }
);

function DropdownGroup({ entry, pathname }: { entry: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = entry.items.some(i => pathname.startsWith(i.href));

  const onEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const onLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div style={{ position: 'relative' }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        color: active ? 'var(--foreground)' : 'var(--muted-strong)',
        border: active ? '1px solid var(--foreground)' : '1px solid transparent',
        padding: '3px 10px',
        borderRadius: 3,
        fontWeight: active ? 700 : 500,
        fontSize: 13.5,
        background: 'transparent',
        cursor: 'pointer',
        transition: 'color 0.15s, border-color 0.15s',
      }}>
        {entry.label}
        <ChevronDown size={12} style={{ opacity: 0.6, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          marginTop: 6,
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          minWidth: 172,
          zIndex: 100,
          padding: '4px 0',
        }}>
          {entry.items.map(item => {
            const itemActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'block',
                padding: '8px 14px',
                fontSize: 13.5,
                fontWeight: itemActive ? 700 : 400,
                color: itemActive ? 'var(--accent)' : 'var(--foreground)',
                textDecoration: 'none',
                background: itemActive ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--accent) 10%, transparent)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = itemActive ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent'; }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'color-mix(in srgb, var(--background) 88%, transparent)',
      backdropFilter: 'saturate(140%) blur(10px)',
      WebkitBackdropFilter: 'saturate(140%) blur(10px)',
      borderBottom: '1px solid var(--rule)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 60, gap: 20 }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, background: 'var(--accent)', color: '#fff',
            fontWeight: 800, fontSize: 16, fontFamily: 'var(--font-mono), ui-monospace, monospace',
            borderRadius: 2,
          }}>G</span>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.01em' }}>
            GastoPúblico<span style={{ color: 'var(--muted)' }}>.es</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex" style={{ gap: 4, marginLeft: 8, alignItems: 'center' }}>
          {NAV.map(entry => {
            if (isGroup(entry)) {
              return <DropdownGroup key={entry.label} entry={entry} pathname={pathname} />;
            }
            const active = pathname.startsWith(entry.href);
            return (
              <Link key={entry.href} href={entry.href} style={{
                color: active ? 'var(--foreground)' : 'var(--muted-strong)',
                border: active ? '1px solid var(--foreground)' : '1px solid transparent',
                padding: '3px 10px',
                borderRadius: 3,
                fontWeight: active ? 700 : 500,
                fontSize: 13.5,
                textDecoration: 'none',
                transition: 'color 0.15s, border-color 0.15s',
              }}>
                {entry.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Global search */}
        <NavSearch />

        {/* EN DIRECTO badge */}
        <span className="tag tag-live mono hidden sm:inline-flex" style={{ fontSize: 10 }}>EN DIRECTO</span>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Cambiar tema"
          style={{
            width: 34, height: 34, border: '1px solid var(--card-border)',
            background: 'transparent', color: 'var(--foreground)',
            borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 15, flexShrink: 0,
          }}>
          {theme === 'dark' ? '☀' : '☾'}
        </button>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden"
          onClick={() => setOpen(!open)}
          style={{ padding: 6, background: 'transparent', border: 'none', color: 'var(--foreground)', cursor: 'pointer', flexShrink: 0 }}
          aria-label="Menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col md:hidden" style={{
          borderTop: '1px solid var(--rule)',
          background: 'var(--background)',
          padding: '8px 24px 20px',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          {MOBILE_GROUPS.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                  color: 'var(--muted)', textTransform: 'uppercase',
                  padding: '14px 0 6px',
                  borderTop: gi > 0 ? '1px solid var(--rule)' : 'none',
                }}>
                  {group.label}
                </div>
              )}
              {group.items.map(l => {
                const active = pathname.startsWith(l.href);
                return (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
                    display: 'block',
                    padding: group.label ? '7px 8px' : '10px 0',
                    borderBottom: group.label ? 'none' : '1px solid var(--rule)',
                    fontSize: group.label ? 14 : 15,
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--accent)' : 'var(--foreground)',
                    textDecoration: 'none',
                    borderRadius: group.label ? 4 : 0,
                    background: active && group.label ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                  }}>
                    {l.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
