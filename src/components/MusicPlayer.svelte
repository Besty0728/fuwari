<script lang="ts">
  import { onMount } from 'svelte';
  
  let audio: HTMLAudioElement;
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;
  let isLoaded = false;
  let isInitialized = false; // 是否已初始化音频
  let isLoading = false; // 是否正在加载
  let checkboxElement: HTMLInputElement;
  let showLoadingToast = false; // 控制加载提示显示
  let showLoadedToast = false; // 控制加载完成提示显示
  let loadStartTime = 0; // 记录加载开始时间
  
  // 音频文件配置 - 支持多格式回退
  const audioSources = [
    '/music/background.flac',
    '/music/background.mp3'
  ];
  
  let currentSourceIndex = 0;
  
  onMount(() => {
    audio = new Audio();
    // 懒加载：不立即加载音频文件
    
    audio.addEventListener('loadedmetadata', () => {
      duration = audio.duration;
      isLoaded = true;
      isLoading = false;

      // 确保至少显示1秒加载提示，然后显示完成提示
      const minLoadTime = Math.max(1000 - (Date.now() - loadStartTime), 100);
      setTimeout(() => {
        showLoadingToast = false;
        // 显示加载完成提示
        showLoadedToast = true;
        // 1秒后隐藏完成提示
        setTimeout(() => {
          showLoadedToast = false;
        }, 1000);
      }, minLoadTime);
    });
    
    audio.addEventListener('timeupdate', () => {
      currentTime = audio.currentTime;
    });
    
    audio.addEventListener('ended', () => {
      isPlaying = false;
      if (checkboxElement) {
        checkboxElement.checked = false;
      }
    });
    
    audio.addEventListener('error', handleAudioError);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  });
  
  function loadAudioSource() {
    if (currentSourceIndex < audioSources.length) {
      isLoading = true;
      showLoadingToast = true; // 显示加载提示
      loadStartTime = Date.now(); // 记录开始时间
      audio.src = audioSources[currentSourceIndex];
      audio.load();
      isInitialized = true;
    }
  }
  
  function handleAudioError() {
    console.warn(`Failed to load audio source: ${audioSources[currentSourceIndex]}`);
    currentSourceIndex++;
    if (currentSourceIndex < audioSources.length) {
      loadAudioSource();
    } else {
      console.error('All audio sources failed to load');
      isLoading = false;
      showLoadingToast = false;
      showLoadedToast = false;
      // 所有音频源都加载失败时重置checkbox
      if (checkboxElement) {
        checkboxElement.checked = false;
      }
    }
  }
  
  function handleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    
    // 如果音频尚未初始化，先初始化
    if (!isInitialized) {
      loadAudioSource();
      
      // 如果正在加载，阻止checkbox状态改变并等待加载完成
      if (isLoading) {
        target.checked = false;
        return;
      }
    }
    
    if (!isLoaded) {
      // 如果音频未加载完成，阻止checkbox状态改变
      target.checked = false;
      return;
    }

    // 如果显示加载完成提示，立即隐藏
    if (showLoadedToast) {
      showLoadedToast = false;
    }
    
    isPlaying = target.checked;
    
    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Failed to play audio:', error);
        // 播放失败时重置checkbox
        if (checkboxElement) {
          checkboxElement.checked = false;
        }
        isPlaying = false;
      });
    } else {
      audio.pause();
    }
  }
</script>

<div class="container">
  <label>
    <input 
      class="play-btn" 
      type="checkbox"
      bind:this={checkboxElement}
      on:change={handleCheckboxChange}
      disabled={isLoading}
    >
    <div class="play-icon"></div>
    <div class="pause-icon"></div>
  </label>
</div>

<!-- 优雅的音乐加载提示 -->
{#if showLoadingToast}
  <div class="music-loading-notification loading">
    <div class="loading-content">
      <div class="music-icon loading-icon">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </div>
      <div class="loading-wave">
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
      </div>
      <div class="loading-text">
        <span class="main-text loading-main-text">🎵 音乐准备中</span>
        <span class="sub-text">正在加载音频文件...</span>
      </div>
    </div>
    <div class="loading-progress"></div>
  </div>
{/if}

<!-- 音乐加载完成提示 -->
{#if showLoadedToast}
  <div class="music-loading-notification loaded">
    <div class="loading-content">
      <div class="music-icon success-icon">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </div>
      <div class="success-animation">
        <div class="ripple-1"></div>
        <div class="ripple-2"></div>
        <div class="ripple-3"></div>
      </div>
      <div class="loading-text">
        <span class="main-text success-main-text">✨ 音乐已就绪</span>
        <span class="sub-text">点击播放按钮开始播放</span>
      </div>
    </div>
    <div class="success-glow"></div>
  </div>
{/if}

<style>
  .container {
    width: 40px;
    height: 40px;
    position: relative;
    border-radius: 50%;
    margin-right: 12px;
  }

  .play-btn {
    position: absolute;
    appearance: none;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(var(--primary), var(--primary));
    cursor: pointer;
    outline: none;
  }

  .play-btn::before {
    content: "";
    position: absolute;
    width: 93%;
    height: 93%;
    background-color: var(--card-bg);
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .play-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .play-btn:checked {
    animation: borderAnimate 700ms ease-in-out 1;
    animation-fill-mode: forwards;
  }

  @keyframes borderAnimate {
    0% {
      transform: rotate(0);
      background: conic-gradient(var(--primary), transparent 20%);
    }

    80% {
      background: conic-gradient(var(--primary), transparent 90%);
    }

    100% {
      transform: rotate(360deg);
      background: conic-gradient(var(--primary), var(--primary));
    }
  }

  .play-icon {
    position: absolute;
    width: 13px;
    height: 13px;
    left: 60%;
    top: 50%;
    background-color: var(--primary);
    transform: translate(-60%, -50%) rotate(90deg);
    clip-path: polygon(50% 15%, 0% 100%, 100% 100%);
    transition: all 400ms ease-in-out;
    cursor: pointer;
  }

  .play-btn:checked + .play-icon {
    clip-path: polygon(0 100%, 0% 100%, 100% 100%);
  }

  .pause-icon {
    position: absolute;
    width: 13px;
    height: 13px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  .pause-icon::before {
    content: "";
    position: absolute;
    width: 0%;
    height: 100%;
    background-color: var(--primary);
    left: 0;
  }

  .pause-icon::after {
    content: "";
    position: absolute;
    width: 0;
    height: 100%;
    background-color: var(--primary);
    right: 0;
  }

  .play-btn:checked ~ .pause-icon::before {
    animation: reveal 300ms ease-in-out 350ms 1;
    animation-fill-mode: forwards;
  }

  .play-btn:checked ~ .pause-icon::after {
    animation: reveal 300ms ease-in-out 600ms 1;
    animation-fill-mode: forwards;
  }

  @keyframes reveal {
    0% {
      width: 0;
    }

    100% {
      width: 35%;
    }
  }

  /* 优雅的音乐加载提示样式 */
  .music-loading-notification {
    position: fixed;
    top: 24px;
    right: 24px;
    background: var(--card-bg);
    color: var(--primary);
    padding: 0;
    border-radius: var(--radius-large);
    z-index: 1000;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(16px);
    border: 1px solid var(--btn-regular-bg);
    overflow: hidden;
    animation: musicNotificationSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    min-width: 280px;
  }

  .loading-content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px 12px 20px;
  }

  .music-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: white;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }

  .loading-icon {
    background: linear-gradient(135deg, var(--primary), oklch(0.8 0.12 var(--hue)));
    animation: musicPulse 2s ease-in-out infinite;
  }

  .success-icon {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    animation: successBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .loading-wave {
    display: flex;
    align-items: center;
    gap: 3px;
    height: 20px;
  }

  .wave-bar {
    width: 3px;
    background: var(--primary);
    border-radius: 2px;
    animation: musicWave 1.2s ease-in-out infinite;
  }

  .wave-bar:nth-child(1) { animation-delay: 0s; }
  .wave-bar:nth-child(2) { animation-delay: 0.2s; }
  .wave-bar:nth-child(3) { animation-delay: 0.4s; }
  .wave-bar:nth-child(4) { animation-delay: 0.6s; }

  .loading-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .main-text {
    font-size: 15px;
    font-weight: 600;
    color: var(--deep-text);
  }

  .loading-main-text {
    background: linear-gradient(135deg, var(--primary), oklch(0.8 0.12 var(--hue)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    animation: textPulse 2s ease-in-out infinite;
  }

  .success-main-text {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }

  .sub-text {
    font-size: 12px;
    color: var(--btn-content);
    opacity: 0.8;
  }

  .loading-progress {
    height: 3px;
    background: var(--btn-regular-bg);
    position: relative;
    overflow: hidden;
  }

  .loading-progress::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--primary), transparent);
    animation: progressSlide 1.5s ease-in-out infinite;
  }

  .success-animation {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    position: relative;
  }

  .ripple-1, .ripple-2, .ripple-3 {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid #22c55e;
    border-radius: 50%;
    opacity: 0;
    animation: rippleEffect 1.5s ease-out infinite;
  }

  .ripple-2 {
    animation-delay: 0.3s;
  }

  .ripple-3 {
    animation-delay: 0.6s;
  }

  .success-glow {
    height: 3px;
    background: linear-gradient(90deg, transparent, #22c55e, transparent);
    position: relative;
    overflow: hidden;
    opacity: 0.8;
  }

  .success-glow::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.8), transparent);
    animation: successGlow 0.8s ease-out;
  }

  @keyframes musicNotificationSlideIn {
    from {
      transform: translateX(100%) scale(0.9);
      opacity: 0;
    }
    to {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }

  @keyframes musicPulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(var(--primary-rgb, 112, 78, 199), 0.4);
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 0 0 8px rgba(var(--primary-rgb, 112, 78, 199), 0);
    }
  }

  @keyframes musicWave {
    0%, 40%, 100% { 
      height: 8px; 
      opacity: 0.6;
    }
    20% { 
      height: 20px; 
      opacity: 1;
    }
  }

  @keyframes progressSlide {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  @keyframes textPulse {
    0%, 100% { 
      opacity: 1;
      transform: scale(1);
    }
    50% { 
      opacity: 0.8;
      transform: scale(1.02);
    }
  }

  @keyframes successBounce {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes rippleEffect {
    0% {
      transform: scale(0.8);
      opacity: 0.8;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }

  @keyframes successGlow {
    0% {
      left: -100%;
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      left: 100%;
      opacity: 0;
    }
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .container {
      width: 36px;
      height: 36px;
    }
    
    .play-icon,
    .pause-icon {
      width: 11px;
      height: 11px;
    }

    .music-loading-notification {
      top: 16px;
      right: 16px;
      min-width: 260px;
    }

    .loading-content {
      padding: 14px 16px 10px 16px;
      gap: 12px;
    }

    .music-icon {
      width: 32px;
      height: 32px;
    }

    .main-text {
      font-size: 14px;
    }

    .sub-text {
      font-size: 11px;
    }
  }
</style>
