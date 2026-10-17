import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),

		/* 性能优化：预渲染所有内容（包括折叠区），适用于长文章 */
		prerenderAll: z.boolean().optional().default(false),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const worksCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		lang: z.string().optional().default(""),
		version: z.string().optional().default(""),
		architecture: z.string().optional().default(""),
		video: z.string().optional().default(""),
		videoPoster: z.string().optional().default(""),
		featured: z.boolean().optional().default(false),
	}),
});

const specCollection = defineCollection({
	schema: z.object({
		title: z.string().optional(),
		published: z.date().optional(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
	}),
});

const assetsCollection = defineCollection({
	type: "data",
	schema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
	}),
});

const friendsCollection = defineCollection({
	type: "data",
	schema: z.object({
		name: z.string(),
		url: z.string(),
		avatar: z.string(),
		introduction: z.string(),
		friendsPage: z.string(),
	}),
});

export const collections = {
	posts: postsCollection,
	works: worksCollection,
	spec: specCollection,
	assets: assetsCollection,
	friends: friendsCollection,
};
