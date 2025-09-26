// Button component for Scholarport
function Button(props) {
  const {
    children,
    onClick,
    disabled = false,
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button'
  } = props;

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover-lift';

  let variantClass = '';
  if (variant === 'primary') variantClass = 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-lg';
  else if (variant === 'secondary') variantClass = 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 shadow-lg';
  else if (variant === 'outline') variantClass = 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500';
  else if (variant === 'ghost') variantClass = 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500';

  let sizeClass = '';
  if (size === 'sm') sizeClass = 'px-3 py-2 text-sm';
  else if (size === 'md') sizeClass = 'px-6 py-3 text-base';
  else if (size === 'lg') sizeClass = 'px-8 py-4 text-lg';

  const classes = `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim();

  return React.createElement('button', {
    type,
    className: classes,
    onClick,
    disabled,
  }, children);
};

export default Button;