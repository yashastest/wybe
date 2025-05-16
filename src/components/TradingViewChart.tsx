
import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TradingViewChartProps {
  symbol: string;
  timeframe?: string;
  chartType?: 'price' | 'marketCap';
  onChartTypeChange?: (type: 'price' | 'marketCap') => void;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = "PEPES",
  timeframe = "1D",
  chartType = "price",
  onChartTypeChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [localChartType, setLocalChartType] = useState<'price' | 'marketCap'>(chartType);
  
  // Handle chart type change internally and notify parent if callback provided
  const handleChartTypeChange = (type: 'price' | 'marketCap') => {
    setLocalChartType(type);
    setIsLoading(true);
    if (onChartTypeChange) onChartTypeChange(type);
  };
  
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
  }, [symbol, timeframe, localChartType]);

  const createWidget = () => {
    if (containerRef.current && containerRef.current.innerHTML === '' && window.TradingView) {
      // Format symbol for TradingView
      const symbolFormatted = localChartType === 'price' 
        ? `SOLUSDT` // For price charts we can use standard pairs
        : `TOTAL:${symbol}USD`; // For market cap charts
      
      new window.TradingView.widget({
        autosize: true,
        symbol: symbolFormatted,
        interval: getTimeframeValue(timeframe),
        container_id: containerRef.current.id,
        library_path: 'https://s3.tradingview.com/charting_library/',
        locale: 'en',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: localChartType === 'price' ? '1' : '3', // Candles for price, Area for market cap
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
          "mainSeriesProperties.areaStyle.color1": "rgba(139, 92, 246, 0.4)",
          "mainSeriesProperties.areaStyle.color2": "rgba(139, 92, 246, 0.05)",
          "mainSeriesProperties.lineStyle.color": "#8B5CF6",
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
    <Card className="bg-[#0F1118]/90 border border-gray-800/50 p-2 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs uppercase font-medium text-gray-400">Price Chart</div>
        <div className="flex">
          <Button 
            size="sm" 
            variant="outline" 
            className={`h-7 py-0 px-2 ${localChartType === 'price' ? 'bg-purple-600/30 border-purple-500' : 'bg-[#1A1F2C]/40'}`}
            onClick={() => handleChartTypeChange('price')}
          >
            Price
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className={`h-7 py-0 px-2 ml-1 ${localChartType === 'marketCap' ? 'bg-purple-600/30 border-purple-500' : 'bg-[#1A1F2C]/40'}`}
            onClick={() => handleChartTypeChange('marketCap')}
          >
            Market Cap
          </Button>
        </div>
      </div>
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
          id={`tradingview-widget-${symbol}-${timeframe}-${localChartType}`} 
          ref={containerRef} 
          className="w-full h-full"
        />
      </AspectRatio>
    </Card>
  );
};

export default TradingViewChart;
