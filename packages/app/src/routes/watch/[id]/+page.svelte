<script lang="ts">
  import { page } from '$app/stores';
  import { FontSizeEnum } from '$lib/isomorphic.types/FontSizeEnum';
  import { SubtitleStream } from '$lib/isomorphic.services/SubtitleStream';
  import { SubtitleStreamStateEnum } from '$lib/isomorphic.types/SubtitleStreamStateEnum';
  import { formatMsAsTime } from '$lib/isomorphic.utils/formatMsAsTime';
  import BottomBar from '$lib/ui.components/BottomBar';
  import type { ProgressEventDetail } from '$lib/ui.components/BottomBar/types';
  import Overlay from '$lib/ui.components/Overlay';
  import TopBar from '$lib/ui.components/TopBar';
  import { watchService } from '$lib/ui.composition/watchService';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let frame = { subtitle: '', progress: 0 };
  let elapsedTime = '';
  let controlsVisible = false;
  let title: string;
  let controlsTimeout: NodeJS.Timeout;
  let overlayTimeout: NodeJS.Timeout;
  let overlayVisible = false;
  let streamState = SubtitleStreamStateEnum.Paused;
  let fontSize = FontSizeEnum.Normal;

  const inactivityDelay = 3000;
  const overlayDelay = 6000;
  let subtitleStream: SubtitleStream;

  const handleProgressClick = ({ detail }: CustomEvent<ProgressEventDetail>) => subtitleStream.goTo(detail.progress);
  const handleBackClick = () => history.back();
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

  const scheduleShowOverlay = () => (overlayTimeout = setTimeout(() => (overlayVisible = true), overlayDelay));

  const hideOverlay = () => {
    clearTimeout(overlayTimeout);
    overlayVisible = false;
  };

  const onInteraction = () => {
    hideOverlay();
    showControls();
    if (streamState === SubtitleStreamStateEnum.Paused) scheduleShowOverlay();
  };

  onMount(async () => {
    const loadRes = await watchService.load($page.params.id);
    title = loadRes.movie.title;
    subtitleStream = new SubtitleStream(loadRes.movie.subtitles[0].frames);
    showControls();
    scheduleShowOverlay();
    setInterval(() => handleInterval(), 100);
  });
</script>

<svelte:window on:mousemove|preventDefault|stopPropagation={onInteraction} on:click|preventDefault|stopPropagation={onInteraction} />

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
