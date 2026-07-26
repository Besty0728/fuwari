export type ContributionDay = { date: string; count: number; level: number };
export type ContributionData = {
	username: string;
	total: number;
	updatedAt: string;
	days: ContributionDay[];
};

// 数据文件由 scripts/fetch-github-contributions.mjs 生成，可能尚未生成或被误删。
// 这里必须用 import.meta.glob 而不是 await import()：动态 import 在 Vite 构建的
// 静态分析阶段就会因解析不到模块而直接中断构建，运行时的 try/catch 根本拦不住；
// glob 匹配不到文件时只返回空对象，构建照常通过，组件据此降级为不渲染。
const dataModules = import.meta.glob<{ default: ContributionData }>(
	"../data/github-contributions.json",
	{ eager: true },
);

// cached 缓存最终结果（可能为 null），attempted 标记是否已尝试过读取
let cached: ContributionData | null = null;
let attempted = false;

export async function getGithubContributions(): Promise<ContributionData | null> {
	if (attempted) return cached;
	attempted = true;

	const data = Object.values(dataModules)[0]?.default;

	if (
		!data ||
		typeof data.username !== "string" ||
		typeof data.total !== "number" ||
		!Array.isArray(data.days) ||
		data.days.length === 0
	) {
		cached = null;
	} else {
		cached = data;
	}

	return cached;
}
