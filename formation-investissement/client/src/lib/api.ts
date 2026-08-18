/** Client HTTP minimal vers l'API locale. Aucune donnee ne quitte la machine. */

export class ErreurApi extends Error {
  constructor(
    message: string,
    readonly statut: number,
  ) {
    super(message);
  }
}

async function requete<T>(url: string, options?: RequestInit): Promise<T> {
  const reponse = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
  });
  const texte = await reponse.text();
  const corps = texte ? JSON.parse(texte) : null;
  if (!reponse.ok) {
    throw new ErreurApi(corps?.erreur ?? `Erreur ${reponse.status}`, reponse.status);
  }
  return corps as T;
}

export const api = {
  get: <T>(chemin: string) => requete<T>(`/api${chemin}`),
  post: <T>(chemin: string, corps?: unknown) =>
    requete<T>(`/api${chemin}`, {
      method: 'POST',
      body: corps === undefined ? undefined : JSON.stringify(corps),
    }),
  patch: <T>(chemin: string, corps?: unknown) =>
    requete<T>(`/api${chemin}`, {
      method: 'PATCH',
      body: corps === undefined ? undefined : JSON.stringify(corps),
    }),
  delete: <T>(chemin: string) => requete<T>(`/api${chemin}`, { method: 'DELETE' }),
};
