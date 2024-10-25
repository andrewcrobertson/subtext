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

    for(let i = 0; i < data.recentMovies.length; i++) {
      const movie = data.recentMovies[i];
      if(includes(BookmarkedMovieIds, movie.id)) tempBookmarkedMovies.push(movie)
    }

    for(let i = 0; i < data.olderMovies.length; i++) {
      const movie = data.olderMovies[i];
      if(includes(BookmarkedMovieIds, movie.id)) tempBookmarkedMovies.push(movie)
    }

    BookmarkedMovies = tempBookmarkedMovies
  }

  onMount(() => loadBookmarkedMovies());
</script>

<div class="relative">
  <Header class="fixed top-0 left-0 right-0" />
  <div class="mt-16"></div>
  <MovieGrid title="Bookmarked" movies={BookmarkedMovies} on:pinclick={(e) => handleUnbookmarkClick(e)} />
  <MovieGrid title="Movies" movies={data.movies} on:pinclick={(e) => handleBookmarkClick(e)} />
</div>
