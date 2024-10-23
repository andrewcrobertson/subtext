<script lang="ts">
  import Header from '$lib/ui.components/Header';
  import MovieGrid from '$lib/ui.components/MovieGrid';
  import MovieCarousel from '$lib/ui.components/MovieCarousel';
  
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<div class="relative">
  <Header class="fixed top-0 left-0 right-0" />
  <div class="mt-16"></div>
  <MovieCarousel movies={data.recentMovies} />
  <MovieGrid title="Recent" movies={data.recentMovies} />
  <MovieGrid title="Older" movies={data.olderMovies} />
</div>
