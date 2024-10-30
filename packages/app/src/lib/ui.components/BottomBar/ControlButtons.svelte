<script lang="ts">
  let _class = '';
  import BackwardIcon from '$lib/ui.icons/BackwardIcon.svelte';
  import ForwardIcon from '$lib/ui.icons/ForwardIcon.svelte';
  import PauseIcon from '$lib/ui.icons/PauseIcon.svelte';
  import PlayIcon from '$lib/ui.icons/PlayIcon.svelte';
  import { createEventDispatcher } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  export { _class as class };
  export let isPlaying = false;

  const dispatch = createEventDispatcher();
  const onSkipBackClick = (event: MouseEvent) => dispatch('skipbackclick', event.detail);
  const onPlayClick = (event: MouseEvent) => dispatch('playclick', event.detail);
  const onPauseClick = (event: MouseEvent) => dispatch('pauseclick', event.detail);
  const onSkipForwardClick = (event: MouseEvent) => dispatch('skipforwardclick', event.detail);
</script>

<div class={twMerge('flex space-x-2', _class)}>
  <button class="btn btn-square text-white size-10" on:click={onSkipBackClick}><BackwardIcon class="size-10" /></button>
  {#if isPlaying}
    <button class="btn btn-square text-white size-10" on:click={onPauseClick}><PauseIcon class="size-10" /></button>
  {:else}
    <button class="btn btn-square text-white size-10" on:click={onPlayClick}><PlayIcon class="size-10" /></button>
  {/if}
  <button class="btn btn-square text-white size-10" on:click={onSkipForwardClick}><ForwardIcon class="size-10" /></button>
</div>
