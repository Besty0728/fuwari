/**
 * 抓取 GitHub 用户近一年的贡献热力图数据，写入 src/data/github-contributions.json。
 *
 * 数据源优先级：
 *   A. GitHub GraphQL API（仅当存在 GITHUB_TOKEN 环境变量时使用）
 *   B. jogruber 第三方接口（无 token 或数据源 A 失败时的回退）
 *
 * 容错策略：两个数据源都不可用时，若本地已存在旧数据文件则保留旧文件并以
 * 退出码 0 结束，避免外部 API 抖动导致构建失败；若连旧文件都没有，才以
 * 非零退出码结束。
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const USERNAME = "Besty0728";
const TIMEOUT_MS = 15000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(
	__dirname,
	"..",
	"src",
	"data",
	"github-contributions.json",
);

// GraphQL 的贡献等级枚举 -> 归一化数字（0-4）
const GRAPHQL_LEVEL_MAP = {
	NONE: 0,
	FIRST_QUARTILE: 1,
	SECOND_QUARTILE: 2,
	THIRD_QUARTILE: 3,
	FOURTH_QUARTILE: 4,
};

/**
 * 数据源 A：GitHub GraphQL API（需要 token）
 */
async function fetchFromGraphQL(token) {
	const query = `
		query($login: String!) {
			user(login: $login) {
				name
				avatarUrl
				contributionsCollection {
					contributionCalendar {
						totalContributions
						weeks {
							contributionDays {
								date
								contributionCount
								contributionLevel
							}
						}
					}
				}
			}
		}
	`;

	const res = await fetch("https://api.github.com/graphql", {
		method: "POST",
		headers: {
			Authorization: `bearer ${token}`,
			"Content-Type": "application/json",
			"User-Agent": "fuwari-contributions-fetcher",
		},
		body: JSON.stringify({ query, variables: { login: USERNAME } }),
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});

	if (!res.ok) {
		throw new Error(`GraphQL HTTP ${res.status} ${res.statusText}`);
	}

	const json = await res.json();

	// GraphQL 即使 HTTP 200 也可能携带 errors 字段，必须显式检查
	if (json.errors) {
		throw new Error(`GraphQL 返回错误: ${JSON.stringify(json.errors)}`);
	}

	const user = json.data?.user;
	const calendar = user?.contributionsCollection?.contributionCalendar;
	if (!calendar) {
		throw new Error("GraphQL 响应缺少 contributionCalendar 字段");
	}

	const days = calendar.weeks.flatMap((week) =>
		week.contributionDays.map((day) => ({
			date: day.date,
			count: day.contributionCount,
			level: GRAPHQL_LEVEL_MAP[day.contributionLevel] ?? 0,
		})),
	);

	return {
		name: user.name || null,
		avatarUrl: user.avatarUrl || `https://github.com/${USERNAME}.png`,
		total: calendar.totalContributions,
		days,
	};
}

/**
 * 数据源 B：jogruber 第三方接口（无需 token）
 */
async function fetchFromJogruber() {
	const res = await fetch(
		`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`,
		{ signal: AbortSignal.timeout(TIMEOUT_MS) },
	);

	if (!res.ok) {
		throw new Error(`jogruber HTTP ${res.status} ${res.statusText}`);
	}

	const json = await res.json();
	const days = (json.contributions || []).map((day) => ({
		date: day.date,
		count: day.count,
		level: day.level,
	}));

	// jogruber 接口不返回展示名和头像，展示名留空由前端回退为用户名，
	// 头像直接用 GitHub 的免鉴权头像地址（稳定、无需 token）。
	return {
		name: null,
		avatarUrl: `https://github.com/${USERNAME}.png`,
		total: json.total?.lastYear ?? 0,
		days,
	};
}

/**
 * 基本合理性校验：避免把畸形数据当作有效结果写入文件
 */
function isValid(result) {
	if (!result || !Array.isArray(result.days)) return false;
	if (result.days.length < 300 || result.days.length > 400) return false;
	if (typeof result.avatarUrl !== "string" || !result.avatarUrl) return false;
	return result.days.every(
		(d) =>
			typeof d.date === "string" &&
			typeof d.count === "number" &&
			typeof d.level === "number",
	);
}

function loadExisting() {
	if (!existsSync(OUTPUT_PATH)) return null;
	try {
		return JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
	} catch {
		return null;
	}
}

function writeResult(result) {
	mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
	const data = {
		username: USERNAME,
		name: result.name,
		avatarUrl: result.avatarUrl,
		total: result.total,
		updatedAt: new Date().toISOString(),
		days: result.days,
	};
	writeFileSync(OUTPUT_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
	return data;
}

async function main() {
	const token = process.env.GITHUB_TOKEN;
	let result = null;
	let source = null;

	if (token) {
		try {
			console.log("尝试数据源 A：GitHub GraphQL API ...");
			const r = await fetchFromGraphQL(token);
			if (isValid(r)) {
				result = r;
				source = "GraphQL";
			} else {
				console.warn("⚠️ GraphQL 返回数据未通过合理性校验，回退到 jogruber");
			}
		} catch (err) {
			console.warn(`⚠️ GraphQL 数据源失败: ${err.message}`);
		}
	} else {
		console.log("未检测到 GITHUB_TOKEN，跳过 GraphQL，直接使用 jogruber");
	}

	if (!result) {
		try {
			console.log("尝试数据源 B：jogruber ...");
			const r = await fetchFromJogruber();
			if (isValid(r)) {
				result = r;
				source = "jogruber";
			} else {
				console.warn("⚠️ jogruber 返回数据未通过合理性校验");
			}
		} catch (err) {
			console.warn(`⚠️ jogruber 数据源失败: ${err.message}`);
		}
	}

	if (!result) {
		const existing = loadExisting();
		if (existing) {
			console.warn("⚠️ 两个数据源均失败，保留旧数据文件，本次不更新");
			process.exit(0);
		}
		console.error("❌ 两个数据源均失败，且不存在旧数据文件");
		process.exit(1);
	}

	const data = writeResult(result);
	console.log(`✅ 数据源: ${source}`);
	console.log(`   total: ${data.total}`);
	console.log(`   days: ${data.days.length}`);
	console.log(`   写入路径: ${OUTPUT_PATH}`);
}

main().catch((err) => {
	console.error("❌ 脚本执行出现未捕获异常:", err);
	process.exit(1);
});
