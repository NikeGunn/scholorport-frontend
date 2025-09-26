// University related types based on API schema
export interface University {
    id: number;
    university_name: string;
    country: string;
    city: string;
    tuition: string;
    ielts: number;
    toefl: number;
    ranking: string;
    programs: string[];
    why_selected: string;
    region: string;
    acceptance_rate?: string;
    website?: string;
}

export interface UniversityRecommendation {
    university: University;
    match_score: number;
    reasons: string[];
    ai_insights: string;
}

export interface UniversityFilters {
    country?: string;
    search?: string;
    max_tuition?: string;
    limit?: number;
    offset?: number;
}