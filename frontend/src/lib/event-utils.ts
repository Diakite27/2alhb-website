/**
 * Utilitaires partagés pour les événements.
 */

export const categoryLabels: Record<string, { label: string; color: string }> = {
  gala: { label: "Gala", color: "bg-orange text-white" },
  sport: { label: "Sport", color: "bg-green text-white" },
  forum: { label: "Forum", color: "bg-blue-600 text-white" },
  retrouvailles: { label: "Retrouvailles", color: "bg-purple-600 text-white" },
  solidarite: { label: "Solidarité", color: "bg-pink-600 text-white" },
  autre: { label: "Autre", color: "bg-gray-500 text-white" },
};

export function getCategoryStyle(category: string) {
  return categoryLabels[category] ?? categoryLabels.autre;
}

export function extractTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
