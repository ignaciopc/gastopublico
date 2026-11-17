-- Las rutas /api/alertas/* usan SUPABASE_SECRET_KEY (bypassa RLS), así que el rol
-- anónimo no necesita ningún acceso. Con las políticas anteriores, cualquiera con la
-- clave publicable (que va en el bundle del navegador) podía leer todos los emails y
-- tokens de baja, y modificar cualquier suscripción.
DROP POLICY IF EXISTS "allow_select" ON public.alert_subscriptions;
DROP POLICY IF EXISTS "allow_insert" ON public.alert_subscriptions;
DROP POLICY IF EXISTS "allow_update" ON public.alert_subscriptions;
-- RLS sigue activo y sin políticas: deny-all para anon/authenticated.

-- Aplicado en producción el 2026-11-17 vía MCP (ver commit).
ALTER VIEW public.budget_summary_by_seccion SET (security_invoker = true);
