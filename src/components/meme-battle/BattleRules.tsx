
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BattleRules = () => {
  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader className="bg-orange-50 dark:bg-orange-900/20">
        <CardTitle className="text-orange-800 dark:text-orange-200">
          Meme Battle Royale: Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">How It Works</h3>
            <ol className="list-decimal ml-5 space-y-2">
              <li>
                <strong>Battle Rooms:</strong> Every minute, new battle rooms open for meme coin creators.
              </li>
              <li>
                <strong>Room Capacity:</strong> Each room accepts 3-4 meme coins.
              </li>
              <li>
                <strong>Waiting Period:</strong> Creators have a 1-minute window to promote their token and attract initial buyers.
              </li>
              <li>
                <strong>Battle Duration:</strong> After the waiting period, all tokens launch simultaneously. The battle lasts for 24 hours.
              </li>
              <li>
                <strong>Winner Determination:</strong> The coin with the highest market cap at the end of 24 hours wins the battle.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Rewards Distribution</h3>
            <ul className="list-disc ml-5 space-y-2">
              <li>
                <strong>Winner's Traders:</strong> 90% of the total trading fees collected from all tokens in the room are distributed to the traders of the winning token.
              </li>
              <li>
                <strong>Platform Treasury:</strong> 10% of the total fees go to the platform treasury.
              </li>
              <li>
                <strong>Distribution Method:</strong> Traders receive rewards proportional to their trading volume on the winning token.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Trading Tips</h3>
            <ul className="list-disc ml-5 space-y-2">
              <li>
                <strong>Research:</strong> Look at token names, symbols, and creator wallets to inform your trading decisions.
              </li>
              <li>
                <strong>Timing:</strong> Market dynamics can shift quickly. Monitor trading activity and market cap changes.
              </li>
              <li>
                <strong>Diversify:</strong> Consider trading across multiple tokens in different battle rooms.
              </li>
              <li>
                <strong>Social Promotion:</strong> Share your token with others to increase trading volume and market cap.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Important Notes</h3>
            <ul className="list-disc ml-5 space-y-2">
              <li>
                <strong>Trading Fees:</strong> Each trade has a small fee that contributes to the reward pool.
              </li>
              <li>
                <strong>Market Cap Calculation:</strong> Market cap is calculated based on current token price × circulating supply.
              </li>
              <li>
                <strong>Rewards Claiming:</strong> After a battle ends, traders of the winning token can claim their portion of the reward pool.
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BattleRules;
