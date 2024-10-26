<script lang="ts">
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';

  const handleBackClick = ({}: MouseEvent) => history.back();
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between p-2 z-10 bg-black bg-opacity-70 border-b-2 border-yellow-500">
  <button class="btn btn-square text-white" on:click={handleBackClick}>
    <ArrowLeftIcon class="size-8" />
  </button>
</div>
<div class="mt-16"></div>

Help!
