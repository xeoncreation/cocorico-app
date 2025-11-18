import { GET as searchGET } from "@/app/api/recipes/search/route";

// Minimal NextRequest mock
class MockReq {
  url: string;
  constructor(url: string) { this.url = url; }
}

// Mock Supabase client behaviour for textSearch and ilike
jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createRouteHandlerClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          // First branch used by textSearch path
          textSearch: () => ({ lte: () => ({ limit: async () => ({ data: [{ id: "r1" }], error: null }) }) }),
          // Fallback branch used by ilike path
          ilike: () => ({ lte: () => ({ limit: async () => ({ data: [{ id: "r2" }], error: null }) }) }),
          order: () => ({ limit: async () => ({ data: [{ id: "r3" }], error: null }) }),
          lte: () => ({ order: () => ({ limit: async () => ({ data: [{ id: "r4" }], error: null }) }) }),
          limit: async () => ({ data: [{ id: "r5" }], error: null }),
        })
      })
    })
  })
}));

describe("recipes search api", () => {
  it("returns recipes array", async () => {
    const req = new MockReq("https://example.com/api/recipes/search?q=pasta");
    const res = await searchGET(req as any);
    const body = JSON.parse(await res.text());
    expect(Array.isArray(body.recipes)).toBe(true);
    expect(res.status).toBe(200);
  });
});
