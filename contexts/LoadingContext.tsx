import React, { createContext, useContext, useState, useEffect } from 'react';

type LoadState = 'loading' | 'timeout' | 'loaded';

const LoadingContext = createContext<LoadState>('loading');

export const useLoadingState = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadState, setLoadState] = useState<LoadState>('loading');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const testMode = params.get('hero'); // ?hero=slow | ?hero=fail

    let isFullyLoaded = false;
    let desktopLoaded = false;
    let mobileLoaded = false;

    const checkComplete = () => {
      if (desktopLoaded && mobileLoaded) {
        isFullyLoaded = true;
        setLoadState('loaded');
        document.body.style.overflow = 'unset';
      }
    };

    if (testMode === 'fail') {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        setLoadState('timeout');
        document.body.style.overflow = 'unset';
      }, 4500);
      return () => { clearTimeout(timer); document.body.style.overflow = 'unset'; };
    }

    const desktopImg = new window.Image();
    const mobileImg = new window.Image();
    desktopImg.src = "/images/hero-landscae.png";
    mobileImg.src = "/images/hero.jpg";

    if (testMode === 'slow') {
      setTimeout(() => { desktopLoaded = true; checkComplete(); }, 8000);
      setTimeout(() => { mobileLoaded = true; checkComplete(); }, 8000);
    } else {
      desktopImg.onload = () => { desktopLoaded = true; checkComplete(); };
      mobileImg.onload = () => { mobileLoaded = true; checkComplete(); };
      if (desktopImg.complete) desktopLoaded = true;
      if (mobileImg.complete) mobileLoaded = true;
      checkComplete();
    }

    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      if (!isFullyLoaded) {
        setLoadState('timeout');
        document.body.style.overflow = 'unset';
      }
    }, 4500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <LoadingContext.Provider value={loadState}>
      {children}
    </LoadingContext.Provider>
  );
};
