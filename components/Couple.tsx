import React from 'react';
import { motion } from 'framer-motion';

export const Couple: React.FC = () => {
  return (
    <section id="couple" className="relative w-full bg-ivory py-32 px-6 md:px-12 overflow-hidden flex flex-col justify-center">
        {/* Background Decorative Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03]">
             <h3 className="font-display text-[40vw] leading-none text-wine">V&J</h3>
        </div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative z-10 items-center">
            
            {/* Vita Info */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center md:items-end text-center md:text-right"
            >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-wine-light mb-6">Mempelai Wanita</span>
                <h2 className="font-display text-4xl md:text-6xl text-wine mb-4 leading-none">
                    Alvita<br/>Fabiola<br/>Aprilia
                </h2>
                <div className="w-12 h-px bg-wine/30 my-6"></div>
                <p className="font-serif italic text-xl text-wine-dark/80">Putri dari Bapak & Ibu ...</p>
                <p className="font-sans text-sm tracking-widest uppercase mt-2 text-wine-light">18 April 1998</p>
            </motion.div>

            {/* Divider for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-px bg-wine/20"></div>

            {/* Jessen Info */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex flex-col items-center md:items-start text-center md:text-left"
            >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-wine-light mb-6">Mempelai Pria</span>
                <h2 className="font-display text-4xl md:text-6xl text-wine mb-4 leading-none">
                    Muhammad<br/>Jessen<br/>Reinhart
                </h2>
                <div className="w-12 h-px bg-wine/30 my-6"></div>
                <p className="font-serif italic text-xl text-wine-dark/80">Putra dari Bapak & Ibu ...</p>
                <p className="font-sans text-sm tracking-widest uppercase mt-2 text-wine-light">12 Juni 1996</p>
            </motion.div>

        </div>
    </section>
  );
};