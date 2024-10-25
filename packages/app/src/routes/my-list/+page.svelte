<script lang="ts">
  import { base } from '$app/paths';  
  import Header from '$lib/ui.components/Header';
  import { MyListManager } from '$lib/ui.services/MyListManager';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { includes } from 'lodash-es';
  import ChevronRightIcon from '$lib/ui.icons/ChevronRightIcon.svelte';
  import { fade } from 'svelte/transition';
  export let data: PageData;

  let myListMovies: any[] = [];
  let loaded = false;

  const myListManager = new MyListManager()

  onMount(async () => {
    let tempMyListMovies: any[] = [];
    const myListMovieIds = myListManager.get()

    for(let i = 0; i < data.movies.length; i++) {
      const movie = data.movies[i];
      if(includes(myListMovieIds, movie.id)) tempMyListMovies.push(movie)
    }

    myListMovies = tempMyListMovies
    loaded = true
  });
</script>

<div class="relative">
  <Header class="fixed top-0 left-0 right-0" />
  <div class="mt-16"></div>
  {#if loaded}
  <div transition:fade={{ duration: 500 }}>
    {#if myListMovies.length > 0}
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide">
        {#each myListMovies as { id, title, posterFileName, hasSubtitles }}
          <a href={`${base}/subtitles/${id}`} class="group block relative">
            <img src={`${base}/posters/${posterFileName}`} alt={title} class="w-full h-full object-cover" />
          </a>
        {/each}
      </div>
  {/if}
</div>
{/if}
</div>
