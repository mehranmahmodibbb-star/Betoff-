import React, { createContext, useContext, useState, useCallback } from "react";

export interface BetSelection {
  id: string;
  eventId: string;
  eventName: string;
  selection: string;
  odds: number;
}

export type BetType = "single" | "parlay" | "system";

export interface BettingContextType {
  betSlip: BetSelection[];
  betType: BetType;
  setBetType: (type: BetType) => void;
  addBet: (bet: BetSelection) => void;
  removeBet: (id: string) => void;
  clearBetSlip: () => void;
  getTotalOdds: () => number;
  getBetCount: () => number;
  calculateWinnings: (stake: number) => number;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: React.ReactNode }) {
  const [betSlip, setBetSlip] = useState<BetSelection[]>([]);
  const [betType, setBetType] = useState<BetType>("parlay");

  const addBet = useCallback((bet: BetSelection) => {
    setBetSlip((prev) => {
      const exists = prev.find((b) => b.id === bet.id);
      if (exists) return prev;
      return [...prev, bet];
    });
  }, []);

  const removeBet = useCallback((id: string) => {
    setBetSlip((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const clearBetSlip = useCallback(() => {
    setBetSlip([]);
  }, []);

  const getTotalOdds = useCallback(() => {
    if (betType === "single") {
      return betSlip.length > 0 ? betSlip[0].odds : 1;
    } else if (betType === "parlay") {
      return betSlip.reduce((acc, bet) => acc * bet.odds, 1);
    } else {
      // System: average of all combinations
      return betSlip.reduce((acc, bet) => acc * bet.odds, 1);
    }
  }, [betSlip, betType]);

  const calculateWinnings = useCallback(
    (stake: number) => {
      if (betType === "single") {
        // Single: only one selection counts
        if (betSlip.length === 0) return 0;
        return stake * betSlip[0].odds;
      } else if (betType === "parlay") {
        // Parlay: all selections must win, odds multiply
        const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
        return stake * totalOdds;
      } else {
        // System: multiple combinations, each with stake/combinations
        if (betSlip.length < 2) return stake * getTotalOdds();
        
        // For simplicity, calculate as average of all possible combinations
        const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
        const combinations = Math.pow(2, betSlip.length) - 1; // Total combinations
        return (stake / combinations) * totalOdds;
      }
    },
    [betType, betSlip, getTotalOdds]
  );

  const getBetCount = useCallback(() => {
    return betSlip.length;
  }, [betSlip]);

  return (
    <BettingContext.Provider
      value={{
        betSlip,
        betType,
        setBetType,
        addBet,
        removeBet,
        clearBetSlip,
        getTotalOdds,
        getBetCount,
        calculateWinnings,
      }}
    >
      {children}
    </BettingContext.Provider>
  );
}

export function useBetting() {
  const context = useContext(BettingContext);
  if (!context) {
    throw new Error("useBetting must be used within BettingProvider");
  }
  return context;
}
