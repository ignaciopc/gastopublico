-- Migration: create alert_subscriptions table
-- Run this in Supabase SQL Editor or via supabase db push

CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT        NOT NULL,
  tipos           TEXT[]      NOT NULL DEFAULT ARRAY['contratos_grandes'],
  umbral_importe  NUMERIC     NOT NULL DEFAULT 1000000,
  activa          BOOLEAN     NOT NULL DEFAULT TRUE,
  token           TEXT        NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT alert_subscriptions_email_key UNIQUE (email)
);

-- Indexes
CREATE INDEX IF NOT EXISTS alert_subscriptions_email_idx  ON alert_subscriptions(email);
CREATE INDEX IF NOT EXISTS alert_subscriptions_activa_idx ON alert_subscriptions(activa);
CREATE INDEX IF NOT EXISTS alert_subscriptions_token_idx  ON alert_subscriptions(token);

-- RLS
ALTER TABLE alert_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_select" ON alert_subscriptions FOR SELECT USING (true);
CREATE POLICY "allow_insert" ON alert_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update" ON alert_subscriptions FOR UPDATE USING (true);
