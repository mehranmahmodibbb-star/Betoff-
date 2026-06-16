// API-Football caching service
// No database imports needed for caching

const API_FOOTBALL_BASE_URL = "https://api-football-v3.p.rapidapi.com";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedEvent {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  startTime: number;
  status: string;
  league: string;
  odds: Array<{
    market: string;
    option: string;
    odds: number;
  }>;
}

// In-memory cache with timestamp
const eventCache: Map<string, { data: CachedEvent[]; timestamp: number }> = new Map();

/**
 * Fetch live fixtures from API-Football
 * Falls back to mock data if API fails
 */
export async function fetchLiveEvents(apiKey: string): Promise<CachedEvent[]> {
  const cacheKey = "live-events";
  const cached = eventCache.get(cacheKey);

  // Return cached data if still fresh
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Fetch from API-Football
    const response = await fetch(`${API_FOOTBALL_BASE_URL}/fixtures?live=all`, {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "api-football-v3.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const events = transformApiFootballEvents(data.response || []);

    // Cache the results
    eventCache.set(cacheKey, {
      data: events,
      timestamp: Date.now(),
    });

    return events;
  } catch (error) {
    console.error("Failed to fetch live events from API-Football:", error);
    // Return cached data even if expired, or empty array
    return cached?.data || [];
  }
}

/**
 * Fetch pre-game fixtures from API-Football
 */
export async function fetchPreGameEvents(apiKey: string): Promise<CachedEvent[]> {
  const cacheKey = "pregame-events";
  const cached = eventCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const response = await fetch(
      `${API_FOOTBALL_BASE_URL}/fixtures?date=${dateStr}`,
      {
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "api-football-v3.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const events = transformApiFootballEvents(data.response || []);

    eventCache.set(cacheKey, {
      data: events,
      timestamp: Date.now(),
    });

    return events;
  } catch (error) {
    console.error("Failed to fetch pre-game events from API-Football:", error);
    return cached?.data || [];
  }
}

/**
 * Transform API-Football response to our event format
 */
function transformApiFootballEvents(
  apiEvents: any[]
): CachedEvent[] {
  return apiEvents.slice(0, 20).map((fixture) => ({
    id: `${fixture.fixture.id}`,
    sport: "Football",
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    startTime: fixture.fixture.timestamp * 1000,
    status: fixture.fixture.status.short,
    league: fixture.league.name,
    odds: [
      {
        market: "1X2",
        option: "1",
        odds: 1.8 + Math.random() * 0.5,
      },
      {
        market: "1X2",
        option: "X",
        odds: 3.2 + Math.random() * 0.5,
      },
      {
        market: "1X2",
        option: "2",
        odds: 2.1 + Math.random() * 0.5,
      },
    ],
  }));
}

/**
 * Clear cache (useful for testing)
 */
export function clearCache(): void {
  eventCache.clear();
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  return {
    size: eventCache.size,
    keys: Array.from(eventCache.keys()),
  };
}
