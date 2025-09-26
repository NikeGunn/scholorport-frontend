// Loading Spinner component for Scholarport
function LoadingSpinner(props) {
    const { size = 'md', color = 'primary-500', className = '' } = props;

    let sizeClass = '';
    if (size === 'sm') sizeClass = 'w-4 h-4';
    else if (size === 'md') sizeClass = 'w-8 h-8';
    else if (size === 'lg') sizeClass = 'w-12 h-12';

    return React.createElement('div', {
        className: `inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${sizeClass} ${className}`,
        role: 'status'
    },
        React.createElement('span', {
            className: 'sr-only'
        }, 'Loading...')
    );
}

// Typing indicator for chat
function TypingIndicator() {
    return React.createElement('div', {
        className: 'flex items-center space-x-2 p-4'
    },
        React.createElement('div', {
            className: 'flex space-x-1'
        },
            React.createElement('div', {
                className: 'w-2 h-2 bg-primary-500 rounded-full animate-bounce'
            }),
            React.createElement('div', {
                className: 'w-2 h-2 bg-primary-500 rounded-full animate-bounce',
                style: { animationDelay: '0.1s' }
            }),
            React.createElement('div', {
                className: 'w-2 h-2 bg-primary-500 rounded-full animate-bounce',
                style: { animationDelay: '0.2s' }
            })
        ),
        React.createElement('span', {
            className: 'text-sm text-gray-500'
        }, 'Scholarport AI is typing...')
    );
}

// Progress Bar component
function ProgressBar(props) {
    const { currentStep, totalSteps, className = '' } = props;
    const progress = (currentStep / totalSteps) * 100;

    return React.createElement('div', {
        className: `w-full ${className}`
    },
        React.createElement('div', {
            className: 'flex justify-between items-center mb-2'
        },
            React.createElement('span', {
                className: 'text-sm font-medium text-gray-700'
            }, 'Progress'),
            React.createElement('span', {
                className: 'text-sm text-gray-600 hidden sm:block'
            }, `Step ${currentStep} of ${totalSteps}`)
        ),
        // Progress bar container with proper right boundary
        React.createElement('div', {
            className: 'relative'
        },
            React.createElement('div', {
                className: 'w-full bg-gray-200 rounded-full h-2'
            },
                React.createElement('div', {
                    className: 'bg-primary-500 h-2 rounded-full transition-all duration-500 ease-in-out',
                    style: { width: `${progress}%` }
                })
            )
        )
    );
}

// Toast notification component
function Toast(props) {
    const { message, type = 'info', onClose, duration = 5000 } = props;

    React.useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    let typeClasses = '';
    if (type === 'success') typeClasses = 'bg-green-50 border-green-200 text-green-800';
    else if (type === 'error') typeClasses = 'bg-red-50 border-red-200 text-red-800';
    else if (type === 'warning') typeClasses = 'bg-yellow-50 border-yellow-200 text-yellow-800';
    else typeClasses = 'bg-blue-50 border-blue-200 text-blue-800';

    return React.createElement('div', {
        className: `fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-lg animate-slideUp ${typeClasses}`
    },
        React.createElement('div', {
            className: 'flex items-center justify-between'
        },
            React.createElement('span', {
                className: 'text-sm font-medium'
            }, message),
            React.createElement('button', {
                onClick: onClose,
                className: 'ml-4 text-gray-400 hover:text-gray-600'
            },
                React.createElement('i', {
                    'data-lucide': 'x',
                    className: 'w-4 h-4'
                })
            )
        )
    );
}

// Modal component
function Modal(props) {
    const { isOpen, onClose, title, children, className = '' } = props;

    if (!isOpen) return null;

    return React.createElement('div', {
        className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50',
        onClick: onClose
    },
        React.createElement('div', {
            className: `bg-white rounded-lg shadow-xl max-w-md w-full ${className}`,
            onClick: (e) => e.stopPropagation()
        },
            React.createElement('div', {
                className: 'flex items-center justify-between p-6 border-b'
            },
                React.createElement('h3', {
                    className: 'text-lg font-semibold'
                }, title),
                React.createElement('button', {
                    onClick: onClose,
                    className: 'text-gray-400 hover:text-gray-600'
                },
                    React.createElement('i', {
                        'data-lucide': 'x',
                        className: 'w-6 h-6'
                    })
                )
            ),
            React.createElement('div', {
                className: 'p-6'
            }, children)
        )
    );
}

// Export all components to global scope
window.LoadingSpinner = LoadingSpinner;
window.TypingIndicator = TypingIndicator;
window.ProgressBar = ProgressBar;
window.Toast = Toast;
window.Modal = Modal;