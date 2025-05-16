
// Type definitions for the TradingView Charting Library
declare global {
  interface Window {
    TradingView: {
      widget: new (config: any) => any;
    };
  }
}

export {};
