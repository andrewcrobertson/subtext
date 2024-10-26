<script lang="ts">
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import { base } from '$app/paths';
  import Header from '$lib/ui.components/Header';
  import { MyListManager } from '$lib/ui.services/MyListManager';
  import { formatRunTime, formatTextArray, formatIsoDate, formatText } from '$lib/ui.utils/format';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { includes } from 'lodash-es';
  import { fade } from 'svelte/transition';
  import PlusCircleIcon from '$lib/ui.icons/PlusCircleIcon.svelte';
  import MinusCircleIcon from '$lib/ui.icons/MinusCircleIcon.svelte';
  import { fly } from 'svelte/transition';
  import { tick } from 'svelte';

  export let data: PageData;

  let myListMovies: any[] = [];
  let loaded = false;
  const myListManager = new MyListManager();

  const onBackClick = (event: MouseEvent) => history.back();

  const onAddToListClick = (id: string) => {
    myListManager.add(id);
    for (let i = 0; i < myListMovies.length; i++) {
      if (myListMovies[i].id === id) {
        myListMovies[i].isOnMyList = true;
        break;
      }
    }
  };

  const onRemoveFromListClick = (id: string) => {
    try {
      document.startViewTransition(async () => {
        myListManager.remove(id);
        for (let i = 0; i < myListMovies.length; i++) {
          if (myListMovies[i].id === id) {
            myListMovies.splice(i, 1);
            myListMovies = myListMovies;
            await tick();
            break;
          }
        }
      });
    } catch {
      myListManager.remove(id);
      for (let i = 0; i < myListMovies.length; i++) {
        if (myListMovies[i].id === id) {
          myListMovies.splice(i, 1);
          myListMovies = myListMovies;
          break;
        }
      }
    }
  };

  onMount(async () => {
    let tempAllMovies: any[] = [];
    const myListMovieIds = myListManager.get();

    for (let i = 0; i < data.movies.length; i++) {
      const movie = data.movies[i];
      const isOnMyList = includes(myListMovieIds, movie.id);
      if (isOnMyList) tempAllMovies.push({ ...movie, isOnMyList });
    }

    myListMovies = tempAllMovies;
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
{#if loaded}
  <div transition:fade={{ duration: 500 }}>
    {#if myListMovies.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2 overflow-y-auto py-4">
        {#each myListMovies as { id, title, releaseDate, posterFileName, rated, genres, actors, runTime, plot, isOnMyList } (id)}
          <div class="flex items-start overflow-hidden">
            <a href={`${base}/subtitles/${id}`} class="w-1/2">
              <img src={`${base}/posters/${posterFileName}`} alt={title} class="w-full h-auto" />
            </a>
            <div class="pl-4 w-1/2 flex flex-col justify-between h-full">
              <div>
                <h3 class="text-lg font-semibold text-white">{title}</h3>
                <p class="text-sm text-gray-400">Released: {formatIsoDate(releaseDate, 'Unknown')}</p>
                <p class="text-sm text-gray-400">Rated: {formatText(rated, 'Unknown')}</p>
                <p class="text-sm text-gray-400">Genres: {formatTextArray(genres, 'Unknown')}</p>
                <p class="text-sm text-gray-400">Actors: {formatTextArray(actors, 'Unknown')}</p>
                <p class="text-sm text-gray-400">Runtime: {formatRunTime(runTime, 'Unknown')}</p>
              </div>
              {#if isOnMyList}
                <button class="btn btn-square text-white w-full flex items-center" on:click={() => onRemoveFromListClick(id)}>
                  <span>My List&nbsp;</span>
                  <MinusCircleIcon class="text-lg text-white size-8" />
                </button>
              {:else}
                <button class="btn btn-square text-white w-full flex items-center" on:click={() => onAddToListClick(id)}>
                  <span>My List&nbsp;</span>
                  <PlusCircleIcon class="text-lg text-white size-8" />
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
