import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SportEvent {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  sport: string;
  status: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  startTime?: string;
}

interface LeagueGroup {
  league: string;
  sport: string;
  events: SportEvent[];
}

interface LeagueGroupedEventsProps {
  events: SportEvent[];
  onPlaceBet: (event: SportEvent, selection: "home" | "draw" | "away") => void;
  isLoading?: boolean;
}

const LEAGUE_ORDER = [
  "BUNDESLIGA",
  "PREMIER LEAGUE",
  "LA LIGA",
  "LIGUE 1",
  "SERIE A",
  "LIGA PORTUGAL",
  "CHAMPIONS LEAGUE",
  "EUROPA LEAGUE",
  "NBA",
  "ATP",
  "WTA",
  "IPL",
  "FORMULA 1",
  "UFC",
  "BOXING",
];

const LEAGUE_FLAGS: Record<string, string> = {
  BUNDESLIGA: "🇩🇪",
  "PREMIER LEAGUE": "🇬🇧",
  "LA LIGA": "🇪🇸",
  "LIGUE 1": "🇫🇷",
  "SERIE A": "🇮🇹",
  "LIGA PORTUGAL": "🇵🇹",
  "CHAMPIONS LEAGUE": "🏆",
  "EUROPA LEAGUE": "🏆",
  NBA: "🏀",
  ATP: "🎾",
  WTA: "🎾",
  IPL: "🏏",
  "FORMULA 1": "🏎️",
  UFC: "🥊",
  BOXING: "🥊",
};

export function LeagueGroupedEvents({
  events,
  onPlaceBet,
  isLoading = false,
}: LeagueGroupedEventsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No events available</p>
      </div>
    );
  }

  // Group events by league
  const groupedByLeague: Record<string, SportEvent[]> = {};
  events.forEach((event) => {
    const league = event.league || "Other";
    if (!groupedByLeague[league]) {
      groupedByLeague[league] = [];
    }
    groupedByLeague[league].push(event);
  });

  // Sort leagues by predefined order
  const sortedLeagues = Object.keys(groupedByLeague).sort((a, b) => {
    const aIndex = LEAGUE_ORDER.indexOf(a.toUpperCase());
    const bIndex = LEAGUE_ORDER.indexOf(b.toUpperCase());
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className="space-y-6">
      {sortedLeagues.map((league) => (
        <Card key={league} className="overflow-hidden bg-card border-border">
          {/* League Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
            <h3 className="text-lg font-bold text-primary-foreground flex items-center gap-2">
              <span className="text-2xl">
                {LEAGUE_FLAGS[league.toUpperCase()] || "⚽"}
              </span>
              {league.toUpperCase()}
            </h3>
          </div>

          {/* Events Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                    Match
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
                    Home
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
                    Draw
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
                    Away
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedByLeague[league].map((event, idx) => (
                  <tr
                    key={event.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    {/* Match Name */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-foreground">
                          {event.homeTeam} vs {event.awayTeam}
                        </p>
                        {event.startTime && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.startTime).toLocaleString()}
                          </p>
                        )}
                        <span className="inline-block w-fit px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded">
                          {event.status}
                        </span>
                      </div>
                    </td>

                    {/* Home Odds */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => onPlaceBet(event, "home")}
                        className="w-full px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold rounded transition-colors"
                      >
                        {event.odds.home.toFixed(2)}
                      </button>
                    </td>

                    {/* Draw Odds */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => onPlaceBet(event, "draw")}
                        className="w-full px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-bold rounded transition-colors"
                      >
                        {event.odds.draw.toFixed(2)}
                      </button>
                    </td>

                    {/* Away Odds */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => onPlaceBet(event, "away")}
                        className="w-full px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold rounded transition-colors"
                      >
                        {event.odds.away.toFixed(2)}
                      </button>
                    </td>

                    {/* Action Button */}
                    <td className="px-4 py-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Show more markets or details
                          console.log("Show more markets for", event.id);
                        }}
                      >
                        More
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Event Count */}
          <div className="px-6 py-3 bg-muted/30 text-sm text-muted-foreground border-t border-border">
            {groupedByLeague[league].length} match
            {groupedByLeague[league].length !== 1 ? "es" : ""}
          </div>
        </Card>
      ))}
    </div>
  );
}
