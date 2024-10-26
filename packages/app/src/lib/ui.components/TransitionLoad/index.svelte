<script lang="ts">
  import { fade } from 'svelte/transition';
  export let loaded = false;
  export let duration = 500;
</script>

{#if loaded}
  <div transition:fade={{ duration }}>
    <slot />
  </div>
{/if}
