<script lang="ts">
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import { createEventDispatcher } from 'svelte';
  export let title = '';

  const dispatch = createEventDispatcher();
  const onBackClick = (event: MouseEvent) => dispatch('backclick', event.detail);
</script>

<div class="flex justify-between items-center p-8">
  <button class="btn btn-square text-white" on:click={onBackClick}>
    <ArrowLeftIcon class="size-8" />
  </button>
  <h1 class="text-white">{title}</h1>
</div>
