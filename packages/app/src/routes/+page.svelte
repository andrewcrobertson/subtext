<script lang="ts">
  import { base } from '$app/paths';
  import Header from '$lib/ui.components/Header';
  import PosterLink from '$lib/ui.components/PosterLink';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { myListManager } from '$lib/ui.composition/myListManager';
  import ChevronRightIcon from '$lib/ui.icons/ChevronRightIcon.svelte';
  import { filter, includes, take } from 'lodash-es';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  export let data: PageData;

  let myListMovies: any[] = [];
  let loaded = false;

  onMount(async () => {
    const myListMovieIds = myListManager.get();
    myListMovies = filter(data.movies, (m) => includes(myListMovieIds, m.id));
    loaded = true;
  });
</script>

<Header class="fixed top-0 left-0 right-0" />
<div class="mt-16"></div>
<TransitionWhenLoaded {loaded}>
  {#if myListMovies.length > 0}
    <div class="flex justify-between items-center py-4 px-2">
      <h2 class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">My List</h2>
      <a href={`${base}/search`} class="flex items-center text-white text-xl md:text-2xl lg:text-3xl font-semibold">
        Edit
        <ChevronRightIcon class="font-semibold" />
      </a>
    </div>
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide">
      {#each myListMovies as { id, title, posterFileName }}
        <PosterLink href={`${base}/subtitles/${id}`} src={`${base}/data/${id}/${posterFileName}`} alt={title} />
      {/each}
    </div>
  {/if}
</TransitionWhenLoaded>
