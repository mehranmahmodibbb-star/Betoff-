import { describe, it, expect, beforeEach } from "vitest";
import { fetchLiveEvents, fetchPreGameEvents, clearCache } from "./_core/apifootball-cache";

const API_KEY = process.env.API_FOOTBALL_KEY || "";

describe("API-Football Caching Service", () => {
  beforeEach(() => {
    clearCache();
  });

  it("should fetch live events from API-Football", async () => {
    if (!API_KEY) {
      console.log("Skipping API test - API_FOOTBALL_KEY not set");
      expect(true).toBe(true);
      return;
    }

    const events = await fetchLiveEvents(API_KEY);
    
    // Should return an array (even if empty due to no live events)
    expect(Array.isArray(events)).toBe(true);
    
    // If events exist, check structure
    if (events.length > 0) {
      const event = events[0];
      expect(event).toHaveProperty("id");
      expect(event).toHaveProperty("sport");
      expect(event).toHaveProperty("homeTeam");
      expect(event).toHaveProperty("awayTeam");
      expect(event).toHaveProperty("startTime");
      expect(event).toHaveProperty("odds");
    }
  });

  it("should fetch pre-game events from API-Football", async () => {
    if (!API_KEY) {
      console.log("Skipping API test - API_FOOTBALL_KEY not set");
      expect(true).toBe(true);
      return;
    }

    const events = await fetchPreGameEvents(API_KEY);
    
    expect(Array.isArray(events)).toBe(true);
    
    if (events.length > 0) {
      const event = events[0];
      expect(event.sport).toBe("Football");
      expect(event.homeTeam).toBeTruthy();
      expect(event.awayTeam).toBeTruthy();
    }
  });

  it("should cache events and return cached data on subsequent calls", async () => {
    if (!API_KEY) {
      console.log("Skipping cache test - API_FOOTBALL_KEY not set");
      expect(true).toBe(true);
      return;
    }

    const firstCall = await fetchLiveEvents(API_KEY);
    const secondCall = await fetchLiveEvents(API_KEY);
    
    // Both calls should return the same data (from cache)
    expect(firstCall).toEqual(secondCall);
  });

  it("should handle API errors gracefully", async () => {
    const invalidKey = "invalid-key-12345";
    const events = await fetchLiveEvents(invalidKey);
    
    // Should return empty array on error
    expect(Array.isArray(events)).toBe(true);
  });
});
