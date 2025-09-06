<script lang="ts">
  import { onMount } from 'svelte';
  
  let audio: HTMLAudioElement;
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;
  let isLoaded = false;
  let checkboxElement: HTMLInputElement;
  
  // 音频文件配置 - 支持多格式回退
  const audioSources = [
    '/music/background.flac',
    '/music/background.mp3'
  ];
  
  let currentSourceIndex = 0;
  
  onMount(() => {
    audio = new Audio();
    loadAudioSource();
    
    audio.addEventListener('loadedmetadata', () => {
      duration = audio.duration;
      isLoaded = true;
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
      audio.src = audioSources[currentSourceIndex];
      audio.load();
    }
  }
  
  function handleAudioError() {
    console.warn(`Failed to load audio source: ${audioSources[currentSourceIndex]}`);
    currentSourceIndex++;
    if (currentSourceIndex < audioSources.length) {
      loadAudioSource();
    } else {
      console.error('All audio sources failed to load');
    }
  }
  
  function handleCheckboxChange(event: Event) {
    if (!isLoaded) {
      // 如果音频未加载，阻止checkbox状态改变
      if (checkboxElement) {
        checkboxElement.checked = false;
      }
      return;
    }
    
    const target = event.target as HTMLInputElement;
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
      disabled={!isLoaded}
    >
    <div class="play-icon"></div>
    <div class="pause-icon"></div>
  </label>
</div>

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
  }
</style>
