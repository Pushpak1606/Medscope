import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "dark" | "light" | "system"

export type AccentPresetKey = 
  | "ocean" 
  | "emerald" 
  | "violet" 
  | "sunset" 
  | "crimson" 
  | "aqua" 
  | "amber" 
  | "custom";

export interface AccentPreset {
  id: AccentPresetKey;
  label: string;
  desc: string;
  previewHex: string;
  lightHsl: string;
  darkHsl: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  {
    id: "ocean",
    label: "Ocean Blue",
    desc: "Default Medscope classic vibrant blue",
    previewHex: "#3b82f6",
    lightHsl: "220 80% 55%",
    darkHsl: "222 85% 65%",
  },
  {
    id: "emerald",
    label: "Emerald Mint",
    desc: "Refreshing clinical healing mint",
    previewHex: "#10b981",
    lightHsl: "160 84% 39%",
    darkHsl: "160 84% 48%",
  },
  {
    id: "violet",
    label: "Cyber Violet",
    desc: "Modern royal amethyst glow",
    previewHex: "#8b5cf6",
    lightHsl: "270 75% 55%",
    darkHsl: "270 85% 68%",
  },
  {
    id: "sunset",
    label: "Sunset Coral",
    desc: "Warm energetic coral aura",
    previewHex: "#f97316",
    lightHsl: "18 90% 52%",
    darkHsl: "18 95% 60%",
  },
  {
    id: "crimson",
    label: "Ruby Crimson",
    desc: "High priority vivid crimson red",
    previewHex: "#f43f5e",
    lightHsl: "345 82% 52%",
    darkHsl: "345 90% 64%",
  },
  {
    id: "aqua",
    label: "Neon Aqua",
    desc: "Futuristic energetic cyan teal",
    previewHex: "#06b6d4",
    lightHsl: "190 90% 42%",
    darkHsl: "190 95% 50%",
  },
  {
    id: "amber",
    label: "Obsidian Gold",
    desc: "Premium warm golden amber",
    previewHex: "#eab308",
    lightHsl: "42 90% 45%",
    darkHsl: "43 96% 56%",
  },
];

export function hexToHsl(hex: string): { lightHsl: string; darkHsl: string } {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  if (c.length !== 6) {
    return { lightHsl: "220 80% 55%", darkHsl: "222 85% 65%" };
  }
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPctLight = Math.max(25, Math.min(65, Math.round(l * 100)));
  const lPctDark = Math.max(45, Math.min(80, Math.round(l * 100 + 10)));

  return {
    lightHsl: `${hDeg} ${sPct}% ${lPctLight}%`,
    darkHsl: `${hDeg} ${sPct}% ${lPctDark}%`,
  };
}

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  accentStorageKey?: string
  customAccentStorageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  accentColor: AccentPresetKey
  setAccentColor: (accent: AccentPresetKey) => void
  customHex: string
  setCustomHex: (hex: string) => void
  accentPresets: AccentPreset[]
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  accentColor: "ocean",
  setAccentColor: () => null,
  customHex: "#3b82f6",
  setCustomHex: () => null,
  accentPresets: ACCENT_PRESETS,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  accentStorageKey = "medscope-accent-color",
  customAccentStorageKey = "medscope-custom-accent",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const [accentColor, setAccentColorState] = useState<AccentPresetKey>(
    () => (localStorage.getItem(accentStorageKey) as AccentPresetKey) || "ocean"
  )

  const [customHex, setCustomHexState] = useState<string>(
    () => localStorage.getItem(customAccentStorageKey) || "#3b82f6"
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    let isDark = false
    if (theme === "system") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.add(isDark ? "dark" : "light")
    } else {
      isDark = theme === "dark"
      root.classList.add(theme)
    }

    // Apply Accent Color variables
    let activeHsl = ""
    if (accentColor === "custom" && customHex) {
      const hsl = hexToHsl(customHex)
      activeHsl = isDark ? hsl.darkHsl : hsl.lightHsl
    } else {
      const preset = ACCENT_PRESETS.find((p) => p.id === accentColor) || ACCENT_PRESETS[0]
      activeHsl = isDark ? preset.darkHsl : preset.lightHsl
    }

    if (activeHsl) {
      root.style.setProperty("--primary", activeHsl)
      root.style.setProperty("--ring", activeHsl)
      root.style.setProperty("--sidebar-primary", activeHsl)
      root.style.setProperty("--sidebar-ring", activeHsl)
    } else {
      root.style.removeProperty("--primary")
      root.style.removeProperty("--ring")
      root.style.removeProperty("--sidebar-primary")
      root.style.removeProperty("--sidebar-ring")
    }
  }, [theme, accentColor, customHex])

  const value: ThemeProviderState = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setThemeState(theme)
    },
    accentColor,
    setAccentColor: (accent: AccentPresetKey) => {
      localStorage.setItem(accentStorageKey, accent)
      setAccentColorState(accent)
    },
    customHex,
    setCustomHex: (hex: string) => {
      localStorage.setItem(customAccentStorageKey, hex)
      setCustomHexState(hex)
    },
    accentPresets: ACCENT_PRESETS,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

