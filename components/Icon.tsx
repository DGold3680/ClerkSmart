import React from "react";
import {
  Stethoscope,
  MessageSquare,
  Users,
  Award,
  Play,
  Book,
  History,
  Settings,
  ArrowRight,
  ArrowLeft,
  Mic,
  MicOff,
  Check,
  AlertTriangle,
  Lightbulb,
  Baby,
  User,
  Heart,
  X,
  ChevronsRight,
  SendHorizontal,
  Loader2,
  Mail,
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff,
  MapPin,
} from "lucide-react";

// Using lucide-react directly is simpler and more maintainable
// than managing SVG paths manually.

export const Icon: React.FC<{
  name: string;
  className?: string;
  size?: number;
}> = ({ name, className, size = 24 }) => {
  const iconProps = { className, size };
  switch (name) {
    case "stethoscope":
      return <Stethoscope {...iconProps} />;
    case "message-square":
      return <MessageSquare {...iconProps} />;
    case "users":
      return <Users {...iconProps} />;
    case "award":
      return <Award {...iconProps} />;
    case "play":
      return <Play {...iconProps} />;
    case "book":
      return <Book {...iconProps} />;
    case "history":
      return <History {...iconProps} />;
    case "settings":
      return <Settings {...iconProps} />;
    case "arrow-right":
      return <ArrowRight {...iconProps} />;
    case "arrow-left":
      return <ArrowLeft {...iconProps} />;
    case "mic":
      return <Mic {...iconProps} />;
    case "mic-off":
      return <MicOff {...iconProps} />;
    case "check":
      return <Check {...iconProps} />;
    case "alert-triangle":
      return <AlertTriangle {...iconProps} />;
    case "lightbulb":
      return <Lightbulb {...iconProps} />;
    case "baby":
      return <Baby {...iconProps} />;
    case "user":
      return <User {...iconProps} />;
    case "heart":
      return <Heart {...iconProps} />;
    case "x":
      return <X {...iconProps} />;
    case "chevrons-right":
      return <ChevronsRight {...iconProps} />;
    case "send":
      return <SendHorizontal {...iconProps} />;
    case "loader-2":
      return <Loader2 {...iconProps} />;
    case "mail":
      return <Mail {...iconProps} />;
    case "eye":
      return <Eye {...iconProps} />;
    case "eye-off":
      return <EyeOff {...iconProps} />;
    case "map-pin":
      return <MapPin {...iconProps} />; // Theme icons
    case "sun":
      return <Sun {...iconProps} />;
    case "moon":
      return <Moon {...iconProps} />;
    case "monitor":
      return <Monitor {...iconProps} />;
    default:
      return null;
  }
};
