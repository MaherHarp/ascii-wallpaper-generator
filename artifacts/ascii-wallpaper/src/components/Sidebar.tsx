import React from "react";
import { 
  Sliders, Settings2, Download, Shuffle, 
  Terminal, MonitorPlay, AlignLeft, RefreshCw, X
} from "lucide-react";
import { 
  HackerButton, HackerInput, HackerLabel, 
  HackerPanel, HackerSelect, HackerSlider, HackerSwitch 
} from "./ui-hacker";
import { useWallpaperStore } from "@/hooks/use-wallpaper-store";
import { ASCII_CHARSETS, COLOR_MODES, CharsetType } from "@/lib/ascii-core";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const config = useWallpaperStore();
  const { updateConfig, randomize, imageElement, setImage } = config;

  const handleExport = (type: 'png' | 'txt', preset: string) => {
    // We'll dispatch a custom event that AsciiRenderer listens to
    window.dispatchEvent(new CustomEvent('export-ascii', { 
      detail: { type, preset } 
    }));
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col gap-6 p-4 bg-background/95 backdrop-blur-md border-r border-border">
      
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-bold glow-text tracking-widest uppercase">SYS.ASCII</h1>
        </div>
        <div className="flex gap-2">
          <HackerButton variant="ghost" className="p-2 h-auto" onClick={randomize} title="Randomize Parameters">
            <Shuffle className="w-4 h-4" />
          </HackerButton>
          {onClose && (
            <HackerButton variant="ghost" className="p-2 h-auto md:hidden" onClick={onClose}>
              <X className="w-4 h-4" />
            </HackerButton>
          )}
        </div>
      </div>

      {imageElement && (
        <HackerButton 
          variant="outline" 
          onClick={() => setImage(null, null)}
          className="w-full text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-2" /> EJECT CURRENT IMAGE
        </HackerButton>
      )}

      <HackerPanel title="Engine Params">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <HackerLabel className="mb-0">Resolution (Chars)</HackerLabel>
              <span className="text-xs text-primary">{config.resolution}</span>
            </div>
            <HackerSlider 
              min={40} max={400} step={1}
              value={config.resolution}
              onChange={(e) => updateConfig({ resolution: Number(e.target.value) })}
            />
            <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
              Higher resolution = more detail, lower performance.
            </p>
          </div>

          <div>
            <HackerLabel>Character Set</HackerLabel>
            <HackerSelect 
              value={config.charSetType}
              onChange={(e) => updateConfig({ charSetType: e.target.value as CharsetType })}
            >
              {Object.keys(ASCII_CHARSETS).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
              <option value="Custom">Custom...</option>
            </HackerSelect>
          </div>

          {config.charSetType === 'Custom' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <HackerLabel>Custom Characters</HackerLabel>
              <HackerInput 
                value={config.customCharSet}
                onChange={(e) => updateConfig({ customCharSet: e.target.value })}
                placeholder="Darkest to lightest..."
              />
            </motion.div>
          )}

          <div className="pt-2">
            <HackerSwitch 
              label="Invert Luminance Map"
              checked={config.invert}
              onChange={(v) => updateConfig({ invert: v })}
            />
          </div>
        </div>
      </HackerPanel>

      <HackerPanel title="Visuals">
        <div className="space-y-4">
          <div>
            <HackerLabel>Color Theme</HackerLabel>
            <HackerSelect 
              value={config.colorMode}
              onChange={(e) => updateConfig({ colorMode: e.target.value })}
            >
              {Object.keys(COLOR_MODES).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
              <option value="Custom">Custom...</option>
            </HackerSelect>
          </div>

          {config.colorMode === 'Custom' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className="flex gap-4"
            >
              <div className="flex-1">
                <HackerLabel>Foreground</HackerLabel>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={config.customFg}
                    onChange={(e) => updateConfig({ customFg: e.target.value })}
                    className="w-8 h-8 p-0 border border-border bg-transparent cursor-pointer"
                  />
                  <HackerInput 
                    value={config.customFg}
                    onChange={(e) => updateConfig({ customFg: e.target.value })}
                    className="flex-1 font-mono uppercase"
                  />
                </div>
              </div>
              <div className="flex-1">
                <HackerLabel>Background</HackerLabel>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={config.customBg}
                    onChange={(e) => updateConfig({ customBg: e.target.value })}
                    className="w-8 h-8 p-0 border border-border bg-transparent cursor-pointer"
                  />
                  <HackerInput 
                    value={config.customBg}
                    onChange={(e) => updateConfig({ customBg: e.target.value })}
                    className="flex-1 font-mono uppercase"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div>
             <div className="flex justify-between items-center mb-1">
              <HackerLabel className="mb-0">Preview Font Size</HackerLabel>
              <span className="text-xs text-primary">{config.fontSize}px</span>
            </div>
            <HackerSlider 
              min={4} max={30} step={1}
              value={config.fontSize}
              onChange={(e) => updateConfig({ fontSize: Number(e.target.value) })}
            />
          </div>
        </div>
      </HackerPanel>

      <HackerPanel title="Live Mode" className={cn(config.liveMode ? "border-primary" : "")}>
        <div className="space-y-4">
          <HackerSwitch 
            label="Enable Live Wallpaper"
            checked={config.liveMode}
            onChange={(v) => updateConfig({ liveMode: v })}
          />

          {config.liveMode && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-4 pt-2 border-t border-border mt-4"
            >
              <div>
                <HackerLabel>Animation Type</HackerLabel>
                <HackerSelect 
                  value={config.animationMode}
                  onChange={(e) => updateConfig({ animationMode: e.target.value as any })}
                >
                  <option value="Float">Drift & Float</option>
                  <option value="Rotate">Focal Rotate</option>
                  <option value="Parallax">Mouse Parallax</option>
                </HackerSelect>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <HackerLabel className="mb-0">Intensity / Speed</HackerLabel>
                  <span className="text-xs text-primary">{config.animationSpeed.toFixed(1)}x</span>
                </div>
                <HackerSlider 
                  min={0.1} max={3.0} step={0.1}
                  value={config.animationSpeed}
                  onChange={(e) => updateConfig({ animationSpeed: Number(e.target.value) })}
                />
              </div>
            </motion.div>
          )}
        </div>
      </HackerPanel>

      <HackerPanel title="Export">
        <div className="space-y-3">
          <HackerLabel>Download as PNG (Wallpaper)</HackerLabel>
          <div className="grid grid-cols-2 gap-2">
            <HackerButton variant="outline" onClick={() => handleExport('png', '1920x1080')} className="text-xs">
              <Download className="w-3 h-3 mr-2" /> FHD 1080p
            </HackerButton>
            <HackerButton variant="outline" onClick={() => handleExport('png', '2560x1440')} className="text-xs">
              <Download className="w-3 h-3 mr-2" /> QHD 1440p
            </HackerButton>
            <HackerButton variant="outline" onClick={() => handleExport('png', '3840x2160')} className="text-xs">
              <Download className="w-3 h-3 mr-2" /> 4K 2160p
            </HackerButton>
            <HackerButton variant="outline" onClick={() => handleExport('png', 'viewport')} className="text-xs">
              <MonitorPlay className="w-3 h-3 mr-2" /> Viewport
            </HackerButton>
          </div>
          
          <div className="pt-2 mt-2 border-t border-border">
            <HackerLabel>Raw Data</HackerLabel>
            <div className="grid grid-cols-2 gap-2">
              <HackerButton variant="ghost" onClick={() => handleExport('txt', '')} className="text-xs border-dashed">
                <AlignLeft className="w-3 h-3 mr-2" /> TXT File
              </HackerButton>
              <HackerButton variant="ghost" onClick={() => {
                const text = config.asciiGrid.map(row => row.join('')).join('\n');
                navigator.clipboard.writeText(text);
              }} className="text-xs border-dashed">
                <Settings2 className="w-3 h-3 mr-2" /> Copy Clip
              </HackerButton>
            </div>
          </div>
        </div>
      </HackerPanel>
    </div>
  );
};
