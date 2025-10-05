import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Loader2 } from "lucide-react";

interface BrowserPreviewProps {
  url?: string;
  className?: string;
}

const BrowserPreview: React.FC<BrowserPreviewProps> = ({ 
  url = "https://portfolio-assets-vercel-v1.vercel.app/",
  className = ""
}) => {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    // Update navigation state based on iframe history
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        setCanGoBack(iframe.contentWindow.history.length > 1);
      }
    } catch (error) {
      // Cross-origin restrictions may prevent access
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

  return (
    <div className={`border border-gray-600 rounded-lg shadow-sm overflow-hidden ${className}`} style={{ backgroundColor: 'rgb(16,24,40)' }}>
      {/* Browser Controls */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-600" style={{ backgroundColor: 'rgb(16,24,40)' }}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          disabled={!canGoBack}
          className="h-8 w-8 p-0 border-gray-600 text-white hover:text-white disabled:text-gray-400"
          style={{ backgroundColor: canGoBack ? 'rgb(16,24,40)' : 'transparent' }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleForward}
          disabled={!canGoForward}
          className="h-8 w-8 p-0 border-gray-600 text-white hover:text-white disabled:text-gray-400"
          style={{ backgroundColor: canGoForward ? 'rgb(16,24,40)' : 'transparent' }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="h-8 w-8 p-0 border-gray-600 text-white hover:text-white"
          style={{ backgroundColor: 'rgb(16,24,40)' }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 mx-3">
          <div className="border border-gray-600 rounded px-3 py-1 text-sm text-white truncate" style={{ backgroundColor: 'rgb(16,24,40)' }}>
            {currentUrl}
          </div>
        </div>
        
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-white">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        )}
      </div>

      {/* Browser Content */}
      <div className="relative">
        <iframe
          ref={iframeRef}
          src={currentUrl}
          className="w-full h-96 border-0"
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