<script lang="ts">
  import Header from '$lib/ui.components/Header';
  import MovieGrid from '$lib/ui.components/MovieGrid';
  import { StarManager } from '$lib/ui.services/StarManager';
  import type{ StarMovieEventDetail } from '$lib/ui.types/StarMovieEventDetail';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
    import { includes } from 'lodash-es';
  export let data: PageData;

  let starredMovies: any[] = [];
  const starManager = new StarManager()

  const handleStarClick = ({ detail }: CustomEvent<StarMovieEventDetail>) => {
    starManager.starMovie(detail.id)
    loadStarredMovies();
  }

  const handleUnstarClick = ({ detail }: CustomEvent<StarMovieEventDetail>) => {
    starManager.unstarMovie(detail.id)
    loadStarredMovies();
  }

  const loadStarredMovies = () => {
    let tempStarredMovies: any[] = [];
    const starredMovieIds = starManager.getAllStarredMovies()

    for(let i = 0; i < data.recentMovies.length; i++) {
      const movie = data.recentMovies[i];
      if(includes(starredMovieIds, movie.id)) tempStarredMovies.push(movie)
    }

    for(let i = 0; i < data.olderMovies.length; i++) {
      const movie = data.olderMovies[i];
      if(includes(starredMovieIds, movie.id)) tempStarredMovies.push(movie)
    }

    starredMovies = tempStarredMovies
  }

  onMount(() => loadStarredMovies());
</script>

<div class="relative">
  <Header class="fixed top-0 left-0 right-0" />
  <div class="mt-16"></div>
  <MovieGrid title="Starred" movies={starredMovies} on:pinclick={(e) => handleUnstarClick(e)} />
    <MovieGrid title="Recent" movies={data.recentMovies} on:pinclick={(e) => handleStarClick(e)} />
      <MovieGrid title="Older" movies={data.olderMovies} on:pinclick={(e) => handleStarClick(e)} />
</div>
