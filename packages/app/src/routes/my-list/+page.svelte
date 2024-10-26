<script lang="ts">
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { myListManager } from '$lib/ui.composition/myListManager';
  import type { MyListEventDetail } from '$lib/ui.types/MyListEventDetail';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { includes, findIndex } from 'lodash-es';
  import { tick } from 'svelte';
  import MovieDetailPanelGrid from '$lib/ui.components/MovieDetailPanelGrid';
  import type { Movie } from '$lib/ui.components/MovieDetailPanelGrid/types';
  export let data: PageData;

  let movies: Movie[] = [];
  let loaded = false;

  const onBackClick = (event: MouseEvent) => history.back();

  const handleAddClick = ({ detail }: CustomEvent<MyListEventDetail>) => {
    myListManager.add(detail.id);
    const idx = findIndex(movies, (m) => m.id === detail.id);
    if (idx !== -1) movies[idx].isOnMyList = true;
  };

  const handleRemoveClick = ({ detail }: CustomEvent<MyListEventDetail>) => {
    myListManager.remove(detail.id);
    const idx = findIndex(movies, (m) => m.id === detail.id);
    movies.splice(idx, 1);
    try {
      document.startViewTransition(async () => {
        movies = movies;
        await tick();
      });
    } catch {
      movies = movies;
    }
  };

  onMount(async () => {
    let tempMovies: any[] = [];
    const myListMovieIds = myListManager.get();

    for (let i = 0; i < data.movies.length; i++) {
      const movie = data.movies[i];
      const isOnMyList = includes(myListMovieIds, movie.id);
      if (isOnMyList) tempMovies.push({ ...movie, isOnMyList });
    }

    movies = tempMovies;
    loaded = true;
  });
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between text-white p-2 z-10 bg-black bg-opacity-70 border-b-2 border-yellow-500">
  <div class="flex space-x-2">
    <button class="btn btn-square text-white" on:click={onBackClick}>
      <ArrowLeftIcon class="size-8" />
    </button>
  </div>
</div>
<div class="mt-16"></div>
<TransitionWhenLoaded {loaded}>
  {#if movies.length > 0}
    <MovieDetailPanelGrid {movies} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
  {/if}
</TransitionWhenLoaded>
