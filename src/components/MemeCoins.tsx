import React from "react";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  category: string[];
}

const trendingCoins: CoinData[] = [
  {
    id: "pepe",
    name: "Pepe",
    symbol: "PEPE",
    logo: "/coins/pepe.png",
    price: 0.00000123,
    change24h: 5.67,
    marketCap: 420000000,
    volume24h: 69000000,
    category: ["Meme", "Frog"],
  },
  {
    id: "doge",
    name: "Dogecoin",
    symbol: "DOGE",
    logo: "/coins/doge.png",
    price: 0.123,
    change24h: -2.34,
    marketCap: 16000000000,
    volume24h: 980000000,
    category: ["Meme", "Dog"],
  },
  {
    id: "shib",
    name: "Shiba Inu",
    symbol: "SHIB",
    logo: "/coins/shib.png",
    price: 0.00002345,
    change24h: 7.89,
    marketCap: 13500000000,
    volume24h: 850000000,
    category: ["Meme", "Dog"],
  },
  {
    id: "floki",
    name: "Floki",
    symbol: "FLOKI",
    logo: "/coins/floki.png",
    price: 0.0001234,
    change24h: 12.34,
    marketCap: 1200000000,
    volume24h: 320000000,
    category: ["Meme", "Dog"],
  },
  {
    id: "bonk",
    name: "Bonk",
    symbol: "BONK",
    logo: "/coins/bonk.png",
    price: 0.00000234,
    change24h: -3.45,
    marketCap: 950000000,
    volume24h: 210000000,
    category: ["Meme", "Dog", "Solana"],
  },
  {
    id: "wojak",
    name: "Wojak",
    symbol: "WOJAK",
    logo: "/coins/wojak.png",
    price: 0.0000789,
    change24h: 9.87,
    marketCap: 320000000,
    volume24h: 78000000,
    category: ["Meme", "Feels"],
  },
];

const formatPrice = (price: number): string => {
  if (price < 0.00001) {
    return price.toFixed(8);
  } else if (price < 0.01) {
    return price.toFixed(6);
  } else if (price < 1) {
    return price.toFixed(4);
  } else {
    return price.toFixed(2);
  }
};

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1000000000) {
    return `$${(marketCap / 1000000000).toFixed(2)}B`;
  } else if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(2)}M`;
  } else {
    return `$${(marketCap / 1000).toFixed(2)}K`;
  }
};

const MemeCoins: React.FC = () => {
  return (
    <section id="memecoins" className="py-16 container">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-gradient">Trending Meme Coins</h2>
          <p className="text-muted-foreground">
            Track the hottest meme coins in the crypto market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingCoins.map((coin) => (
            <div
              key={coin.id}
              className="glass-card p-4 hover:shadow-glow-sm transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-black/40">
                  <AspectRatio ratio={1 / 1}>
                    <img
                      src={coin.logo}
                      alt={coin.name}
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{coin.name}</h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-wybe-primary" />
                      <span className="text-xs text-muted-foreground">
                        Trending
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-muted-foreground">
                      {coin.symbol}
                    </span>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        coin.change24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {coin.change24h >= 0 ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      <span>{Math.abs(coin.change24h).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-medium">${formatPrice(coin.price)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Market Cap</p>
                    <p className="font-medium">
                      {formatMarketCap(coin.marketCap)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {coin.category.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-1 bg-wybe-primary/10 rounded-full text-xs text-wybe-primary"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MemeCoins;
