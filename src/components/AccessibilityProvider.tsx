"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Modes = {
  contrast: boolean;
  large: boolean;
  reducedMotion: boolean;
};

const Ctx = createContext<{
  modes: Modes;
  setModes: (m: Partial<Modes>) => void;
} | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [modes, setModesState] = useState<Modes>({
    contrast: false,
    large: false,
    reducedMotion: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("campusos-a11y");
      if (raw) setModesState(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-contrast", modes.contrast);
    root.classList.toggle("theme-large", modes.large);
    root.classList.toggle("theme-reduced-motion", modes.reducedMotion);
    localStorage.setItem("campusos-a11y", JSON.stringify(modes));
  }, [modes]);

  function setModes(partial: Partial<Modes>) {
    setModesState((m) => ({ ...m, ...partial }));
  }

  return <Ctx.Provider value={{ modes, setModes }}>{children}</Ctx.Provider>;
}

export function useA11y() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useA11y outside provider");
  return ctx;
}
