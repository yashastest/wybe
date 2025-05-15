
import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Loader, BarChart3, LineChart } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TradingViewChartProps {
  symbol: string;
  timeframe?: string;
  chartType?: 'price' | 'marketCap';
  containerClassName?: string;
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
  containerClassName = "",
  onChartTypeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [isChartReady, setIsChartReady] = useState(false);
  const [localChartType, setLocalChartType] = useState<'price' | 'marketCap'>(chartType);
  
  // Handle chart type change internally and notify parent if callback provided
  const handleChartTypeChange = (type: 'price' | 'marketCap') => {
    setLocalChartType(type);
    setIsLoading(true);
    setIsChartReady(false);
    if (onChartTypeChange) onChartTypeChange(type);
  };
  
  useEffect(() => {
    setIsLoading(true);
    setIsChartReady(false);
    
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    
    script.onload = () => {
      createWidget();
      
      // Simulate some loading time to show the animation
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setIsChartReady(true), 300);
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
      const symbolFormatted = localChartType === 'price' 
        ? `SOLUSDT` // For price charts we can use standard pairs
        : `TOTAL:${symbol}USD`; // For market cap charts
        
      // Different widgets for different chart types
      if (localChartType === 'price') {
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
          toolbar_bg: '#131722',
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: true, // Always hide side toolbar on all devices for consistent UI
          hide_top_toolbar: isMobile, // Hide top toolbar on mobile for more chart space
          studies: isMobile ? [] : ['Volume@tv-basicstudies'], // Simplify on mobile
          overrides: {
            "paneProperties.background": "#0F172A",
            "paneProperties.vertGridProperties.color": "rgba(139, 92, 246, 0.1)",
            "paneProperties.horzGridProperties.color": "rgba(139, 92, 246, 0.1)",
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
          loading_screen: { backgroundColor: "#0F172A", foregroundColor: "#8B5CF6" },
          height: isMobile ? "100%" : undefined,
          width: isMobile ? "100%" : undefined,
        });
      } else {
        // Market cap view has different settings
        new window.TradingView.widget({
          autosize: true,
          symbol: symbolFormatted,
          interval: getTimeframeValue(timeframe),
          container_id: containerRef.current.id,
          library_path: 'https://s3.tradingview.com/charting_library/',
          locale: 'en',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '3', // Area chart for market cap
          toolbar_bg: '#131722',
          enable_publishing: false,
          hide_side_toolbar: true, // Always hide side toolbar
          hide_top_toolbar: isMobile, // Hide top toolbar on mobile
          overrides: {
            "paneProperties.background": "#0F172A",
            "paneProperties.vertGridProperties.color": "rgba(139, 92, 246, 0.1)",
            "paneProperties.horzGridProperties.color": "rgba(139, 92, 246, 0.1)",
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
            ...(isMobile ? ["left_toolbar", "header_indicators", "header_chart_type"] : []),
          ],
          loading_screen: { backgroundColor: "#0F172A", foregroundColor: "#8B5CF6" },
          height: isMobile ? "100%" : undefined,
          width: isMobile ? "100%" : undefined,
        });
      }
    }
  };

  // Convert timeframe string to TradingView interval value
  const getTimeframeValue = (tf: string): string => {
    switch (tf) {
      case '5m': return '5';
      case '15m': return '15';
      case '30m': return '30';
      case '1h': return '60';
      case '4h': return '240';
      case '1D': return 'D';
      case '1W': return 'W';
      case '1M': return 'M';
      default: return 'D'; // Default to daily
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex justify-end">
        <Tabs 
          value={localChartType} 
          onValueChange={(value) => handleChartTypeChange(value as 'price' | 'marketCap')}
          className="bg-black/30 rounded-lg p-1 w-auto"
        >
          <TabsList className="grid grid-cols-2 h-8">
            <TabsTrigger value="price" className="text-xs flex items-center gap-1">
              <LineChart size={14} /> Price
            </TabsTrigger>
            <TabsTrigger value="marketCap" className="text-xs flex items-center gap-1">
              <BarChart3 size={14} /> Market Cap
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <AspectRatio ratio={isMobile ? 4/3 : 16/9} className={`relative ${containerClassName}`}>
        {isLoading && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/90 to-indigo-950/90 z-10 rounded-xl backdrop-blur-sm"
            animate={{ opacity: isLoading ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: 360,
                  boxShadow: ["0 0 10px rgba(139, 92, 246, 0.5)", "0 0 30px rgba(139, 92, 246, 0.8)", "0 0 10px rgba(139, 92, 246, 0.5)"]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="p-4 rounded-full"
              >
                <Loader size={isMobile ? 24 : 32} className="text-wybe-primary" />
              </motion.div>
              <p className="gradient-text text-base md:text-lg font-bold">Loading Chart Data</p>
              <div className="w-36 md:w-48 h-2 bg-wybe-background-light rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"
                  animate={{ 
                    width: ["0%", "100%", "0%"],
                    x: ["-100%", "0%", "100%"]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut" 
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className="w-full h-full rounded-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: isChartReady ? 1 : 0,
            scale: isChartReady ? 1 : 0.98,
          }}
          transition={{ duration: 0.4 }}
        >
          {!isChartReady && (
            <Skeleton className="w-full h-full rounded-xl" />
          )}
          <div 
            id={`tradingview-widget-${symbol}-${timeframe}-${localChartType}`} 
            ref={containerRef} 
            className="w-full h-full"
          />
        </motion.div>
      </AspectRatio>
    </div>
  );
};

export default TradingViewChart;
