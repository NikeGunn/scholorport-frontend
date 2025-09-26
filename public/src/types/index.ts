// Export all types for easy importing
export * from './chat';
export * from './university';
export * from './api';

// Common UI types
export interface ButtonProps {
    children: any; // ReactNode type
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    className?: string;
}

export interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

export interface ResponsiveBreakpoints {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    screenWidth: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
    type: ToastType;
    message: string;
    duration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}