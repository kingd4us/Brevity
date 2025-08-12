import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">
        Your One Link for Everything
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Create a single, beautiful landing page to share all your important links with your audience, from one simple URL.
      </p>
      <div className="flex justify-center">
        <Link to="/register">
          <Button className="w-auto px-8 py-4 text-lg">
            Claim Your Username
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;