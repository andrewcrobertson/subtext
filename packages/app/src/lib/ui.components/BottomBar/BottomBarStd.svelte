<script lang="ts">
  import Progress from '$lib/ui.components/Progress/index.svelte';
  import ControlButtons from './ControlButtons.svelte';
  import FontSizeButtons from './FontSizeButtons.svelte';
  export let isPlaying = false;
  export let title = '';
  export let progress = 0;
  export let elapsedTime = '';
</script>

<Progress class="px-2" {progress} {elapsedTime} on:progressclick />
<div class="flex items-center justify-between px-8 py-4">
  <ControlButtons {isPlaying} on:skipbackclick on:playclick on:pauseclick on:skipforwardclick />
  <div class="text-white">{title}</div>
  <FontSizeButtons on:fontsmallclick on:fontnormalclick on:fontlargeclick />
</div>
