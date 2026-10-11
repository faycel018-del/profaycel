-- =====================================================
-- PROFAYCEL — Base de données complète
-- À exécuter UNE SEULE FOIS dans un nouveau projet Supabase :
-- Dashboard → SQL Editor → New query → coller tout → Run
-- =====================================================


-- -----------------------------------------------------
-- 1. ADMIN
-- L'admin est reconnu par son email (vérifié par Supabase),
-- pas par user_metadata que chaque utilisateur peut modifier.
-- -----------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
    select lower(coalesce(auth.jwt() ->> 'email', '')) = 'faycel.khlifiii@gmail.com';
$$;


-- -----------------------------------------------------
-- 2. TABLES
-- -----------------------------------------------------

create table if not exists public.classes (
    id          bigint generated always as identity primary key,
    nom         text not null,
    niveau      text,
    groupe      text,
    enseignant  text,
    statut      text default 'active',
    created_at  timestamptz not null default now()
);

create table if not exists public.parents (
    id          bigint generated always as identity primary key,
    user_id     uuid references auth.users (id) on delete set null,
    nom         text not null,
    prenom      text not null,
    email       text,
    telephone   text,
    statut      text default 'actif',
    created_at  timestamptz not null default now()
);

create table if not exists public.eleves (
    id          bigint generated always as identity primary key,
    user_id     uuid references auth.users (id) on delete set null,
    parent_id   bigint references public.parents (id) on delete set null,
    nom         text not null,
    prenom      text not null,
    email       text,
    telephone   text,
    classe      text,
    statut      text default 'actif',
    created_at  timestamptz not null default now()
);

create table if not exists public.cours (
    id          bigint generated always as identity primary key,
    titre       text not null,
    matiere     text,
    niveau      text,
    classe      text,
    trimestre   int,
    categorie   text,
    numero      int,
    statut      text default 'publie',
    created_at  timestamptz not null default now()
);

create table if not exists public.devoirs (
    id           bigint generated always as identity primary key,
    titre        text not null,
    matiere      text,
    classe       text,
    date_limite  date,
    statut       text,
    created_at   timestamptz not null default now()
);

create table if not exists public.seances (
    id           bigint generated always as identity primary key,
    matiere      text not null,
    classe       text,
    date_seance  date,
    heure_debut  time,
    heure_fin    time,
    salle        text,
    lien_visio   text,
    statut       text default 'prévue',
    created_at   timestamptz not null default now()
);

create table if not exists public.resultats (
    id               bigint generated always as identity primary key,
    eleve_id         bigint references public.eleves (id) on delete cascade,
    matiere          text,
    evaluation       text,
    note             numeric,
    bareme           numeric default 20,
    date_evaluation  date,
    created_at       timestamptz not null default now()
);

create table if not exists public.documents (
    id            bigint generated always as identity primary key,
    nom           text not null,
    type_fichier  text,
    niveau        text,
    lien          text,
    classe        text,
    statut        text,
    created_at    timestamptz not null default now()
);

create table if not exists public.annonces (
    id              bigint generated always as identity primary key,
    titre           text not null,
    type_annonce    text,
    destinataires   text,
    statut          text,
    created_at      timestamptz not null default now()
);


-- -----------------------------------------------------
-- 3. LIAISON AUTOMATIQUE COMPTE ↔ FICHE
-- Quand un élève ou un parent crée son compte avec le même
-- email que sa fiche, la fiche est liée automatiquement
-- (et inversement quand l'admin crée la fiche après).
-- Les fonctions sont dans le schéma "prive", non exposé par l'API.
-- -----------------------------------------------------

create schema if not exists prive;

create or replace function prive.lier_compte_nouvel_utilisateur()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.eleves  set user_id = new.id
        where user_id is null and lower(email) = lower(new.email);
    update public.parents set user_id = new.id
        where user_id is null and lower(email) = lower(new.email);
    return new;
end;
$$;

drop trigger if exists on_auth_user_created_lier on auth.users;
create trigger on_auth_user_created_lier
    after insert on auth.users
    for each row execute function prive.lier_compte_nouvel_utilisateur();

create or replace function prive.lier_fiche_compte_existant()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
    if new.user_id is null and new.email is not null and new.email <> '' then
        select id into new.user_id
            from auth.users
            where lower(email) = lower(new.email)
            limit 1;
    end if;
    return new;
end;
$$;

drop trigger if exists eleves_lier_compte on public.eleves;
create trigger eleves_lier_compte
    before insert or update of email on public.eleves
    for each row execute function prive.lier_fiche_compte_existant();

drop trigger if exists parents_lier_compte on public.parents;
create trigger parents_lier_compte
    before insert or update of email on public.parents
    for each row execute function prive.lier_fiche_compte_existant();


-- -----------------------------------------------------
-- 4. SÉCURITÉ (Row Level Security)
-- -----------------------------------------------------

alter table public.classes   enable row level security;
alter table public.parents   enable row level security;
alter table public.eleves    enable row level security;
alter table public.cours     enable row level security;
alter table public.devoirs   enable row level security;
alter table public.seances   enable row level security;
alter table public.resultats enable row level security;
alter table public.documents enable row level security;
alter table public.annonces  enable row level security;

-- L'admin peut tout faire sur toutes les tables
do $$
declare
    t text;
begin
    foreach t in array array['classes','parents','eleves','cours','devoirs',
                             'seances','resultats','documents','annonces']
    loop
        execute format('drop policy if exists admin_tout on public.%I', t);
        execute format(
            'create policy admin_tout on public.%I for all to authenticated
             using (public.is_admin()) with check (public.is_admin())', t);
    end loop;
end $$;

-- Contenu pédagogique : lisible par tous les utilisateurs connectés
do $$
declare
    t text;
begin
    foreach t in array array['classes','cours','devoirs','seances','documents','annonces']
    loop
        execute format('drop policy if exists lecture_connectes on public.%I', t);
        execute format(
            'create policy lecture_connectes on public.%I for select to authenticated
             using (true)', t);
    end loop;
end $$;

-- Un parent voit sa propre fiche
drop policy if exists parent_sa_fiche on public.parents;
create policy parent_sa_fiche on public.parents
    for select to authenticated
    using (user_id = auth.uid());

-- Un élève voit sa fiche ; un parent voit la fiche de ses enfants
drop policy if exists eleve_sa_fiche on public.eleves;
create policy eleve_sa_fiche on public.eleves
    for select to authenticated
    using (
        user_id = auth.uid()
        or parent_id in (select id from public.parents where user_id = auth.uid())
    );

-- Résultats : l'élève voit les siens, le parent ceux de ses enfants
drop policy if exists resultats_eleve_parent on public.resultats;
create policy resultats_eleve_parent on public.resultats
    for select to authenticated
    using (
        eleve_id in (
            select id from public.eleves
            where user_id = auth.uid()
               or parent_id in (select id from public.parents where user_id = auth.uid())
        )
    );
