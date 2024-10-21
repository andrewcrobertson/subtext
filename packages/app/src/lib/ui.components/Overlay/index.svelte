<script lang="ts">
  import ChatBubbleLeftRightIcon from '$lib/ui.icons/ChatBubbleLeftRightIcon.svelte';
  import { fade } from 'svelte/transition';
  export let title = '';
</script>

<div class="" transition:fade>
  <div class="flex items-center mb-4">
    <ChatBubbleLeftRightIcon class="text-yellow-500 size-8 mr-2" />
    <p class="text-2xl font-bold text-yellow-500">SubText</p>
    <p class="font-bold text-white ml-2 mt-2">(Paused)</p>
  </div>
  <div class="text-white text-lg -mb-2">You're watching</div>
  <div class="text-white text-4xl font-semibold">{title}</div>
</div>
