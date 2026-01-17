import React from 'react';
import { Hero } from './components/Hero';
import { Couple } from './components/Couple';
import { Venue } from './components/Venue';
import { Event } from './components/Event';
import { RSVP } from './components/RSVP';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  return (
    <main className="w-full bg-ivory text-wine selection:bg-wine selection:text-ivory">
      <Navigation />
      
      <AnimatePresence mode='wait'>
        <div className="flex flex-col relative z-10">
          <Hero />
          <Couple />
          <Venue />
          <Event />
          <RSVP />
          <Footer />
        </div>
      </AnimatePresence>
      
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[9999] mix-blend-multiply"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
           }}>
      </div>
    </main>
  );
};

export default App;