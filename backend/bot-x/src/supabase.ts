import { createClient } from '@supabase/supabase-js';
import { config } from './config';

export const supabase = createClient(config.supabase.url, config.supabase.secretKey);

export type ContratoRow = {
  id: string;
  titulo: string;
  organo_contratante: string;
  tipo: string;
  importe: number;
  estado: string;
  fecha_publicacion: string;
  adjudicatario: string | null;
  enlace: string;
  tweeted_at: string | null;
};

export type SubvencionRow = {
  id: string;
  beneficiario: string;
  convocante: string;
  importe: number;
  descripcion: string;
  fecha_concesion: string;
  enlace: string | null;
  tweeted_at: string | null;
};
