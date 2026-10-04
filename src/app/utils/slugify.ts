export const slugify = (text: string): string =>
	text
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/['"`‘’“”]/g, "")
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9\s-]/g, " ")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
