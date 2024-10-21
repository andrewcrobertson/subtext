<script lang="ts">
  import { base } from '$app/paths';  
  import Header from '$lib/ui.components/Header';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<div class="relative max-w-lg mx-auto p-1">
  <Header class="fixed top-0 left-0 right-0 max-w-lg mx-auto" />

  <!-- Note: scrollbar-hide is a Tailwind custom utility -->
  <div class="mt-20 grid grid-cols-2 gap-4 pr-2 overflow-y-auto scrollbar-hide">
    {#each data.titles as { id, title, poster }}
      <a href={`${base}/view/${id}`} class="group block relative">
        <img src={`${base}/${poster}`} alt={title} class="w-full h-full object-cover rounded-lg" />
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="text-white text-lg font-semibold">{title}</span>
        </div>
      </a>
    {/each}
  </div>
</div>
