import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Map from './Map';

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
              initial={{ filter: "blur(0px) sepia(0) grayscale(0)" }}
              whileInView={{ filter: "blur(4px) sepia(0.2) grayscale(1)" }}
              transition={{ duration: 2, delay: 0.2 }}
              src="/images/venue-bg.jpg"
              alt="Amanaia Menteng Architecture"
              className="w-full h-full object-cover grayscale opacity-50 sepia-[.2]"
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col justify-center items-center p-8 bg-wine/30 mix-blend-multiply">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
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

        {/* Map Section */}
        <div className="mt-24 w-full">
          <div className="flex flex-col items-start text-left mb-10">
            <h3 className="font-display text-3xl md:text-4xl uppercase tracking-wide mb-6">Petunjuk Arah</h3>
            <p className="font-sans font-light text-ivory/80 max-w-lg leading-relaxed mb-8">
              Jl. Dr. Abdul Rahman Saleh I No.12, Kwitang, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10410
            </p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=-6.179173700072192,106.84046081165128"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-ivory text-wine font-sans uppercase tracking-widest text-sm font-bold overflow-hidden inline-block"
            >
              <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all">
                Buka Google Maps <ArrowRight size={16} />
              </span>
              <div className="absolute inset-0 bg-wine-light transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
              <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100 text-ivory pointer-events-none">
                Buka Google Maps <ArrowRight size={16} />
              </span>
            </a>
          </div>

          <div className="w-full h-px bg-ivory/20 mb-10"></div>

          <div className="w-full h-[400px] md:h-[500px] rounded-sm overflow-hidden border border-ivory/10 grayscale hover:grayscale-0 transition-all duration-700">
            <Map position={[-6.179173700072192, 106.84046081165128]} className="h-full w-full" />
          </div>
        </div>

      </div>
    </section>
  );
};