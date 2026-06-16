import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BettingMarket {
  id: number;
  marketType: string;
  marketName: string;
  description?: string;
}

interface MarketSelection {
  id: number;
  selectionName: string;
  selectionCode: string;
  oddValue?: number;
}

interface BettingMarketsProps {
  eventId: number;
  markets: BettingMarket[];
  onSelectOption: (market: BettingMarket, selection: MarketSelection, odds: number) => void;
}

export default function BettingMarkets({ eventId, markets, onSelectOption }: BettingMarketsProps) {
  const [expandedMarkets, setExpandedMarkets] = useState<Set<number>>(new Set());
  const [marketSelections, setMarketSelections] = useState<Record<number, MarketSelection[]>>({});

  const toggleMarket = async (marketId: number) => {
    const newExpanded = new Set(expandedMarkets);
    if (newExpanded.has(marketId)) {
      newExpanded.delete(marketId);
    } else {
      newExpanded.add(marketId);
      // Load selections if not already loaded
      if (!marketSelections[marketId]) {
        // In a real app, fetch from API
        // For now, use mock data
        const mockSelections: Record<number, MarketSelection[]> = {
          1: [
            { id: 1, selectionName: "Home Win", selectionCode: "1", oddValue: 1.85 },
            { id: 2, selectionName: "Draw", selectionCode: "X", oddValue: 3.50 },
            { id: 3, selectionName: "Away Win", selectionCode: "2", oddValue: 4.20 },
          ],
          2: [
            { id: 4, selectionName: "Home or Draw", selectionCode: "1X", oddValue: 1.45 },
            { id: 5, selectionName: "Home or Away", selectionCode: "12", oddValue: 1.50 },
            { id: 6, selectionName: "Draw or Away", selectionCode: "X2", oddValue: 2.10 },
          ],
          3: [
            { id: 7, selectionName: "Over 2.5", selectionCode: "O2.5", oddValue: 1.90 },
            { id: 8, selectionName: "Under 2.5", selectionCode: "U2.5", oddValue: 1.95 },
          ],
          4: [
            { id: 9, selectionName: "Yes", selectionCode: "YES", oddValue: 1.75 },
            { id: 10, selectionName: "No", selectionCode: "NO", oddValue: 2.15 },
          ],
        };
        setMarketSelections((prev) => ({
          ...prev,
          [marketId]: mockSelections[marketId] || [],
        }));
      }
    }
    setExpandedMarkets(newExpanded);
  };

  return (
    <div className="space-y-2">
      {markets.map((market) => (
        <div key={market.id} className="border border-border rounded-lg overflow-hidden">
          {/* Market Header */}
          <button
            onClick={() => toggleMarket(market.id)}
            className="w-full px-4 py-3 bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-between"
          >
            <div className="text-left">
              <h4 className="font-semibold text-foreground">{market.marketName}</h4>
              <p className="text-xs text-muted-foreground">{market.marketType}</p>
            </div>
            {expandedMarkets.has(market.id) ? (
              <ChevronUp size={20} className="text-accent" />
            ) : (
              <ChevronDown size={20} className="text-muted-foreground" />
            )}
          </button>

          {/* Market Selections */}
          {expandedMarkets.has(market.id) && (
            <div className="p-4 bg-background border-t border-border space-y-2">
              {marketSelections[market.id]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {marketSelections[market.id].map((selection) => (
                    <button
                      key={selection.id}
                      onClick={() => onSelectOption(market, selection, selection.oddValue || 1.0)}
                      className="p-3 border border-border rounded-lg hover:border-accent hover:bg-accent/10 transition-all text-left group"
                    >
                      <div className="font-medium text-sm text-foreground group-hover:text-accent transition-colors">
                        {selection.selectionName}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {selection.oddValue ? selection.oddValue.toFixed(2) : "N/A"}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No selections available</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
