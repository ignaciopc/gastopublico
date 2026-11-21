import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// Client-side: uses publishable key (safe to expose)
export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Server-side: uses secret key for writes (never exposed to browser)
export function getServerSupabase() {
  if (!supabaseSecretKey) {
    throw new Error('SUPABASE_SECRET_KEY is not set');
  }
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: { persistSession: false },
  });
}

// DB row types matching the Supabase schema
export interface ContratoRow {
  id: string;
  titulo: string;
  organo_contratante: string;
  tipo: 'obras' | 'servicios' | 'suministros' | 'otro';
  importe: number;
  estado: 'en_licitacion' | 'adjudicado' | 'resuelto' | 'anulado';
  fecha_publicacion: string;
  fecha_adjudicacion?: string | null;
  adjudicatario?: string | null;
  enlace: string;
  synced_at?: string;
}

export interface AlertSubscriptionRow {
  id?: string;
  email: string;
  tipos: string[];
  umbral_importe: number;
  activa: boolean;
  token?: string;
  created_at?: string;
  updated_at?: string;
}
