<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { gitHubService } from '$lib/ui.composition/gitHubService';
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let query = '';

  const idOrUrl = writable('');

  const onBackClick = ({}: MouseEvent) => history.back();

  const handleSubmit = async (event: SubmitEvent) => {
    const submitIssueRes = await gitHubService.submitIssue($idOrUrl);
    const link = base + (submitIssueRes ? '/request/ok' : '/request/err');
    goto(link, { replaceState: true });
  };

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    query = urlParams.get('q') ?? '';
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
<div class="p-4 text-xl mx-auto max-w-screen-md">
  <div class="pb-10 text-white">
    <p class="pb-4">
      To request subtitles for a movie, <a class="font-bold text-yellow-500" href="https://www.imdb.com/find/?q={query}&s=tt&ttype=ft&ref_=subtext"
        >search for the movie in IMDb</a
      > and submit it's url or id below.
    </p>
    <p>
      To find out more, you can read about IMDb <a class="font-bold text-yellow-500" href="https://developer.imdb.com/documentation/key-concepts"
        >data key concepts</a
      >.
    </p>
  </div>
  <form on:submit|preventDefault={handleSubmit}>
    <input type="text" class="h-8 p-2" bind:value={$idOrUrl} />
    <button class="text-white" type="submit">Submit</button>
  </form>
</div>
