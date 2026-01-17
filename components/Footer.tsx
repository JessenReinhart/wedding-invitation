import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-wine-dark text-ivory/60 py-12 px-6 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center text-xs font-sans uppercase tracking-widest">
      <div className="mb-4 md:mb-0">
        &copy; 2026 Vita & Jessen
      </div>
      <div className="flex gap-6">
        <a href="#" className="hover:text-ivory transition-colors">Hadiah</a>
        <a href="#" className="hover:text-ivory transition-colors">Akomodasi</a>
        <a href="#" className="hover:text-ivory transition-colors">Kontak</a>
      </div>
    </footer>
  );
};