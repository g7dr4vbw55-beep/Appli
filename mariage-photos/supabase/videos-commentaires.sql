-- =========================================================================
-- Commentaires des vidéos récapitulatives
--
-- À exécuter dans Supabase : SQL Editor > New query > coller > Run.
-- Effet immédiat, aucun redéploiement Vercel nécessaire.
--
-- Ce script ne touche NI à la table photos, NI à la table commentaires, NI
-- au stockage : il ajoute seulement une nouvelle table. Vos photos et vos
-- commentaires existants ne sont pas modifiés.
--
-- Les commentaires des vidéos sont volontairement rangés à part plutôt
-- qu'ajoutés à la table commentaires : celle-ci exige un photo_id existant,
-- et la modifier aurait impliqué de toucher à des données précieuses.
-- =========================================================================

create table if not exists public.commentaires_video (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  -- Identifiant de la vidéo, tel que défini dans videos.config.ts
  video_id       text not null check (char_length(trim(video_id)) between 1 and 50),
  auteur_prenom  text not null check (char_length(trim(auteur_prenom)) between 1 and 50),
  contenu        text not null check (char_length(trim(contenu)) between 1 and 500)
);

create index if not exists commentaires_video_video_id_created_at_idx
  on public.commentaires_video (video_id, created_at);

-- =========================================================================
-- DROITS D'ACCÈS ET SÉCURITÉ
--
-- Même principe que pour les photos : les invités peuvent lire et écrire,
-- jamais supprimer. Seul service_role, utilisé par les fonctions serveur de
-- l'administration, peut effacer un commentaire.
-- =========================================================================

grant select, insert on public.commentaires_video to anon, authenticated;
grant all privileges on public.commentaires_video to service_role;

alter table public.commentaires_video enable row level security;

create policy "Lecture publique des commentaires de vidéos"
  on public.commentaires_video for select
  to anon, authenticated
  using (true);

create policy "Ajout public de commentaires de vidéos"
  on public.commentaires_video for insert
  to anon, authenticated
  with check (true);

-- Vérification : doit renvoyer la table et ses droits pour service_role.
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'commentaires_video'
order by grantee, privilege_type;
