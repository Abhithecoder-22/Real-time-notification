import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  lastError: string | null;
  onReconnect: () => void;
}

export function ConnectionStatus({ 
  isConnected, 
  isConnecting, 
  lastError, 
  onReconnect 
}: ConnectionStatusProps) {
  if (isConnected) {
    return (
      <Badge 
        variant="secondary" 
        className="bg-success/10 text-success border-success/20 animate-pulse-glow"
      >
        <Wifi className="w-3 h-3 mr-1" />
        Connected
      </Badge>
    );
  }

  if (isConnecting) {
    return (
      <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
        Connecting...
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
        <WifiOff className="w-3 h-3 mr-1" />
        Disconnected
      </Badge>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReconnect}
        className="h-6 px-2 text-xs"
      >
        <RefreshCw className="w-3 h-3 mr-1" />
        Retry
      </Button>
    </div>
  );
}