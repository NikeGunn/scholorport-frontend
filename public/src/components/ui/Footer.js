// Footer component for Scholarport
function Footer() {
    const currentYear = new Date().getFullYear();

    // Coming Soon Badge Component - Minimal style matching brand
    const ComingSoonBadge = () => React.createElement('span', {
        className: 'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-600 ml-2 border border-primary-100'
    }, 
        React.createElement('span', {
            className: 'w-1 h-1 bg-primary-400 rounded-full mr-1'
        }),
        'Soon'
    );

    return React.createElement('footer', {
        className: 'bg-white border-t border-gray-200'
    },
        // Main Footer Content
        React.createElement('div', {
            className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'
        },
            React.createElement('div', {
                className: 'grid grid-cols-2 md:grid-cols-4 gap-8'
            },
                // Company Info
                React.createElement('div', {
                    className: 'col-span-2 md:col-span-1'
                },
                    React.createElement('a', {
                        href: '/',
                        className: 'flex items-center mb-4'
                    },
                        React.createElement('img', {
                            src: './image/mainLogo.png',
                            alt: 'Scholarport logo',
                            className: 'h-9 w-auto object-cover'
                        })
                    ),
                    React.createElement('p', {
                        className: 'text-gray-500 text-sm leading-relaxed mb-4'
                    }, 'AI-powered study abroad guidance. Find your perfect university with personalized recommendations.'),
                    // Social Links
                    React.createElement('div', {
                        className: 'flex space-x-2'
                    },
                        React.createElement('a', {
                            href: 'https://www.facebook.com/profile.php?id=61576616633733',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: 'w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-500 transition-all duration-200'
                        },
                            React.createElement('i', { 'data-lucide': 'facebook', className: 'w-4 h-4' })
                        ),
                        React.createElement('a', {
                            href: 'https://www.instagram.com/scholar.port/',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: 'w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition-all duration-200'
                        },
                            React.createElement('i', { 'data-lucide': 'instagram', className: 'w-4 h-4' })
                        ),
                        React.createElement('a', {
                            href: 'https://www.linkedin.com/company/scholarport/posts/?feedView=all',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: 'w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200'
                        },
                            React.createElement('i', { 'data-lucide': 'linkedin', className: 'w-4 h-4' })
                        )
                    )
                ),

                // Company Links
                React.createElement('div', {
                    className: 'col-span-1'
                },
                    React.createElement('h4', {
                        className: 'font-semibold text-gray-900 mb-3 text-sm'
                    }, 'Company'),
                    React.createElement('ul', {
                        className: 'space-y-2 text-sm'
                    },
                        React.createElement('li', {},
                            React.createElement('a', {
                                href: 'https://www.scholarport.co/about-us',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                className: 'text-gray-500 hover:text-primary-500 transition-colors'
                            }, 'About Us')
                        ),
                        React.createElement('li', {},
                            React.createElement('a', {
                                href: 'https://www.scholarport.co/contact',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                className: 'text-gray-500 hover:text-primary-500 transition-colors'
                            }, 'Contact Us')
                        ),
                        React.createElement('li', {},
                            React.createElement('span', {
                                className: 'text-gray-400 flex items-center'
                            },
                                'Careers',
                                React.createElement(ComingSoonBadge)
                            )
                        )
                    )
                ),

                // Resources
                React.createElement('div', {
                    className: 'col-span-1'
                },
                    React.createElement('h4', {
                        className: 'font-semibold text-gray-900 mb-3 text-sm'
                    }, 'Resources'),
                    React.createElement('ul', {
                        className: 'space-y-2 text-sm'
                    },
                        React.createElement('li', {},
                            React.createElement('a', {
                                href: '#universities',
                                className: 'text-gray-500 hover:text-primary-500 transition-colors'
                            }, 'Universities')
                        ),
                        React.createElement('li', {},
                            React.createElement('span', {
                                className: 'text-gray-400 flex items-center'
                            },
                                'Study Guides',
                                React.createElement(ComingSoonBadge)
                            )
                        ),
                        React.createElement('li', {},
                            React.createElement('span', {
                                className: 'text-gray-400 flex items-center'
                            },
                                'Blog',
                                React.createElement(ComingSoonBadge)
                            )
                        ),
                        React.createElement('li', {},
                            React.createElement('span', {
                                className: 'text-gray-400 flex items-center'
                            },
                                'FAQs',
                                React.createElement(ComingSoonBadge)
                            )
                        )
                    )
                ),

                // Legal
                React.createElement('div', {
                    className: 'col-span-1'
                },
                    React.createElement('h4', {
                        className: 'font-semibold text-gray-900 mb-3 text-sm'
                    }, 'Legal'),
                    React.createElement('ul', {
                        className: 'space-y-2 text-sm'
                    },
                        React.createElement('li', {},
                            React.createElement('span', {
                                className: 'text-gray-400 flex items-center'
                            },
                                'Privacy Policy',
                                React.createElement(ComingSoonBadge)
                            )
                        ),
                        React.createElement('li', {},
                            React.createElement('span', {
                                className: 'text-gray-400 flex items-center'
                            },
                                'Terms of Service',
                                React.createElement(ComingSoonBadge)
                            )
                        ),
                        React.createElement('li', {},
                            React.createElement('span', {
                                className: 'text-gray-400 flex items-center'
                            },
                                'Cookie Policy',
                                React.createElement(ComingSoonBadge)
                            )
                        )
                    )
                )
            )
        ),

        // Bottom Bar
        React.createElement('div', {
            className: 'border-t border-gray-100 bg-gray-50'
        },
            React.createElement('div', {
                className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'
            },
                React.createElement('div', {
                    className: 'flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0'
                },
                    React.createElement('p', {
                        className: 'text-xs text-gray-500'
                    }, '© ', currentYear, ' Scholarport Ltd. All rights reserved.'),
                    React.createElement('div', {
                        className: 'flex items-center space-x-4 text-xs text-gray-500'
                    },
                        // Beta Notice - Subtle inline mention
                        React.createElement('span', {
                            className: 'flex items-center text-primary-600'
                        },
                            React.createElement('span', {
                                className: 'w-1.5 h-1.5 bg-primary-500 rounded-full mr-1.5 animate-pulse'
                            }),
                            'AI Chatbot in Beta'
                        ),
                        React.createElement('span', {
                            className: 'text-gray-300'
                        }, '|'),
                        React.createElement('span', {
                            className: 'flex items-center'
                        },
                            React.createElement('span', {
                                className: 'w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5'
                            }),
                            'All systems operational'
                        )
                    )
                )
            )
        )
    );
}

window.Footer = Footer;