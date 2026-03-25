export const ASCII_CHARSETS = {
  Standard: "@#S%?*+;:,. ",
  Dense: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  Simple: "#@+=-:. ",
  Blocks: "█▓▒░ ",
  Binary: "10 ",
} as const;

export type CharsetType = keyof typeof ASCII_CHARSETS | 'Custom';

export interface ColorModeConfig {
  bg: string;
  fg: string;
}

export const COLOR_MODES: Record<string, ColorModeConfig> = {
  Terminal: { bg: "#020603", fg: "#00ff41" },
  Matrix: { bg: "#000000", fg: "#00cc33" },
  Classic: { bg: "#000000", fg: "#ffffff" },
  Paper: { bg: "#ffffff", fg: "#000000" },
  Amber: { bg: "#1a0a00", fg: "#ffb000" },
  Blood: { bg: "#1a0000", fg: "#ff0000" },
  Cyber: { bg: "#050014", fg: "#00ffff" },
};

export function convertImageToAsciiGrid(
  image: HTMLImageElement,
  widthInChars: number,
  charSet: string,
  invert: boolean
): string[][] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  // Monospace characters are generally ~0.5 to 0.6 aspect ratio (width / height)
  // To prevent vertical stretching, we must factor this into the height calculation
  const fontAspect = 0.5;
  const heightInChars = Math.floor((image.height / image.width) * widthInChars * fontAspect);

  // Safeguard against insanely large or zero dimensions
  if (widthInChars <= 0 || heightInChars <= 0) return [];

  canvas.width = widthInChars;
  canvas.height = heightInChars;

  // Draw scaled down image
  ctx.drawImage(image, 0, 0, widthInChars, heightInChars);
  const imgData = ctx.getImageData(0, 0, widthInChars, heightInChars);
  const pixels = imgData.data;

  const grid: string[][] = [];

  for (let y = 0; y < heightInChars; y++) {
    const row: string[] = [];
    for (let x = 0; x < widthInChars; x++) {
      const idx = (y * widthInChars + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const a = pixels[idx + 3];

      if (a === 0) {
        row.push(" ");
        continue;
      }

      // Calculate relative luminance
      let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      if (invert) {
        luminance = 1 - luminance;
      }

      // Map luminance to character index
      const maxIndex = charSet.length - 1;
      const charIndex = Math.floor(luminance * maxIndex);
      
      // Safety clamp
      const safeIndex = Math.max(0, Math.min(maxIndex, charIndex));
      row.push(charSet[safeIndex]);
    }
    grid.push(row);
  }

  return grid;
}
