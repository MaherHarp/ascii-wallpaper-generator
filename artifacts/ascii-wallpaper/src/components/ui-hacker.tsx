import * as React from "react";
import { cn } from "@/lib/utils";

// Hacker themed components tailored for this app

export const HackerButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'destructive' }>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-primary/10 text-primary border border-primary hover:bg-primary/20 glow-box hover:glow-box-active",
      outline: "bg-transparent text-primary border border-primary/50 hover:border-primary hover:bg-primary/5",
      ghost: "bg-transparent text-primary/80 border border-transparent hover:text-primary hover:bg-primary/10",
      destructive: "bg-destructive/10 text-destructive border border-destructive hover:bg-destructive/20",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
HackerButton.displayName = "HackerButton";

export const HackerInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
HackerInput.displayName = "HackerInput";

export const HackerLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-xs font-semibold uppercase tracking-wider text-primary/80 mb-1 block", className)}
      {...props}
    />
  )
);
HackerLabel.displayName = "HackerLabel";

export const HackerSlider = React.forwardRef<HTMLInputElement, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>>(
  ({ className, ...props }, ref) => (
    <input
      type="range"
      ref={ref}
      className={cn(
        "w-full h-2 bg-muted appearance-none cursor-pointer outline-none border border-border",
        "accent-primary",
        className
      )}
      style={{
        WebkitAppearance: "none",
      }}
      {...props}
    />
  )
);
HackerSlider.displayName = "HackerSlider";

export const HackerSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "appearance-none flex h-10 w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors cursor-pointer",
          className
        )}
        {...props}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  )
);
HackerSelect.displayName = "HackerSelect";

export const HackerSwitch = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) => (
  <label className="flex items-center cursor-pointer group">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={cn("block w-10 h-6 border transition-colors duration-200", checked ? "bg-primary/20 border-primary" : "bg-muted border-border")}></div>
      <div className={cn("dot absolute left-1 top-1 bg-primary w-4 h-4 transition-transform duration-200", checked ? "transform translate-x-4 glow-box" : "opacity-50")}></div>
    </div>
    {label && <span className="ml-3 text-sm text-primary/80 group-hover:text-primary transition-colors">{label}</span>}
  </label>
);

export const HackerPanel = ({ children, className, title }: { children: React.ReactNode, className?: string, title?: string }) => (
  <div className={cn("border border-border bg-card relative", className)}>
    {title && (
      <div className="absolute -top-3 left-4 bg-card px-2 text-xs font-bold text-primary tracking-widest uppercase">
        [{title}]
      </div>
    )}
    <div className={cn("p-4", title && "pt-6")}>
      {children}
    </div>
  </div>
);
