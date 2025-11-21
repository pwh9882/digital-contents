import React from 'react';

const Card = ({
  children,
  className = '',
  variant = 'elevated', // elevated, outlined, flat, glass
  padding = 'md', // sm, md, lg, none
  title,
  subtitle,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300 overflow-hidden';

  const variants = {
    elevated: 'bg-[var(--bg-surface)] shadow-soft border border-[var(--border-base)] dark:shadow-dark-soft',
    outlined: 'bg-[var(--bg-surface)] border border-[var(--border-base)] hover:border-[var(--border-highlight)]',
    flat: 'bg-bg-highlight border-none',
    glass: 'glass-card',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-bold text-text-main mb-1">{title}</h3>}
          {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
