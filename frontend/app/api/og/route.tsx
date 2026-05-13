import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') ?? 'GastoPublico.es';
  const sub = searchParams.get('sub') ?? 'Transparencia del Gasto Público Español';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: '#0a0a0d',
          padding: '64px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid pattern background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(239,77,104,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(239,77,104,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          display: 'flex',
        }} />

        {/* Red accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 4, background: '#ef4d68', display: 'flex',
        }} />

        {/* Site badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
        }}>
          <div style={{
            width: 40, height: 40, background: '#ef4d68', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 900, color: '#fff',
          }}>G</div>
          <span style={{
            fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>GastoPublico.es · datos oficiales del Estado</span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: title.length > 45 ? 52 : 64,
          fontWeight: 800, color: '#ededeb',
          lineHeight: 1.08, marginBottom: 20,
          maxWidth: 960,
          letterSpacing: '-0.02em',
          display: 'flex',
        }}>
          {title}
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 24, color: 'rgba(255,255,255,0.5)',
          fontWeight: 400, lineHeight: 1.4,
          display: 'flex',
        }}>
          {sub}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
