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
export interface MemberPublic {
  id: number;
  full_name: string;
  promotion: string;
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
  image: string | null;
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

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API calls
export const api = {
  getStats: () => fetchAPI<SiteStats>("/stats/"),
  getTestimonials: () => fetchAPI<PaginatedResponse<Testimonial>>("/testimonials/"),
  getMembers: (params?: string) =>
    fetchAPI<PaginatedResponse<MemberPublic>>(`/members/${params ? `?${params}` : ""}`),
  getMembersMap: () => fetchAPI<CountryData[]>("/members/map/"),
  getEvents: () => fetchAPI<PaginatedResponse<Event>>("/events/"),
  getEvent: (id: number) => fetchAPI<Event>(`/events/${id}/`),
  getNews: () => fetchAPI<PaginatedResponse<NewsArticle>>("/news/"),
  getNewsArticle: (slug: string) => fetchAPI<NewsArticle>(`/news/${slug}/`),
  getPartners: () => fetchAPI<PaginatedResponse<Partner>>("/partners/"),
  register: (data: Record<string, unknown>) =>
    fetchAPI("/members/register/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  contact: (data: Record<string, unknown>) =>
    fetchAPI("/contact/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
