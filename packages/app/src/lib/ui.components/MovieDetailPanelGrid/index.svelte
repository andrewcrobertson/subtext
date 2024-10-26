<script lang="ts">
  import MovieDetailPanel from '$lib/ui.components/MovieDetailPanel';
  import type * as T from './types';
  export let movies: T.Movie[];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-2 overflow-y-auto scrollbar-hide">
  {#each movies as movie}
    <MovieDetailPanel {movie} on:addclick on:removeclick />
  {/each}
</div>
