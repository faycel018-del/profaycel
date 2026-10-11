-- =====================================================
-- PROFAYCEL — Séances en ligne
-- À exécuter une seule fois dans Supabase :
-- Dashboard → SQL Editor → New query → coller → Run
-- =====================================================

-- Lien du cours en ligne (Jitsi Meet, Google Meet, Zoom...)
alter table public.seances
    add column if not exists lien_visio text;

-- Les élèves et les parents connectés peuvent lire les séances
-- (nécessaire pour afficher "Mes prochaines séances" dans l'espace élève)
do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
          and tablename = 'seances'
          and policyname = 'seances_lecture_connectes'
    ) then
        create policy seances_lecture_connectes
            on public.seances
            for select
            to authenticated
            using (true);
    end if;
end $$;
