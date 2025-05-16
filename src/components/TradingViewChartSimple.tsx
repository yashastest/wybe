
import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface TradingViewChartSimpleProps {
  symbol: string;
  type: 'price' | 'marketcap';
  timeframe: string;
}

const TradingViewChartSimple: React.FC<TradingViewChartSimpleProps> = ({ symbol, type, timeframe }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Clean up function to handle component unmounting
    return () => {
      if (chartRef.current) {
        try {
          // Clean up TradingView widget if it exists
          chartRef.current.remove();
          chartRef.current = null;
        } catch (e) {
          console.error("Error cleaning up chart:", e);
        }
      }
    };
  }, []);

  useEffect(() => {
    // Don't try to create chart if there's no symbol or container
    if (!symbol || !containerRef.current) return;

    // Clean up previous chart if it exists
    if (chartRef.current) {
      try {
        chartRef.current.remove();
        chartRef.current = null;
      } catch (e) {
        console.error("Error removing previous chart:", e);
      }
    }

    // Determine interval based on timeframe
    let interval = '15';
    switch (timeframe) {
      case '1s': interval = '1S'; break;
      case '1m': interval = '1'; break;
      case '5m': interval = '5'; break;
      case '15m': interval = '15'; break;
      case '30m': interval = '30'; break;
      default: interval = '15'; break;
    }

    // Create the TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        try {
          // For demo, use SOL/USD as a placeholder - in a real app, would use actual token symbol
          const actualSymbol = symbol ? `${symbol}USD` : 'SOLUSD';
          
          // Create the widget
          // @ts-ignore
          chartRef.current = new window.TradingView.widget({
            autosize: true,
            symbol: actualSymbol,
            interval: interval,
            container_id: containerRef.current?.id,
            library_path: 'https://s3.tradingview.com/charting_library/',
            locale: 'en',
            timezone: 'exchange',
            theme: 'dark',
            style: '1', // Candlestick chart
            toolbar_bg: '#131722',
            enable_publishing: false,
            hide_top_toolbar: false,
            hide_side_toolbar: true,
            allow_symbol_change: false,
            save_image: false,
            studies: [],
            disabled_features: [
              'header_indicators',
              'header_symbol_search',
              'header_chart_type',
              'header_compare',
              'header_undo_redo',
              'header_screenshot',
              'header_saveload',
              'create_volume_indicator_by_default',
              'use_localstorage_for_settings',
              'volume_force_overlay',
              'timeframes_toolbar',
              'left_toolbar',
              'show_logo_on_all_charts',
              'caption_buttons_text_if_possible',
              'header_settings',
              'header_resolutions',
              'control_bar',
              'study_buttons_in_legend',
              'symbol_info',
              'symbol_search_hot_key',
              'border_around_the_chart',
              'remove_library_container_border',
              'chart_property_page_background',
              'chart_property_page_style',
              'chart_property_page_scales',
              'chart_property_page_trading',
              'chart_property_page_events'
            ],
            enabled_features: [
              'hide_last_na_study_output',
              'side_toolbar_in_fullscreen_mode'
            ],
          });
        } catch (e) {
          console.error("Error creating TradingView widget:", e);
        }
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, timeframe, type]);

  return (
    <div className="w-full h-[400px] relative">
      <div 
        id={`tradingview_chart_${symbol}`} 
        ref={containerRef} 
        className="w-full h-full"
      />
      {!symbol && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0F1118]/80">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="ml-2 text-gray-400">Loading chart...</span>
        </div>
      )}
    </div>
  );
};

export default TradingViewChartSimple;
