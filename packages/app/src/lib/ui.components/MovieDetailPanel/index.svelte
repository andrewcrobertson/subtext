<script lang="ts">
  import { base } from '$app/paths';
  import MinusCircleIcon from '$lib/ui.icons/MinusCircleIcon.svelte';
  import PlusCircleIcon from '$lib/ui.icons/PlusCircleIcon.svelte';
  import { formatRunTime, formatTextArray, formatIsoDate, formatText } from '$lib/ui.utils/format';
  import { createEventDispatcher } from 'svelte';
  import type * as T from './types';
  export let movie: T.Movie;

  const dispatch = createEventDispatcher();

  const onAddToListClick = (id: string) => {
    const eventDetail: T.MyListEventDetail = { id };
    dispatch('addclick', eventDetail);
  };

  const onRemoveFromListClick = (id: string) => {
    const eventDetail: T.MyListEventDetail = { id };
    dispatch('removeclick', eventDetail);
  };
</script>

<div class="flex items-start overflow-hidden">
  <a href={`${base}/subtitles/${movie.id}`} class="w-1/2">
    <img src={`${base}/data/${movie.id}/${movie.posterFileName}`} alt={movie.title} class="w-full h-auto" />
  </a>
  <div class="pl-4 w-1/2 flex flex-col justify-between h-full">
    <div>
      <h3 class="text-lg font-semibold text-white">{movie.title}</h3>
      <p class="text-sm text-gray-400">Released: {formatIsoDate(movie.releaseDate, 'Unknown')}</p>
      <p class="text-sm text-gray-400">Rated: {formatText(movie.rated, 'Unknown')}</p>
      <p class="text-sm text-gray-400">Genres: {formatTextArray(movie.genres, 'Unknown')}</p>
      <p class="text-sm text-gray-400">Actors: {formatTextArray(movie.actors, 'Unknown')}</p>
      <p class="text-sm text-gray-400">Runtime: {formatRunTime(movie.runTime, 'Unknown')}</p>
    </div>
    {#if movie.isOnMyList}
      <button class="btn btn-square text-white w-full flex items-center" on:click={() => onRemoveFromListClick(movie.id)}>
        <span>My List&nbsp;</span>
        <MinusCircleIcon class="text-lg text-white size-8" />
      </button>
    {:else}
      <button class="btn btn-square text-white w-full flex items-center" on:click={() => onAddToListClick(movie.id)}>
        <span>My List&nbsp;</span>
        <PlusCircleIcon class="text-lg text-white size-8" />
      </button>
    {/if}
  </div>
</div>
