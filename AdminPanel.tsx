import { useLocation } from "wouter";
import { ArrowLeft, Users, CreditCard, TicketIcon, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function AdminPanel() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useState<"bets" | "users" | "transactions">("bets");
  const [settlementResult, setSettlementResult] = useState<"won" | "lost" | "void" | null>(null);
  const [settlementWinnings, setSettlementWinnings] = useState("");
  const [selectedBetId, setSelectedBetId] = useState<number | null>(null);

  // Fetch active bets for settlement
  const { data: activeBets = [], isLoading: betsLoading } = trpc.betting.getActiveBets.useQuery();
  
  // Settlement mutation
  const settleBetMutation = trpc.betting.settleBet.useMutation({
    onSuccess: () => {
      setSelectedBetId(null);
      setSettlementResult(null);
      setSettlementWinnings("");
    },
  });

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const pendingBets = activeBets.filter((bet: any) => bet.status === "pending");
  const settledBets = activeBets.filter((bet: any) => bet.status !== "pending");

  const handleSettleBet = async () => {
    if (!selectedBetId || !settlementResult) return;
    
    await settleBetMutation.mutateAsync({
      betSlipId: selectedBetId,
      result: settlementResult,
      winnings: settlementWinnings || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-indigo-900 border-b border-gray-700 sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <img src="/logo-new.png" alt="BetOff" className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700 p-4">
            <p className="text-gray-400 text-sm mb-2">Total Bets</p>
            <p className="text-2xl font-bold text-white">{activeBets.length}</p>
          </Card>
          <Card className="bg-gray-800 border-gray-700 p-4">
            <p className="text-gray-400 text-sm mb-2">Pending Bets</p>
            <p className="text-2xl font-bold text-yellow-500">{pendingBets.length}</p>
          </Card>
          <Card className="bg-gray-800 border-gray-700 p-4">
            <p className="text-gray-400 text-sm mb-2">Settled Bets</p>
            <p className="text-2xl font-bold text-green-500">{settledBets.length}</p>
          </Card>
          <Card className="bg-gray-800 border-gray-700 p-4">
            <p className="text-gray-400 text-sm mb-2">Total Stake</p>
            <p className="text-2xl font-bold text-white">
              ${activeBets.reduce((sum: number, b: any) => sum + parseFloat(b.stake || 0), 0).toFixed(2)}
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setSelectedTab("bets")}
            className={`px-4 py-2 font-semibold transition ${
              selectedTab === "bets"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Bet Settlement ({pendingBets.length})
          </button>
          <button
            onClick={() => setSelectedTab("users")}
            className={`px-4 py-2 font-semibold transition ${
              selectedTab === "users"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setSelectedTab("transactions")}
            className={`px-4 py-2 font-semibold transition ${
              selectedTab === "transactions"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Transactions
          </button>
        </div>

        {/* Bet Settlement Tab */}
        {selectedTab === "bets" && (
          <div>
            {betsLoading ? (
              <p className="text-gray-400">Loading bets...</p>
            ) : pendingBets.length === 0 ? (
              <p className="text-gray-400">No pending bets to settle</p>
            ) : (
              <div className="space-y-4">
                {pendingBets.map((bet: any) => (
                  <Card
                    key={bet.id}
                    className={`bg-gray-800 border-gray-700 p-4 cursor-pointer transition ${
                      selectedBetId === bet.id ? "border-blue-500 bg-gray-700" : ""
                    }`}
                    onClick={() => setSelectedBetId(bet.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold">
                          Bet #{bet.id} - {bet.betType.toUpperCase()}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Stake: ${bet.stake} | Potential: ${bet.potentialWinnings}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Created: {new Date(bet.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/10 text-yellow-500">
                        Pending
                      </span>
                    </div>

                    {selectedBetId === bet.id && (
                      <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSettlementResult("won");
                            }}
                            className={`${
                              settlementResult === "won"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Won
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSettlementResult("lost");
                            }}
                            className={`${
                              settlementResult === "lost"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Lost
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSettlementResult("void");
                            }}
                            className={`${
                              settlementResult === "void"
                                ? "bg-gray-600 hover:bg-gray-500"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                          >
                            Void
                          </Button>
                        </div>

                        {settlementResult === "won" && (
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Winnings Amount</label>
                            <Input
                              type="number"
                              placeholder="Enter winnings amount"
                              value={settlementWinnings}
                              onChange={(e) => setSettlementWinnings(e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                        )}

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSettleBet();
                          }}
                          disabled={!settlementResult || settleBetMutation.isPending}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          {settleBetMutation.isPending ? "Settling..." : "Confirm Settlement"}
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === "users" && (
          <div className="text-center py-12">
            <p className="text-gray-400">User management coming soon...</p>
          </div>
        )}

        {/* Transactions Tab */}
        {selectedTab === "transactions" && (
          <div className="text-center py-12">
            <p className="text-gray-400">Transaction management coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
