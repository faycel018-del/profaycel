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


-- -----------------------------------------------------
-- 5. SUIVI : CODE D'ACCÈS, PRÉSENCES, PAIEMENTS
-- -----------------------------------------------------

alter table public.eleves add column if not exists code_acces text unique;
alter table public.eleves add column if not exists date_debut date;
alter table public.eleves add column if not exists seances_anterieures int not null default 0;
alter table public.eleves add column if not exists tarif_mensuel numeric not null default 100;
alter table public.parents add column if not exists lien_parente text;

-- Code lisible, sans caractères ambigus (0/O, 1/I/L)
create or replace function prive.generer_code()
returns text
language plpgsql
set search_path = ''
as $$
declare
    alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    code text;
begin
    loop
        code := 'PF-';
        for i in 1..6 loop
            code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
        end loop;
        exit when not exists (select 1 from public.eleves where code_acces = code);
    end loop;
    return code;
end;
$$;

create or replace function prive.eleve_code_defaut()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if new.code_acces is null or new.code_acces = '' then
        new.code_acces := prive.generer_code();
    end if;
    return new;
end;
$$;

create trigger eleves_code_defaut
    before insert on public.eleves
    for each row execute function prive.eleve_code_defaut();

create table if not exists public.presences (
    id          bigint generated always as identity primary key,
    seance_id   bigint not null references public.seances (id) on delete cascade,
    eleve_id    bigint not null references public.eleves (id) on delete cascade,
    present     boolean not null default true,
    created_at  timestamptz not null default now(),
    unique (seance_id, eleve_id)
);

-- Une mensualité = 4 séances
create table if not exists public.paiements (
    id             bigint generated always as identity primary key,
    eleve_id       bigint not null references public.eleves (id) on delete cascade,
    date_paiement  date not null default current_date,
    montant        numeric not null default 100,
    note           text,
    created_at     timestamptz not null default now()
);

alter table public.presences enable row level security;
alter table public.paiements enable row level security;

create policy admin_tout on public.presences for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
create policy admin_tout on public.paiements for all to authenticated
    using (public.is_admin()) with check (public.is_admin());

create policy presences_eleve_parent on public.presences
    for select to authenticated
    using (
        eleve_id in (
            select id from public.eleves
            where user_id = auth.uid()
               or parent_id in (select id from public.parents where user_id = auth.uid())
        )
    );

create policy paiements_eleve_parent on public.paiements
    for select to authenticated
    using (
        eleve_id in (
            select id from public.eleves
            where user_id = auth.uid()
               or parent_id in (select id from public.parents where user_id = auth.uid())
        )
    );

-- Lier son compte (parent ou élève) à une fiche élève avec le code reçu par WhatsApp
create or replace function public.utiliser_code(code text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
    uid uuid := auth.uid();
    role_utilisateur text := coalesce(auth.jwt() -> 'user_metadata' ->> 'role', 'eleve');
    nom_utilisateur text := coalesce(auth.jwt() -> 'user_metadata' ->> 'nom',
                                     auth.jwt() -> 'user_metadata' ->> 'full_name',
                                     auth.jwt() ->> 'email');
    e public.eleves%rowtype;
    p_id bigint;
    ancien_parent public.parents%rowtype;
begin
    if uid is null then
        raise exception 'Non connecté';
    end if;

    select * into e from public.eleves
        where code_acces = upper(trim(code));

    if not found then
        raise exception 'Code invalide';
    end if;

    if role_utilisateur = 'parent' then

        select id into p_id from public.parents where user_id = uid limit 1;

        if e.parent_id is not null then
            select * into ancien_parent from public.parents where id = e.parent_id;

            if ancien_parent.user_id is not null and ancien_parent.user_id <> uid then
                raise exception 'Cet élève est déjà lié à un autre compte parent';
            end if;

            -- La fiche parent créée par l'enseignant devient celle de ce compte
            if p_id is null and ancien_parent.user_id is null then
                update public.parents set user_id = uid where id = ancien_parent.id;
                p_id := ancien_parent.id;
            end if;
        end if;

        if p_id is null then
            insert into public.parents (nom, prenom, user_id)
                values ('', coalesce(nom_utilisateur, 'Parent'), uid)
                returning id into p_id;
        end if;

        update public.eleves set parent_id = p_id where id = e.id;

    else

        if e.user_id is not null and e.user_id <> uid then
            raise exception 'Ce code est déjà utilisé par un autre compte élève';
        end if;

        -- La fiche « à distance » créée automatiquement pour ce compte est archivée
        update public.eleves
            set user_id = null, statut = 'archive'
            where user_id = uid and id <> e.id;

        update public.eleves set user_id = uid where id = e.id;

    end if;

    return json_build_object('prenom', e.prenom, 'nom', e.nom, 'classe', e.classe);
end;
$$;

revoke execute on function public.utiliser_code(text) from anon, public;
grant execute on function public.utiliser_code(text) to authenticated;


-- -----------------------------------------------------
-- 6. PRÉSENTIEL / À DISTANCE
-- -----------------------------------------------------

alter table public.eleves add column if not exists mode text not null default 'distance'
    check (mode in ('presentiel', 'distance'));

-- Un compte « élève » créé en ligne reçoit automatiquement sa fiche « à distance »
-- (à la création, ou quand le rôle est choisi après une connexion Google)
create or replace function prive.creer_fiche_distance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if coalesce(new.raw_user_meta_data ->> 'role', '') = 'eleve'
       and not exists (select 1 from public.eleves where user_id = new.id) then

        insert into public.eleves (nom, prenom, email, user_id, mode, statut, classe)
        values (
            '',
            coalesce(
                nullif(new.raw_user_meta_data ->> 'nom', ''),
                nullif(new.raw_user_meta_data ->> 'full_name', ''),
                nullif(new.raw_user_meta_data ->> 'name', ''),
                split_part(new.email, '@', 1)
            ),
            new.email,
            new.id,
            'distance',
            'actif',
            nullif(new.raw_user_meta_data ->> 'niveau', '')
        );

    end if;

    return new;
end;
$$;

create trigger on_auth_user_zz_fiche_distance
    after insert or update of raw_user_meta_data on auth.users
    for each row execute function prive.creer_fiche_distance();


-- Un élève à distance sans niveau le choisit une seule fois depuis son espace
create or replace function public.choisir_niveau(niveau text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
    uid uuid := auth.uid();
    n int;
begin
    if uid is null then
        raise exception 'Non connecté';
    end if;

    if niveau not in ('7 أساسي', '8 أساسي', '9 أساسي', '1 ثانوي', '2 ثانوي', '3 ثانوي', 'باكالوريا') then
        raise exception 'Niveau inconnu';
    end if;

    update public.eleves
        set classe = niveau
        where user_id = uid and mode = 'distance' and coalesce(classe, '') = '';

    get diagnostics n = row_count;

    if n = 0 then
        raise exception 'Niveau déjà choisi : demandez au professeur pour le changer';
    end if;

    return json_build_object('classe', niveau);
end;
$$;

revoke execute on function public.choisir_niveau(text) from anon, public;
grant execute on function public.choisir_niveau(text) to authenticated;
