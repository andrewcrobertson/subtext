<script lang="ts">
  import BottomBarSm from './BottomBarSm.svelte';
  import BottomBarStd from './BottomBarStd.svelte';
  export let isPlaying = false;
  export let title = '';
  export let progress = 0;
  export let elapsedTime = '';
</script>

<div class="block xs:hidden">
  <BottomBarSm {isPlaying} {progress} {elapsedTime} on:progressclick on:skipbackclick on:playclick on:pauseclick on:skipforwardclick />
</div>
<div class="hidden xs:block">
  <BottomBarStd
    {title}
    {isPlaying}
    {progress}
    {elapsedTime}
    on:progressclick
    on:skipbackclick
    on:playclick
    on:pauseclick
    on:skipforwardclick
    on:fontsmallclick
    on:fontnormalclick
    on:fontlargeclick
  />
</div>
