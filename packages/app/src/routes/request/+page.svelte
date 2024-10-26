<script lang="ts">
  import { base } from '$app/paths';
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import { gitHubService } from '$lib/ui.composition/gitHubService';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';

  const id = writable('');

  const onBackClick = ({}: MouseEvent) => history.back();

  const handleSubmit = async (event: SubmitEvent) => {
    const submitIssueRes = await gitHubService.submitIssue($id);
    const link = base + (submitIssueRes ? '/request/ok' : '/request/err');
    goto(link, { replaceState: true });
  };
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
    <p class="pb-4">To request subtitles for a movie, submit the movie's IMDb id below.</p>
    <p>Here is some information on IMDb ids:</p>
    <ul class="list-inside list-disc">
      <li>IMDb <a class="font-bold text-yellow-500" href="https://developer.imdb.com/documentation/key-concepts">data key concepts</a>.</li>
      <li>Google search "<a class="font-bold text-yellow-500" href="https://www.google.com/search?q=how+to+find+an+IMDb+id">how to find an IMDb id</a>".</li>
    </ul>
  </div>
  <form on:submit|preventDefault={handleSubmit}>
    <input type="text" class="h-8 p-2" bind:value={$id} />
    <button class="text-white" type="submit">Submit</button>
  </form>
</div>
