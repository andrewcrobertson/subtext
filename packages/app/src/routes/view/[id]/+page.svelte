<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';  
  import { SubtitleStream } from '$lib/isomorphic.services/SubtitleStream';
  import { FontSizeEnum } from '$lib/isomorphic.types/FontSizeEnum';
  import { SubtitleStreamStateEnum } from '$lib/isomorphic.types/SubtitleStreamStateEnum';
  import { formatMsAsTime } from '$lib/isomorphic.utils/formatMsAsTime';
  import BottomBar from '$lib/ui.components/BottomBar';
  import Overlay from '$lib/ui.components/Overlay';
  import TopBar from '$lib/ui.components/TopBar';
  import type { ProgressEventDetail } from '$lib/ui.types/ProgressEventDetail';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';
  export let data: PageData;

  let frame = { subtitle: '', progress: 0 };
  let elapsedTime = '';
  let controlsVisible = false;
  let title = data.title;
  let controlsTimeout: NodeJS.Timeout;
  let overlayTimeout: NodeJS.Timeout;
  let overlayVisible = false;
  let streamState = SubtitleStreamStateEnum.Paused;
  let fontSize = FontSizeEnum.Normal;

  const inactivityDelay = 3000;
  const overlayDelay = 6000;
  const subtitleStream = new SubtitleStream(data.subtitles);

  const handleProgressClick = ({ detail }: CustomEvent<ProgressEventDetail>) => subtitleStream.goTo(detail.progress);
  const handleBackClick = () => goto(`${base}/`);
  const handleSkipBackClick = () => subtitleStream.skipToPrevious();
  const handleSkipForwardClick = () => subtitleStream.skipToNext();
  const handleFontSmallClick = () => (fontSize = FontSizeEnum.Small);
  const handleFontNormalClick = () => (fontSize = FontSizeEnum.Normal);
  const handleFontLargeClick = () => (fontSize = FontSizeEnum.Large);

  const handlePlayPauseClick = () => {
    showControls();
    streamState === SubtitleStreamStateEnum.Paused ? play() : pause();
  };

  const handleInterval = () => {
    frame = subtitleStream.getCurrentFrame();
    if (frame.progress === 100) pause();
    elapsedTime = formatMsAsTime(subtitleStream.getElapsedTime());
  };

  const play = () => {
    subtitleStream.start();
    streamState = SubtitleStreamStateEnum.Playing;
    hideOverlay();
  };

  const pause = () => {
    subtitleStream.pause();
    streamState = SubtitleStreamStateEnum.Paused;
    scheduleShowOverlay();
  };

  const showControls = () => {
    clearTimeout(controlsTimeout);
    controlsVisible = true;
    controlsTimeout = setTimeout(() => (controlsVisible = false), inactivityDelay);
  };

  const scheduleShowOverlay = () => overlayTimeout = setTimeout(() => (overlayVisible = true), overlayDelay);

  const hideOverlay = () => {
    clearTimeout(overlayTimeout);
    overlayVisible = false;
  };

  const onInteraction = () => {
    hideOverlay();
    showControls();
    if (streamState === SubtitleStreamStateEnum.Paused) scheduleShowOverlay();
  };

  onMount(() => {
    showControls();
    scheduleShowOverlay();
    const interval = setInterval(() => handleInterval(), 100);
    return () => {
      clearTimeout(interval);
      clearTimeout(overlayTimeout);
    };
  });
</script>

<svelte:window on:mousemove={onInteraction} on:click={onInteraction} />

<div class="flex items-center justify-center h-screen">
  <p
    class:text-2xl={fontSize === FontSizeEnum.Small}
    class:text-3xl={fontSize === FontSizeEnum.Normal}
    class:text-4xl={fontSize === FontSizeEnum.Large}
    class:md:text-4xl={fontSize === FontSizeEnum.Small}
    class:md:text-5xl={fontSize === FontSizeEnum.Normal}
    class:md:text-6xl={fontSize === FontSizeEnum.Large}
    class="text-center text-white"
  >
    {@html frame.subtitle}
  </p>
</div>
{#if controlsVisible}
  <div class="fixed top-0 left-0 right-0" transition:fade>
    <TopBar {title} on:backclick={handleBackClick} />
  </div>
  <div class="fixed bottom-0 left-0 right-0 pb-6" transition:fade>
    <BottomBar
      {title}
      isPlaying={streamState === SubtitleStreamStateEnum.Playing}
      progress={frame.progress}
      {elapsedTime}
      on:progressclick={handleProgressClick}
      on:skipbackclick={handleSkipBackClick}
      on:playclick={handlePlayPauseClick}
      on:pauseclick={handlePlayPauseClick}
      on:skipforwardclick={handleSkipForwardClick}
      on:fontsmallclick={handleFontSmallClick}
      on:fontnormalclick={handleFontNormalClick}
      on:fontlargeclick={handleFontLargeClick}
    />
  </div>
{/if}
{#if overlayVisible}
  <div class="fixed inset-0 flex items-center pl-20 bg-black bg-opacity-80" transition:fade>
    <Overlay {title} />
  </div>
{/if}
