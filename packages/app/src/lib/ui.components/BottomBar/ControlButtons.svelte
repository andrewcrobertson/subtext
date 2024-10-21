<script lang="ts">
  let _class = '';
  import { twMerge } from 'tailwind-merge';
  export { _class as class };

  import PlayIcon from '$lib/ui.icons/PlayIcon.svelte';
  import BackwardIcon from '$lib/ui.icons/BackwardIcon.svelte';
  import ForwardIcon from '$lib/ui.icons/ForwardIcon.svelte';
  import PauseIcon from '$lib/ui.icons/PauseIcon.svelte';
  import { createEventDispatcher } from 'svelte';
  import BottomBarButton from './Button.svelte';
  export let isPlaying = false;

  const dispatch = createEventDispatcher();
  const onSkipBackClick = (event: MouseEvent) => dispatch('skipbackclick', event.detail);
  const onPlayClick = (event: MouseEvent) => dispatch('playclick', event.detail);
  const onPauseClick = (event: MouseEvent) => dispatch('pauseclick', event.detail);
  const onSkipForwardClick = (event: MouseEvent) => dispatch('skipforwardclick', event.detail);
</script>

<div class={twMerge('flex space-x-2', _class)}>
  <BottomBarButton on:click={onSkipBackClick}><BackwardIcon class="size-10" /></BottomBarButton>
  {#if isPlaying}
    <BottomBarButton on:click={onPauseClick}><PauseIcon class="size-10" /></BottomBarButton>
  {:else}
    <BottomBarButton on:click={onPlayClick}><PlayIcon class="size-10" /></BottomBarButton>
  {/if}
  <BottomBarButton on:click={onSkipForwardClick}><ForwardIcon class="size-10" /></BottomBarButton>
</div>
