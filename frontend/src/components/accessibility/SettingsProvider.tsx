'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type TextSize = 'small' | 'normal' | 'large' | 'xlarge';

interface SettingsContextType {
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  textSize: TextSize;
  setTextSize: (v: TextSize) => void;
  signingSpeed: number;
  setSigningSpeed: (v: number) => void;
  showSubtitles: boolean;
  setShowSubtitles: (v: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  highContrast: false,
  textSize: 'normal' as TextSize,
  signingSpeed: 1.0,
  showSubtitles: true,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(defaultSettings.highContrast);
  const [textSize, setTextSize] = useState<TextSize>(defaultSettings.textSize);
  const [signingSpeed, setSigningSpeed] = useState(defaultSettings.signingSpeed);
  const [showSubtitles, setShowSubtitles] = useState(defaultSettings.showSubtitles);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem('isl-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.highContrast === 'boolean') setHighContrast(parsed.highContrast);
        if (['small', 'normal', 'large', 'xlarge'].includes(parsed.textSize)) setTextSize(parsed.textSize);
        if (typeof parsed.signingSpeed === 'number') setSigningSpeed(parsed.signingSpeed);
        if (typeof parsed.showSubtitles === 'boolean') setShowSubtitles(parsed.showSubtitles);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  }, []);

  // Save to localStorage and apply side-effects when settings change
  useEffect(() => {
    if (!isMounted) return;
    
    // Save
    localStorage.setItem('isl-settings', JSON.stringify({
      highContrast, textSize, signingSpeed, showSubtitles
    }));

    // Apply High Contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }

    // Apply Text Size via root font size
    let rootSize = '16px';
    if (textSize === 'small') rootSize = '14px';
    if (textSize === 'large') rootSize = '18px';
    if (textSize === 'xlarge') rootSize = '20px';
    document.documentElement.style.fontSize = rootSize;
    
  }, [highContrast, textSize, signingSpeed, showSubtitles, isMounted]);

  const resetSettings = () => {
    setHighContrast(defaultSettings.highContrast);
    setTextSize(defaultSettings.textSize);
    setSigningSpeed(defaultSettings.signingSpeed);
    setShowSubtitles(defaultSettings.showSubtitles);
  };

  // Prevent hydration mismatch by not rendering children until mounted (or render unstyled)
  // Rendering children is necessary to avoid flicker, so we just let them render with defaults during SSR
  return (
    <SettingsContext.Provider value={{
      highContrast, setHighContrast,
      textSize, setTextSize,
      signingSpeed, setSigningSpeed,
      showSubtitles, setShowSubtitles,
      resetSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
