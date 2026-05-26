import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";

describe("analytics cleanup", () => {
  it("keeps Umami in the root head", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");

    expect(layout).toContain("https://cloud.umami.is/script.js");
    expect(layout).toContain("5d250dde-2543-4934-b2c7-0255f00f8720");
  });

  it("removes the custom analytics route, page, tracker, and nav entry", () => {
    expect(existsSync("app/api/track/route.ts")).toBe(false);
    expect(existsSync("app/(site)/analytics/page.tsx")).toBe(false);
    expect(existsSync("components/analytics-tracker.tsx")).toBe(false);
    expect(existsSync("lib/supabase.ts")).toBe(false);
    expect(JSON.stringify(siteConfig.navItems)).not.toContain("/analytics");
    expect(JSON.stringify(siteConfig.navMenuItems)).not.toContain("/analytics");
  });
});
