import { motion } from "framer-motion";
import { Star, ArrowLeft, User, Calendar, Clock, MapPin, Download, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SpiritualCard, SpiritualCardContent } from "@/components/ui/spiritual-card";
import { SpiritualButton } from "@/components/ui/spiritual-button";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { format } from "date-fns";
import NorthIndianKundliChart from "@/components/kundli/NorthIndianKundliChart";
import PlanetaryTable from "@/components/kundli/PlanetaryTable";
import { generateSampleKundli } from "@/lib/kundli";
import { toast } from "sonner";

const MyKundli = () => {
  const navigate = useNavigate();
  const { userData } = useOnboardingStore();

  // Generate Kundli based on user's actual birth data
  const kundliData = generateSampleKundli(
    userData.dateOfBirth,
    userData.timeOfBirth,
    userData.placeOfBirth
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SpiritualButton variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </SpiritualButton>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-spiritual flex items-center justify-center">
                <Star className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">My Kundli</span>
            </div>
          </div>
          <div className="flex gap-2">
            <SpiritualButton variant="ghost" size="icon" onClick={() => toast.info("Share feature coming soon!")}>
              <Share2 className="w-5 h-5" />
            </SpiritualButton>
            <SpiritualButton variant="ghost" size="icon" onClick={() => toast.info("Download feature coming soon!")}>
              <Download className="w-5 h-5" />
            </SpiritualButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* User Info */}
        <SpiritualCard variant="spiritual" className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold font-display">{userData.fullName || 'Your Name'}</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {userData.dateOfBirth ? format(userData.dateOfBirth, 'PPP') : 'Not set'}
                </p>
                <p className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {userData.timeOfBirth || 'Not set'}
                </p>
                <p className="flex items-center gap-1 col-span-2">
                  <MapPin className="w-4 h-4" />
                  {userData.placeOfBirth || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </SpiritualCard>

        {/* Kundli Chart - Now with real visualization */}
        <SpiritualCard variant="elevated" className="overflow-hidden">
          <SpiritualCardContent className="p-6">
            <h3 className="text-lg font-bold font-display mb-4 text-center">Janam Kundli (Birth Chart)</h3>
            <div className="flex justify-center">
              <NorthIndianKundliChart data={kundliData} size={280} />
            </div>
          </SpiritualCardContent>
        </SpiritualCard>

        {/* Lagna Info */}
        <SpiritualCard variant="golden" className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Lagna (Ascendant)</p>
          <p className="text-2xl font-bold text-accent">{kundliData.lagnaSign}</p>
          <p className="text-sm mt-1">
            Moon Nakshatra: <span className="font-medium">{kundliData.nakshatras.moon}</span> (Pada {kundliData.nakshatras.pada})
          </p>
        </SpiritualCard>

        {/* Dasha Info */}
        {kundliData.dashaInfo && (
          <SpiritualCard variant="mystic" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Maha Dasha</p>
                <p className="text-xl font-bold">{kundliData.dashaInfo.currentMahaDasha}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="font-medium">{kundliData.dashaInfo.startDate} - {kundliData.dashaInfo.endDate}</p>
              </div>
            </div>
          </SpiritualCard>
        )}

        {/* Planet Positions - Using the component */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold font-display">Planetary Positions</h3>
          <PlanetaryTable data={kundliData} />
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <SpiritualButton 
            variant="primary" 
            size="lg" 
            className="w-full"
            onClick={() => toast.info("Detailed analysis coming soon!")}
          >
            Detailed Analysis
          </SpiritualButton>
          <SpiritualButton 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => toast.info("Dasha periods coming soon!")}
          >
            Dasha Periods
          </SpiritualButton>
        </div>
      </main>
    </motion.div>
  );
};

export default MyKundli;
