<script lang="ts">
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';

  const onBackClick = ({}: MouseEvent) => history.back();
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between text-white p-2 z-10 bg-black bg-opacity-70 border-b-2 border-yellow-500">
  <div class="flex space-x-2">
    <button class="btn btn-square text-white" on:click={onBackClick}>
      <ArrowLeftIcon class="size-8" />
    </button>
  </div>
</div>
<div class="mt-16"></div>
<div class="p-4 text-xl mx-auto max-w-screen-md">
  <div class="pb-10 text-white">
    <p class="pb-4">Your request was successful!</p>
  </div>
</div>
