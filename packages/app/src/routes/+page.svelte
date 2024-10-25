<script lang="ts">
  import { base } from '$app/paths';  
  import Header from '$lib/ui.components/Header';
  import { MyListManager } from '$lib/ui.services/MyListManager';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { includes } from 'lodash-es';
  import ChevronRightIcon from '$lib/ui.icons/ChevronRightIcon.svelte';
  import PosterLink from '$lib/ui.components/PosterLink';  
  import { fade } from 'svelte/transition';
  export let data: PageData;

  let myListMovies: any[] = [];
  let recentMovies: any[] = [];
  let loaded = false;

  const showNMovies = 10
  const myListManager = new MyListManager()

  onMount(async () => {
    let tempMyListMovies: any[] = [];
    let tempRecentMovies: any[] = [];
    const myListMovieIds = myListManager.get()

    for(let i = 0; i < data.movies.length; i++) {
      const movie = data.movies[i];
      if(i < showNMovies) tempRecentMovies.push(movie)
      if(includes(myListMovieIds, movie.id)) tempMyListMovies.push(movie)
      if(tempMyListMovies.length >= showNMovies) break;
    }

    recentMovies = tempRecentMovies
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
      <div class="flex justify-between items-center py-4 px-2 md:px-4">
        <h2 class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">My List</h2>
        <a href={`${base}/my-list`} class="flex items-center text-white text-xl md:text-2xl lg:text-3xl font-semibold">
          View All
          <ChevronRightIcon class="font-semibold" />
        </a>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide">
        {#each myListMovies as { id, title, posterFileName }}
        <PosterLink href={`${base}/subtitles/${id}`} src={`${base}/posters/${posterFileName}`} alt={title} />
        {/each}
      </div>
  {/if}
  {#if recentMovies.length > 0}
      <div class="flex justify-between items-center py-4 px-2 md:px-4">
        <h2 class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">Recent</h2>
        <a href={`${base}/search`} class="flex items-center text-white text-xl md:text-2xl lg:text-3xl font-semibold">
          View All
          <ChevronRightIcon class="font-semibold" />
        </a>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide">
        {#each recentMovies as { id, title, posterFileName }}
        <PosterLink href={`${base}/subtitles/${id}`} src={`${base}/posters/${posterFileName}`} alt={title} />
        {/each}
      </div>
  {/if}
</div>
{/if}
</div>
