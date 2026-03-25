import React from "react";
import { Link } from "wouter";
import { HackerButton } from "@/components/ui-hacker";
import { TerminalSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 max-w-md p-8 border border-primary/30 glow-box bg-card">
        <TerminalSquare className="w-16 h-16 text-destructive mx-auto animate-pulse" />
        <h1 className="text-4xl font-bold text-destructive glow-text">ERR 404</h1>
        <p className="text-muted-foreground font-mono">
          System critical failure. The requested sector does not exist in the current grid.
        </p>
        <Link href="/" className="inline-block mt-4">
          <HackerButton variant="outline" className="w-full">
            RETURN TO MAINFRAME
          </HackerButton>
        </Link>
      </div>
    </div>
  );
}
