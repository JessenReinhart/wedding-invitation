import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Venue: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const clipPathInset = useTransform(
    scrollYProgress,
    [0.1, 0.5],
    ["15%", "0%"]
  );
  
  const imageScale = useTransform(
    scrollYProgress,
    [0.1, 0.6],
    [1.2, 1]
  );

  return (
    <section id="venue" ref={ref} className="relative min-h-screen w-full bg-wine text-ivory py-24 md:py-32 flex flex-col items-center">
      <div className="w-full max-w-[90%] md:max-w-6xl px-4 md:px-0 z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 border-b border-ivory/20 pb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl uppercase tracking-tight"
          >
            Lokasi
          </motion.h2>
          <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3, duration: 0.8 }}
             className="mt-6 md:mt-0 text-right font-sans font-light text-sm md:text-base tracking-widest text-ivory/70"
          >
            <p>AMANAIA MENTENG</p>
            <p>JAKARTA, INDONESIA</p>
          </motion.div>
        </div>

        {/* Main Visual */}
        <div className="relative w-full aspect-[4/5] md:aspect-[16/9] overflow-hidden">
          <motion.div 
            style={{ 
                clipPath: useTransform(clipPathInset, (val) => `inset(${val})`) 
            }}
            className="w-full h-full relative"
          >
            <motion.img 
              style={{ scale: imageScale }}
              src="https://picsum.photos/1920/1080?grayscale&blur=2" 
              alt="Amanaia Menteng Architecture" 
              className="w-full h-full object-cover grayscale opacity-90 sepia-[.2]"
            />
            
            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col justify-center items-center p-8 bg-wine/30 mix-blend-multiply">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-serif italic text-3xl md:text-5xl text-center leading-relaxed text-ivory max-w-2xl"
              >
                "Keanggunan dalam kesederhanaan, sebuah ruang untuk merayakan cinta yang abadi."
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Description Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-24">
            <div className="hidden md:block">
                 <div className="w-full h-px bg-ivory/20 mt-4"></div>
            </div>
            <div className="font-sans font-light text-lg md:text-xl text-ivory/80 leading-relaxed">
                <p className="mb-8">
                    Amanaia Menteng menjadi saksi penyatuan janji suci kami. Dengan arsitektur yang memadukan kekuatan struktur dan kelembutan alam, tempat ini melambangkan fondasi hubungan kami yang kokoh namun terus bertumbuh dengan indah.
                </p>
                <p>
                    Prosesi Akad Nikah akan dilangsungkan dengan khidmat di area taman, menyatu dengan alam, dilanjutkan dengan perayaan hangat bersama orang-orang terkasih.
                </p>
            </div>
        </div>

      </div>
    </section>
  );
};