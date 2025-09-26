// Header component for Scholarport
function Header(props) {
    const { showBackButton = false, onBack } = props;

    return React.createElement('header', {
        className: 'bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'
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
                    React.createElement('div', {
                        className: 'flex items-center'
                    },
                        React.createElement('div', {
                            className: 'w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3'
                        },
                            React.createElement('span', {
                                className: 'text-white font-bold text-lg'
                            }, 'S')
                        ),
                        React.createElement('h1', {
                            className: 'text-xl font-bold text-gray-900'
                        }, 'Scholarport')
                    )
                ),

                // Right side - Navigation or actions
                React.createElement('div', {
                    className: 'flex items-center space-x-4'
                },
                    React.createElement('span', {
                        className: 'text-sm text-gray-600 hidden sm:block'
                    }, 'Find Your Perfect University')
                )
            )
        )
    );
}

window.Header = Header;