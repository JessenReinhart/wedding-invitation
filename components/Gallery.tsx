import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Skeleton } from './ui/Skeleton';

// We hardcode the 19 gallery image paths from our inspection
const images = [
    '/images/gallery/Maestro-1006752.jpg',
    '/images/gallery/Maestro-1006762.jpg',
    '/images/gallery/Maestro-1006880.jpg',
    '/images/gallery/Maestro-1006917.jpg',
    '/images/gallery/Maestro-1006924.jpg',
    '/images/gallery/Maestro-1006937-2.jpg',
    '/images/gallery/Maestro-1006959.jpg',
    '/images/gallery/Maestro-1006966.jpg',
    '/images/gallery/Maestro-1006975.jpg',
    '/images/gallery/Maestro-1006977.jpg',
    '/images/gallery/Maestro-1007024.jpg',
    '/images/gallery/Maestro-1007030.jpg',
    '/images/gallery/Maestro-1007084.jpg',
    '/images/gallery/Maestro-1007118.jpg',
    '/images/gallery/Maestro-1007141.jpg',
    '/images/gallery/Maestro-1007152.jpg',
    '/images/gallery/Maestro-1007276.jpg',
    '/images/gallery/Maestro-1007289.jpg',
    '/images/gallery/Maestro-1008182.jpg',
];

export const Gallery: React.FC = () => {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});

    const handleImageLoad = (src: string) => {
        setLoadedImages(prev => ({ ...prev, [src]: true }));
    };

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    return (
        <section id="gallery" className="w-full bg-ivory py-24 md:py-32 px-6 md:px-12 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="font-sans text-xs tracking-[0.3em] uppercase text-wine-light mb-6 block">
                            {t('nav.gallery') || 'Gallery'}
                        </span>
                        <h2 className="font-display text-5xl md:text-7xl text-wine mb-6 leading-none drop-shadow-sm uppercase">
                            {t('gallery.memories')}
                        </h2>
                    </motion.div>
                </div>

                {/* Masonry Layout implementation using CSS Multi-Column */}
                {/* break-inside-avoid is applied inside the mapping to ensure elements aren't cut mid-column */}
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {images.map((src, index) => (
                        <motion.div
                            key={src}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "50px" }}
                            transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                            className="relative cursor-pointer overflow-hidden rounded-md group break-inside-avoid shadow-sm hover:shadow-xl transition-shadow"
                            onClick={() => setSelectedImage(src)}
                        >
                            {!loadedImages[src] && (
                                <Skeleton className="absolute inset-0 z-0 h-64 md:h-80" />
                            )}
                            
                            <motion.div 
                                layoutId={`gallery-image-${src}`}
                                className={`w-full h-full transition-opacity duration-700 ${loadedImages[src] ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <img
                                    src={src}
                                    alt={`Gallery detail ${index + 1}`}
                                    className="w-full h-auto object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
                                    loading="lazy"
                                    onLoad={() => handleImageLoad(src)}
                                />
                            </motion.div>
                            
                            {/* Overlay effect to make it feel premium */}
                            <div className="absolute inset-0 bg-wine/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-multiply" />
                        </motion.div>
                    ))}
                </div>

                {/* Expandable Lightbox */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 md:p-12 cursor-pointer backdrop-blur-md"
                        >
                            <div 
                                className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center pointer-events-none"
                            >
                                <motion.div
                                    layoutId={`gallery-image-${selectedImage}`}
                                    className="relative z-10 w-auto max-h-[85vh] drop-shadow-2xl"
                                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                >
                                    <img
                                        src={selectedImage}
                                        className="max-w-full max-h-[85vh] object-contain rounded-sm"
                                        alt="Expanded memory"
                                    />
                                </motion.div>
                                
                                <motion.button 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                                    exit={{ opacity: 0, y: -20, transition: { duration: 0.1 } }}
                                    className="absolute md:top-8 md:right-8 top-4 right-4 text-white/50 hover:text-white font-sans text-xs tracking-[0.2em] uppercase pointer-events-auto transition-colors z-20 flex items-center gap-2"
                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                                >
                                    <span>Close</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};
