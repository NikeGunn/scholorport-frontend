// Environment Configuration for Scholarport Frontend
// This file determines which API base URL to use based on the environment
// UPDATED: 2025-10-07 - Backend URL: ec2-43-205-95-162 (NEW BACKEND)

(function() {
    'use strict';

    // Detect environment
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const isLocalhost = hostname === 'localhost' ||
                       hostname === '127.0.0.1' ||
                       hostname.startsWith('192.168.') ||
                       hostname.startsWith('10.0.');

    // Check if using custom domain (chat.scholarport.co)
    const isCustomDomain = hostname === 'chat.scholarport.co' || hostname === 'scholarport.co' || hostname === 'www.scholarport.co';
    const useHTTPS = protocol === 'https:' || isCustomDomain;

    // API Configuration
    // Use nginx proxy when on custom domain to avoid SSL certificate issues
    const API_CONFIG = {
        development: {
            BASE_URL: 'http://127.0.0.1:8000/api/chat',
            WS_URL: 'ws://127.0.0.1:8000/ws',
            ENV: 'development'
        },
        production: {
            // Use nginx proxy on custom domain, direct URL when on IP
            BASE_URL: isCustomDomain
                ? `${protocol}//${hostname}/api/chat`
                : 'https://43.205.95.162/api/chat',
            WS_URL: isCustomDomain
                ? `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}/ws`
                : 'wss://43.205.95.162/ws',
            ENV: 'production',
            BACKEND_IP: '43.205.95.162',
            BACKEND_HOST: isCustomDomain ? hostname : '43.205.95.162',
            FRONTEND_DOMAIN: isCustomDomain ? hostname : null,
            USE_HTTPS: useHTTPS,
            USE_PROXY: isCustomDomain
        }
    };

    // Select configuration based on environment
    const currentConfig = isLocalhost ? API_CONFIG.development : API_CONFIG.production;

    // Log current environment with prominent styling
    console.log('%c🌍 Environment: ' + currentConfig.ENV, 'color: #0066CC; font-size: 16px; font-weight: bold;');
    console.log('%c🔗 API Base URL: ' + currentConfig.BASE_URL, 'color: #00B050; font-size: 14px; font-weight: bold;');
    if (useHTTPS) {
        console.log('%c🔒 HTTPS Enabled - Secure connection active', 'color: #00B050; font-size: 14px; font-weight: bold;');
    }
    if (isCustomDomain) {
        console.log('%c🌐 Custom Domain: ' + hostname, 'color: #0066CC; font-size: 14px; font-weight: bold;');
        if (currentConfig.USE_PROXY) {
            console.log('%c🔄 Using Nginx Proxy - Avoiding SSL certificate issues', 'color: #0066CC; font-size: 14px; font-weight: bold;');
        }
    }

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
