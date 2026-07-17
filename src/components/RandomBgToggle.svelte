<script lang="ts">
import Icon from "@iconify/svelte";
import { getStoredBgMode, setStoredBgMode } from "@utils/setting-utils";
import { onMount } from "svelte";

// client:only 组件只在浏览器运行，初始化时即可读取 localStorage。
// Swup 导航会销毁并重建本组件，从存储恢复状态可保证随机模式不被重置。
let isRandom = getStoredBgMode() === "random";
let button: HTMLButtonElement;

// --bg-url 会被 Layout 的 define:vars 内联到 <body>，直接写 <html> 的 --bg-url 会被遮蔽。
// 统一写 body 不会覆盖的 --bg-url-active，body::before 通过 var(--bg-url-active, var(--bg-url)) 继承。
const FIXED_BG = "--bg-url-active";
const CARD_BG = "--card-bg";
const FLOAT_PANEL_BG = "--float-panel-bg";

function getBgUrls(): { fixed: string | null; fixedLandscape: string | null; fixedPortrait: string | null; random: string | null } {
	const root = document.documentElement;
	return {
		fixed: root.dataset.bgFixed ?? null,
		fixedLandscape: root.dataset.bgFixedLandscape ?? null,
		fixedPortrait: root.dataset.bgFixedPortrait ?? null,
		random: root.dataset.bgRandom ?? null,
	};
}

function getCurrentFixedUrl(): string | null {
	const { fixed, fixedLandscape, fixedPortrait } = getBgUrls();
	if (fixedLandscape && fixedPortrait) {
		const isLandscape = window.matchMedia('(orientation: landscape)').matches;
		return isLandscape ? fixedLandscape : fixedPortrait;
	}
	return fixed;
}

function updateBackground() {
	const { random } = getBgUrls();
	const targetUrl = isRandom ? random : getCurrentFixedUrl();
	if (!targetUrl) return;

	document.documentElement.style.setProperty(FIXED_BG, `url(${targetUrl})`);

	// 参考 Layout.astro 的加载逻辑，切换背景后更新半透明卡片背景
	document.documentElement.style.setProperty(
		CARD_BG,
		"var(--card-bg-transparent)",
	);
	document.documentElement.style.setProperty(
		FLOAT_PANEL_BG,
		"var(--float-panel-bg-transparent)",
	);
}

function toggleRandom() {
	isRandom = !isRandom;
	setStoredBgMode(isRandom ? "random" : "fixed");
	updateBackground();
}

onMount(() => {
	// 组件挂载后按持久化的模式同步一次背景（Swup 重挂载时恢复随机背景）
	updateBackground();

	// 横竖屏切换时，若当前为固定背景则自动切换到对应方向的图片
	const mediaQuery = window.matchMedia('(orientation: landscape)');
	const handleOrientationChange = () => {
		if (!isRandom) {
			updateBackground();
		}
	};
	mediaQuery.addEventListener('change', handleOrientationChange);

	return () => {
		mediaQuery.removeEventListener('change', handleOrientationChange);
	};
});
</script>

<button
    bind:this={button}
    on:click={toggleRandom}
    class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90 flex items-center justify-center"
    class:text-[var(--primary)]={isRandom}
    aria-label={isRandom ? "切换到固定背景" : "切换到随机背景"}
    title={isRandom ? "切换到固定背景" : "切换到随机背景"}
>
    {#if isRandom}
        <Icon icon="material-symbols:casino" class="text-[1.25rem]" />
    {:else}
        <Icon icon="material-symbols:image" class="text-[1.25rem]" />
    {/if}
</button>
