// University related types based on API schema
// Updated: December 27, 2025 - Backend Version 2.0.0
export interface University {
    id: number;
    name: string;                    // Primary field name from API
    university_name?: string;        // Legacy support
    country: string;
    city: string;
    tuition: string;
    ielts_requirement: number | null;  // Updated field name
    toefl_requirement: number | null;  // Updated field name
    ielts?: number;                  // Legacy support
    toefl?: number;                  // Legacy support
    ranking: string;
    programs: string[];
    why_selected?: string;           // Only in recommendations
    region: string;                  // Geographic region (Europe, North America, etc.)
    affordability: string;           // Very Affordable, Affordable, Moderate, Expensive, Very Expensive
    apply_url: string;               // NEW: Official application page URL
    notes?: string;                  // Additional notes
    acceptance_rate?: string;
    website?: string;
}

export interface UniversityRecommendation {
    university: University;
    match_score: number;
    reasons: string[];
    ai_insights: string;
}

// Available regions for filtering
export type UniversityRegion = 'Europe' | 'North America' | 'Asia' | 'Oceania' | 'Africa' | 'Latin America';

// Available affordability levels
export type AffordabilityLevel = 'Free' | 'Very Affordable' | 'Affordable' | 'Moderate' | 'Expensive' | 'Very Expensive';

export interface UniversityFilters {
    search?: string;           // Multi-field search across name, country, city, region, programs, notes
    country?: string;          // Filter by country
    city?: string;             // Filter by city
    region?: string;           // Filter by geographic region
    program?: string;          // Filter by program/field of study
    affordability?: string;    // Filter by affordability level
    max_ielts?: number;        // Maximum IELTS requirement
    max_toefl?: number;        // Maximum TOEFL requirement
    max_tuition?: string;      // Maximum tuition (numeric)
    top_ranking?: number;      // Only universities ranked in top N
    sort_by?: 'name' | 'country' | 'ranking';  // Sort field
    sort_order?: 'asc' | 'desc';               // Sort direction
    limit?: number;            // Results per page (default: 50)
    offset?: number;           // Pagination offset (default: 0)
}

export interface PaginationInfo {
    limit: number;
    offset: number;
    has_more: boolean;
}