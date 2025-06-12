import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-4 text-center text-sm text-muted-foreground">
      <p>&copy; {currentYear} AI Image Generator. All rights reserved.</p>
    </footer>
  );
}
