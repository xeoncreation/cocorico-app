import {getRequestConfig} from "next-intl/server";

export default getRequestConfig(async ({locale}) => {
	const loc = locale || "es";
	try {
		const messages = (await import(`./src/messages/${loc}.json`)).default;
		return {locale: loc, messages};
	} catch (e) {
		// Fallback: load Spanish as default if locale file missing
		const messages = (await import("./src/messages/es.json")).default;
		return {locale: "es", messages};
	}
});
