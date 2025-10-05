import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Loader2, ExternalLink } from "lucide-react";

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

  const iframeHeight = typeof height === 'number' ? height - 60 : 'calc(100% - 60px)';

  return (
    <div className={`border border-gray-600 rounded-lg shadow-sm overflow-hidden ${className}`} style={containerStyle}>
      {/* Browser Controls */}
      <div className="flex items-center gap-2 p-2 sm:p-3 border-b border-gray-600" style={{ backgroundColor: 'rgb(16,24,40)' }}>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={!canGoBack}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-gray-600 text-white hover:text-white disabled:text-gray-400"
            style={{ backgroundColor: canGoBack ? 'rgb(16,24,40)' : 'transparent' }}
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleForward}
            disabled={!canGoForward}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-gray-600 text-white hover:text-white disabled:text-gray-400"
            style={{ backgroundColor: canGoForward ? 'rgb(16,24,40)' : 'transparent' }}
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-gray-600 text-white hover:text-white"
            style={{ backgroundColor: 'rgb(16,24,40)' }}
          >
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={openInNewTab}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-gray-600 text-white hover:text-white"
            style={{ backgroundColor: 'rgb(16,24,40)' }}
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        
        <div className="flex-1 mx-2 sm:mx-3 min-w-0">
          <div className="border border-gray-600 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm text-white truncate" style={{ backgroundColor: 'rgb(16,24,40)' }}>
            {currentUrl}
          </div>
        </div>
        
        {isLoading && (
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white">
            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            <span className="hidden sm:inline">Loading...</span>
          </div>
        )}
      </div>

      {/* URL Selector */}
      {showUrlSelector && urls.length > 1 && (
        <div className="flex flex-wrap gap-1 sm:gap-2 p-2 sm:p-3 border-b border-gray-600" style={{ backgroundColor: 'rgb(16,24,40)' }}>
          {urls.map((url, index) => (
            <Button
              key={index}
              variant={currentUrl === url ? "default" : "outline"}
              size="sm"
              onClick={() => handleUrlChange(url)}
              className={`text-xs sm:text-sm px-2 sm:px-3 py-1 border-gray-600 ${
                currentUrl === url 
                  ? 'bg-white text-gray-900 hover:bg-gray-100' 
                  : 'text-white hover:text-white'
              }`}
              style={currentUrl !== url ? { backgroundColor: 'transparent' } : {}}
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
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          onLoad={handleLoad}
          title="Browser Preview"
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(16,24,40,0.9)' }}>
            <div className="flex items-center gap-2 text-white">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading website...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserPreview;