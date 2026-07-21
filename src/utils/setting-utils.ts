import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";
import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}

export type BgMode = "fixed" | "random";

// 背景模式持久化：默认固定背景，用户手动切换到随机背景后跨页面/跨会话保持
export function getStoredBgMode(): BgMode {
	return localStorage.getItem("bg-mode") === "random" ? "random" : "fixed";
}

export function setStoredBgMode(mode: BgMode): void {
	localStorage.setItem("bg-mode", mode);
}

// 随机背景横竖屏感知：按屏幕方向加载对应方向的图片，iPad 横屏、桌面窄窗口等 UA 与方向不一致的场景也能尽力匹配
export function getOrientation(): "landscape" | "portrait" {
	return window.matchMedia("(orientation: landscape)").matches
		? "landscape"
		: "portrait";
}

const RANDOM_BG_CACHE_KEY = {
	landscape: "bg-random-url-landscape",
	portrait: "bg-random-url-portrait",
} as const;

export function getCachedRandomBgUrl(
	orientation: "landscape" | "portrait",
): string | null {
	try {
		return sessionStorage.getItem(RANDOM_BG_CACHE_KEY[orientation]);
	} catch {
		return null;
	}
}

function setCachedRandomBgUrl(
	orientation: "landscape" | "portrait",
	url: string,
): void {
	try {
		sessionStorage.setItem(RANDOM_BG_CACHE_KEY[orientation], url);
	} catch {
		// 隐私模式等存储失败不致命，继续运行
	}
}

function appendTimestamp(url: string): string {
	const separator = url.includes("?") ? "&_t=" : "?_t=";
	return `${url}${separator}${Date.now()}`;
}

function isLandscapeImage(img: HTMLImageElement): boolean {
	return img.naturalWidth >= img.naturalHeight;
}

// 用隐藏 Image 探测实际加载到的图片方向，最多重试 3 次，保证 callback 只调用一次
export function prepareRandomBgUrl(
	randomSrc: string,
	isLandscape: boolean,
	callback: (url: string) => void,
): void {
	const orientation = isLandscape ? "landscape" : "portrait";
	const cached = getCachedRandomBgUrl(orientation);
	if (cached) {
		callback(cached);
		return;
	}

	let attempts = 0;
	const maxAttempts = 3;

	function tryLoad() {
		attempts += 1;
		const probeUrl = appendTimestamp(randomSrc);
		const img = new Image();

		img.onload = () => {
			if (isLandscapeImage(img) === isLandscape) {
				setCachedRandomBgUrl(orientation, probeUrl);
				callback(probeUrl);
				return;
			}
			if (attempts < maxAttempts) {
				tryLoad();
			} else {
				// 尽力重试后仍不匹配，使用最后一次 URL，保证有背景显示
				callback(probeUrl);
			}
		};

		img.onerror = () => {
			if (attempts < maxAttempts) {
				tryLoad();
			} else {
				// 多次失败后用裸 randomSrc，避免无背景
				callback(randomSrc);
			}
		};

		img.src = probeUrl;
	}

	tryLoad();
}
