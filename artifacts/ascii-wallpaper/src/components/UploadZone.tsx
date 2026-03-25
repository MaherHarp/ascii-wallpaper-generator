import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useWallpaperStore } from "@/hooks/use-wallpaper-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const UploadZone = () => {
  const { setImage } = useWallpaperStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(file, img);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, [setImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full h-full max-w-2xl mx-auto p-8"
    >
      <div
        {...getRootProps()}
        className={cn(
          "w-full aspect-video border-2 border-dashed flex flex-col items-center justify-center p-12 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group",
          isDragActive 
            ? "border-primary bg-primary/10 glow-box-active scale-105" 
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input {...getInputProps()} />
        
        {/* Animated corner brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors m-4" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors m-4" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors m-4" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors m-4" />

        <div className="bg-background/80 p-6 rounded-full mb-6 relative">
          {isDragActive ? (
            <Upload className="w-12 h-12 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="w-12 h-12 text-primary/60 group-hover:text-primary transition-colors" />
          )}
        </div>
        
        <h3 className="text-2xl font-bold mb-2 text-foreground glow-text">
          {isDragActive ? "INITIALIZE UPLOAD..." : "SELECT TARGET IMAGE"}
        </h3>
        <p className="text-muted-foreground">
          Drag and drop your asset here, or click to browse
        </p>
        
        <div className="mt-8 flex gap-2 text-xs text-primary/40 font-mono">
          <span>[PNG]</span>
          <span>[JPG]</span>
          <span>[WEBP]</span>
          <span>[GIF]</span>
        </div>
      </div>
    </motion.div>
  );
};
