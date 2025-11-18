import { GET as statsGET } from "@/app/api/dashboard/stats/route";
jest.mock("@supabase/auth-helpers-nextjs", () => ({ createRouteHandlerClient: () => ({ auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) }, from: () => ({ select: () => ({ eq: () => ({ data: [{}] }) }) }) }) }));

describe("stats api", () => { it("returns aggregated stats", async () => { const res = await statsGET(); const body = JSON.parse(await res.text()); expect(body.totalRecipes).toBeDefined(); expect(res.status).toBe(200); }); });
