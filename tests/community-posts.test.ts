import { GET as postsGET } from "@/app/api/community/posts/route";
jest.mock("@/lib/supabase/server", () => ({
	createRouteHandlerClient: () => ({
		auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) },
		from: (table: string) => {
			// Provide chainable mocks used in route
			if (table === "community_posts") {
				return {
					select: () => ({
						order: () => ({
							limit: () => ({ data: [{ id: "p1", user_id: "u1", content: "Hola truco", image_url: null, likes: 0, created_at: new Date().toISOString() }] })
						})
					})
				} as any;
			}
			if (table === "user_profiles") {
				return {
					select: () => ({
						in: () => ({ data: [{ id: "u1", display_name: "Tester", avatar_url: null }] })
					})
				} as any;
			}
			if (table === "community_follows") {
				return {
					select: () => ({ eq: () => ({ data: [] }) })
				} as any;
			}
			if (table === "community_comments") {
				return {
					select: () => ({ in: () => ({ data: [] }) })
				} as any;
			}
			return { select: () => ({ data: [] }) } as any;
		},
	}),
}));
describe("community posts api", () => {
	it("returns posts list", async () => {
		const res = await postsGET();
		const body = JSON.parse(await res.text());
		expect(Array.isArray(body.posts)).toBe(true);
		expect(body.posts[0].content).toContain("Hola");
	});
});
