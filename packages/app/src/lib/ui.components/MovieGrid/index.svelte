<script lang="ts">
  import { base } from '$app/paths';  
  export let title: string
  export let movies: { id: string, title: string, posterFileName: string }[] = [];
</script>

<h1 class="text-white">{title}</h1>
  <!-- Note: scrollbar-hide is a Tailwind custom utility -->
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pr-2 overflow-y-auto scrollbar-hide">
  {#each movies as { id, title, posterFileName }}
    <a href={`${base}/view/${id}`} class="group block relative">
      <img src={`${base}/posters/${posterFileName}`} alt={title} class="w-full h-full object-cover" />
    </a>
  {/each}
</div>
