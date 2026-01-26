import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary-500 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">
          Strona nie znaleziona
        </h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Przepraszamy, ale strona której szukasz nie istnieje lub została
          przeniesiona.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button>
              <Home className="w-4 h-4" />
              Strona główna
            </Button>
          </Link>
          <Button variant="secondary" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
            Wróć
          </Button>
        </div>
      </div>
    </div>
  );
}
