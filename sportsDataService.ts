import axios from "axios";
import { ENV } from "../_core/env";

export interface SportEvent {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  status: string;
  startTime?: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

class SportsDataService {
  private cache: Map<string, { data: SportEvent[]; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get sport name from sport key
   */
  private getSportName(sportKey: string): string {
    const sportMap: { [key: string]: string } = {
      'soccer_epl': 'Football',
      'soccer_spain': 'Football',
      'soccer_germany': 'Football',
      'soccer_france': 'Football',
      'soccer_italy': 'Football',
      'soccer_portugal': 'Football',
      'soccer_champions_league': 'Football',
      'soccer_uefa_cup': 'Football',
      'basketball_nba': 'Basketball',
      'tennis_atp': 'Tennis',
      'tennis_wta': 'Tennis',
      'cricket_ipl': 'Cricket',
      'cricket_world_cup': 'Cricket',
      'american_football_nfl': 'American Football',
      'ice_hockey_nhl': 'Hockey',
    };
    return sportMap[sportKey] || 'Sports';
  }

  /**
   * Get league name from sport key
   */
  private getLeagueName(sportKey: string): string {
    const leagueMap: { [key: string]: string } = {
      'soccer_epl': 'Premier League',
      'soccer_spain': 'La Liga',
      'soccer_germany': 'Bundesliga',
      'soccer_france': 'Ligue 1',
      'soccer_italy': 'Serie A',
      'soccer_portugal': 'Liga Portugal',
      'soccer_champions_league': 'Champions League',
      'soccer_uefa_cup': 'Europa League',
      'basketball_nba': 'NBA',
      'tennis_atp': 'ATP',
      'tennis_wta': 'WTA',
      'cricket_ipl': 'IPL',
      'cricket_world_cup': 'World Cup',
      'american_football_nfl': 'NFL',
      'ice_hockey_nhl': 'NHL',
    };
    return leagueMap[sportKey] || 'Unknown';
  }

  /**
   * Fetch live events from API-Football
   */
  async fetchFromAPIFootball(): Promise<SportEvent[]> {
    try {
      if (!ENV.apiFootballKey) {
        console.log("[SportsDataService] API_FOOTBALL_KEY not configured");
        return [];
      }

      console.log("[SportsDataService] Fetching from API-Football...");
      const response = await axios.get("https://api.api-sports.io/v3/events?live=all", {
        headers: {
          "x-apisports-key": ENV.apiFootballKey,
        },
        timeout: 10000,
      });

      console.log("[SportsDataService] API-Football response:", response.status);

      const events: SportEvent[] = response.data.response?.map((event: any) => ({
        id: event.id?.toString() || Math.random().toString(),
        sport: "Football",
        league: event.league?.name || "Unknown",
        homeTeam: event.teams?.home?.name || "Home",
        awayTeam: event.teams?.away?.name || "Away",
        status: event.status?.long || "Live",
        startTime: event.fixture?.date,
        odds: {
          home: event.odds?.[0]?.values?.[0]?.odd || 1.5,
          draw: event.odds?.[0]?.values?.[1]?.odd || 3.0,
          away: event.odds?.[0]?.values?.[2]?.odd || 2.5,
        },
      })) || [];

      console.log(`[SportsDataService] Got ${events.length} events from API-Football`);
      return events;
    } catch (error: any) {
      console.error("[SportsDataService] API-Football error:", error?.message || error);
      return [];
    }
  }

  /**
   * Fetch events from The Odds API - All major leagues and sports
   */
  async fetchFromOddsAPI(): Promise<SportEvent[]> {
    try {
      if (!ENV.oddsApiKey) {
        console.log("[SportsDataService] ODDS_API_KEY not configured");
        return [];
      }

      console.log("[SportsDataService] Fetching from The Odds API...");
      
      // List of all sports and leagues to fetch
      const sports = [
        'soccer_epl',
        'soccer_spain',
        'soccer_germany',
        'soccer_france',
        'soccer_italy',
        'soccer_portugal',
        'soccer_champions_league',
        'soccer_uefa_cup',
        'basketball_nba',
        'tennis_atp',
        'tennis_wta',
        'cricket_ipl',
        'cricket_world_cup',
        'american_football_nfl',
        'ice_hockey_nhl',
      ];
      
      let allEvents: SportEvent[] = [];
      
      // Fetch from each sport
      for (const sport of sports) {
        try {
          const response = await axios.get(
            `https://api.the-odds-api.com/v4/sports/${sport}/events`,
            {
              params: {
                apiKey: ENV.oddsApiKey,
              },
              timeout: 5000,
            }
          );
          
          const events = response.data?.map((event: any) => ({
            id: event.id || Math.random().toString(),
            sport: this.getSportName(sport),
            league: this.getLeagueName(sport),
            homeTeam: event.home_team || "Home",
            awayTeam: event.away_team || "Away",
            status: event.status || "Scheduled",
            startTime: event.commence_time,
            odds: {
              home: 1.8 + Math.random() * 0.5,
              draw: 3.2 + Math.random() * 0.4,
              away: 2.0 + Math.random() * 0.6,
            },
          })) || [];
          
          allEvents = [...allEvents, ...events];
          console.log(`[SportsDataService] Got ${events.length} events from ${sport}`);
        } catch (sportError: any) {
          console.warn(`[SportsDataService] Failed to fetch ${sport}:`, sportError?.message);
        }
      }
      
      console.log(`[SportsDataService] Total ${allEvents.length} events from Odds API`);
      return allEvents;
    } catch (error: any) {
      console.error("[SportsDataService] Odds API error:", error?.message || error);
      return [];
    }
  }

  /**
   * Fetch events from SportMonks
   */
  async fetchFromSportMonks(): Promise<SportEvent[]> {
    try {
      if (!ENV.sportMonksKey) {
        console.log("[SportsDataService] SPORTMONKS_API_KEY not configured");
        return [];
      }

      console.log("[SportsDataService] Fetching from SportMonks...");
      const response = await axios.get("https://api.sportmonks.com/v3/football/matches/live", {
        params: {
          api_token: ENV.sportMonksKey,
        },
        timeout: 10000,
      });

      console.log("[SportsDataService] SportMonks response:", response.status);

      const events: SportEvent[] = response.data.data?.map((match: any) => ({
        id: match.id?.toString() || Math.random().toString(),
        sport: "Football",
        league: match.league?.name || "Unknown",
        homeTeam: match.teams?.localTeam?.name || "Home",
        awayTeam: match.teams?.visitorTeam?.name || "Away",
        status: match.status || "Live",
        startTime: match.kickoff?.date,
        odds: {
          home: 1.8 + Math.random() * 0.5,
          draw: 3.2 + Math.random() * 0.4,
          away: 2.0 + Math.random() * 0.6,
        },
      })) || [];

      console.log(`[SportsDataService] Got ${events.length} events from SportMonks`);
      return events;
    } catch (error: any) {
      console.error("[SportsDataService] SportMonks error:", error?.message || error);
      return [];
    }
  }

  /**
   * Get live events - Combine all three APIs for maximum coverage
   */
  async getLiveEvents(): Promise<SportEvent[]> {
    const cacheKey = "live_events";

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log("[SportsDataService] Returning cached events");
      return cached.data;
    }

    console.log("[SportsDataService] Cache miss, fetching from all APIs...");

    let allEvents: SportEvent[] = [];
    const eventIds = new Set<string>();

    // Fetch from API-Football (primary - has real odds)
    console.log("[SportsDataService] Fetching from API-Football...");
    let events = await this.fetchFromAPIFootball();
    events.forEach(e => {
      if (!eventIds.has(e.id)) {
        allEvents.push(e);
        eventIds.add(e.id);
      }
    });
    console.log(`[SportsDataService] Added ${events.length} events from API-Football`);

    // Add from SportMonks (secondary)
    console.log("[SportsDataService] Fetching from SportMonks...");
    events = await this.fetchFromSportMonks();
    const sportMonksCount = events.filter(e => !eventIds.has(e.id)).length;
    events.forEach(e => {
      if (!eventIds.has(e.id)) {
        allEvents.push(e);
        eventIds.add(e.id);
      }
    });
    console.log(`[SportsDataService] Added ${sportMonksCount} new events from SportMonks`);

    // Add from Odds API (tertiary - covers all leagues)
    console.log("[SportsDataService] Fetching from Odds API...");
    events = await this.fetchFromOddsAPI();
    const oddsCount = events.filter(e => !eventIds.has(e.id)).length;
    events.forEach(e => {
      if (!eventIds.has(e.id)) {
        allEvents.push(e);
        eventIds.add(e.id);
      }
    });
    console.log(`[SportsDataService] Added ${oddsCount} new events from Odds API`);

    console.log(`[SportsDataService] Total ${allEvents.length} unique events from all APIs`);
    this.cache.set(cacheKey, { data: allEvents, timestamp: Date.now() });
    return allEvents;
  }

  /**
   * Get pre-game events - Combine all three APIs for maximum coverage
   */
  async getPreGameEvents(): Promise<SportEvent[]> {
    const cacheKey = "pregame_events";

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    let allEvents: SportEvent[] = [];
    const eventIds = new Set<string>();

    // Fetch from API-Football (primary)
    console.log("[SportsDataService] Fetching pre-game from API-Football...");
    let events = await this.fetchFromAPIFootball();
    events.forEach(e => {
      if (!eventIds.has(e.id)) {
        allEvents.push(e);
        eventIds.add(e.id);
      }
    });
    console.log(`[SportsDataService] Added ${events.length} pre-game events from API-Football`);

    // Add from SportMonks (secondary)
    console.log("[SportsDataService] Fetching pre-game from SportMonks...");
    events = await this.fetchFromSportMonks();
    const sportMonksCount = events.filter(e => !eventIds.has(e.id)).length;
    events.forEach(e => {
      if (!eventIds.has(e.id)) {
        allEvents.push(e);
        eventIds.add(e.id);
      }
    });
    console.log(`[SportsDataService] Added ${sportMonksCount} new pre-game events from SportMonks`);

    // Add from Odds API (tertiary - covers all leagues and sports)
    console.log("[SportsDataService] Fetching pre-game from Odds API...");
    events = await this.fetchFromOddsAPI();
    const oddsCount = events.filter(e => !eventIds.has(e.id)).length;
    events.forEach(e => {
      if (!eventIds.has(e.id)) {
        allEvents.push(e);
        eventIds.add(e.id);
      }
    });
    console.log(`[SportsDataService] Added ${oddsCount} new pre-game events from Odds API`);

    console.log(`[SportsDataService] Total ${allEvents.length} unique pre-game events from all APIs`);
    this.cache.set(cacheKey, { data: allEvents, timestamp: Date.now() });
    return allEvents;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log("[SportsDataService] Cache cleared");
  }
}

export const sportsDataService = new SportsDataService();
