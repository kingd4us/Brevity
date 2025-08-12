import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-border text-white mt-12 py-6">
  <div className="container mx-auto px-6 text-center text-gray-400">
    <p>&copy; {currentYear} Link-in-Bio. All Rights Reserved.</p>
    <p className="mt-2 text-sm">
      Built by Firdaus using vite + Typescript
    </p>
  </div>
</footer>
  );
};

export default Footer;