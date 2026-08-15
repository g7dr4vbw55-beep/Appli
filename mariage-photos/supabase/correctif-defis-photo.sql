-- =========================================================================
-- CORRECTIF — ajoute les défis photo à une base déjà en service
--
-- À exécuter si votre projet Supabase a été créé avant l'ajout de la
-- fonctionnalité « Défis ». Sans cela, l'envoi d'une photo depuis un défi
-- échoue avec une erreur du type :
--   « Could not find the 'defi' column of 'photos' in the schema cache »
--
-- Ce correctif est déjà inclus dans supabase/schema.sql : il n'est utile que
-- pour une base existante.
--
-- Comment l'exécuter : Supabase > SQL Editor > New query > coller ce fichier
-- en entier > Run. Aucun redéploiement Vercel n'est nécessaire, l'effet est
-- immédiat. Les photos déjà envoyées ne sont pas modifiées : elles restent
-- simplement sans défi associé.
-- =========================================================================

alter table public.photos add column if not exists defi text;

create index if not exists photos_defi_created_at_idx on public.photos (defi, created_at desc);

-- Vérification : la colonne doit apparaître dans le résultat.
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'photos'
order by ordinal_position;
