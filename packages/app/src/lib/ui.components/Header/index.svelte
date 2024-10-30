<script lang="ts">
  let _class = '';
  import { base } from '$app/paths';
  import ChatBubbleLeftRightIcon from '$lib/ui.icons/ChatBubbleLeftRightIcon.svelte';
  import MagnifyingGlassIcon from '$lib/ui.icons/MagnifyingGlassIcon.svelte';
  import FilmIcon from '$lib/ui.icons/FilmIcon.svelte';
  import { fade } from 'svelte/transition';
  import { twMerge } from 'tailwind-merge';
  import * as T from './types';
  export { _class as class };
  export let mode: T.Mode = T.Mode.Online;
</script>

{#if mode === T.Mode.Offline}
  <div transition:fade class={twMerge('flex justify-between items-center p-4 z-10 bg-yellow-500 border-b-2 border-yellow-500 h-14', _class)}>
    <div class="flex space-x-4">
      <div class="flex items-center">
        <ChatBubbleLeftRightIcon class="text-black w-6 h-6 mr-2" />
        <p class="font-semibold text-lg text-black hidden sm:block">SubText</p>
      </div>
      <p class="font-semibold text-xl text-white">Offline</p>
    </div>
  </div>
{:else}
  <div transition:fade class={twMerge('flex justify-between items-center p-4 z-10 bg-black bg-opacity-80 border-b-2 border-yellow-500 h-14', _class)}>
    <div class="flex items-center">
      <ChatBubbleLeftRightIcon class="text-yellow-500 w-6 h-6 mr-2" />
      <p class="font-semibold text-lg text-yellow-500 sm:block">SubText</p>
    </div>
    <div class="flex space-x-4">
      <a href={`${base}/request`} class="flex items-center">
        <FilmIcon class="text-white size-5" />
        <p class="text-white text-sm hidden sm:inline">Request</p>
      </a>
      <a href={`${base}/search`} class="flex items-center">
        <MagnifyingGlassIcon class="text-white size-5" />
        <p class="text-white text-sm hidden sm:inline">Search</p>
      </a>
    </div>
  </div>
{/if}
