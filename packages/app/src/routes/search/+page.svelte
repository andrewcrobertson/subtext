<script lang="ts">
  import { base } from '$app/paths';
  import Alert from '$lib/ui.components/Alert';
  import MoviePanel, { type MyListEventDetail, type Movie, Mode as PMode } from '$lib/ui.components/MoviePanel';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { searchService } from '$lib/ui.composition/searchService';
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import MagnifyingGlassIcon from '$lib/ui.icons/MagnifyingGlassIcon.svelte';
  import { findIndex, debounce } from 'lodash-es';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let searchQuery = '';
  let recentMovies: Movie[] = [];
  let displayMovies: Movie[] = [];
  let doShowRequestAlert = true;
  let requestAlertVisible = false;
  let loaded = false;

  const updateIsOnMyList = async (imdbId: string, isOnMyList: boolean) => {
    if (isOnMyList) {
      doShowRequestAlert = false;
      requestAlertVisible = false;
    }

    await searchService.updateIsOnMyList(imdbId, isOnMyList);
    const idx1 = findIndex(recentMovies, (m) => m.imdbId === imdbId);
    const idx2 = findIndex(displayMovies, (m) => m.imdbId === imdbId);
    if (idx1 !== -1) recentMovies[idx1].isOnMyList = isOnMyList;
    if (idx2 !== -1) displayMovies[idx2].isOnMyList = isOnMyList;
  };

  $: handleQueryChange(searchQuery);

  const handleQueryChange = debounce(async (searchQuery: string) => {
    displayMovies = searchQuery === '' ? recentMovies : await searchService.search(searchQuery);
    if (displayMovies.length === 0 && doShowRequestAlert) requestAlertVisible = true;
  }, 300);

  const handleBackClick = ({}: MouseEvent) => history.back();
  const handleAddClick = ({ detail }: CustomEvent<MyListEventDetail>) => updateIsOnMyList(detail.id, true);
  const handleRemoveClick = ({ detail }: CustomEvent<MyListEventDetail>) => updateIsOnMyList(detail.id, false);

  onMount(async () => {
    const loadRes = await searchService.load();
    recentMovies = loadRes.recentMovies;
    displayMovies = loadRes.recentMovies;
    loaded = true;
    setTimeout(() => (requestAlertVisible = doShowRequestAlert), 5000);
  });
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between p-4 z-10 bg-black bg-opacity-70 border-b-2 border-yellow-500 h-14">
  <div class="flex space-x-4 items-center">
    <button class="btn btn-square text-white" on:click={handleBackClick}>
      <ArrowLeftIcon class="size-5" />
    </button>
    <p class="text-white font-semibold text-lg">Search</p>
  </div>
  <div class="flex space-x-2 items-center w-1/2 sm:w-1/3 md:w-1/4">
    <div class="relative w-full">
      <input type="text" placeholder="Movie title" class="h-8 pl-10 pr-4 py-2 w-full bg-black text-white focus:outline-none" bind:value={searchQuery} />
      <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white size-5" />
    </div>
  </div>
</div>
<div class="mt-16"></div>
<TransitionWhenLoaded {loaded}>
  {#if recentMovies.length === 0}
    <Alert>
      <p class="text-white text-xl">
        There are currently no movies in the database. Would you like to
        <a class="font-bold text-yellow-500 underline" href={`${base}/request?q=${searchQuery}`}>request a movie?</a>
      </p>
    </Alert>
  {:else}
    {#if displayMovies.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2 overflow-y-auto scrollbar-hide">
        {#each displayMovies as movie}
          <MoviePanel mode={PMode.View} {movie} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
        {/each}
      </div>
    {/if}
    {#if requestAlertVisible}
      <div transition:fade={{ duration: 1000 }} class="fixed bottom-0 left-0 right-0 bg-black">
        <Alert>
          <p class="text-white text-xl">
            Can't find a specific movie? <a class="font-bold text-yellow-500 underline" href={`${base}/request?q=${searchQuery}`}>Make a request</a>, and we'll
            do our best to add it.
          </p>
        </Alert>
      </div>
    {/if}
  {/if}
</TransitionWhenLoaded>
