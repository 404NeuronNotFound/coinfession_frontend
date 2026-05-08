'use client';

import { Badge } from './badge';
import EmotionBadge from './EmotionBadge';
import { EmotionTag } from '@/types/trade';

interface TradeItem {
  id: string | number;
  type: 'BUY' | 'SELL';
  coin: string;
  ticker: string;
  price: number;
  quantity: number;
  emotion: EmotionTag;
  date: string;
}

interface RecentTradesProps {
  trades: TradeItem[];
  onViewAll?: () => void;
}

export default function RecentTrades({ trades, onViewAll }: RecentTradesProps) {
  return (
    <div className="p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold mb-4 text-muted-foreground">
        Recent Trades
      </h3>

      <div className="space-y-3">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <Badge
                variant={trade.type === 'BUY' ? 'secondary' : 'default'}
                className="shrink-0"
              >
                {trade.type}
              </Badge>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{trade.ticker}</span>
                  <span className="text-xs text-muted-foreground">
                    {trade.quantity} @ ${trade.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <EmotionBadge emotion={trade.emotion} />
                  <span className="text-xs text-muted-foreground">{trade.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          View all trades →
        </button>
      )}
    </div>
  );
}
