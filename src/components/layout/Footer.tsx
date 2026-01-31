import React from 'react';
import { APP_VERSION_LABEL } from '../../config/version';

export function Footer() {
  return (
    <footer className="py-4 text-center text-xs text-gray-500">
      {APP_VERSION_LABEL}
    </footer>
  );
}
