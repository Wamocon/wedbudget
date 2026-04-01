# Supabase Setup

Dieses Verzeichnis folgt dem Standard aus dem Template-Repository.

## Regeln

- Alle Schema-Aenderungen laufen ueber SQL-Migrationen in `supabase/migrations`.
- Keine lokal gepflegten Testdaten-Dateien im Projekt (JSON/SQL-Dumps ausserhalb von Migrationen).
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` und `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` pflegen.

## Hinweis zu mehreren Schemas

Wenn ein eigenes Schema wie `app` genutzt wird, muss es in Supabase API als `Exposed schema` freigeschaltet werden und passende Rechte erhalten.
