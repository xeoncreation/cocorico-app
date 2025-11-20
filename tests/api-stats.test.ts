import { GET as statsGET } from "@/app/api/dashboard/stats/route";

// Build a chaining mock that supports .eq() calls and head/count options
const createChainableMock = () => {
  const mock: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    data: [],
    count: 0,
  };
  // Override for promises
  mock.then = (resolve: any) => resolve({ data: mock.data, count: mock.count });
  return mock;
};

jest.mock("@/lib/supabase/server", () => ({
  createRouteHandlerClient: () => ({
    auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) },
    from: () => createChainableMock(),
  }),
}));

describe("stats api", () => {
  it("returns aggregated stats", async () => {
    const res = await statsGET();
    const body = JSON.parse(await res.text());
    expect(body.totalRecipes).toBeDefined();
    expect(res.status).toBe(200);
  });
});

