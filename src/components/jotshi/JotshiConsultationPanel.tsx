import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  BookOpen, 
  Pill, 
  X,
  User,
  Calendar,
  Clock,
  MapPin,
  Star
} from "lucide-react";
import { SpiritualCard, SpiritualCardContent } from "@/components/ui/spiritual-card";
import { SpiritualButton } from "@/components/ui/spiritual-button";
import { SpiritualInput } from "@/components/ui/spiritual-input";
import NorthIndianKundliChart from "@/components/kundli/NorthIndianKundliChart";
import PlanetaryTable from "@/components/kundli/PlanetaryTable";
import { generateSampleKundli } from "@/lib/kundli";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  concern: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: string;
  birthTimeExactness: string;
}

interface JotshiConsultationPanelProps {
  user: UserProfile;
  onBack: () => void;
}

const quickActions = [
  { icon: Sparkles, label: 'Suggest Mantra', action: 'mantra' },
  { icon: Pill, label: 'Send Remedy', action: 'remedy' },
  { icon: BookOpen, label: 'Recommend Pooja', action: 'pooja' },
];

const JotshiConsultationPanel = ({ user, onBack }: JotshiConsultationPanelProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: 'jotshi' | 'user'; text: string; time: string }>>([
    { role: 'user', text: `Namaste Guruji, I need guidance about ${user.concern.toLowerCase()}.`, time: '2:30 PM' },
  ]);

  // Generate Kundli based on user's birth data
  const kundliData = generateSampleKundli(
    new Date(user.birthDate), 
    user.birthTime, 
    user.birthPlace
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, {
      role: 'jotshi',
      text: message,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }]);
    setMessage("");
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      mantra: `🙏 Based on your chart, I recommend chanting the ${kundliData.lagnaSign === 'Leo' ? 'Surya' : 'Chandra'} Mantra daily:\n\n"Om ${kundliData.lagnaSign === 'Leo' ? 'Suryaya' : 'Chandraya'} Namaha"\n\nChant 108 times every morning for best results.`,
      remedy: `💎 Recommended Remedies:\n\n1. Wear a ${kundliData.lagnaSign === 'Leo' ? 'Ruby' : 'Pearl'} gemstone on your ${kundliData.lagnaSign === 'Leo' ? 'ring' : 'little'} finger\n2. Donate to the needy on ${kundliData.lagnaSign === 'Leo' ? 'Sundays' : 'Mondays'}\n3. Fast on ${kundliData.lagnaSign === 'Leo' ? 'Sunday' : 'Monday'} mornings`,
      pooja: `🪔 I recommend performing a ${user.concern === 'Marriage & Love' ? 'Vivah Prapti' : user.concern === 'Career & Business' ? 'Brihaspati' : 'Navagraha'} Pooja for your specific concerns.\n\nBest time: During ${kundliData.nakshatras.moon} Nakshatra\nIdeal day: Thursday or ${kundliData.lagnaSign === 'Leo' ? 'Sunday' : 'Monday'}`,
    };

    setMessages([...messages, {
      role: 'jotshi',
      text: actionMessages[action] || 'Guidance sent.',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }]);
    toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} suggestion sent!`);
  };

  const handleEndSession = () => {
    toast.success("Session ended. Earnings updated.");
    onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Top Bar - User Info */}
      <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <SpiritualButton 
                variant="ghost" 
                size="icon" 
                className="text-secondary-foreground hover:bg-secondary-foreground/10"
                onClick={onBack}
              >
                <ArrowLeft className="w-5 h-5" />
              </SpiritualButton>
              <div className="w-10 h-10 rounded-full bg-secondary-foreground/20 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold">{user.name}</h2>
                <p className="text-xs opacity-75">{user.concern}</p>
              </div>
            </div>
            <SpiritualButton 
              variant="ghost" 
              size="sm"
              className="text-secondary-foreground hover:bg-secondary-foreground/10"
              onClick={handleEndSession}
            >
              <X className="w-4 h-4 mr-1" />
              End Session
            </SpiritualButton>
          </div>

          {/* Birth Details Strip */}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1 opacity-80">
              <Calendar className="w-4 h-4" /> {user.birthDate}
            </span>
            <span className="flex items-center gap-1 opacity-80">
              <Clock className="w-4 h-4" /> {user.birthTime}
              {user.birthTimeExactness !== 'exact' && (
                <span className="text-xs bg-yellow-500/20 px-1 rounded">~approx</span>
              )}
            </span>
            <span className="flex items-center gap-1 opacity-80">
              <MapPin className="w-4 h-4" /> {user.birthPlace}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent" /> 
              {kundliData.lagnaSign} Lagna | {kundliData.nakshatras.moon} Nakshatra
            </span>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 container mx-auto p-4 grid lg:grid-cols-5 gap-4 overflow-hidden">
        {/* Left: Kundli Chart (40%) */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto">
          <SpiritualCard variant="elevated" className="p-4">
            <h3 className="font-semibold text-center mb-4 font-display">Janam Kundli</h3>
            <div className="flex justify-center">
              <NorthIndianKundliChart data={kundliData} size={250} />
            </div>
          </SpiritualCard>

          <PlanetaryTable data={kundliData} />

          {/* Dasha Info */}
          {kundliData.dashaInfo && (
            <SpiritualCard variant="golden" className="p-4">
              <h4 className="font-semibold mb-2">Current Maha Dasha</h4>
              <p className="text-lg font-bold text-accent">{kundliData.dashaInfo.currentMahaDasha}</p>
              <p className="text-sm text-muted-foreground">
                {kundliData.dashaInfo.startDate} - {kundliData.dashaInfo.endDate}
              </p>
            </SpiritualCard>
          )}
        </div>

        {/* Right: Chat Area (60%) */}
        <div className="lg:col-span-3 flex flex-col bg-muted/30 rounded-xl overflow-hidden">
          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'jotshi' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === 'jotshi' 
                    ? 'bg-primary text-primary-foreground rounded-br-sm' 
                    : 'bg-card border border-border rounded-bl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'jotshi' ? 'opacity-70' : 'text-muted-foreground'}`}>
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
            {quickActions.map((action) => (
              <SpiritualButton
                key={action.action}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.action)}
                className="whitespace-nowrap"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </SpiritualButton>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <SpiritualInput
                placeholder="Type your guidance..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <SpiritualButton 
                variant="primary" 
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send className="w-5 h-5" />
              </SpiritualButton>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JotshiConsultationPanel;
