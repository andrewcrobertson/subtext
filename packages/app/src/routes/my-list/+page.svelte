<script lang="ts">
  import { base } from '$app/paths';  
  import Header from '$lib/ui.components/Header';
  import { MyListManager } from '$lib/ui.services/MyListManager';
  import { formatIsoDate } from '$lib/ui.utils/format';
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2 overflow-y-auto scrollbar-hide">
          {#each myListMovies as { id, title, releaseDate, posterFileName, rated, genres, actors, runTime, plot }}
            <div class="flex items-start overflow-hidden">
              <a href={`${base}/subtitles/${id}`} class="flex-shrink-0">
                <img src={`${base}/posters/${posterFileName}`} alt={title} class="w-32 h-auto object-cover" />
              </a>
              <div class="pl-4 flex-1">
                <h3 class="text-lg font-semibold text-white">{title}</h3>
                <!-- <p class="text-sm  text-white">{plot}</p> -->
                <p class="text-sm text-gray-400">Release Date: {formatIsoDate(releaseDate)}</p>
                <p class="text-sm text-gray-400">Rated: {rated}</p>
                <p class="text-sm text-gray-400">Genres: {genres.join(', ')}</p>
                <p class="text-sm text-gray-400">Actors: {actors.join(', ')}</p>
                <p class="text-sm text-gray-400">Runtime: {runTime} min</p>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Add your custom styles here */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
