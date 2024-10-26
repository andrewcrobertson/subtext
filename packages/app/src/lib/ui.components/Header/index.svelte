<script lang="ts">
  let _class = '';
  import { base } from '$app/paths';
  import ChatBubbleLeftRightIcon from '$lib/ui.icons/ChatBubbleLeftRightIcon.svelte';
  import QuestionMarkCircleIcon from '$lib/ui.icons/QuestionMarkCircleIcon.svelte';
  import { onMount } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  export { _class as class };

  let canInstall = false;

  const handleInstallClick = () => window.beforeInstallPromptEvent.prompt();

  onMount(() => {
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    const isMinimalUi = window.matchMedia('(display-mode: minimal-ui)').matches;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (!isFullscreen && !isMinimalUi && !isStandalone) canInstall = true;
  });
</script>

<div class={twMerge('flex justify-between items-center p-2 z-10 bg-black bg-opacity-70 border-b-2 border-yellow-500', _class)}>
  <div class="flex items-center">
    <ChatBubbleLeftRightIcon class="text-yellow-500 size-8 mr-1" />
    <p class="font-bold text-xl text-yellow-500">SubText</p>
  </div>
  <a href={`${base}/help`} class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">
    <QuestionMarkCircleIcon class="text-white size-8" />
  </a>
</div>
