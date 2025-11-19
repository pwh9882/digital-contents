import React from 'react';

const Card = ({
  children,
  className = '',
  title,
  subtitle,
  variant = 'elevated', // elevated, outlined, flat
  padding = 'md', // none, sm, md, lg
  onClick,
  ...props
}) => {

  const variants = {
    elevated: "bg-white shadow-soft border border-neutral-100",
    outlined: "bg-white border border-neutral-200",
    flat: "bg-neutral-50 border border-transparent",
    glass: "glass-card",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`rounded-2xl transition-all ${variants[variant]} ${paddings[padding]} ${className} ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-bold text-neutral-800">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
