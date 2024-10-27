<script lang="ts">
  import { base } from '$app/paths';
  import { showNRecentMovies } from '$lib/isomorphic.constants/movies';
  import MovieDetailPanelGrid from '$lib/ui.components/MovieDetailPanelGrid';
  import type { Movie, MyListEventDetail } from '$lib/ui.components/MovieDetailPanelGrid/types';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { myListManager } from '$lib/ui.composition/myListManager';
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import MagnifyingGlassIcon from '$lib/ui.icons/MagnifyingGlassIcon.svelte';
  import { includes, findIndex } from 'lodash-es';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  export let data: PageData;

  let recentMovies: Movie[] = [];
  let loaded = false;

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

  const updateIsOnMyList = (imdbId: string, isOnMyList: boolean) => {
    if (isOnMyList) {
      myListManager.add(imdbId);
    } else {
      myListManager.remove(imdbId);
    }

    const idx2 = findIndex(filteredMovies, (m) => m.id === imdbId);
    if (idx2 !== -1) filteredMovies[idx2].isOnMyList = isOnMyList;
    const idx1 = findIndex(recentMovies, (m) => m.id === imdbId);
    if (idx1 !== -1) recentMovies[idx1].isOnMyList = isOnMyList;
  };

  const handleBackClick = ({}: MouseEvent) => history.back();
  const handleAddClick = ({ detail }: CustomEvent<MyListEventDetail>) => updateIsOnMyList(detail.id, true);
  const handleRemoveClick = ({ detail }: CustomEvent<MyListEventDetail>) => updateIsOnMyList(detail.id, false);

  onMount(async () => {
    let tempRecentMovies: Omit<Movie, 'isOnMyList'>[] = [];
    for (let i = 0; i < data.movies.length; i++) {
      const movie = data.movies[i];
      if (i < showNRecentMovies) tempRecentMovies.push(movie);
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
        There are no movies in the database. Would you like to <a class="font-bold text-yellow-500" href={`${base}/request?q=${searchQuery}`}>request</a> one?
      </p>
    {/if}
  {:else if filteredMovies.length > 0}
    <MovieDetailPanelGrid movies={filteredMovies} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
    <p class="text-white text-center mt-4">
      Not what you were looking for? Would you like to <a class="font-bold text-yellow-500" href={`${base}/request?q=${searchQuery}`}>request</a> it?
    </p>
  {:else}
    <p class="text-white text-center mt-4">
      Sorry, we couldn't find a matching movie in the database. Would you like to <a class="font-bold text-yellow-500" href={`${base}/request?q=${searchQuery}`}
        >request</a
      > it?
    </p>
  {/if}
</TransitionWhenLoaded>
