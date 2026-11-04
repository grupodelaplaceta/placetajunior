-- Placeta Junior Education: estado del backend de educación (un documento jsonb, versión optimista).
-- Acceso solo desde el servidor (clave secreta). Los clientes no leen ni escriben directamente.

create table if not exists public."PJ27_estado" (
  id text primary key,
  datos jsonb not null,
  version integer not null default 1,
  actualizado_en timestamptz not null default now()
);

alter table public."PJ27_estado" enable row level security;
revoke all on public."PJ27_estado" from anon, authenticated;
