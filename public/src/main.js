// Main React Application for Scholarport

// Wait for API to be available and use it directly from global scope
function isAPIReady() {
    return window.ScholarportAPI &&
           window.ScholarportAPI.chatAPI &&
           window.ScholarportAPI.universityAPI &&
           window.ScholarportAPI.adminAPI;
}

// Simple router state management
let currentRoute = (window.location.hash || '#home').split('?')[0];
let routeListeners = [];

function navigate(route) {
    currentRoute = route;
    window.location.hash = route;
    routeListeners.forEach(listener => listener(route));
}

function useRouter() {
    // Ensure current route is properly initialized without parameters
    const initialRoute = (window.location.hash || '#home').split('?')[0];
    const [route, setRoute] = React.useState(initialRoute);

    React.useEffect(() => {
        const listener = (newRoute) => setRoute(newRoute);
        routeListeners.push(listener);

        const handleHashChange = () => {
            const fullHash = window.location.hash || '#home';
            // Extract just the route part before any parameters
            const newRoute = fullHash.split('?')[0];
            if (newRoute !== currentRoute) {
                currentRoute = newRoute;
                routeListeners.forEach(l => l(newRoute));
            }
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            routeListeners = routeListeners.filter(l => l !== listener);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    return { route, navigate };
}

// Landing Page Component
function LandingPage() {
    return React.createElement('div', {
        className: 'min-h-screen flex flex-col'
    },
        // Header
        React.createElement(Header),

        // Hero Section
        React.createElement('main', {
            className: 'flex-1 bg-gradient-to-br from-blue-50 to-indigo-100'
        },
            React.createElement('div', {
                className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'
            },
                React.createElement('div', {
                    className: 'text-center'
                },
                    React.createElement('h1', {
                        className: 'text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fadeIn font-primary'
                    }, 'Find Your Perfect University'),
                    React.createElement('p', {
                        className: 'text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fadeIn font-secondary'
                    }, 'AI-powered study abroad guidance. Get personalized university recommendations in just 3 minutes with our intelligent chatbot.'),
                    React.createElement('div', {
                        className: 'animate-slideUp'
                    },
                        React.createElement('div', {
                            className: 'flex flex-col sm:flex-row gap-4 justify-center mb-8'
                        },
                            React.createElement(Button, {
                                onClick: () => {
                                    // Clear any existing session and start fresh
                                    if (window.ScholarportAPI) {
                                        window.ScholarportAPI.storageUtils.clearSession();
                                    }
                                    navigate('#chat?new=true');
                                },
                                size: 'lg'
                            }, 'Start Your Journey'),
                            React.createElement(Button, {
                                onClick: () => navigate('#universities'),
                                size: 'lg',
                                variant: 'outline'
                            }, 'Browse Universities')
                        ),
                        React.createElement('p', {
                            className: 'text-sm text-gray-500'
                        }, '✓ Free consultation ✓ AI-powered matching ✓ 408+ universities')
                    )
                )
            ),

            // Stats Section
            React.createElement('div', {
                className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'
            },
                React.createElement('div', {
                    className: 'grid grid-cols-1 md:grid-cols-3 gap-8 text-center'
                },
                    React.createElement('div', {
                        className: 'bg-white rounded-lg p-6 shadow-lg hover-lift'
                    },
                        React.createElement('div', {
                            className: 'text-3xl font-bold text-primary-500 mb-2'
                        }, '408+'),
                        React.createElement('p', {
                            className: 'text-gray-600'
                        }, 'Partner Universities')
                    ),
                    React.createElement('div', {
                        className: 'bg-white rounded-lg p-6 shadow-lg hover-lift'
                    },
                        React.createElement('div', {
                            className: 'text-3xl font-bold text-primary-500 mb-2'
                        }, '50+'),
                        React.createElement('p', {
                            className: 'text-gray-600'
                        }, 'Countries Covered')
                    ),
                    React.createElement('div', {
                        className: 'bg-white rounded-lg p-6 shadow-lg hover-lift'
                    },
                        React.createElement('div', {
                            className: 'text-3xl font-bold text-primary-500 mb-2'
                        }, '3 min'),
                        React.createElement('p', {
                            className: 'text-gray-600'
                        }, 'Average Completion Time')
                    )
                )
            )
        ),

        // Footer
        React.createElement(Footer)
    );
}

// Chat Page Component
function ChatPage() {
    const [messages, setMessages] = React.useState([]);
    const [currentStep, setCurrentStep] = React.useState(0);
    const [sessionId, setSessionId] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isCompleted, setIsCompleted] = React.useState(false);
    const [universities, setUniversities] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [showConsentDialog, setShowConsentDialog] = React.useState(false);
    const messagesContainerRef = React.useRef(null);

    // Auto-scroll to bottom when new messages are added
    React.useEffect(() => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, universities, isLoading]);

    // Initialize chat when component mounts
    React.useEffect(() => {
        // Check if URL has new=true parameter to force new chat
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const isNewChat = urlParams.get('new') === 'true';
        initializeChat(isNewChat);
    }, []);

    const initializeChat = async (forceNew = false) => {
        setIsLoading(true);
        setError(null);

        try {
            // Only try to resume if not forcing new chat and we have an incomplete session
            const existingSessionId = window.ScholarportAPI.storageUtils.getSessionId();
            if (existingSessionId && !forceNew) {
                // Only resume if the conversation was incomplete (not finished)
                const sessionData = window.ScholarportAPI.storageUtils.getSessionData();
                if (sessionData && !sessionData.completed) {
                    try {
                        const history = await window.ScholarportAPI.chatAPI.getConversationHistory(existingSessionId);
                        if (history.success && !history.completed) {
                            setSessionId(existingSessionId);
                            setMessages(history.messages.map(msg => ({
                                id: Date.now().toString() + Math.random(),
                                type: msg.type,
                                content: msg.content,
                                timestamp: msg.timestamp
                            })));
                            setCurrentStep(history.current_step);
                            setIsCompleted(history.completed);
                            setIsLoading(false);
                            return;
                        }
                    } catch (err) {
                        console.log('Could not resume conversation, starting new one');
                    }
                }
                // Clear old/completed session
                window.ScholarportAPI.storageUtils.clearSession();
            }

            // Start new conversation with real API
            const response = await window.ScholarportAPI.chatAPI.startConversation();

            if (response.success) {
                setSessionId(response.session_id);
                window.ScholarportAPI.storageUtils.setSessionId(response.session_id);

                const welcomeMessage = {
                    id: Date.now().toString(),
                    type: 'bot',
                    content: response.message,
                    timestamp: new Date().toISOString()
                };

                const firstQuestion = {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    content: response.question,
                    timestamp: new Date().toISOString()
                };

                setMessages([welcomeMessage, firstQuestion]);
                setCurrentStep(response.current_step);
                setIsLoading(false);
            } else {
                throw new Error('Failed to start conversation');
            }
        } catch (error) {
            console.error('Error initializing chat:', error);
            setError(`Failed to start conversation: ${error.message}`);
            setIsLoading(false);
        }
    };

    const sendMessage = async (message) => {
        if (!message.trim() || !sessionId) return;

        setError(null);

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Send message to real API
            const response = await window.ScholarportAPI.chatAPI.sendMessage({
                session_id: sessionId,
                message: message
            });

            if (response.success) {
                const botMessage = {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    content: response.bot_response,
                    timestamp: new Date().toISOString()
                };

                setMessages(prev => [...prev, botMessage]);
                
                // Handle validation errors gracefully (NEW)
                // Don't advance step on validation error - let user retry
                if (response.validation_error) {
                    console.log('⚠️ Validation error - keeping current step');
                    // Keep suggestions visible for user to retry
                    setIsLoading(false);
                    return;
                }
                
                setCurrentStep(response.current_step);

                // Handle conversation completion
                if (response.completed === true && response.recommendations) {
                    setIsCompleted(true);
                    setUniversities(response.recommendations);

                    // Mark session as completed in storage
                    window.ScholarportAPI.storageUtils.markSessionCompleted();

                    // Show consent dialog after a short delay to let user read the recommendations
                    setTimeout(() => {
                        const consentMessage = {
                            id: (Date.now() + 2).toString(),
                            type: 'bot',
                            content: "Would you like me to save your details so our expert counselors can help you with the application process? 🌟",
                            timestamp: new Date().toISOString()
                        };
                        setMessages(prev => [...prev, consentMessage]);
                        setShowConsentDialog(true);
                    }, 2000);
                }
                // If conversation is not completed, just wait for next user input
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError(`Failed to send message: ${error.message}`);

            const errorMessage = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: "I'm sorry, I'm having trouble connecting to the server. Please try again in a moment.",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        }

        setIsLoading(false);
    };

    const handleConsentResponse = async (consent) => {
        console.log('🎯 Starting consent response handling:', { consent, sessionId });
        setShowConsentDialog(false);
        setIsLoading(true);
        setError(null); // Clear any existing errors

        try {
            console.log('📡 Calling submitConsent API...');
            const response = await window.ScholarportAPI.chatAPI.submitConsent({
                session_id: sessionId,
                consent: consent
            });

            console.log('📥 Received consent response:', response);

            if (response && response.success) {
                console.log('✅ Consent submission successful');
                const consentMessage = {
                    id: Date.now().toString(),
                    type: 'bot',
                    content: response.message,
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, consentMessage]);

                if (consent && response.data_saved) {
                    console.log('💾 Data was saved, clearing session in 5 seconds...');
                    // Clear session after successful consent submission
                    setTimeout(() => {
                        window.ScholarportAPI.storageUtils.clearSession();
                    }, 5000);
                }
            } else {
                console.error('❌ Response missing success field:', response);
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('❌ Consent submission failed:', error);
            setError(`Failed to submit consent: ${error.message}`);
        }

        setIsLoading(false);
    };

    const resetChat = () => {
        setMessages([]);
        setCurrentStep(0);
        setSessionId(null);
        setIsCompleted(false);
        setUniversities([]);
        setError(null);
        setShowConsentDialog(false);
        window.ScholarportAPI.storageUtils.clearSession();
        initializeChat(true); // Force new conversation
    };

    return React.createElement('div', {
        className: 'min-h-screen bg-gray-50 flex flex-col'
    },
        // Header with back button
        React.createElement(Header, {
            showBackButton: true,
            onBack: () => navigate('#home')
        }),

        // Chat Header with Progress and Actions
        React.createElement('div', {
            className: 'bg-white border-b py-3'
        },
            React.createElement('div', {
                className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3'
            },
                // Progress Bar Row - matching exact text boundaries like professional websites
                React.createElement('div', {
                    className: 'flex items-center justify-between'
                },
                    // Left side - Replicate exact header left structure to align with "Scholarport"
                    React.createElement('div', {
                        className: 'flex items-center flex-1'
                    },
                        // Back button spacer (invisible but takes same space)
                        React.createElement('div', {
                            className: 'mr-4 p-2 opacity-0', // Same space as back button
                            style: { width: '24px', height: '24px' }
                        }),
                        // Logo spacer (invisible but takes same space)
                        React.createElement('div', {
                            className: 'mr-3 opacity-0', // Same space as logo
                            style: { width: '32px', height: '32px' }
                        }),
                        // Progress bar extends to align with the end of "New Chat" text (last "t" in Chat)
                        React.createElement('div', {
                            className: 'relative',
                            style: { width: 'calc(100% - 20px)' } // Minimal space - progress bar extends almost to button end
                        },
                            React.createElement(ProgressBar, {
                                currentStep: currentStep,
                                totalSteps: 8
                            })
                        )
                    ),

                    // Minimal right spacer - just enough spacing from button end
                    React.createElement('div', {
                        className: 'flex-shrink-0 opacity-0 pointer-events-none',
                        style: { width: '20px' } // Small gap from the end of "Chat" text
                    })
                ),
                // Action Buttons Row
                React.createElement('div', {
                    className: 'flex justify-end space-x-2'
                },
                    React.createElement(Button, {
                        variant: 'outline',
                        size: 'sm',
                        onClick: resetChat,
                        disabled: isLoading
                    }, 'New Chat'),
                    error && React.createElement(Button, {
                        variant: 'outline',
                        size: 'sm',
                        onClick: () => initializeChat(true)
                    }, 'Retry')
                )
            )
        ),

        // Chat Container
        React.createElement('div', {
            className: 'flex-1 flex flex-col max-w-4xl mx-auto w-full'
        },
            // Messages Area with smooth auto-scroll
            React.createElement('div', {
                ref: messagesContainerRef,
                className: 'flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth'
            },
                messages.map(message =>
                    React.createElement('div', {
                        key: message.id,
                        className: `flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} chat-message`
                    },
                        React.createElement('div', {
                            className: `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.type === 'user'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white text-gray-900 border'
                            }`
                        }, message.content)
                    )
                ),

                // Typing indicator
                isLoading && React.createElement(TypingIndicator),

                // University recommendations
                universities.length > 0 && React.createElement('div', {
                    className: 'space-y-4 mt-6'
                },
                    universities.map(university =>
                        React.createElement(UniversityCard, {
                            key: university.id,
                            university: university
                        })
                    )
                )
            ),

            // Input Area (only show if not completed)
            !isCompleted && React.createElement(ChatInput, {
                onSendMessage: sendMessage,
                disabled: isLoading
            }),

            // Error message
            error && React.createElement('div', {
                className: 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mb-4'
            }, error),

            // Consent Dialog
            showConsentDialog && React.createElement(ConsentDialog, {
                onConsent: handleConsentResponse
            })
        ),
    );
}

// Chat Input Component with Auto-Focus and Smooth UX
function ChatInput(props) {
    const { onSendMessage, disabled } = props;
    const [message, setMessage] = React.useState('');
    const inputRef = React.useRef(null);

    // Auto-focus input when enabled and after bot responses
    React.useEffect(() => {
        if (!disabled && inputRef.current) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [disabled]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage('');

            // Keep focus on input for seamless typing experience
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    };

    return React.createElement('form', {
        onSubmit: handleSubmit,
        className: 'bg-white border-t p-4'
    },
        React.createElement('div', {
            className: 'flex space-x-2 max-w-4xl mx-auto'
        },
            React.createElement('input', {
                ref: inputRef,
                type: 'text',
                value: message,
                onChange: (e) => setMessage(e.target.value),
                placeholder: disabled ? 'Processing...' : 'Type your message...',
                disabled: disabled,
                autoComplete: 'off',
                className: 'flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 transition-all duration-200'
            }),
            React.createElement(Button, {
                type: 'submit',
                disabled: disabled || !message.trim(),
                className: 'px-6 py-2'
            }, disabled ? 'Sending...' : 'Send')
        )
    );
}

// University Card Component
// Updated: December 27, 2025 - Added Apply Now button with apply_url support
function UniversityCard(props) {
    const { university } = props;

    // Track Apply Now clicks for analytics
    const handleApplyClick = () => {
        if (window.ScholarportAPI && window.ScholarportAPI.analyticsUtils) {
            window.ScholarportAPI.analyticsUtils.trackEvent('apply_now_clicked', {
                university_name: university.name || university.university_name,
                apply_url: university.apply_url,
                timestamp: new Date().toISOString()
            });
        }
    };

    return React.createElement('div', {
        className: 'bg-white rounded-lg shadow-lg p-6 hover-lift border border-gray-200'
    },
        React.createElement('div', {
            className: 'flex justify-between items-start mb-4'
        },
            React.createElement('div', {},
                React.createElement('h3', {
                    className: 'text-xl font-bold text-gray-900 mb-2'
                }, university.name || university.university_name),
                React.createElement('p', {
                    className: 'text-gray-600 flex items-center'
                },
                    React.createElement('i', {
                        'data-lucide': 'map-pin',
                        className: 'w-4 h-4 mr-1'
                    }),
                    `${university.city}, ${university.country}`
                )
            ),
            React.createElement('span', {
                className: 'bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium'
            }, university.tuition)
        ),

        React.createElement('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'
        },
            React.createElement('div', {},
                React.createElement('p', {
                    className: 'text-sm text-gray-600 mb-1'
                }, 'Global Ranking'),
                React.createElement('p', {
                    className: 'font-semibold'
                }, `#${university.ranking}`)
            ),
            React.createElement('div', {},
                React.createElement('p', {
                    className: 'text-sm text-gray-600 mb-1'
                }, 'Popular Programs'),
                React.createElement('p', {
                    className: 'font-semibold text-sm'
                }, Array.isArray(university.programs) ? university.programs.slice(0, 3).join(', ') : 'Various Programs')
            )
        ),

        React.createElement('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'
        },
            React.createElement('div', {},
                React.createElement('p', {
                    className: 'text-sm text-gray-600 mb-1'
                }, 'IELTS Requirement'),
                React.createElement('p', {
                    className: 'font-semibold'
                }, university.ielts_requirement || university.ielts || 'N/A')
            ),
            React.createElement('div', {},
                React.createElement('p', {
                    className: 'text-sm text-gray-600 mb-1'
                }, 'Affordability'),
                React.createElement('p', {
                    className: 'font-semibold'
                }, university.affordability || 'Moderate')
            )
        ),

        // Region Badge (NEW)
        university.region && React.createElement('div', {
            className: 'mb-4'
        },
            React.createElement('span', {
                className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
            },
                React.createElement('i', {
                    'data-lucide': 'globe',
                    className: 'w-3 h-3 mr-1'
                }),
                university.region
            )
        ),

        university.why_selected && React.createElement('div', {
            className: 'bg-blue-50 rounded-lg p-4 mb-4'
        },
            React.createElement('p', {
                className: 'text-sm text-blue-800'
            },
                React.createElement('i', {
                    'data-lucide': 'lightbulb',
                    className: 'w-4 h-4 inline mr-2'
                }),
                'Why this match: ', university.why_selected
            )
        ),

        React.createElement('div', {
            className: 'flex space-x-2'
        },
            React.createElement(Button, {
                variant: 'outline',
                size: 'sm'
            }, 'Learn More'),
            // Apply Now Button with apply_url support (NEW)
            university.apply_url ? 
                React.createElement('a', {
                    href: university.apply_url,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    onClick: handleApplyClick,
                    className: 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-primary-500 to-indigo-600 text-white hover:from-primary-600 hover:to-indigo-700 focus:ring-primary-500 shadow-lg px-3 py-2 text-sm hover-lift'
                }, 
                    'Apply Now ',
                    React.createElement('span', { className: 'ml-1' }, '↗')
                ) :
                React.createElement(Button, {
                    size: 'sm',
                    variant: 'secondary',
                    onClick: () => {
                        // Handle contact counselor action
                        console.log('Contact counselor for:', university.name || university.university_name);
                    }
                }, 'Get Help Applying')
        )
    );
}

// Consent Dialog Component
function ConsentDialog(props) {
    const { onConsent } = props;

    return React.createElement('div', {
        className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    },
        React.createElement('div', {
            className: 'bg-white rounded-lg shadow-xl max-w-md w-full p-6'
        },
            React.createElement('div', {
                className: 'flex items-center mb-4'
            },
                React.createElement('i', {
                    'data-lucide': 'shield-check',
                    className: 'w-6 h-6 text-primary-500 mr-3'
                }),
                React.createElement('h3', {
                    className: 'text-lg font-semibold text-gray-900'
                }, 'Save Your Information?')
            ),

            React.createElement('p', {
                className: 'text-gray-600 mb-6'
            }, 'Would you like to save your information so our counselors can contact you with more details about these universities and help you with your applications?'),

            React.createElement('div', {
                className: 'flex space-x-3'
            },
                React.createElement(Button, {
                    variant: 'outline',
                    onClick: () => onConsent(false),
                    className: 'flex-1'
                }, 'No, Thanks'),
                React.createElement(Button, {
                    onClick: () => onConsent(true),
                    className: 'flex-1'
                }, 'Yes, Save Info')
            ),

            React.createElement('p', {
                className: 'text-xs text-gray-500 mt-4 text-center'
            }, 'Your data will be handled securely and used only to help you with university applications.')
        )
    );
}

// University Search Page Component
// Updated: December 27, 2025 - Added hybrid search, advanced filters, sorting, pagination
function UniversitySearchPage() {
    const [universities, setUniversities] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [filters, setFilters] = React.useState({
        search: '',
        country: '',
        region: '',
        program: '',
        affordability: '',
        max_ielts: '',
        sort_by: 'name',
        sort_order: 'asc',
        limit: 12
    });
    const [pagination, setPagination] = React.useState({
        offset: 0,
        total: 0,
        hasMore: false
    });
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

    React.useEffect(() => {
        loadUniversities();
    }, []);

    // Reinitialize icons when universities change
    React.useEffect(() => {
        if (window.lucide) {
            setTimeout(() => lucide.createIcons(), 100);
        }
    }, [universities]);

    const loadUniversities = async (searchFilters = filters, resetPagination = true) => {
        setLoading(true);
        setError(null);

        try {
            const filtersToSend = {
                ...searchFilters,
                offset: resetPagination ? 0 : pagination.offset
            };
            
            // Clean up empty values
            Object.keys(filtersToSend).forEach(key => {
                if (filtersToSend[key] === '' || filtersToSend[key] === null) {
                    delete filtersToSend[key];
                }
            });

            console.log('🔍 Loading universities with filters:', filtersToSend);
            const response = await window.ScholarportAPI.universityAPI.getUniversities(filtersToSend);
            console.log('📦 Raw response:', response);

            if (response.success) {
                const institutionsList = response.institutions || response.universities || [];
                console.log('✅ Institutions found:', institutionsList.length, institutionsList);
                setUniversities(institutionsList);
                
                // Update pagination state
                setPagination({
                    offset: resetPagination ? 0 : pagination.offset,
                    total: response.total_count || institutionsList.length,
                    hasMore: response.pagination?.has_more || false
                });
            } else {
                console.error('❌ Response not successful:', response);
                throw new Error('Failed to load universities');
            }
        } catch (err) {
            console.error('❌ Error loading universities:', err);
            setError(`Failed to load universities: ${err.message}`);
        }

        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, offset: 0 }));
        loadUniversities(filters, true);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleNextPage = () => {
        const newOffset = pagination.offset + filters.limit;
        setPagination(prev => ({ ...prev, offset: newOffset }));
        loadUniversities({ ...filters, offset: newOffset }, false);
    };

    const handlePrevPage = () => {
        const newOffset = Math.max(0, pagination.offset - filters.limit);
        setPagination(prev => ({ ...prev, offset: newOffset }));
        loadUniversities({ ...filters, offset: newOffset }, false);
    };

    const clearFilters = () => {
        const defaultFilters = {
            search: '',
            country: '',
            region: '',
            program: '',
            affordability: '',
            max_ielts: '',
            sort_by: 'name',
            sort_order: 'asc',
            limit: 12
        };
        setFilters(defaultFilters);
        setPagination({ offset: 0, total: 0, hasMore: false });
        loadUniversities(defaultFilters, true);
    };

    const currentPage = Math.floor(pagination.offset / filters.limit) + 1;
    const totalPages = Math.ceil(pagination.total / filters.limit);

    return React.createElement('div', {
        className: 'min-h-screen flex flex-col'
    },
        React.createElement(Header, {
            showBackButton: true,
            onBack: () => navigate('#home')
        }),

        React.createElement('div', {
            className: 'flex-1 bg-gray-50'
        },
            React.createElement('div', {
                className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
            },
                // Page Header
                React.createElement('div', {
                    className: 'flex justify-between items-center mb-8'
                },
                    React.createElement('div', {},
                        React.createElement('h1', {
                            className: 'text-3xl font-bold text-gray-900'
                        }, 'Explore Universities'),
                        React.createElement('p', {
                            className: 'text-gray-600 mt-1'
                        }, `${pagination.total} universities available`)
                    ),
                    React.createElement(Button, {
                        variant: 'outline',
                        size: 'sm',
                        onClick: () => setShowAdvancedFilters(!showAdvancedFilters)
                    }, showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters')
                ),

                // Search & Filters Form
                React.createElement('form', {
                    onSubmit: handleSearch,
                    className: 'bg-white rounded-lg shadow p-6 mb-8'
                },
                    // Basic Search Row - All inputs and buttons on same row
                    React.createElement('div', {
                        className: 'flex flex-col lg:flex-row gap-4 mb-4'
                    },
                        // Search Input - Takes more space
                        React.createElement('input', {
                            type: 'text',
                            placeholder: 'Search universities, programs, cities...',
                            value: filters.search,
                            onChange: (e) => handleFilterChange('search', e.target.value),
                            className: 'flex-1 lg:flex-[2] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500'
                        }),
                        // Region Dropdown
                        React.createElement('select', {
                            value: filters.region,
                            onChange: (e) => handleFilterChange('region', e.target.value),
                            className: 'flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white'
                        },
                            React.createElement('option', { value: '' }, 'All Regions'),
                            React.createElement('option', { value: 'Europe' }, 'Europe (254)'),
                            React.createElement('option', { value: 'North America' }, 'North America (118)'),
                            React.createElement('option', { value: 'Asia' }, 'Asia (15)'),
                            React.createElement('option', { value: 'Oceania' }, 'Oceania (10)'),
                            React.createElement('option', { value: 'Africa' }, 'Africa (6)'),
                            React.createElement('option', { value: 'Latin America' }, 'Latin America (4)')
                        ),
                        // Budget Dropdown
                        React.createElement('select', {
                            value: filters.affordability,
                            onChange: (e) => handleFilterChange('affordability', e.target.value),
                            className: 'flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white'
                        },
                            React.createElement('option', { value: '' }, 'All Budgets'),
                            React.createElement('option', { value: 'Free' }, 'Free'),
                            React.createElement('option', { value: 'Very Affordable' }, 'Very Affordable'),
                            React.createElement('option', { value: 'Affordable' }, 'Affordable'),
                            React.createElement('option', { value: 'Moderate' }, 'Moderate'),
                            React.createElement('option', { value: 'Expensive' }, 'Expensive'),
                            React.createElement('option', { value: 'Very Expensive' }, 'Very Expensive')
                        ),
                        // Action Buttons - Aligned on same row
                        React.createElement('div', {
                            className: 'flex gap-2 lg:gap-2'
                        },
                            React.createElement(Button, {
                                type: 'submit',
                                disabled: loading,
                                className: 'flex-1 lg:flex-none lg:min-w-[100px]'
                            }, loading ? 'Searching...' : 'Search'),
                            React.createElement(Button, {
                                type: 'button',
                                variant: 'outline',
                                onClick: clearFilters,
                                className: 'flex-1 lg:flex-none lg:min-w-[120px]'
                            }, 'Clear Filters')
                        )
                    ),

                    // Advanced Filters (Collapsible)
                    showAdvancedFilters && React.createElement('div', {
                        className: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pt-4 border-t border-gray-200'
                    },
                        React.createElement('input', {
                            type: 'text',
                            placeholder: 'Country (e.g., UK, USA)',
                            value: filters.country,
                            onChange: (e) => handleFilterChange('country', e.target.value),
                            className: 'border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500'
                        }),
                        React.createElement('input', {
                            type: 'text',
                            placeholder: 'Program (e.g., Computer Science)',
                            value: filters.program,
                            onChange: (e) => handleFilterChange('program', e.target.value),
                            className: 'border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500'
                        }),
                        React.createElement('input', {
                            type: 'number',
                            placeholder: 'Max IELTS (e.g., 6.5)',
                            step: '0.5',
                            min: '4',
                            max: '9',
                            value: filters.max_ielts,
                            onChange: (e) => handleFilterChange('max_ielts', e.target.value),
                            className: 'border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500'
                        }),
                        React.createElement('select', {
                            value: filters.sort_by,
                            onChange: (e) => handleFilterChange('sort_by', e.target.value),
                            className: 'border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white'
                        },
                            React.createElement('option', { value: 'name' }, 'Sort by Name'),
                            React.createElement('option', { value: 'country' }, 'Sort by Country'),
                            React.createElement('option', { value: 'ranking' }, 'Sort by Ranking')
                        )
                    ),

                    // Sort Order Toggle (Only visible when advanced filters are shown)
                    showAdvancedFilters && React.createElement('div', {
                        className: 'flex justify-end pt-2'
                    },
                        React.createElement('button', {
                            type: 'button',
                            onClick: () => handleFilterChange('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc'),
                            className: 'flex items-center text-gray-600 hover:text-primary-500 transition-colors'
                        },
                            React.createElement('i', {
                                'data-lucide': filters.sort_order === 'asc' ? 'arrow-up' : 'arrow-down',
                                className: 'w-4 h-4 mr-1'
                            }),
                            filters.sort_order === 'asc' ? 'Ascending' : 'Descending'
                        )
                    )
                ),

                // Error message
                error && React.createElement('div', {
                    className: 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'
                }, error),

                // Loading state
                loading && React.createElement('div', {
                    className: 'text-center py-12'
                }, React.createElement(TypingIndicator)),

                // Universities grid
                universities.length > 0 && React.createElement('div', {
                    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'
                },
                    universities.map(university =>
                        React.createElement(UniversityCard, {
                            key: university.id,
                            university: university
                        })
                    )
                ),

                // Pagination Controls
                universities.length > 0 && React.createElement('div', {
                    className: 'flex justify-center items-center space-x-4 py-6'
                },
                    React.createElement(Button, {
                        variant: 'outline',
                        size: 'sm',
                        disabled: pagination.offset === 0,
                        onClick: handlePrevPage
                    }, '← Previous'),
                    React.createElement('span', {
                        className: 'text-gray-600'
                    }, `Page ${currentPage} of ${totalPages || 1}`),
                    React.createElement(Button, {
                        variant: 'outline',
                        size: 'sm',
                        disabled: !pagination.hasMore,
                        onClick: handleNextPage
                    }, 'Next →')
                ),

                // No results
                !loading && universities.length === 0 && !error && React.createElement('div', {
                    className: 'text-center py-12'
                },
                    React.createElement('div', {
                        className: 'max-w-md mx-auto'
                    },
                        React.createElement('i', {
                            'data-lucide': 'search-x',
                            className: 'w-16 h-16 text-gray-300 mx-auto mb-4'
                        }),
                        React.createElement('p', {
                            className: 'text-gray-600 text-lg mb-4'
                        }, 'No universities found matching your criteria.'),
                        React.createElement(Button, {
                            variant: 'outline',
                            onClick: clearFilters
                        }, 'Clear Filters & Try Again')
                    )
                )
            )
        ),

        // Footer
        React.createElement(Footer)
    );
}

// Main App Component
function App() {
    const { route } = useRouter();

    React.useEffect(() => {
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }, [route]);

    let currentPage;
    // Extract route without parameters for matching
    const routeBase = route.split('?')[0];

    if (routeBase === '#chat') {
        currentPage = React.createElement(ChatPage);
    } else if (routeBase === '#universities') {
        currentPage = React.createElement(UniversitySearchPage);
    } else {
        currentPage = React.createElement(LandingPage);
    }

    return React.createElement('div', {
        className: 'min-h-screen flex flex-col font-inter'
    }, currentPage);
}

// Initialize and render the application
function startApp() {
    if (isAPIReady()) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
    } else {
        // Retry after a short delay if API isn't ready
        setTimeout(startApp, 100);
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}