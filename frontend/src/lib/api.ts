const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

// Types

export interface AssociationInfo {
  name: string;
  full_name: string;
  slogan: string;
  email: string;
  phone: string;
  address: string;
  facebook_url: string;
  linkedin_url: string;
  adhesion_fee: number;
  monthly_fee: number;
  annual_fee: number;
}

export interface MemberPublic {
  id: number;
  full_name: string;
  promotion: number | null;
  promotion_year: number | null;
  promotion_name: string;
  profession: string;
  company: string;
  city: string;
  country: string;
  photo: string | null;
  linkedin: string;
}

export interface Testimonial {
  id: number;
  member: MemberPublic;
  content: string;
  is_featured: boolean;
  created_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image: string | null;
  is_featured: boolean;
}

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  author_name: string;
  published_at: string;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
  website: string;
}

export interface SiteStats {
  members_count: number;
  countries_count: number;
  promotions_count: number;
  insertion_rate: number;
}

export interface CountryData {
  country: string;
  count: number;
}

export interface BureauMember {
  id: number;
  display_name: string;
  initials: string;
  role: string;
  category: "direction" | "commission";
  photo_url: string | null;
  order: number;
}

export interface JobOffer {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  sector: string;
  description: string;
  apply_url: string;
  posted_by_name: string;
  poster_email: string;
  is_active: boolean;
  created_at: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  quarter: string;
  year: number;
  date_label: string;
  status: "done" | "in-progress" | "upcoming";
  order: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API calls
export const api = {
  // Association
  getInfo: () => fetchAPI<AssociationInfo>("/info/"),
  getStats: () => fetchAPI<SiteStats>("/stats/"),

  // Members
  getMembers: (params?: string) =>
    fetchAPI<PaginatedResponse<MemberPublic>>(`/members/${params ? `?${params}` : ""}`),
  getMembersMap: () => fetchAPI<CountryData[]>("/members/map/"),
  register: (data: FormData | Record<string, unknown>) => {
    if (data instanceof FormData) {
      return fetch(`${API_BASE}/members/register/`, { method: "POST", body: data });
    }
    return fetchAPI("/members/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Promotions
  getPromotions: () => fetchAPI<PaginatedResponse<{ id: number; year: number; name: string; members_count: number }>>("/promotions/"),

  // Testimonials
  getTestimonials: () => fetchAPI<PaginatedResponse<Testimonial>>("/testimonials/"),

  // Events
  getEvents: (params?: string) =>
    fetchAPI<PaginatedResponse<Event>>(`/events/${params ? `?${params}` : ""}`),
  getEvent: (id: number) => fetchAPI<Event>(`/events/${id}/`),

  // News
  getNews: () => fetchAPI<PaginatedResponse<NewsArticle>>("/news/"),
  getNewsArticle: (slug: string) => fetchAPI<NewsArticle>(`/news/${slug}/`),

  // Partners
  getPartners: () => fetchAPI<PaginatedResponse<Partner>>("/partners/"),

  // Bureau
  getBureau: () => fetchAPI<PaginatedResponse<BureauMember>>("/bureau/"),

  // Jobs
  getJobs: (params?: string) =>
    fetchAPI<PaginatedResponse<JobOffer>>(`/jobs/${params ? `?${params}` : ""}`),
  createJob: (data: Record<string, unknown>) =>
    fetchAPI("/jobs/create/", { method: "POST", body: JSON.stringify(data) }),

  // FAQ
  getFAQ: () => fetchAPI<PaginatedResponse<FAQItem>>("/faq/"),

  // Activities
  getActivities: (params?: string) =>
    fetchAPI<PaginatedResponse<Activity>>(`/activities/${params ? `?${params}` : ""}`),

  // Contact
  contact: (data: Record<string, unknown>) =>
    fetchAPI("/contact/", { method: "POST", body: JSON.stringify(data) }),
};
