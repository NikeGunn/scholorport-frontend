// Header component for Scholarport
function Header(props) {
    const { showBackButton = false, onBack } = props;
  
    return React.createElement('header', {
        className: 'bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 py-3'
    },
        React.createElement('div', {
            className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        },
            React.createElement('div', {
                className: 'flex items-center justify-between h-16'
            },
                // Left side - Back button or Logo
                React.createElement('div', {
                    className: 'flex items-center'
                },
                    showBackButton && React.createElement('button', {
                        onClick: onBack,
                        className: 'mr-4 p-2 text-gray-600 hover:text-primary-500 transition-colors'
                    },
                        React.createElement('i', {
                            'data-lucide': 'arrow-left',
                            className: 'w-6 h-6'
                        })
                    ),
                    // Logo and brand
                    React.createElement('a', {href:"/", className: 'flex items-center' },
                        React.createElement('img', {
                            src: "./image/mainLogo.png" ,
                            alt: 'Scholarport logo',
                            className: 'h-11 w-auto object-cover'
                        })
                    )
                ),

                // Right side - Navigation or actions
                React.createElement('div', {
                    className: 'flex items-center space-x-3'
                },
                    // Beta Badge - Clean, minimal design
                    React.createElement('div', {
                        className: 'flex items-center space-x-1.5 bg-primary-50 border border-primary-200 text-primary-600 px-2.5 py-1 rounded-md'
                    },
                        React.createElement('span', {
                            className: 'w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse'
                        }),
                        React.createElement('span', {
                            className: 'text-xs font-semibold tracking-wide'
                        }, 'BETA')
                    ),
                    React.createElement('span', {
                        className: 'text-sm text-gray-600 hidden lg:block'
                    }, 'Find Your Perfect University')
                )
            )
        )
    );
}

window.Header = Header;