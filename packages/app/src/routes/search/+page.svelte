<script lang="ts">
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import MovieDetailPanel from '$lib/ui.components/MovieDetailPanel';
  import TransitionLoad from '$lib/ui.components/TransitionLoad';
  import { MyListManager } from '$lib/ui.services/MyListManager';
  import type { MyListEventDetail } from '$lib/ui.types/MyListEventDetail';
  import { includes, findIndex } from 'lodash-es';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  export let data: PageData;

  let movies: any[] = [];
  let loaded = false;
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

<div class="fixed top-0 left-0 right-0 flex items-center justify-between text-white p-2 z-10 bg-black bg-opacity-70 border-b-2 border-yellow-500">
  <div class="flex space-x-2">
    <button class="btn btn-square text-white" on:click={handleBackClick}>
      <ArrowLeftIcon class="size-8" />
    </button>
  </div>
</div>
<div class="mt-16"></div>
<TransitionLoad {loaded}>
  {#if movies.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2 overflow-y-auto py-4">
      {#each movies as movie}
        <MovieDetailPanel {movie} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
      {/each}
    </div>
  {/if}
</TransitionLoad>
