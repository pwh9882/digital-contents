import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'md', // sm, md, lg, xl
  className = '',
  to,
  disabled,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary: 'bg-primary text-primary-contrast hover:bg-primary-hover shadow-lg shadow-primary/30 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-contrast hover:bg-secondary-hover shadow-lg shadow-secondary/30 focus:ring-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary-light focus:ring-primary dark:hover:bg-primary-900/30',
    ghost: 'text-text-muted hover:bg-bg-highlight hover:text-text-main focus:ring-text-muted',
    danger: 'bg-error text-white hover:bg-red-600 shadow-lg shadow-error/30 focus:ring-error',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl font-bold',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
