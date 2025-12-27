// Chat related types based on API schema
import { University } from './university';

export interface Message {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: string;
    processedInput?: string; // What AI understood from user input
}

export interface ChatState {
    messages: Message[];
    currentStep: number;
    sessionId: string;
    isLoading: boolean;
    isCompleted: boolean;
    suggestedUniversities: University[];
    studentData: StudentData;
    guidedSuggestions: string[];
    lastProcessedInput?: string;
    isProcessing: boolean;
}

export interface ConversationSession {
    session_id: string;
    current_step: number;
    student_name?: string;
    education_background?: string;
    test_score?: string;
    budget?: string;
    preferred_country?: string;
    email?: string;
    phone?: string;
    conversation_completed: boolean;
    profile_created: boolean;
    created_at: string;
    updated_at: string;
}

export interface StudentData {
    name: string;
    education: string;
    testScore: string;
    budget: string;
    country: string;
    email: string;
    phone: string;
}