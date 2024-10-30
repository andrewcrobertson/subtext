<script lang="ts">
  import DocumentIcon from '$lib/ui.icons/DocumentIcon.svelte';
  import DocumentMinusIcon from '$lib/ui.icons/DocumentMinusIcon.svelte';
  import DocumentPlusIcon from '$lib/ui.icons/DocumentPlusIcon.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const onFontSmallClick = (event: MouseEvent) => dispatch('fontsmallclick', event.detail);
  const onFontNormalClick = (event: MouseEvent) => dispatch('fontnormalclick', event.detail);
  const onFontLargeClick = (event: MouseEvent) => dispatch('fontlargeclick', event.detail);
</script>

<div class="flex space-x-2">
  <button class="btn btn-square text-white size-10" on:click={onFontSmallClick}><DocumentMinusIcon class="size-10" /></button>
  <button class="btn btn-square text-white size-10" on:click={onFontNormalClick}><DocumentIcon class="size-10" /></button>
  <button class="btn btn-square text-white size-10" on:click={onFontLargeClick}><DocumentPlusIcon class="size-10" /></button>
</div>
