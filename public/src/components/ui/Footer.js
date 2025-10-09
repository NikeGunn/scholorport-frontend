// Footer component for Scholarport
function Footer() {
    const currentYear = new Date().getFullYear();

    return React.createElement('footer', {
        className: 'bg-gray-50 border-t border-gray-200 mt-auto'
    },
        React.createElement('div', {
            className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
        },
            React.createElement('div', {
                className: 'grid grid-cols-1 md:grid-cols-4 gap-8'
            },
                // Company Info
                React.createElement('div', {
                    className: 'col-span-1 md:col-span-2'
                },
                    React.createElement('a', {
                        href: '/',
                        className: 'flex items-center mb-4'
                    },
                        React.createElement('img', {
                            src: './image/mainLogo.png',
                            alt: 'Scholarport logo',
                            className: 'h-11 w-auto object-cover'
                        })
                    ),
                    React.createElement('p', {
                        className: 'text-gray-600 mb-4'
                    }, 'AI-powered study abroad guidance. Find your perfect university with personalized recommendations.'),
                    React.createElement('p', {
                        className: 'text-sm text-gray-500'
                    }, '© ', currentYear, ' Scholarport Ltd. All rights reserved.')
                ),

                // Quick Links
                React.createElement('div', {
                    className: 'col-span-1'
                },
                    React.createElement('h4', {
                        className: 'font-semibold text-gray-900 mb-4'
                    }, 'Quick Links'),
                    React.createElement('ul', {
                        className: 'space-y-2 text-sm text-gray-600'
                    },
                        React.createElement('li', {},
                            React.createElement('a', {
                                href: '#',
                                className: 'hover:text-primary-500 transition-colors'
                            }, 'About Us')
                        ),
                        React.createElement('li', {},
                            React.createElement('a', {
                                href: '#',
                                className: 'hover:text-primary-500 transition-colors'
                            }, 'Universities')
                        ),
                        React.createElement('li', {},
                            React.createElement('a', {
                                href: '#',
                                className: 'hover:text-primary-500 transition-colors'
                            }, 'Contact')
                        )
                    )
                ),

                // Support
                React.createElement('div', {
                    className: 'col-span-1'
                },
                    React.createElement('h4', {
                        className: 'font-semibold text-gray-900 mb-4'
                    }, 'Support'),
                    React.createElement('ul', {
                        className: 'space-y-2 text-sm text-gray-600'
                    },
                        React.createElement('li', {},
                            React.createElement('a', {
                                href: '#',
                                className: 'hover:text-primary-500 transition-colors'
                            }, 'Help Center')
                        ),
                        React.createElement('li', {},
                            React.createElement('a', {
                                href: '#',
                                className: 'hover:text-primary-500 transition-colors'
                            }, 'Privacy Policy')
                        ),
                        React.createElement('li', {},
                            React.createElement('a', {
                                href: '#',
                                className: 'hover:text-primary-500 transition-colors'
                            }, 'Terms of Service')
                        )
                    )
                )
            )
        )
    );
}

window.Footer = Footer;