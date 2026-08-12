export const SITE_NAME = "2ALHB";
export const SITE_FULL_NAME = "Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo";
export const SITE_SLOGAN = "Connecter les anciens, inspirer les générations futures";
export const SITE_DESCRIPTION =
  "Rejoignez le réseau des anciens élèves du Lycée HOUPHOUËT-BOIGNY de Korhogo. Solidarité, excellence et fraternité.";

export interface NavSubItem {
  label: string;
  description: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavSubItem[];
}

export const NAV_LINKS: NavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "L'Association",
    href: "#about",
    children: [
      { label: "Présentation", description: "Découvrez l'histoire et les objectifs de la 2ALHB", href: "/association/presentation" },
      { label: "Le Bureau", description: "Rencontrez les membres du bureau exécutif", href: "/association/bureau" },
      { label: "Adhésion", description: "Rejoignez le réseau des anciens", href: "/association/adhesion" },
      { label: "Statuts", description: "Consultez les statuts officiels", href: "/association/statuts" },
      { label: "Règlement", description: "Consultez le règlement intérieur", href: "/association/reglement" },
      { label: "Plan d'activités", description: "Découvrez nos projets et actions prévues", href: "/association/plan-activites" },
    ],
  },
  { label: "Événements", href: "/evenements" },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Emplois", href: "/emplois" },
  { label: "Contact", href: "/#contact" },
];

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/2alhb",
  linkedin: "https://linkedin.com/company/2alhb",
} as const;

// Fallback stats when API is unavailable
export const FALLBACK_STATS = {
  members_count: 500,
  countries_count: 8,
  promotions_count: 40,
  insertion_rate: 85,
};

// Fallback testimonials for demo
export const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    member: {
      id: 1,
      full_name: "Kouadio Yao Marc",
      promotion: "1998",
      profession: "Directeur Général",
      company: "Tech Solutions CI",
      city: "Abidjan",
      country: "Côte d'Ivoire",
      photo: null,
      linkedin: "",
    },
    content:
      "Le Lycée HOUPHOUËT-BOIGNY de Korhogo m'a donné les bases solides qui ont façonné ma carrière. Grâce à la 2ALHB, je reste connecté avec mes anciens camarades et ensemble, nous contribuons au rayonnement de notre alma mater.",
    is_featured: true,
    created_at: "2025-01-15",
  },
  {
    id: 2,
    member: {
      id: 2,
      full_name: "Traoré Aminata",
      promotion: "2005",
      profession: "Ingénieure Informatique",
      company: "Orange CI",
      city: "Abidjan",
      country: "Côte d'Ivoire",
      photo: null,
      linkedin: "",
    },
    content:
      "Être membre de la 2ALHB, c'est faire partie d'une grande famille. Le réseau m'a permis de trouver des mentors et d'accompagner à mon tour les jeunes diplômés dans leur insertion professionnelle.",
    is_featured: true,
    created_at: "2025-02-20",
  },
  {
    id: 3,
    member: {
      id: 3,
      full_name: "Bamba Seydou",
      promotion: "2010",
      profession: "Médecin",
      company: "CHU de Cocody",
      city: "Abidjan",
      country: "Côte d'Ivoire",
      photo: null,
      linkedin: "",
    },
    content:
      "La solidarité entre anciens du LHB est remarquable. Quand j'ai eu besoin de soutien pour mon projet de clinique, c'est à travers le réseau de la 2ALHB que j'ai trouvé les partenaires qu'il me fallait.",
    is_featured: true,
    created_at: "2025-03-10",
  },
];


/** Format a number with space as thousands separator (consistent SSR/client) */
export function formatPrice(n: number): string {
  if (!Number.isFinite(n)) return "0";
  const isNegative = n < 0;
  const abs = Math.abs(n);
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return isNegative ? `-${formatted}` : formatted;
}
