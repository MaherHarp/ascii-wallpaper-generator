import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { UploadZone } from "@/components/UploadZone";
import { AsciiRenderer } from "@/components/AsciiRenderer";
import { useWallpaperStore } from "@/hooks/use-wallpaper-store";
import { HackerButton } from "@/components/ui-hacker";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { imageElement } = useWallpaperStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 z-50 w-80 shadow-2xl shadow-primary/20 md:relative md:z-auto"
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative h-full flex flex-col">
        {!sidebarOpen && (
          <div className="absolute top-4 left-4 z-40">
            <HackerButton variant="outline" className="p-2 h-auto bg-background/80 backdrop-blur" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </HackerButton>
          </div>
        )}

        {imageElement ? (
          <AsciiRenderer />
        ) : (
          <div className="flex-1 flex items-center justify-center relative bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=80&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full px-4">
              <UploadZone />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
