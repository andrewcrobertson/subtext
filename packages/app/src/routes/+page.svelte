<script lang="ts">
  import Header from '$lib/ui.components/Header';
  import MovieGrid from '$lib/ui.components/MovieGrid';
  import { PinManager } from '$lib/ui.services/PinManager';
  import type{ PinMovieEventDetail } from '$lib/ui.types/PinMovieEventDetail';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
    import { includes } from 'lodash-es';
  export let data: PageData;

  let pinnedMovies: any[] = [];
  const pinManager = new PinManager()

  const handlePinClick = ({ detail }: CustomEvent<PinMovieEventDetail>) => {
    pinManager.pinMovie(detail.id)
    loadPinnedMovies();
  }

  const handleUnpinClick = ({ detail }: CustomEvent<PinMovieEventDetail>) => {
    pinManager.unpinMovie(detail.id)
    loadPinnedMovies();
  }

  const loadPinnedMovies = () => {
    let tempPinnedMovies: any[] = [];
    const pinnedMovieIds = pinManager.getAllPinnedMovies()

    for(let i = 0; i < data.recentMovies.length; i++) {
      const movie = data.recentMovies[i];
      if(includes(pinnedMovieIds, movie.id)) tempPinnedMovies.push(movie)
    }

    for(let i = 0; i < data.olderMovies.length; i++) {
      const movie = data.olderMovies[i];
      if(includes(pinnedMovieIds, movie.id)) tempPinnedMovies.push(movie)
    }

    pinnedMovies = tempPinnedMovies
  }

  onMount(() => loadPinnedMovies());
</script>

<div class="relative">
  <Header class="fixed top-0 left-0 right-0" />
  <div class="mt-16"></div>
  <MovieGrid title="Pinned" movies={pinnedMovies} on:pinclick={(e) => handleUnpinClick(e)} />
    <MovieGrid title="Recent" movies={data.recentMovies} on:pinclick={(e) => handlePinClick(e)} />
      <MovieGrid title="Older" movies={data.olderMovies} on:pinclick={(e) => handlePinClick(e)} />
</div>
