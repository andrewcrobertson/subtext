<script lang="ts">
  import { base } from '$app/paths';
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { myListManager } from '$lib/ui.composition/myListManager';
  import type { MyListEventDetail } from '$lib/ui.types/MyListEventDetail';
  import { includes, findIndex } from 'lodash-es';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import MagnifyingGlassIcon from '$lib/ui.icons/MagnifyingGlassIcon.svelte';
  import MovieDetailPanelGrid from '$lib/ui.components/MovieDetailPanelGrid';
  import type { Movie } from '$lib/ui.components/MovieDetailPanelGrid/types';
  export let data: PageData;

  let recentMovies: Movie[] = [];
  let loaded = false;
  const showNMovies = 10;

  let searchQuery = '';
  $: filteredMovies = getFilteredMovies(searchQuery);

  const getFilteredMovies = (searchQuery: string) => {
    const matches = data.movies.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredMovies = mapMovies(matches);
    return filteredMovies;
  };

  const mapMovies = (movies: Omit<Movie, 'isOnMyList'>[]) => {
    const filteredMovies: Movie[] = [];
    const myListMovieIds = myListManager.get();
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const isOnMyList = includes(myListMovieIds, movie.id);
      filteredMovies.push({ ...movie, isOnMyList });
    }

    return filteredMovies;
  };

  const handleBackClick = ({}: MouseEvent) => history.back();

  const handleAddClick = ({ detail }: CustomEvent<MyListEventDetail>) => {
    myListManager.add(detail.id);
    const idx = findIndex(recentMovies, (m) => m.id === detail.id);
    if (idx !== -1) recentMovies[idx].isOnMyList = true;
  };

  const handleRemoveClick = ({ detail }: CustomEvent<MyListEventDetail>) => {
    myListManager.remove(detail.id);
    const idx = findIndex(recentMovies, (m) => m.id === detail.id);
    if (idx !== -1) recentMovies[idx].isOnMyList = false;
  };

  onMount(async () => {
    let tempRecentMovies: Omit<Movie, 'isOnMyList'>[] = [];
    for (let i = 0; i < data.movies.length; i++) {
      const movie = data.movies[i];
      if (i < showNMovies) tempRecentMovies.push(movie);
    }

    recentMovies = mapMovies(tempRecentMovies);
    loaded = true;
  });
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between p-2 z-10 bg-black bg-opacity-70 border-b-2 border-yellow-500">
  <button class="btn btn-square text-white" on:click={handleBackClick}>
    <ArrowLeftIcon class="size-8" />
  </button>
  <div class="flex items-center">
    <MagnifyingGlassIcon class="text-white size-8 mr-1" />
    <input type="text" class="h-8 p-2" bind:value={searchQuery} />
  </div>
</div>
<div class="mt-16"></div>
<TransitionWhenLoaded {loaded}>
  {#if searchQuery.length === 0}
    {#if recentMovies.length > 0}
      <MovieDetailPanelGrid movies={recentMovies} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
    {:else}
      <p class="text-white text-center mt-4">
        There are no movies in the database. Would you like to <a class="font-bold text-yellow-500" href={`${base}/request`}>request</a> one?
      </p>
    {/if}
  {:else if filteredMovies.length > 0}
    <MovieDetailPanelGrid movies={filteredMovies} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
  {:else}
    <p class="text-white text-center mt-4">
      Sorry, we couldn't find a matching movie in the database. Would you like to <a class="font-bold text-yellow-500" href={`${base}/request`}>request</a> it?
    </p>
  {/if}
</TransitionWhenLoaded>
