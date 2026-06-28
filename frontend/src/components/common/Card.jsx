import React from 'react';

/**
 * Card Component
 * 
 * Example usage:
 * <Card className="mb-4">
 *   <Card.Header title="Notice Board" action={<Button>Add</Button>} />
 *   <Card.Body>Content goes here</Card.Body>
 * </Card>
 */
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-surface-container-lowest border border-surface-container-highest rounded-card shadow-card ${className}`}>
      {children}
    </div>
  );
};

const Header = ({ title, subtitle, action, className = '' }) => (
  <div className={`p-6 pb-4 border-b border-surface-container flex justify-between items-center ${className}`}>
    <div>
      {title && <h3 className="text-title-lg font-semibold text-onSurface">{title}</h3>}
      {subtitle && <p className="text-body-md text-onSurface-variant mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

const Body = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Footer = ({ children, className = '' }) => (
  <div className={`p-6 pt-4 border-t border-surface-container bg-surface-container-lowest rounded-b-card ${className}`}>
    {children}
  </div>
);

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export default Card;
