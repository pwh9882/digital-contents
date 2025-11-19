import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  to,
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) => {

  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/30 focus:ring-primary-500",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600 shadow-lg shadow-secondary-500/30 focus:ring-secondary-500",
    outline: "border-2 border-neutral-200 bg-transparent text-neutral-700 hover:border-primary-500 hover:text-primary-600 focus:ring-primary-500",
    ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-500",
    danger: "bg-error text-white hover:bg-red-600 shadow-lg shadow-red-500/30 focus:ring-red-500",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-6 py-3",
    xl: "text-lg px-8 py-4",
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
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
