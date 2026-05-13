import { XMLParser } from 'fast-xml-parser';
import { CONTRATACION_ATOM_FEED } from '@/lib/constants';
import type { Contract } from '@/lib/types';

// PLACE Atom feed uses CODICE 2.x namespace prefixes:
//   cac-place-ext: → ContractFolderStatus, LocatedContractingParty
//   cbc-place-ext: → ContractFolderStatusCode
//   cac:           → Party, PartyName, ProcurementProject, BudgetAmount
//   cbc:           → Name, TypeCode, TaxExclusiveAmount, EstimatedOverallContractAmount

type NumOrObj = number | { '#text': number; '@_currencyID'?: string };
type StrOrObj = string | { '#text': string; [key: string]: unknown };

interface AtomEntry {
  id: string;
  title: StrOrObj;
  updated: string;
  summary?: StrOrObj;
  link?: { '@_href': string } | Array<{ '@_href': string }>;
  'cac-place-ext:ContractFolderStatus'?: {
    'cbc-place-ext:ContractFolderStatusCode'?: StrOrObj;
    'cac-place-ext:LocatedContractingParty'?: {
      'cac:Party'?: {
        'cac:PartyName'?: { 'cbc:Name'?: string };
      };
    };
    'cac:ProcurementProject'?: {
      'cbc:Name'?: string;
      'cbc:TypeCode'?: StrOrObj;
      'cac:BudgetAmount'?: {
        'cbc:TaxExclusiveAmount'?: NumOrObj;
        'cbc:EstimatedOverallContractAmount'?: NumOrObj;
        'cbc:TotalAmount'?: NumOrObj;
      };
    };
  };
}

function resolveStr(v: StrOrObj | undefined): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return String(v['#text'] ?? '');
}

function resolveNum(v: NumOrObj | undefined): number {
  if (!v) return 0;
  if (typeof v === 'number') return v;
  return Number(v['#text'] ?? 0);
}

function resolveLink(l: AtomEntry['link']): string {
  if (!l) return '#';
  if (Array.isArray(l)) return l[0]?.['@_href'] || '#';
  return l['@_href'] || '#';
}

function inferType(codeRaw: string | undefined): Contract['tipo'] {
  const code = (codeRaw || '').toLowerCase();
  if (code === '1' || code.includes('obra')) return 'obras';
  if (code === '2' || code.includes('servi')) return 'servicios';
  if (code === '3' || code.includes('sumi')) return 'suministros';
  return 'otro';
}

function inferEstado(statusCode: string | undefined): Contract['estado'] {
  const s = (statusCode || '').toUpperCase();
  if (s === 'PUB' || s === 'PUBL' || s.includes('LICIT') || s.includes('PLAZO')) return 'en_licitacion';
  if (s === 'ADJ' || s.includes('ADJUD')) return 'adjudicado';
  if (s === 'RES' || s.includes('RESOL') || s.includes('CERR')) return 'resuelto';
  if (s === 'ANU' || s.includes('ANUL')) return 'anulado';
  return 'en_licitacion';
}

// Parse "Órgano de Contratación: X; Importe: Y EUR; Estado: Z" from summary
function parseSummary(summary: string): { organo: string; importe: number; estado: string } {
  const organo = summary.match(/[Óó]rgano de Contrataci[oó]n:\s*([^;]+)/)?.[1]?.trim() ?? '';
  const importeStr = summary.match(/Importe:\s*([\d.,]+)/)?.[1] ?? '';
  const estado = summary.match(/Estado:\s*([^;]+)/)?.[1]?.trim() ?? '';
  const importe = importeStr
    ? parseFloat(importeStr.replace(/\./g, '').replace(',', '.'))
    : 0;
  return { organo, importe, estado };
}

/**
 * Fetches and parses the latest contracts from the PLACE Atom feed.
 * Returns up to `limit` contracts. Throws on network or parse error.
 */
export async function fetchPlaceContratos(limit = 50): Promise<Contract[]> {
  const res = await fetch(CONTRATACION_ATOM_FEED, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/atom+xml, application/xml;q=0.9, */*;q=0.8',
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) throw new Error(`PLACE feed HTTP ${res.status}`);

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const parsed = parser.parse(xml);

  const entries: AtomEntry[] = parsed?.feed?.entry || [];

  return entries.slice(0, limit).map((entry, i) => {
    const status = entry['cac-place-ext:ContractFolderStatus'];
    const project = status?.['cac:ProcurementProject'];
    const budget = project?.['cac:BudgetAmount'];
    const party = status?.['cac-place-ext:LocatedContractingParty']?.['cac:Party'];

    // Importe: prefer tax-exclusive, then estimated, then total
    let importe = resolveNum(budget?.['cbc:TaxExclusiveAmount'])
      || resolveNum(budget?.['cbc:EstimatedOverallContractAmount'])
      || resolveNum(budget?.['cbc:TotalAmount']);

    // OrganoContratante from XML
    let organoContratante = party?.['cac:PartyName']?.['cbc:Name'] || '';

    // StatusCode
    const statusCode = resolveStr(status?.['cbc-place-ext:ContractFolderStatusCode']);

    // TypeCode
    const typeCode = resolveStr(project?.['cbc:TypeCode']);

    // Fallback: parse summary text for missing fields
    const summaryText = resolveStr(entry.summary);
    if (summaryText && (!organoContratante || !importe)) {
      const parsed = parseSummary(summaryText);
      if (!organoContratante) organoContratante = parsed.organo;
      if (!importe) importe = parsed.importe;
    }

    return {
      id: entry.id || String(i),
      titulo: resolveStr(project?.['cbc:Name'] ? { '#text': project['cbc:Name'] } : entry.title) || resolveStr(entry.title) || 'Sin título',
      organoContratante: organoContratante || 'No especificado',
      tipo: inferType(typeCode),
      importe,
      estado: inferEstado(statusCode),
      fechaPublicacion: entry.updated || new Date().toISOString(),
      enlace: resolveLink(entry.link),
    } satisfies Contract;
  });
}
