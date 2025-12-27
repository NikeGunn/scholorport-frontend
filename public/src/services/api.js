// API Configuration
// Use global config from config.js or fallback to localhost for development
const API_BASE_URL = (window.SCHOLARPORT_CONFIG && window.SCHOLARPORT_CONFIG.API_BASE_URL)
    || 'http://127.0.0.1:8000/api/chat';

// Log which API URL is being used
console.log('🔧 API Service initialized with base URL:', API_BASE_URL);
console.log('🌍 Environment:', window.SCHOLARPORT_CONFIG?.ENV || 'not configured');

// Generic API client with error handling
class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',  // Include cookies for CORS requests
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

    handleError(error) {
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
const chatAPI = {
    // Health check
    healthCheck: async () => {
        return apiClient.request('/health/');
    },

    // Start new conversation
    startConversation: async () => {
        return apiClient.request('/start/', {
            method: 'POST',
            body: JSON.stringify({})
        });
    },

    // Send message in conversation
    sendMessage: async (data) => {
        return apiClient.request('/send/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Handle data consent - use dedicated consent endpoint
    submitConsent: async (data) => {
        console.log('🚀 Submitting consent:', data);

        try {
            const response = await apiClient.request('/consent/', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            console.log('✅ Raw consent response:', response);

            // Normalize the response structure to match what the frontend expects
            const normalizedResponse = {
                success: true,
                message: response.bot_response || 'Consent processed successfully',
                data_saved: response.data_saved || false,
                session_id: response.session_id || data.session_id
            };

            console.log('✅ Normalized consent response:', normalizedResponse);
            return normalizedResponse;

        } catch (error) {
            console.error('❌ Consent submission error:', error);

            // Fallback to send endpoint with consent response if consent endpoint fails
            try {
                console.log('🔄 Trying fallback consent method...');
                const fallbackResponse = await apiClient.request('/send/', {
                    method: 'POST',
                    body: JSON.stringify({
                        session_id: data.session_id,
                        message: data.consent ? 'Yes, please save my details' : 'No, thanks'
                    })
                });

                const fallbackNormalized = {
                    success: fallbackResponse.success || true,
                    message: fallbackResponse.bot_response || 'Your consent has been processed.',
                    data_saved: data.consent,
                    session_id: data.session_id
                };

                console.log('✅ Fallback consent response:', fallbackNormalized);
                return fallbackNormalized;

            } catch (fallbackError) {
                console.error('❌ Fallback consent submission error:', fallbackError);
                throw new Error('Failed to submit consent: ' + (fallbackError.message || 'Unknown error'));
            }
        }
    },

    // Get conversation history
    getConversationHistory: async (sessionId) => {
        return apiClient.request(`/conversation/${sessionId}/`);
    }
};

// University API endpoints
// Updated: December 27, 2025 - Backend Version 2.0.0 with hybrid search
const universityAPI = {
    // Get all universities with optional filtering (supports hybrid search)
    getUniversities: async (filters = {}) => {
        const searchParams = new URLSearchParams();

        // Basic filters
        if (filters.search) searchParams.append('search', filters.search);
        if (filters.country) searchParams.append('country', filters.country);
        if (filters.city) searchParams.append('city', filters.city);
        
        // NEW: Advanced filters
        if (filters.region) searchParams.append('region', filters.region);
        if (filters.program) searchParams.append('program', filters.program);
        if (filters.affordability) searchParams.append('affordability', filters.affordability);
        if (filters.max_ielts) searchParams.append('max_ielts', filters.max_ielts.toString());
        if (filters.max_toefl) searchParams.append('max_toefl', filters.max_toefl.toString());
        if (filters.max_tuition) searchParams.append('max_tuition', filters.max_tuition);
        if (filters.top_ranking) searchParams.append('top_ranking', filters.top_ranking.toString());
        
        // NEW: Sorting
        if (filters.sort_by) searchParams.append('sort_by', filters.sort_by);
        if (filters.sort_order) searchParams.append('sort_order', filters.sort_order);
        
        // Pagination
        if (filters.limit) searchParams.append('limit', filters.limit.toString());
        if (filters.offset) searchParams.append('offset', filters.offset.toString());

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/institutions/?${queryString}` : '/institutions/';

        console.log('🏫 Fetching institutions from:', endpoint);
        const response = await apiClient.request(endpoint);
        console.log('🏫 Institutions response:', response);
        return response;
    },

    // Get specific university details
    getUniversity: async (universityId) => {
        return apiClient.request(`/institutions/${universityId}/`);
    }
};

// Admin API endpoints
const adminAPI = {
    // Get dashboard statistics
    getDashboardStats: async () => {
        return apiClient.request('/admin/stats/');
    },

    // Get student profiles
    getStudentProfiles: async (filters = {}) => {
        const searchParams = new URLSearchParams();

        if (filters.limit) searchParams.append('limit', filters.limit.toString());
        if (filters.offset) searchParams.append('offset', filters.offset.toString());
        if (filters.country) searchParams.append('country', filters.country);
        if (filters.completed_only) searchParams.append('completed_only', 'true');

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/admin/profiles/?${queryString}` : '/admin/profiles/';

        return apiClient.request(endpoint);
    },

    // Export profiles to Excel
    exportProfiles: () => {
        window.open(`${API_BASE_URL}/admin/export/`, '_blank');
    },

    // Export Firebase data
    exportFirebaseData: (format = 'json') => {
        window.open(`${API_BASE_URL}/admin/firebase-export/?format=${format}`, '_blank');
    }
};

// Error handling utility
const handleAPIError = (error) => {
    if (error?.message) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred. Please try again.';
};

// Storage utilities for session management
const storageUtils = {
    setSessionId: (sessionId) => {
        localStorage.setItem('scholarport_session_id', sessionId);
        // Initialize session data
        storageUtils.setSessionData({ sessionId, completed: false, timestamp: new Date().toISOString() });
    },

    getSessionId: () => {
        return localStorage.getItem('scholarport_session_id');
    },

    setSessionData: (data) => {
        localStorage.setItem('scholarport_session_data', JSON.stringify(data));
    },

    getSessionData: () => {
        const data = localStorage.getItem('scholarport_session_data');
        return data ? JSON.parse(data) : null;
    },

    markSessionCompleted: () => {
        const sessionData = storageUtils.getSessionData();
        if (sessionData) {
            sessionData.completed = true;
            storageUtils.setSessionData(sessionData);
        }
    },

    clearSession: () => {
        localStorage.removeItem('scholarport_session_id');
        localStorage.removeItem('scholarport_session_data');
    }
};

// Make APIs available globally
window.ScholarportAPI = {
    chatAPI,
    universityAPI,
    adminAPI,
    storageUtils,
    handleAPIError,
    API_BASE_URL
};

console.log('🔧 Scholarport API initialized');