import React from 'react';
import { motion } from 'framer-motion';
import { ITINERARY_ITEMS } from '../constants';
import { Clock } from 'lucide-react';

export const Event: React.FC = () => {
  return (
    <section id="event" className="relative w-full bg-ivory py-32 md:py-48 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="flex flex-col items-center mb-24"
        >
          <h2 className="font-display text-wine text-6xl md:text-8xl mb-4 text-center">Susunan Acara</h2>
          <div className="h-24 w-px bg-wine/20 mb-4"></div>
          <span className="font-sans text-xs tracking-[0.3em] uppercase text-wine">02 Mei 2026</span>
        </motion.div>

        <div className="grid grid-cols-1 border-t border-wine/10">
          {ITINERARY_ITEMS.map((item, index) => (
            <ItineraryRow key={index} item={item} index={index} />
          ))}
        </div>

        {/* Dress Code Section */}
        <div className="mt-32 p-8 md:p-16 bg-wine/5 border border-wine/10 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-wine/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left ease-[0.16,1,0.3,1]"></div>
            <div className="relative z-10">
                <h3 className="font-serif text-2xl md:text-4xl italic mb-6 text-wine">Busana: Formal & Elegan</h3>
                <p className="font-sans text-wine-light max-w-lg mx-auto">
                    Kami mengharapkan kehadiran Anda dengan balutan busana berwarna netral atau earth tone. 
                    Sentuhan merah anggur (wine) sangat diapresiasi untuk menyelaraskan suasana.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
};

const ItineraryRow: React.FC<{ item: any; index: number }> = ({ item, index }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative border-b border-wine/10 grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:py-16 hover:bg-white/50 transition-colors duration-500"
        >
            {/* Time */}
            <div className="md:col-span-3 flex items-start">
                <div className="flex items-center gap-3 font-sans font-medium text-xl md:text-2xl text-wine/80 group-hover:text-wine transition-colors">
                    <Clock size={18} className="text-wine-light" />
                    {item.time}
                </div>
            </div>

            {/* Title */}
            <div className="md:col-span-5">
                <h3 className="font-serif text-3xl md:text-5xl text-wine group-hover:translate-x-4 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                    {item.title}
                </h3>
            </div>

            {/* Description */}
            <div className="md:col-span-4 flex items-center">
                <p className="font-sans text-wine-light font-light text-sm md:text-base leading-relaxed group-hover:text-wine transition-colors">
                    {item.description}
                </p>
            </div>
        </motion.div>
    );
};