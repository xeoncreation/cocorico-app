import {getRequestConfig} from 'next-intl/server';

// Provide messages for supported locales and fall back to 'es'
export default getRequestConfig(async ({locale}) => {
	const supported = ['es', 'en'] as const;
	const loc = locale ?? 'es';
	const safeLocale = (supported as readonly string[]).includes(loc) ? loc : 'es';
	const messages = (await import(`../messages/${safeLocale}.json`)).default;
	return {
		locale: safeLocale,
		messages
	};
});
