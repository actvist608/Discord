import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Maximize2, RefreshCw, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageEmbedProps {
  url: string;
  alt?: string;
  name?: string;
  onExpand?: (url: string) => void;
}

export const ImageEmbed: React.FC<ImageEmbedProps> = ({
  url,
  alt = 'Image partagée',
  name,
  onExpand,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached and loaded
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setIsLoading(false);
      } else if (imgRef.current.naturalWidth === 0 && imgRef.current.src) {
        setIsLoading(false);
        setHasError(true);
      }
    }
  }, [url, retryKey]);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setIsLoading(true);
    setRetryKey((prev) => prev + 1);
  };

  const handleOpenExternal = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClickImage = () => {
    if (onExpand && !hasError) {
      onExpand(url);
    }
  };

  return (
    <div className="relative group/img inline-block max-w-lg my-1 select-none">
      {/* Container with Discord dark border and background */}
      <div
        onClick={handleClickImage}
        className={`relative rounded-lg overflow-hidden border border-[#232428] bg-[#1e1f22] shadow-md transition-all ${
          !hasError ? 'cursor-pointer hover:border-[#35373c]' : ''
        }`}
      >
        {/* Error Fallback Card */}
        {hasError ? (
          <div className="p-4 bg-[#2b2d31] rounded-lg border border-[#f23f43]/40 flex flex-col gap-2.5 max-w-sm">
            <div className="flex items-center gap-2 text-[#f23f43] text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Impossible de charger l'image</span>
            </div>
            {name && <p className="text-xs text-[#dbdee1] font-mono truncate">{name}</p>}
            <p className="text-[11px] text-[#949ba4] break-all line-clamp-2">{url}</p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center gap-1 text-xs bg-[#35373c] hover:bg-[#404249] text-white px-2.5 py-1 rounded transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Réessayer</span>
              </button>
              <button
                type="button"
                onClick={handleOpenExternal}
                className="flex items-center gap-1 text-xs text-[#5865f2] hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Ouvrir le lien</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative min-w-[180px] min-h-[100px] flex items-center justify-center bg-[#1e1f22]">
            {/* Loading shimmer overlay - does NOT hide the <img> so browser can load it */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1e1f22] text-[#80848e] animate-pulse gap-2">
                <ImageIcon className="w-7 h-7 text-[#5865f2] animate-bounce" />
                <span className="text-[11px] font-medium text-[#949ba4]">Chargement...</span>
              </div>
            )}

            {/* Real Image - rendered in DOM so network request always runs */}
            <img
              ref={imgRef}
              key={`${url}-${retryKey}`}
              src={url}
              alt={alt}
              onLoad={() => {
                setIsLoading(false);
                setHasError(false);
              }}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              className={`max-h-96 w-auto max-w-full rounded-lg object-contain transition-opacity duration-200 ${
                isLoading ? 'opacity-0' : 'opacity-100 hover:opacity-95'
              }`}
              referrerPolicy="no-referrer"
            />

            {/* Hover Action Controls (Zoom, Open Original) */}
            {!isLoading && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/70 backdrop-blur-xs p-1 rounded-md border border-white/10 shadow-lg z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onExpand) onExpand(url);
                  }}
                  title="Agrandir en plein écran"
                  className="p-1 text-[#dbdee1] hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleOpenExternal}
                  title="Ouvrir le lien original"
                  className="p-1 text-[#dbdee1] hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {name && !hasError && (
        <span className="block text-[11px] text-[#949ba4] mt-1 truncate max-w-xs">{name}</span>
      )}
    </div>
  );
};
