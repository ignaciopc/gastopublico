'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

export default function ShareButton({ text, size = 'md' }: ShareButtonProps) {
  const handleShare = () => {
    const url = window.location.href;
    const full = `${text}\n\n${url}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(full)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
  };

  const pad = size === 'sm' ? '5px 10px' : '7px 14px';
  const fs = size === 'sm' ? 11 : 12;

  return (
    <button
      onClick={handleShare}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: pad, fontSize: fs, fontWeight: 700,
        border: '1px solid var(--card-border)', borderRadius: 4,
        background: 'transparent', color: 'var(--muted)',
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'color 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--foreground)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--card-border)';
      }}
    >
      <Share2 size={size === 'sm' ? 12 : 13} />
      Compartir
    </button>
  );
}
