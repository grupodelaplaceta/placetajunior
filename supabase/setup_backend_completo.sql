-- Placeta Junior: esquema completo de Centros + Education.
-- Ejecutar una vez en Supabase > SQL Editor con un usuario administrador.
-- anon/authenticated no acceden directamente; el backend usa SUPABASE_SECRET_KEY.

begin;

create table if not exists public."PJ27_solicitudes" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null,
  nombre_centro text not null,
  tipo_centro text not null check (tipo_centro in ('infantil', 'primaria', 'infantil_primaria', 'secundaria', 'otro', 'docente')),
  ciudad text not null,
  codigo_centro_oficial text,
  responsable_nombre text not null,
  responsable_cargo text not null,
  telefono text not null,
  email_contacto text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'rechazada')),
  motivo_rechazo text,
  creada_en timestamptz not null default now(),
  revisada_en timestamptz,
  revisada_por text
);

create table if not exists public."PJ27_aceptaciones_documentos" (
  id uuid primary key default gen_random_uuid(),
  solicitud_id uuid not null references public."PJ27_solicitudes"(id) on delete cascade,
  user_id uuid not null,
  documento text not null check (documento in ('condiciones', 'privacidad')),
  version text not null,
  aceptada_en timestamptz not null default now(),
  unique (solicitud_id, documento)
);

create table if not exists public."PJ27_organizaciones" (
  id uuid primary key default gen_random_uuid(),
  solicitud_id uuid not null unique references public."PJ27_solicitudes"(id),
  nombre text not null,
  codigo_centro text not null unique,
  estado text not null default 'activo' check (estado in ('activo', 'suspendido', 'cerrado')),
  creada_en timestamptz not null default now()
);

create table if not exists public."PJ27_miembros" (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public."PJ27_organizaciones"(id) on delete cascade,
  user_id uuid not null,
  email text not null,
  rol text not null default 'administrador',
  creado_en timestamptz not null default now(),
  unique (org_id, user_id)
);

create table if not exists public."PJ27_rsp_usuarios" (
  email text primary key check (email = lower(email)),
  creado_en timestamptz not null default now()
);

create table if not exists public."PJ27_auditoria" (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  accion text not null,
  detalle jsonb not null default '{}'::jsonb,
  creada_en timestamptz not null default now()
);

create index if not exists "PJ27_solicitudes_user_creada_idx"
  on public."PJ27_solicitudes" (user_id, creada_en desc);
create index if not exists "PJ27_solicitudes_estado_creada_idx"
  on public."PJ27_solicitudes" (estado, creada_en asc);
create index if not exists "PJ27_miembros_user_idx"
  on public."PJ27_miembros" (user_id);
create index if not exists "PJ27_miembros_org_idx"
  on public."PJ27_miembros" (org_id);

-- Estado de Education: un documento JSON versionado como espera lib/educacion/estado.js.
create table if not exists public."PJ27_estado" (
  id text primary key,
  datos jsonb not null,
  version integer not null default 1 check (version > 0),
  actualizado_en timestamptz not null default now()
);

alter table public."PJ27_solicitudes" enable row level security;
alter table public."PJ27_aceptaciones_documentos" enable row level security;
alter table public."PJ27_organizaciones" enable row level security;
alter table public."PJ27_miembros" enable row level security;
alter table public."PJ27_rsp_usuarios" enable row level security;
alter table public."PJ27_auditoria" enable row level security;
alter table public."PJ27_estado" enable row level security;

revoke all on table
  public."PJ27_solicitudes",
  public."PJ27_aceptaciones_documentos",
  public."PJ27_organizaciones",
  public."PJ27_miembros",
  public."PJ27_rsp_usuarios",
  public."PJ27_auditoria",
  public."PJ27_estado"
from anon, authenticated;

grant all on table
  public."PJ27_solicitudes",
  public."PJ27_aceptaciones_documentos",
  public."PJ27_organizaciones",
  public."PJ27_miembros",
  public."PJ27_rsp_usuarios",
  public."PJ27_auditoria",
  public."PJ27_estado"
to service_role;

create or replace function public."PJ27_aprobar_solicitud"(
  p_solicitud uuid,
  p_revisor text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  v_solicitud public."PJ27_solicitudes"%rowtype;
  v_organizacion_id uuid;
  v_codigo text;
  v_caracteres constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_intento integer;
  v_indice integer;
begin
  if not exists (
    select 1 from public."PJ27_rsp_usuarios" r
    where r.email = lower(trim(p_revisor))
  ) then
    raise exception 'no_autorizado' using errcode = '42501';
  end if;

  select s.* into v_solicitud
  from public."PJ27_solicitudes" s
  where s.id = p_solicitud
  for update;

  if not found then
    raise exception 'solicitud_no_encontrada' using errcode = 'P0001';
  end if;
  if v_solicitud.estado <> 'pendiente' then
    raise exception 'solicitud_no_pendiente' using errcode = 'P0001';
  end if;
  if not exists (
    select 1 from public."PJ27_aceptaciones_documentos" a
    where a.solicitud_id = p_solicitud and a.user_id = v_solicitud.user_id
      and a.documento = 'condiciones' and a.version = '2026-06-01'
  ) or not exists (
    select 1 from public."PJ27_aceptaciones_documentos" a
    where a.solicitud_id = p_solicitud and a.user_id = v_solicitud.user_id
      and a.documento = 'privacidad' and a.version = '2026-06-01'
  ) then
    raise exception 'aceptaciones_incompletas' using errcode = 'P0001';
  end if;

  for v_intento in 1..100 loop
    v_codigo := 'PJ-';
    for v_indice in 1..8 loop
      v_codigo := v_codigo || substr(v_caracteres, floor(random() * length(v_caracteres))::integer + 1, 1);
      if v_indice = 4 then
        v_codigo := v_codigo || '-';
      end if;
    end loop;
    exit when not exists (
      select 1 from public."PJ27_organizaciones" o where o.codigo_centro = v_codigo
    );
    v_codigo := null;
  end loop;

  if v_codigo is null then
    raise exception 'no_se_pudo_generar_codigo' using errcode = 'P0001';
  end if;

  insert into public."PJ27_organizaciones" (solicitud_id, nombre, codigo_centro)
  values (p_solicitud, v_solicitud.nombre_centro, v_codigo)
  returning id into v_organizacion_id;

  insert into public."PJ27_miembros" (org_id, user_id, email, rol)
  values (v_organizacion_id, v_solicitud.user_id, v_solicitud.email, 'administrador');

  update public."PJ27_solicitudes"
  set estado = 'aprobada', revisada_en = now(), revisada_por = lower(trim(p_revisor))
  where id = p_solicitud;

  return jsonb_build_object('organizacion_id', v_organizacion_id, 'codigo_centro', v_codigo);
end;
$function$;

revoke all on function public."PJ27_aprobar_solicitud"(uuid, text) from public, anon, authenticated;
grant execute on function public."PJ27_aprobar_solicitud"(uuid, text) to service_role;

-- Sustituye el correo de ejemplo por la cuenta revisora autorizada y ejecuta la línea:
-- insert into public."PJ27_rsp_usuarios" (email) values ('persona@laplaceta.org') on conflict do nothing;

commit;