
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TradingViewChartProps {
  symbol: string;
  timeframe?: string;
  chartType?: 'price' | 'marketCap';
  containerClassName?: string;
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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = createWidget;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, timeframe, chartType]);

  const createWidget = () => {
    if (containerRef.current && containerRef.current.innerHTML === '' && window.TradingView) {
      const symbolFormatted = chartType === 'price' 
        ? `SOLUSDT` // For price charts we can use standard pairs
        : `TOTAL:${symbol}USD`; // For market cap charts
        
      // Different widgets for different chart types
      if (chartType === 'price') {
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
          hide_side_toolbar: isMobile,
          studies: ['Volume@tv-basicstudies'],
          disabled_features: [
            "header_symbol_search",
            "use_localstorage_for_settings",
          ],
          enabled_features: ["save_chart_properties_to_local_storage"],
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
          hide_side_toolbar: isMobile,
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
    <div 
      className={`w-full ${containerClassName}`}
      style={{ height: '500px' }}
    >
      <div 
        id={`tradingview-widget-${symbol}-${timeframe}-${chartType}`} 
        ref={containerRef} 
        className="w-full h-full"
      />
    </div>
  );
};

export default TradingViewChart;
