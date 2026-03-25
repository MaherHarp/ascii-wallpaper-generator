import { create } from "zustand";
import { ASCII_CHARSETS, COLOR_MODES, CharsetType } from "@/lib/ascii-core";

export type AnimationMode = "None" | "Float" | "Rotate" | "Parallax";

export interface WallpaperConfig {
  // ASCII Settings
  resolution: number; // width in chars
  charSetType: CharsetType;
  customCharSet: string;
  invert: boolean;
  
  // Style Settings
  colorMode: string;
  customBg: string;
  customFg: string;
  fontSize: number; // For preview zooming mostly

  // Live Wallpaper Settings
  liveMode: boolean;
  animationMode: AnimationMode;
  animationSpeed: number; // 0.1 to 2.0
  parallaxIntensity: number;

  // Internal state
  imageFile: File | null;
  imageElement: HTMLImageElement | null;
  asciiGrid: string[][];
  isProcessing: boolean;
}

interface WallpaperStore extends WallpaperConfig {
  updateConfig: (updates: Partial<WallpaperConfig>) => void;
  setImage: (file: File | null, img: HTMLImageElement | null) => void;
  setAsciiGrid: (grid: string[][]) => void;
  randomize: () => void;
}

const DEFAULT_CONFIG: Partial<WallpaperConfig> = {
  resolution: 120,
  charSetType: "Standard",
  customCharSet: ASCII_CHARSETS.Standard,
  invert: false,
  colorMode: "Terminal",
  customBg: "#020603",
  customFg: "#00ff41",
  fontSize: 10,
  liveMode: false,
  animationMode: "Float",
  animationSpeed: 1.0,
  parallaxIntensity: 1.0,
  isProcessing: false,
};

export const useWallpaperStore = create<WallpaperStore>((set) => ({
  ...DEFAULT_CONFIG,
  imageFile: null,
  imageElement: null,
  asciiGrid: [],
  
  updateConfig: (updates) => set((state) => ({ ...state, ...updates })),
  
  setImage: (file, img) => set({ imageFile: file, imageElement: img, asciiGrid: [] }),
  
  setAsciiGrid: (grid) => set({ asciiGrid: grid, isProcessing: false }),
  
  randomize: () => {
    const charSets = Object.keys(ASCII_CHARSETS) as CharsetType[];
    const colorModes = Object.keys(COLOR_MODES);
    const animModes: AnimationMode[] = ["Float", "Rotate", "Parallax"];
    
    set({
      resolution: Math.floor(Math.random() * 200) + 60,
      charSetType: charSets[Math.floor(Math.random() * charSets.length)],
      invert: Math.random() > 0.7,
      colorMode: colorModes[Math.floor(Math.random() * colorModes.length)],
      liveMode: Math.random() > 0.3,
      animationMode: animModes[Math.floor(Math.random() * animModes.length)],
      animationSpeed: 0.2 + Math.random() * 1.5,
    });
  }
} as WallpaperStore));
