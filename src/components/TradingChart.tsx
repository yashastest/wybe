
import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface TradingChartProps {
  symbol: string;
  timeframe?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingChart: React.FC<TradingChartProps> = ({
  symbol = "PEPES",
  timeframe = "1D",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        createWidget();
      }
      
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, timeframe]);

  const createWidget = () => {
    if (containerRef.current && containerRef.current.innerHTML === '' && window.TradingView) {
      // Format symbol for TradingView
      const symbolFormatted = `SOLUSDT`;
      
      new window.TradingView.widget({
        autosize: true,
        symbol: symbolFormatted,
        interval: getTimeframeValue(timeframe),
        container_id: containerRef.current.id,
        library_path: 'https://s3.tradingview.com/charting_library/',
        locale: 'en',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1', // Candles
        toolbar_bg: '#151720',
        enable_publishing: false,
        allow_symbol_change: true,
        hide_side_toolbar: true,
        hide_top_toolbar: isMobile,
        studies: isMobile ? [] : ['Volume@tv-basicstudies'],
        overrides: {
          "paneProperties.background": "#151720",
          "paneProperties.vertGridProperties.color": "rgba(139, 92, 246, 0.05)",
          "paneProperties.horzGridProperties.color": "rgba(139, 92, 246, 0.05)",
          "mainSeriesProperties.candleStyle.upColor": "#22C55E",
          "mainSeriesProperties.candleStyle.downColor": "#EF4444",
          "mainSeriesProperties.candleStyle.wickUpColor": "#22C55E",
          "mainSeriesProperties.candleStyle.wickDownColor": "#EF4444",
        },
        disabled_features: [
          "header_symbol_search",
          "use_localstorage_for_settings",
          "header_saveload",
          "header_screenshot",
          "header_compare",
          "volume_force_overlay",
          ...(isMobile ? ["left_toolbar", "header_indicators", "header_chart_type"] : []),
        ],
        enabled_features: ["save_chart_properties_to_local_storage"],
        loading_screen: { backgroundColor: "#151720", foregroundColor: "#8B5CF6" },
      });
    }
  };

  // Convert timeframe string to TradingView interval value
  const getTimeframeValue = (tf: string): string => {
    switch (tf) {
      case '15m': return '15';
      case '1H': return '60';
      case '4H': return '240';
      case '1D': return 'D';
      case '1W': return 'W';
      default: return 'D';
    }
  };

  return (
    <AspectRatio 
      ratio={isMobile ? 4/3 : 16/9} 
      className="relative w-full h-full"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/60 to-indigo-950/40 z-10 rounded-xl backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader size={32} className="text-blue-500 animate-spin" />
            <p className="text-base font-medium">Loading Chart</p>
          </div>
        </div>
      )}
      <div 
        id={`tradingview-widget-${symbol}-${timeframe}`} 
        ref={containerRef} 
        className="w-full h-full"
      />
    </AspectRatio>
  );
};

export default TradingChart;
