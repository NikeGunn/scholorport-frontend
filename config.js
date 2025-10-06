// Environment Configuration for Scholarport Frontend
// This file determines which API base URL to use based on the environment

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
            BASE_URL: 'http://ec2-13-203-155-163.ap-south-1.compute.amazonaws.com/api/chat',
            WS_URL: 'ws://ec2-13-203-155-163.ap-south-1.compute.amazonaws.com/ws',
            ENV: 'production'
        }
    };

    // Select configuration based on environment
    const currentConfig = isLocalhost ? API_CONFIG.development : API_CONFIG.production;

    // Log current environment
    console.log(`🌍 Environment: ${currentConfig.ENV}`);
    console.log(`🔗 API Base URL: ${currentConfig.BASE_URL}`);

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
