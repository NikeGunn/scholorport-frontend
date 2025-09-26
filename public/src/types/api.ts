import { University } from './university';
import { StudentData } from './chat';

// API Request/Response types based on Django backend schema
export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface HealthCheckResponse {
    success: boolean;
    message: string;
    timestamp: string;
    version: string;
}

export interface StartConversationResponse {
    success: boolean;
    session_id: string;
    current_step: number;
    message: string;
    question: string;
    total_steps: number;
}

export interface ChatRequest {
    session_id: string;
    message: string;
}

export interface ChatResponse {
    success: boolean;
    session_id: string;
    current_step: number;
    bot_response: string;
    completed: boolean;
    total_steps: number;
    next_question?: string;
    guided_suggestions?: string[];
    processed_input?: string;
    original_input?: string;
    recommendations?: University[];
    ai_insights?: string;
    profile_id?: number;
}

export interface ConsentRequest {
    session_id: string;
    consent: boolean;
}

export interface ConsentResponse {
    success: boolean;
    message: string;
    profile_saved?: boolean;
    next_steps?: string;
    recommendations_available?: boolean;
}

export interface UniversityListResponse {
    success: boolean;
    universities: University[];
    total_count: number;
}

export interface UniversityDetailResponse {
    success: boolean;
    university: University;
}

export interface SaveStudentRequest extends StudentData {
    universities: string[];
    ai_insights: string;
    session_id: string;
}

export interface AdminStatsResponse {
    success: boolean;
    stats: {
        total_sessions: number;
        completed_conversations: number;
        total_profiles: number;
        conversion_rate: number;
        popular_countries: Array<{
            country: string;
            count: number;
        }>;
        recent_activity: Array<{
            date: string;
            sessions: number;
        }>;
    };
}

export interface ProfilesListResponse {
    success: boolean;
    profiles: Array<{
        id: number;
        session_id: string;
        student_name: string;
        education_background: string;
        budget_amount: string;
        budget_currency: string;
        test_type: string;
        test_score: number;
        preferred_country: string;
        recommended_universities: string[];
        ai_insights: string;
        created_at: string;
        conversation_completed: boolean;
    }>;
    total_count: number;
}