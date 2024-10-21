<script lang="ts">
  import Progress from '$lib/ui.components/Progress/index.svelte';
  import ControlButtons from './ControlButtons.svelte';
  export let isPlaying = false;
  export let progress = 0;
  export let elapsedTime = '';
</script>

<Progress class="p-2" {progress} {elapsedTime} on:progressclick />
<ControlButtons class="justify-center items-center" {isPlaying} on:skipbackclick on:playclick on:pauseclick on:skipforwardclick />
