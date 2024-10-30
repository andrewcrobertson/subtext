<script lang="ts">
  import Alert from '$lib/ui.components/Alert';
  import MoviePanel, { type MyListEventDetail, type Movie, Mode as PMode } from '$lib/ui.components/MoviePanel';
  import { requestService } from '$lib/ui.composition/requestService';
  import type { SubmitRequestOutput } from '$lib/ui.services/RequestService.types';
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import MagnifyingGlassIcon from '$lib/ui.icons/MagnifyingGlassIcon.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let query = '';
  let requestOutput: SubmitRequestOutput | null = null;
  const idOrUrl = writable('');

  const handleBackClick = () => history.back();
  const handleSubmit = async () => (requestOutput = await requestService.submitRequest($idOrUrl));
  const handleAddClick = ({ detail }: CustomEvent<MyListEventDetail>) => updateIsOnMyList(detail.id, true);
  const handleRemoveClick = ({ detail }: CustomEvent<MyListEventDetail>) => updateIsOnMyList(detail.id, false);
  const handleTryAgain = () => {
    $idOrUrl = '';
    requestOutput = null;
  };

  const updateIsOnMyList = async (imdbId: string, isOnMyList: boolean) => {
    if (requestOutput?.code === 'ALREADY_EXISTS') {
      await requestService.updateIsOnMyList(imdbId, isOnMyList);
      requestOutput.movie.isOnMyList = isOnMyList;
    }
  };

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    query = urlParams.get('q') ?? '';
  });
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between p-4 z-10 bg-black bg-opacity-80 border-b-2 border-yellow-500 h-14">
  <div class="flex items-center space-x-4">
    <button class="btn btn-square text-white" on:click={handleBackClick}>
      <ArrowLeftIcon class="w-5 h-5" />
    </button>
    <p class="text-white font-semibold text-lg">Request a Movie</p>
  </div>
</div>
<div class="mt-16"></div>
<div class="p-4 mx-auto max-w-screen-md text-white">
  {#if requestOutput === null}
    <div class="pb-10">
      <p class="text-lg mb-4">
        To make a request, <a class="font-bold text-yellow-500 underline" href={requestService.getImdbQueryUrl(query)}>find your movie on IMDb</a> and submit
        its URL or ID below. For more details, check out
        <a class="font-bold text-yellow-500 underline" href="https://developer.imdb.com/documentation/key-concepts" target="_blank">IMDb data concepts</a>.
      </p>
    </div>
    <form on:submit|preventDefault={handleSubmit} class="flex items-center gap-2">
      <div class="relative w-full">
        <input
          type="text"
          placeholder="IMDb movie URL or ID"
          class="h-10 pl-10 pr-4 py-2 w-full bg-black text-white text-lg focus:outline-none"
          bind:value={$idOrUrl}
        />
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white size-5" />
      </div>
      <button type="submit" class="h-10 px-4 bg-yellow-500 text-white font-bold hover:bg-yellow-600">Submit</button>
    </form>
  {:else if requestOutput.code === 'INVALID_INPUT'}
    <Alert>
      <p class="text-white text-xl">
        Oops! It looks like there was an issue with the input provided. Please double-check and <button
          class="font-bold text-yellow-500 underline"
          on:click={handleTryAgain}>try again</button
        >.
      </p>
    </Alert>
  {:else if requestOutput.code === 'ALREADY_EXISTS'}
    <Alert>
      <p class="text-white text-xl">Good news! We've got the movie that matches your request.</p>
    </Alert>
    <MoviePanel class="p-2" mode={PMode.View} movie={requestOutput.movie} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
  {:else if requestOutput.code === 'REQUEST_SUBMITTED'}
    <Alert>
      <p class="text-white text-xl">Your request was successfully submitted! Check back soon, and it should be available in the search results.</p>
    </Alert>
  {:else}
    <Alert>
      <p class="text-white text-xl">
        Sorry, something went wrong. Please <button class="font-bold text-yellow-500 underline" on:click={handleTryAgain}>try again</button> a little later.
      </p>
    </Alert>
  {/if}
</div>
