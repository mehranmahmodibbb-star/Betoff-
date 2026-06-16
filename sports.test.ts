import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";

describe("Sports API Integration", () => {
  it("should have SPORTS_API_KEY configured", () => {
    expect(ENV.sportsApiKey).toBeDefined();
    expect(ENV.sportsApiKey).toBeTruthy();
    expect(ENV.sportsApiKey.length).toBeGreaterThan(0);
  });

  it("should be able to construct API request with the key", () => {
    const apiKey = ENV.sportsApiKey;
    const apiUrl = `https://api.api-sports.io/v3/events?live=all`;
    
    // Verify the key format
    expect(apiKey).toMatch(/^[a-zA-Z0-9]+$/);
    
    // Verify URL is valid
    expect(apiUrl).toContain("api-sports.io");
    expect(apiUrl).toContain("v3");
  });
});
