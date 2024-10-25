<script lang="ts">
  import { base } from '$app/paths';
  import BookmarkIcon from '$lib/ui.icons/BookmarkIcon.svelte';
  import type { MyListEventDetail } from '$lib/ui.types/MyListEventDetail';
  import { createEventDispatcher } from 'svelte';
  export let movies: { id: string; title: string; posterFileName: string; hasSubtitles: boolean }[] = [];

  const dispatch = createEventDispatcher();

  const onPinClick = (id: string) => {
    const eventDetail: MyListEventDetail = { id };
    dispatch('pinclick', eventDetail);
  };
</script>

<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide">
  {#each movies as { id, title, posterFileName, hasSubtitles }}
    <a href={`${base}/view/${id}`} class="group block relative">
      <img src={`${base}/posters/${posterFileName}`} alt={title} class="w-full h-full object-cover" />

      {#if !hasSubtitles}
        <div class="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-70 text-white text-center py-1 text-sm">No subtitles</div>
      {/if}

      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" on:click|preventDefault={(event) => onPinClick(id)}>
        <BookmarkIcon class="size-10 text-black fill-yellow-500" />
      </div>
    </a>
  {/each}
</div>
