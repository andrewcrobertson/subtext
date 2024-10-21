<script lang="ts">
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const onBackClick = (event: MouseEvent) => dispatch('backclick', event.detail);
</script>

<div class="flex items-center justify-between p-8 text-white">
  <div class="flex space-x-2">
    <button class="btn btn-square text-white" on:click={onBackClick}>
      <ArrowLeftIcon class="size-8" />
    </button>
  </div>
</div>
