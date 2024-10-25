<script lang="ts">
  import { base } from '$app/paths';  
  import Header from '$lib/ui.components/Header';
  import { BookmarkManager } from '$lib/ui.services/BookmarkManager';
  import type{ BookmarkedMovieEventDetail } from '$lib/ui.types/BookmarkedMovieEventDetail';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { includes } from 'lodash-es';
  export let data: PageData;

  let movies: any[] = [];
  const bookmarkManager = new BookmarkManager()

  const handleUnbookmarkClick = ({ detail }: CustomEvent<BookmarkedMovieEventDetail>) => {
    bookmarkManager.unbookmarkMovie(detail.id)
    loadBookmarkedMovies();
  }

  const loadBookmarkedMovies = () => {
    let tempBookmarkedMovies: any[] = [];
    const BookmarkedMovieIds = bookmarkManager.getAllBookmarkedMovies()

    for(let i = 0; i < data.movies.length; i++) {
      const movie = data.movies[i];
      if(includes(BookmarkedMovieIds, movie.id)) tempBookmarkedMovies.push(movie)
    }

    movies = tempBookmarkedMovies
  }

  onMount(() => loadBookmarkedMovies());
</script>

<div class="relative">
  <Header class="fixed top-0 left-0 right-0" />
  <div class="mt-16"></div>
  {#if movies.length > 0}
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide">
      {#each movies as { id, title, posterFileName, hasSubtitles }}
        <a href={`${base}/subtitles/${id}`} class="group block relative">
          <img src={`${base}/posters/${posterFileName}`} alt={title} class="w-full h-full object-cover" />
          {#if !hasSubtitles}
            <div class="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-70 text-white text-center py-1 text-sm">
              No subtitles
            </div>
          {/if}
        </a>
      {/each}
    </div>
  {:else}
    <p class="text-white">You don't have any book marked movies.</p>
  {/if}
</div>
