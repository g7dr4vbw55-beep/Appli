-- =========================================================================
-- CORRECTIF — droits manquants pour la page d'administration
--
-- À exécuter si l'administration affiche "permission denied for table photos"
-- ou "permission denied for table commentaires", alors que la galerie des
-- invités fonctionne normalement.
--
-- Cause : les fonctions serveur de l'administration utilisent le rôle
-- service_role. Sur un projet créé sans l'option "Exposer automatiquement les
-- nouvelles tables", ce rôle ne reçoit aucun droit sur les tables créées
-- ensuite, et toute lecture ou suppression échoue.
--
-- Ce correctif est déjà inclus dans supabase/schema.sql : il n'est utile que
-- pour un projet créé avec une version antérieure du script.
--
-- Comment l'exécuter : Supabase > SQL Editor > New query > coller ce fichier
-- en entier > Run. Aucun redéploiement Vercel n'est nécessaire, l'effet est
-- immédiat.
-- =========================================================================

grant usage on schema public to service_role;
grant all privileges on public.photos to service_role;
grant all privileges on public.commentaires to service_role;

-- Vérification : la requête ci-dessous doit renvoyer des lignes pour
-- service_role, dont DELETE sur les deux tables.
select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('photos', 'commentaires')
  and grantee = 'service_role'
order by table_name, privilege_type;
