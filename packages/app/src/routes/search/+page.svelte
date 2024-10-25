<script lang="ts">
  import Header from '$lib/ui.components/Header';
  import MovieGrid from '$lib/ui.components/MovieGrid';
  import { BookmarkManager } from '$lib/ui.services/BookmarkManager';
  import type{ BookmarkedMovieEventDetail } from '$lib/ui.types/BookmarkedMovieEventDetail';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
    import { includes } from 'lodash-es';
  export let data: PageData;

  let BookmarkedMovies: any[] = [];
  const bookmarkManager = new BookmarkManager()

  const handleBookmarkClick = ({ detail }: CustomEvent<BookmarkedMovieEventDetail>) => {
    bookmarkManager.bookmarkMovie(detail.id)
    loadBookmarkedMovies();
  }

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

    BookmarkedMovies = tempBookmarkedMovies
  }

  onMount(() => loadBookmarkedMovies());
</script>

<div class="relative">
  <Header class="fixed top-0 left-0 right-0" />
  <div class="mt-16"></div>
  <MovieGrid movies={data.movies} on:pinclick={(e) => handleUnbookmarkClick(e)} />
</div>
