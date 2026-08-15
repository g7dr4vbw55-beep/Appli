-- =========================================================================
-- Script SQL pour l'application de partage de photos de mariage.
-- À exécuter dans Supabase : Dashboard > SQL Editor > New query > coller
-- ce fichier en entier > Run.
--
-- Important : si votre bucket de stockage ne s'appelle pas "photos",
-- remplacez toutes les occurrences de 'photos' dans la section
-- "STOCKAGE" ci-dessous par le nom exact de votre bucket.
-- =========================================================================

-- Nécessaire pour gen_random_uuid() (généralement déjà activée sur Supabase)
create extension if not exists pgcrypto;

-- =========================================================================
-- TABLES
-- =========================================================================

create table if not exists public.photos (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  storage_path   text not null unique,
  auteur_prenom  text not null check (char_length(trim(auteur_prenom)) between 1 and 50),
  largeur        integer,
  hauteur        integer
);

create table if not exists public.commentaires (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  photo_id       uuid not null references public.photos (id) on delete cascade,
  auteur_prenom  text not null check (char_length(trim(auteur_prenom)) between 1 and 50),
  contenu        text not null check (char_length(trim(contenu)) between 1 and 500)
);

create index if not exists photos_created_at_idx on public.photos (created_at desc);
create index if not exists commentaires_photo_id_created_at_idx on public.commentaires (photo_id, created_at);

-- =========================================================================
-- ROW LEVEL SECURITY — TABLES
--
-- Principe : lecture et insertion publiques (l'application n'a pas de
-- comptes utilisateurs), mais AUCUNE politique de modification ou de
-- suppression n'est créée pour les rôles publics (anon/authenticated).
-- Résultat : un visiteur du site ne peut jamais supprimer ni modifier une
-- ligne, même en interrogeant directement l'API Supabase. Seule la clé
-- service_role (utilisée uniquement par les fonctions serveur de la page
-- d'administration) peut supprimer, car elle contourne totalement RLS.
-- =========================================================================

alter table public.photos enable row level security;
alter table public.commentaires enable row level security;

create policy "Lecture publique des photos"
  on public.photos for select
  to anon, authenticated
  using (true);

create policy "Ajout public de photos"
  on public.photos for insert
  to anon, authenticated
  with check (true);

create policy "Lecture publique des commentaires"
  on public.commentaires for select
  to anon, authenticated
  using (true);

create policy "Ajout public de commentaires"
  on public.commentaires for insert
  to anon, authenticated
  with check (true);

-- =========================================================================
-- ROW LEVEL SECURITY — STOCKAGE (storage.objects)
--
-- À exécuter APRÈS avoir créé le bucket "photos" (voir le README, section
-- "Créer le bucket de stockage"). Même principe : lecture et dépôt publics,
-- pas de suppression possible avec la clé publique (anon).
-- =========================================================================

create policy "Lecture publique du bucket photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'photos');

create policy "Dépôt public dans le bucket photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'photos');
