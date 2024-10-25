<script lang="ts">
  import { base } from '$app/paths';  
  import Header from '$lib/ui.components/Header';
  import type { PageData } from './$types';
  export let data: PageData;

  let expandedId: string | null = null;

  function toggleExpand(id: string) {
    expandedId = expandedId === id ? null : id;
  }

  function handleTouchStart(event: TouchEvent, id: string) {
    event.preventDefault();
    toggleExpand(id);
  }
</script>

<div class="relative">
  <Header class="fixed top-0 left-0 right-0" />
  <div class="mt-16"></div>
  {#if data.movies.length > 0}
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide -my-10 py-10">
      {#each data.movies as { id, title, posterFileName, hasSubtitles }}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          on:touchstart={(e) => handleTouchStart(e, id)}
          on:click|stopPropagation={() => toggleExpand(id)}
          class={`relative group cursor-pointer transition-transform duration-300 ease-in-out shadow-lg ${
            expandedId === id ? 'scale-[1.15] z-30' : 'z-0'
          }`}
        >
          <img src={`${base}/posters/${posterFileName}`} alt={title} class="w-full h-full object-cover transition-transform duration-300 ease-in-out" />
          {#if !hasSubtitles}
            <div class="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-70 text-white text-center py-1 text-sm">
              No subtitles
            </div>
          {/if}
          {#if expandedId === id}
            <div on:click|stopPropagation={() => alert(`Bookmarked movie: ${title}`)} class="absolute top-0 w-full bg-black bg-opacity-60 text-white py-2 flex justify-center items-center transition-opacity duration-300">
              <button 
                class="text-lg font-semibold text-white bg-transparent  cursor-pointer z-40"
                on:click|stopPropagation={() => alert(`Bookmarked movie: ${title}`)}
              >
                Bookmark
              </button>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-white">Could not find any movies.</p>
  {/if}
</div>
