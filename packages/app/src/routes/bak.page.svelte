<script lang="ts">
  import { base } from '$app/paths';
  import { showNRecentMovies } from '$lib/isomorphic.constants/movies';
  import Header from '$lib/ui.components/Header';
  import PosterLink from '$lib/ui.components/PosterLink';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { myListManager } from '$lib/ui.composition/myListManager';
  import ChevronRightIcon from '$lib/ui.icons/ChevronRightIcon.svelte';
  import { filter, includes, take } from 'lodash-es';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  export let data: PageData;

  let myListMovies: any[] = [];
  let recentMovies: any[] = [];
  let loaded = false;

  const updateRecentMovies = () => {
    let cols = 3;
    if (window.innerWidth > 640) cols = 4;
    if (window.innerWidth > 768) cols = 5;
    if (window.innerWidth > 1024) cols = 6;
    if (window.innerWidth > 1280) cols = 7;
    const availableMoviesCount = Math.min(showNRecentMovies, data.movies.length);
    const showMoviesCount = availableMoviesCount - (availableMoviesCount % cols);
    recentMovies = take(data.movies, showMoviesCount);
  };

  onMount(async () => {
    const myListMovieIds = myListManager.get();
    myListMovies = filter(data.movies, (m) => includes(myListMovieIds, m.id));
    updateRecentMovies();
    loaded = true;
  });
</script>

<svelte:window on:resize={updateRecentMovies} />

<Header class="fixed top-0 left-0 right-0" />
<div class="mt-16"></div>
<TransitionWhenLoaded {loaded}>
  {#if myListMovies.length > 0}
    <div class="flex justify-between items-center py-4 px-2">
      <h2 class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">My List</h2>
      <a href={`${base}/my-list`} class="flex items-center text-white text-xl md:text-2xl lg:text-3xl font-semibold">
        Edit
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
    <div class="flex justify-between items-center py-4 px-2">
      <h2 class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">Recent</h2>
      <a href={`${base}/search`} class="flex items-center text-white text-xl md:text-2xl lg:text-3xl font-semibold">
        View All
        <ChevronRightIcon class="font-semibold" />
      </a>
    </div>
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide">
      {#each recentMovies as { id, title, posterFileName }, i}
        <PosterLink href={`${base}/subtitles/${id}`} src={`${base}/posters/${posterFileName}`} alt={title} />
      {/each}
    </div>
  {/if}
</TransitionWhenLoaded>
