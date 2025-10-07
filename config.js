// Environment Configuration for Scholarport Frontend
// This file determines which API base URL to use based on the environment
// UPDATED: 2025-10-07 - Backend URL: ec2-43-205-95-162 (NEW BACKEND)

(function() {
    'use strict';

    // Detect environment
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' ||
                       hostname === '127.0.0.1' ||
                       hostname.startsWith('192.168.') ||
                       hostname.startsWith('10.0.');

    // API Configuration
    const API_CONFIG = {
        development: {
            BASE_URL: 'http://127.0.0.1:8000/api/chat',
            WS_URL: 'ws://127.0.0.1:8000/ws',
            ENV: 'development'
        },
        production: {
            BASE_URL: 'http://ec2-43-205-95-162.ap-south-1.compute.amazonaws.com/api/chat',
            WS_URL: 'ws://ec2-43-205-95-162.ap-south-1.compute.amazonaws.com/ws',
            ENV: 'production',
            BACKEND_IP: '43.205.95.162'
        }
    };

    // Select configuration based on environment
    const currentConfig = isLocalhost ? API_CONFIG.development : API_CONFIG.production;

    // Log current environment with prominent styling
    console.log('%c🌍 Environment: ' + currentConfig.ENV, 'color: #0066CC; font-size: 16px; font-weight: bold;');
    console.log('%c🔗 API Base URL: ' + currentConfig.BASE_URL, 'color: #00B050; font-size: 14px; font-weight: bold;');

    // Alert if using old backend
    if (currentConfig.BASE_URL && currentConfig.BASE_URL.includes('13-203-155-163')) {
        console.error('%c⚠️ WARNING: USING OLD BACKEND! Config not updated!', 'color: red; font-size: 20px; font-weight: bold; background: yellow;');
        alert('⚠️ CRITICAL: Using OLD backend (13.203.155.163). Please contact support!');
    } else if (currentConfig.BASE_URL && currentConfig.BASE_URL.includes('43-205-95-162')) {
        console.log('%c✅ Using CORRECT NEW backend: 43.205.95.162', 'color: green; font-size: 14px; font-weight: bold;');
    }

    // Expose configuration globally
    window.SCHOLARPORT_CONFIG = {
        API_BASE_URL: currentConfig.BASE_URL,
        WS_URL: currentConfig.WS_URL,
        ENV: currentConfig.ENV,
        VERSION: '1.0.0',
        IS_DEVELOPMENT: isLocalhost,
        IS_PRODUCTION: !isLocalhost
    };

    // Freeze configuration to prevent modifications
    Object.freeze(window.SCHOLARPORT_CONFIG);

})();
