// Environment Configuration for Scholarport Frontend
// This file determines which API base URL to use based on the environment
// UPDATED: 2026-01-27 - Backend URL: ec2-65-1-127-116 (CURRENT BACKEND)

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
    // CRITICAL: Use same-origin proxy when on custom domain to avoid CORS and SSL issues
    const API_CONFIG = {
        development: {
            BASE_URL: 'http://127.0.0.1:8000/api/chat',
            WS_URL: 'ws://127.0.0.1:8000/ws',
            ENV: 'development'
        },
        production: {
            // ALWAYS use same-origin API calls via nginx proxy
            // This prevents CORS issues and connection resets
            BASE_URL: `${protocol}//${hostname}/api/chat`,
            WS_URL: `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}/ws`,
            ENV: 'production',
            BACKEND_IP: '65.1.127.116',  // Updated to current server
            BACKEND_HOST: hostname,
            FRONTEND_DOMAIN: hostname,
            USE_HTTPS: useHTTPS,
            USE_PROXY: true  // Always use nginx proxy
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
    if (!isLocalhost) {
        console.log('%c🌐 Domain: ' + hostname, 'color: #0066CC; font-size: 14px; font-weight: bold;');
        console.log('%c🔄 Using Nginx Proxy - All requests routed through same origin', 'color: #0066CC; font-size: 14px; font-weight: bold;');
    }

    // Alert if using any old backend (should not happen with new config)
    const oldBackends = ['13-203-155-163', '13.203.155.163', '43-205-95-162', '43.205.95.162'];
    const isOldBackend = oldBackends.some(ip => currentConfig.BASE_URL && currentConfig.BASE_URL.includes(ip));
    if (isOldBackend) {
        console.error('%c⚠️ WARNING: USING OLD BACKEND! Config not updated!', 'color: red; font-size: 20px; font-weight: bold; background: yellow;');
        alert('⚠️ CRITICAL: Using OLD backend! Clear cache and refresh. Current server: 65.1.127.116');
    }

    // Expose configuration globally
    window.SCHOLARPORT_CONFIG = {
        API_BASE_URL: currentConfig.BASE_URL,
        WS_URL: currentConfig.WS_URL,
        ENV: currentConfig.ENV,
        VERSION: '2.0.0',  // Version bump for config changes
        IS_DEVELOPMENT: isLocalhost,
        IS_PRODUCTION: !isLocalhost,
        BUILD_DATE: '2026-01-27'
    };

    // Freeze configuration to prevent modifications
    Object.freeze(window.SCHOLARPORT_CONFIG);

})();
