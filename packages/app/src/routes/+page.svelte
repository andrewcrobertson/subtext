<script lang="ts">
  import { base } from '$app/paths';  
  import Header from '$lib/ui.components/Header';
  import { MyListManager } from '$lib/ui.services/MyListManager';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { includes } from 'lodash-es';
    import ChevronRightIcon from '$lib/ui.icons/ChevronRightIcon.svelte';
  export let data: PageData;

  console.log(data)

  let myListMovies: any[] = [];
  let recentMovies: any[] = [];
  const showXMovies = 10
  const myListManager = new MyListManager()

  const loadMovies = () => {
    let tempMyListMovies: any[] = [];
    let temprecentMovies: any[] = [];
    const myListMovieIds = myListManager.get()

    for(let i = 0; i < data.movies.length; i++) {
      const movie = data.movies[i];
      if(i < showXMovies) temprecentMovies.push(movie)
      if(includes(myListMovieIds, movie.id)) tempMyListMovies.push(movie)
    }

    recentMovies = temprecentMovies
    myListMovies = tempMyListMovies
  }

  onMount(() => loadMovies());
</script>

<div class="relative">
  <Header class="fixed top-0 left-0 right-0" />
  <div class="mt-16"></div>
  
  {#if myListMovies.length > 0}
    <div class="flex justify-between items-center py-4 px-2 md:px-4">
      <h2 class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">My List</h2>
      <a href={`${base}/recent`} class="flex items-center text-white text-xl md:text-2xl lg:text-3xl font-semibold">
        <span>Edit</span>
        <ChevronRightIcon class="font-semibold" />
      </a>
    </div>
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide">
      {#each myListMovies as { id, title, posterFileName, hasSubtitles }}
        <a href={`${base}/subtitles/${id}`} class="group block relative">
          <img src={`${base}/posters/${posterFileName}`} alt={title} class="w-full h-full object-cover" />
        </a>
      {/each}
    </div>
  {/if}
  {#if recentMovies.length > 0}
    <div class="flex justify-between items-center py-4 px-2 md:px-4">
      <h2 class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">Recent</h2>
      <a href={`${base}/recent`} class="flex items-center text-white text-xl md:text-2xl lg:text-3xl font-semibold">
        <span>View All</span>
        <ChevronRightIcon class="font-semibold" />
      </a>
    </div>
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide">
      {#each recentMovies as { id, title, posterFileName, hasSubtitles }}
        <a href={`${base}/subtitles/${id}`} class="group block relative">
          <img src={`${base}/posters/${posterFileName}`} alt={title} class="w-full h-full object-cover" />
        </a>
      {/each}
    </div>
  {/if}
</div>
