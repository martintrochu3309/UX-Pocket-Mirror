// THE POCKET MIRROR · pm-emails: sends the reminder emails through Resend.
//
//   POST { mode: 'welcome' }    every 15 minutes (pg_cron): the Welcome to people who just gave their email
//   POST { mode: 'reminders' }  once a day (pg_cron): the reminder each person is due (rules: pocket.emails_due)
//   POST { mode: 'test', to }   all 6 emails to one test address (pocket.email_settings.test_emails)
//   POST ?unsubscribe=<key>     the one-click "Unsubscribe" button in Gmail / Apple Mail
//
// The first three need the header x-pm-secret (the Vault secret pm_emails_secret; the database checks it).
// While pocket.email_settings.live is false, only the test addresses can get anything (test mode).
// Secrets: POCKET_MIRROR_REMINDERS (the Resend key). SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY come with Supabase.
// The emails themselves (text + design) are ./templates.js, a copy of emails/templates.js in the site.

import './templates.js';
import { createClient } from 'npm:@supabase/supabase-js@2.49.4';

// deno-lint-ignore no-explicit-any
const E = (globalThis as any).PM_EMAILS;
const SITE = 'https://thepocketmirror.com';
const FN_URL = `${Deno.env.get('SUPABASE_URL')}/functions/v1/pm-emails`;
const KEY_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const db = () => createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type Row = { log_id: number; email: string; token: string | null; kind: string; mirrors: number; episodes: number; cards: number; from_address: string };

// one email, ready for Resend: the button opens the app unlocked (?k=key&em=which email), "Leave anytime" unsubscribes
function build(r: Row) {
  const e = E.EMAILS.find((x: { id: string }) => x.id === r.kind);
  const v = { mirrors: r.mirrors, episodes: r.episodes, cards: r.cards };
  const url = r.token ? `${SITE}/?k=${r.token}&em=${r.kind}${e.link.slice(1)}` : SITE + e.link;
  const leave = r.token ? `${SITE}/unsubscribe/?u=${r.token}` : `${SITE}/unsubscribe/`;
  return {
    from: r.from_address,
    to: [r.email],
    subject: E.subject(r.kind, v),
    html: E.render(r.kind, v, { url, unsubscribe: leave }),
    text: E.text(r.kind, v, { url, unsubscribe: leave }),
    headers: r.token ? { 'List-Unsubscribe': `<${FN_URL}?unsubscribe=${r.token}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } : {},
    tags: [{ name: 'kind', value: r.kind }],
  };
}

Deno.serve(async (req) => {
  const supabase = db();
  const params = new URL(req.url).searchParams;

  // one-click unsubscribe from the mail app
  const unsub = params.get('unsubscribe');
  if (unsub !== null) {
    if (req.method !== 'POST') return reply(405, { message: 'Use POST' });
    if (!KEY_RE.test(unsub)) return reply(400, { ok: false });
    const { error } = await supabase.rpc('pm_unsubscribe', { p_token: unsub });
    if (error) console.error(`[pm-emails] unsubscribe failed: ${error.message}`);
    return reply(error ? 500 : 200, { ok: !error });
  }

  if (req.method !== 'POST') return reply(405, { message: 'Use POST' });
  const { data: allowed } = await supabase.rpc('pm_email_secret_ok', { p_secret: req.headers.get('x-pm-secret') ?? '' });
  if (allowed !== true) return reply(401, { message: 'Not allowed' });

  const resendKey = Deno.env.get('POCKET_MIRROR_REMINDERS');
  if (!resendKey) { console.error('[pm-emails] missing secret POCKET_MIRROR_REMINDERS'); return reply(500, { message: 'No Resend key' }); }

  const body = await req.json().catch(() => ({}));
  const mode = String(body.mode ?? '');
  const { data, error } = mode === 'test'
    ? await supabase.rpc('pm_email_test', { p_to: String(body.to ?? '') })
    : mode === 'welcome' || mode === 'reminders'
      ? await supabase.rpc('pm_email_claim', { p_mode: mode })
      : { data: null, error: { message: 'mode must be welcome, reminders or test' } };
  if (error) { console.error(`[pm-emails] ${mode}: ${error.message}`); return reply(400, { message: error.message }); }

  const rows = (data ?? []) as Row[];
  let sent = 0, failed = 0;
  // Resend batch: up to 100 emails per call; one idempotency key per batch, so a retry can't send twice
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    let ids: (string | null)[] = [], problem: string | null = null;
    try {
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `pm-${chunk[0].log_id}-${chunk.length}` },
        body: JSON.stringify(chunk.map(build)),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok) ids = (out.data ?? []).map((d: { id?: string }) => d.id ?? null);
      else problem = `${res.status} ${out.message ?? out.name ?? 'Resend error'}`;
    } catch (err) {
      problem = (err as Error).message;
    }
    for (let j = 0; j < chunk.length; j++) {
      const err = problem ?? (ids[j] ? null : 'no id from Resend');
      await supabase.rpc('pm_email_done', { p_log_id: chunk[j].log_id, p_resend_id: ids[j] ?? null, p_error: err });
      if (err) failed++; else sent++;
    }
    if (problem) console.error(`[pm-emails] ${mode}: batch failed: ${problem}`);
    if (i + 50 < rows.length) await new Promise((r) => setTimeout(r, 600));   // Resend allows ~2 calls a second
  }
  console.log(`[pm-emails] ${mode}: ${sent} sent, ${failed} failed`);
  return reply(200, { mode, sent, failed });
});
