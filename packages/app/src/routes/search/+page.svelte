<script lang="ts">
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { MyListManager } from '$lib/ui.services/MyListManager';
  import type { MyListEventDetail } from '$lib/ui.types/MyListEventDetail';
  import { includes, findIndex } from 'lodash-es';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import MagnifyingGlassIcon from '$lib/ui.icons/MagnifyingGlassIcon.svelte';
  import MovieDetailPanelGrid from '$lib/ui.components/MovieDetailPanelGrid';

  export let data: PageData;

  let movies: any[] = [];
  let loaded = false;
  let searchQuery = '';
  $: filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const myListManager = new MyListManager();

  const handleBackClick = ({}: MouseEvent) => history.back();

  const handleAddClick = ({ detail }: CustomEvent<MyListEventDetail>) => {
    myListManager.add(detail.id);
    const idx = findIndex(movies, (m) => m.id === detail.id);
    if (idx !== -1) movies[idx].isOnMyList = true;
  };

  const handleRemoveClick = ({ detail }: CustomEvent<MyListEventDetail>) => {
    myListManager.remove(detail.id);
    const idx = findIndex(movies, (m) => m.id === detail.id);
    if (idx !== -1) movies[idx].isOnMyList = false;
  };

  onMount(async () => {
    let tempMovies: any[] = [];
    const myListMovieIds = myListManager.get();

    for (let i = 0; i < data.movies.length; i++) {
      const movie = data.movies[i];
      const isOnMyList = includes(myListMovieIds, movie.id);
      tempMovies.push({ ...movie, isOnMyList });
    }

    movies = tempMovies;
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
  {#if filteredMovies.length > 0}
    <MovieDetailPanelGrid movies={filteredMovies} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
  {:else}
    <p class="text-white text-center mt-4">No movies found.</p>
  {/if}
</TransitionWhenLoaded>
