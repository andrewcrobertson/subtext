<script lang="ts">
  let _class = '';
  import type { ProgressEventDetail } from '$lib/ui.types/ProgressEventDetail';
  import { createEventDispatcher } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  export { _class as class };
  export let progress = 0;
  export let elapsedTime = '';

  let slider: HTMLElement;
  const dispatch = createEventDispatcher();

  const handleMouseDown = (event: MouseEvent) => setProgress(event.clientX);
  const handleMove = (event: MouseEvent) => (event.buttons === 1) && setProgress(event.clientX);
  const handleTouchMove = (event: TouchEvent) => setProgress(event.touches[0].clientX);

  const setProgress = (mouseOrTouchX: number) => {
    if(slider === undefined) return;
    const sliderRect = slider.getBoundingClientRect();
    const offsetX = mouseOrTouchX - sliderRect.left;
    const progress = Math.min(100, Math.max(0, (offsetX / sliderRect.width) * 100));
    const eventDetail: ProgressEventDetail = { progress }
    dispatch('progressclick', eventDetail);
  };
</script>

<div class={twMerge('flex items-center space-x-4', _class)}>
  <div class="text-white whitespace-nowrap">
    {elapsedTime}
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div bind:this={slider} class="relative h-4 cursor-pointer flex-1" on:mousedown={handleMouseDown} on:mousemove={handleMove} on:touchmove={handleTouchMove}>
    <div class="absolute top-1/2 left-0 h-1 w-full bg-gray-300 -translate-y-1/2"></div>
    <div class="absolute top-1/2 left-0 h-1 bg-yellow-500 -translate-y-1/2" style="width: {progress}%"></div>
    <div class="absolute top-1/2 h-4 w-4 bg-yellow-500 border-2 border-yellow-500 rounded-full -translate-y-1/2" style="left: calc({progress}% - 8px)"></div>
  </div>
</div>
