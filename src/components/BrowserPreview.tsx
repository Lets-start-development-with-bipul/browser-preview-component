import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Loader2, ExternalLink, Globe } from "lucide-react";

interface BrowserPreviewProps {
  urls?: string[];
  defaultUrl?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  showUrlSelector?: boolean;
}

const BrowserPreview: React.FC<BrowserPreviewProps> = ({ 
  urls = [
    "https://portfolio-assets-vercel-v1.vercel.app/",
    "https://github.com",
    "https://vercel.com"
  ],
  defaultUrl,
  width = "100%",
  height = 400,
  className = "",
  showUrlSelector = true
}) => {
  const [currentUrl, setCurrentUrl] = useState(defaultUrl || urls[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        setCanGoBack(iframe.contentWindow.history.length > 1);
      }
    } catch (error) {
      console.log("Cannot access iframe history due to cross-origin restrictions");
    }
  };

  const handleBack = () => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.history.back();
        setCanGoForward(true);
      }
    } catch (error) {
      console.log("Cannot navigate back due to cross-origin restrictions");
    }
  };

  const handleForward = () => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.history.forward();
      }
    } catch (error) {
      console.log("Cannot navigate forward due to cross-origin restrictions");
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setIsLoading(true);
    setCurrentUrl(newUrl);
  };

  const openInNewTab = () => {
    window.open(currentUrl, '_blank');
  };

  const containerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    backgroundColor: 'rgb(16,24,40)'
  };

  const iframeHeight = typeof height === 'number' ? height - (showUrlSelector && urls.length > 1 ? 120 : 60) : 'calc(100% - 60px)';

  return (
    <div 
      className={`relative border-2 border-gray-700/50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm ${className}`} 
      style={{
        ...containerStyle,
        background: 'linear-gradient(135deg, rgb(16,24,40) 0%, rgb(20,28,44) 50%, rgb(16,24,40) 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Decorative top bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-gray-600/50">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm"></div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
            <Globe className="h-4 w-4" />
            <span>Portfolio Browser</span>
          </div>
        </div>
      </div>

      {/* Browser Controls */}
      <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-gray-600/30 bg-gradient-to-r from-gray-800/30 to-gray-700/30">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={!canGoBack}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0 border-gray-500/50 text-white hover:text-white disabled:text-gray-500 hover:bg-white/10 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleForward}
            disabled={!canGoForward}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0 border-gray-500/50 text-white hover:text-white disabled:text-gray-500 hover:bg-white/10 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0 border-gray-500/50 text-white hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-105 hover:rotate-180"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={openInNewTab}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0 border-gray-500/50 text-white hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
        
        <div className="flex-1 mx-3 sm:mx-4 min-w-0">
          <div 
            className="border border-gray-500/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white/90 truncate font-mono bg-gradient-to-r from-gray-800/50 to-gray-700/50 shadow-inner"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {currentUrl}
          </div>
        </div>
        
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-white/80 bg-white/5 px-3 py-1 rounded-full backdrop-blur-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="hidden sm:inline font-medium">Loading...</span>
          </div>
        )}
      </div>

      {/* URL Selector */}
      {showUrlSelector && urls.length > 1 && (
        <div className="flex flex-wrap gap-2 p-3 sm:p-4 border-b border-gray-600/30 bg-gradient-to-r from-gray-800/20 to-gray-700/20">
          {urls.map((url, index) => (
            <Button
              key={index}
              variant={currentUrl === url ? "default" : "outline"}
              size="sm"
              onClick={() => handleUrlChange(url)}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-2 font-medium transition-all duration-300 hover:scale-105 ${
                currentUrl === url 
                  ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg border-white/20' 
                  : 'text-white/80 hover:text-white border-gray-500/30 hover:bg-white/10 hover:border-white/20'
              }`}
              style={currentUrl !== url ? { 
                backgroundColor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)'
              } : {
                boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
              }}
            >
              {new URL(url).hostname}
            </Button>
          ))}
        </div>
      )}

      {/* Browser Content */}
      <div className="relative" style={{ height: iframeHeight }}>
        <iframe
          ref={iframeRef}
          src={currentUrl}
          className="w-full h-full border-0 rounded-b-xl"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          onLoad={handleLoad}
          title="Browser Preview"
          style={{ 
            overflow: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          scrolling="no"
        />
        
        {isLoading && (
          <div 
            className="absolute inset-0 flex items-center justify-center backdrop-blur-sm" 
            style={{ 
              background: 'linear-gradient(135deg, rgba(16,24,40,0.95) 0%, rgba(20,28,44,0.95) 100%)'
            }}
          >
            <div className="flex flex-col items-center gap-4 text-white">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-white/80" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-white/20 animate-pulse"></div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold mb-1">Loading website...</div>
                <div className="text-sm text-white/60">Please wait while we fetch the content</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default BrowserPreview;