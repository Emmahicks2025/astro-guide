import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Share, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SpiritualButton } from "@/components/ui/spiritual-button";
import { SpiritualCard, SpiritualCardContent } from "@/components/ui/spiritual-card";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream);

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-gradient-spiritual flex items-center justify-center shadow-spiritual mx-auto">
            <Smartphone className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Install AstroGuru</h1>
          <p className="text-muted-foreground">
            Add AstroGuru to your home screen for the best experience — works offline and loads instantly.
          </p>
        </div>

        {isInstalled ? (
          <SpiritualCard variant="elevated">
            <SpiritualCardContent className="p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Download className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Already Installed!</h3>
              <p className="text-sm text-muted-foreground">
                AstroGuru is installed on your device. Open it from your home screen.
              </p>
            </SpiritualCardContent>
          </SpiritualCard>
        ) : deferredPrompt ? (
          <SpiritualButton variant="primary" size="lg" className="w-full" onClick={handleInstall}>
            <Download className="w-5 h-5" />
            Install AstroGuru
          </SpiritualButton>
        ) : isIOS ? (
          <SpiritualCard variant="elevated">
            <SpiritualCardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-foreground text-center">Install on iPhone / iPad</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Share className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tap the <strong className="text-foreground">Share</strong> button in Safari's toolbar
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Plus className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scroll down and tap <strong className="text-foreground">Add to Home Screen</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Download className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tap <strong className="text-foreground">Add</strong> to install
                  </p>
                </div>
              </div>
            </SpiritualCardContent>
          </SpiritualCard>
        ) : (
          <SpiritualCard variant="elevated">
            <SpiritualCardContent className="p-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Open this page in <strong className="text-foreground">Chrome</strong> or <strong className="text-foreground">Safari</strong> to install the app, or use your browser's menu → <strong className="text-foreground">Add to Home Screen</strong>.
              </p>
            </SpiritualCardContent>
          </SpiritualCard>
        )}
      </motion.div>
    </div>
  );
};

export default Install;
