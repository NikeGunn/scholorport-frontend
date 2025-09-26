import {
    ChatRequest,
    ChatResponse,
    StartConversationResponse,
    ConsentRequest,
    ConsentResponse,
    UniversityListResponse,
    UniversityDetailResponse,
    HealthCheckResponse,
    AdminStatsResponse,
    ProfilesListResponse,
    SaveStudentRequest,
    UniversityFilters
} from '../types';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api/chat';

// Generic API client with error handling
class APIClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            ...options
        };

        try {
            console.log(`🚀 API Request: ${options.method || 'GET'} ${url}`);

            const response = await fetch(url, defaultOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ API Response:', data);

            return data;
        } catch (error) {
            console.error('❌ API Error:', error);
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return new Error('Network error: Please check your internet connection and ensure the backend server is running.');
        }

        if (error.message.includes('500')) {
            return new Error('Server error: The backend service is experiencing issues. Please try again later.');
        }

        if (error.message.includes('404')) {
            return new Error('Not found: The requested resource could not be found.');
        }

        if (error.message.includes('400')) {
            return new Error('Bad request: Please check your input and try again.');
        }

        return error instanceof Error ? error : new Error('An unexpected error occurred');
    }
}

// Initialize API client
const apiClient = new APIClient(API_BASE_URL);

// Chat API endpoints
export const chatAPI = {
    // Health check
    healthCheck: async (): Promise<HealthCheckResponse> => {
        return apiClient.request<HealthCheckResponse>('/health/');
    },

    // Start new conversation
    startConversation: async (): Promise<StartConversationResponse> => {
        return apiClient.request<StartConversationResponse>('/start/', {
            method: 'POST',
            body: JSON.stringify({})
        });
    },

    // Send message in conversation
    sendMessage: async (data: ChatRequest): Promise<ChatResponse> => {
        return apiClient.request<ChatResponse>('/send/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Handle data consent
    submitConsent: async (data: ConsentRequest): Promise<ConsentResponse> => {
        return apiClient.request<ConsentResponse>('/consent/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Get conversation history
    getConversationHistory: async (sessionId: string): Promise<any> => {
        return apiClient.request(`/conversation/${sessionId}/`);
    }
};

// University API endpoints
export const universityAPI = {
    // Get all universities with optional filtering
    getUniversities: async (filters: UniversityFilters = {}): Promise<UniversityListResponse> => {
        const searchParams = new URLSearchParams();

        if (filters.country) searchParams.append('country', filters.country);
        if (filters.search) searchParams.append('search', filters.search);
        if (filters.max_tuition) searchParams.append('max_tuition', filters.max_tuition);
        if (filters.limit) searchParams.append('limit', filters.limit.toString());
        if (filters.offset) searchParams.append('offset', filters.offset.toString());

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/universities/?${queryString}` : '/universities/';

        return apiClient.request<UniversityListResponse>(endpoint);
    },

    // Get specific university details
    getUniversity: async (universityId: number): Promise<UniversityDetailResponse> => {
        return apiClient.request<UniversityDetailResponse>(`/universities/${universityId}/`);
    }
};

// Admin API endpoints
export const adminAPI = {
    // Get dashboard statistics
    getDashboardStats: async (): Promise<AdminStatsResponse> => {
        return apiClient.request<AdminStatsResponse>('/admin/stats/');
    },

    // Get student profiles
    getStudentProfiles: async (filters: { limit?: number; offset?: number; country?: string; completed_only?: boolean } = {}): Promise<ProfilesListResponse> => {
        const searchParams = new URLSearchParams();

        if (filters.limit) searchParams.append('limit', filters.limit.toString());
        if (filters.offset) searchParams.append('offset', filters.offset.toString());
        if (filters.country) searchParams.append('country', filters.country);
        if (filters.completed_only) searchParams.append('completed_only', 'true');

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/admin/profiles/?${queryString}` : '/admin/profiles/';

        return apiClient.request<ProfilesListResponse>(endpoint);
    },

    // Export profiles to Excel
    exportProfiles: (): void => {
        window.open(`${API_BASE_URL}/admin/export/`, '_blank');
    },

    // Export Firebase data
    exportFirebaseData: (format: 'json' | 'excel' = 'json'): void => {
        window.open(`${API_BASE_URL}/admin/firebase-export/?format=${format}`, '_blank');
    }
};

// Error handling utility
export const handleAPIError = (error: any): string => {
    if (error?.message) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred. Please try again.';
};

// Storage utilities for session management
export const storageUtils = {
    setSessionId: (sessionId: string): void => {
        localStorage.setItem('scholarport_session_id', sessionId);
    },

    getSessionId: (): string | null => {
        return localStorage.getItem('scholarport_session_id');
    },

    clearSession: (): void => {
        localStorage.removeItem('scholarport_session_id');
    },

    clearSessionId: (): void => {
        localStorage.removeItem('scholarport_session_id');
    },

    setStudentData: (data: any): void => {
        localStorage.setItem('scholarport_student_data', JSON.stringify(data));
    },

    getStudentData: (): any | null => {
        const data = localStorage.getItem('scholarport_student_data');
        return data ? JSON.parse(data) : null;
    },

    clearStudentData: (): void => {
        localStorage.removeItem('scholarport_student_data');
    },

    clearAll: (): void => {
        localStorage.removeItem('scholarport_session_id');
        localStorage.removeItem('scholarport_student_data');
    }
};

// Analytics utilities
export const analyticsUtils = {
    trackEvent: (eventName: string, properties: Record<string, any> = {}): void => {
        console.log(`📊 Analytics Event: ${eventName}`, properties);
        // In production, integrate with Google Analytics or other analytics service
        if (typeof (window as any).gtag !== 'undefined') {
            (window as any).gtag('event', eventName, properties);
        }
    },

    trackChatProgress: (step: number, sessionId: string): void => {
        analyticsUtils.trackEvent('chat_progress', {
            step: step,
            session_id: sessionId,
            timestamp: new Date().toISOString()
        });
    },

    trackUniversityView: (universityName: string): void => {
        analyticsUtils.trackEvent('university_viewed', {
            university_name: universityName,
            timestamp: new Date().toISOString()
        });
    },

    trackConsentGiven: (consent: boolean, sessionId: string): void => {
        analyticsUtils.trackEvent('consent_response', {
            consent_given: consent,
            session_id: sessionId,
            timestamp: new Date().toISOString()
        });
    }
};

export default {
    chatAPI,
    universityAPI,
    adminAPI,
    handleAPIError,
    storageUtils,
    analyticsUtils
};