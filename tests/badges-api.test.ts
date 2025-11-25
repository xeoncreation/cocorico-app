import { GET as badgesGET } from "@/app/api/dashboard/badges/route";
jest.mock("@/lib/supabase/server", () => ({
	createServerComponentClient: () => ({
		auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) },
		from: () => ({
			select: () => ({
				eq: () => ({
					order: () => ({
						data: [
							{
								earned_at: new Date().toISOString(),
								badges: {
									code: "first_3_recipes",
									name: "Primeras 3 recetas",
									description: "Has creado 3 recetas.",
									icon: "🥄",
								},
							},
						],
					}),
				}),
			}),
		}),
	}),
}));
describe("badges api", () => {
	it("returns badges list", async () => {
		const res = await badgesGET();
		const body = JSON.parse(await res.text());
		expect(Array.isArray(body.badges)).toBe(true);
		expect(res.status).toBe(200);
	});
});