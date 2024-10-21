<script lang="ts">
  let _class = '';
  import ChatBubbleLeftRightIcon from '$lib/ui.icons/ChatBubbleLeftRightIcon.svelte';
  import CursorArrowRippleIcon from '$lib/ui.icons/CursorArrowRippleIcon.svelte';  
  import { onMount } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  export { _class as class };

  let canInstall = false;

  const handleInstallClick = () => window.beforeInstallPromptEvent.prompt()

  onMount(() => {
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches
    const isMinimalUi = window.matchMedia('(display-mode: minimal-ui)').matches
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (!isFullscreen && !isMinimalUi && !isStandalone) canInstall = true;
  });

</script>

<div class={twMerge('flex justify-between items-center p-3 bg-gray-900 z-10 border-b-2 border-yellow-500', _class)}>
  <div class="flex items-center">
    <ChatBubbleLeftRightIcon class="text-yellow-500 size-8 mr-2" />
    <p class="font-bold text-xl text-yellow-500">SubText</p>
  </div>
  {#if canInstall}
  <button class="btn btn-square text-white transition transform hover:scale-150" on:click={handleInstallClick}>
    <CursorArrowRippleIcon class="text-yellow-500 size-8 mr-2" />
  </button>
  {/if}
</div>
