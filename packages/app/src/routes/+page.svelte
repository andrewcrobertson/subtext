<script lang="ts">
  import { base } from '$app/paths';  
  import Header from '$lib/ui.components/Header';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<div class="relative">
  <Header class="fixed top-0 left-0 right-0" />

  <!-- Responsive grid layout -->
  <div class="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pr-2 overflow-y-auto scrollbar-hide">
    {#each data.movies as { id, title, posterFileName }}
      <a href={`${base}/view/${id}`} class="group block relative">
        <img src={`${base}/posters/${posterFileName}`} alt={title} class="w-full h-full object-cover" />
      </a>
    {/each}
  </div>
</div>
