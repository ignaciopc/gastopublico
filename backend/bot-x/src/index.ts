import { TwitterApi } from 'twitter-api-v2';
import { config } from './config';
import { supabase, ContratoRow, SubvencionRow } from './supabase';
import { tweetContrato, tweetSubvencion } from './formatter';

const twitter = new TwitterApi({
  appKey: config.x.apiKey,
  appSecret: config.x.apiSecret,
  accessToken: config.x.accessToken,
  accessSecret: config.x.accessTokenSecret,
});

async function postTweet(text: string): Promise<void> {
  if (config.dryRun) {
    console.log('[DRY RUN] Tweet:\n' + text + '\n---');
    return;
  }
  await twitter.v2.tweet(text);
}

async function processContratos(): Promise<number> {
  const { data, error } = await supabase
    .from('contratos')
    .select('*')
    .gte('importe', config.umbrales.contrato)
    .is('tweeted_at', null)
    .order('fecha_publicacion', { ascending: false })
    .limit(5);

  if (error) { console.error('Error contratos:', error.message); return 0; }
  if (!data?.length) return 0;

  let count = 0;
  for (const row of data as ContratoRow[]) {
    try {
      const text = tweetContrato(row);
      await postTweet(text);

      if (!config.dryRun) {
        await supabase
          .from('contratos')
          .update({ tweeted_at: new Date().toISOString() })
          .eq('id', row.id);
      }

      count++;
      // Espera entre tweets para no saturar la API
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(`Error publicando contrato ${row.id}:`, e);
    }
  }
  return count;
}

async function processSubvenciones(): Promise<number> {
  const { data, error } = await supabase
    .from('subvenciones')
    .select('*')
    .gte('importe', config.umbrales.subvencion)
    .is('tweeted_at', null)
    .order('fecha_concesion', { ascending: false })
    .limit(3);

  if (error) { console.error('Error subvenciones:', error.message); return 0; }
  if (!data?.length) return 0;

  let count = 0;
  for (const row of data as SubvencionRow[]) {
    try {
      const text = tweetSubvencion(row);
      await postTweet(text);

      if (!config.dryRun) {
        await supabase
          .from('subvenciones')
          .update({ tweeted_at: new Date().toISOString() })
          .eq('id', row.id);
      }

      count++;
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(`Error publicando subvención ${row.id}:`, e);
    }
  }
  return count;
}

async function main() {
  console.log(`[bot-x] Iniciando ${config.dryRun ? '(DRY RUN)' : ''}...`);

  const contratos = await processContratos();
  const subvenciones = await processSubvenciones();

  console.log(`[bot-x] Publicados: ${contratos} contratos, ${subvenciones} subvenciones`);
}

main().catch(err => {
  console.error('[bot-x] Error fatal:', err);
  process.exit(1);
});
