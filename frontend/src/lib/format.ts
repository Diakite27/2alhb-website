/**
 * Utilitaires de formatage partagés.
 */

/**
 * Formate une date ISO en format français lisible (ex: "12 août 2026").
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
