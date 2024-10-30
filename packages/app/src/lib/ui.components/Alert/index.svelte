<script lang="ts">
  let _class = '';
  import { twMerge } from 'tailwind-merge';
  import ExclamationTriangleIcon from '$lib/ui.icons/ExclamationTriangleIcon.svelte';
  export { _class as class };
</script>

<div class={twMerge('flex items-start p-4 w-full max-w-md mx-auto', _class)}>
  <ExclamationTriangleIcon class="h-10 w-10 mr-3 mt-1 shrink-0 text-yellow-500" />
  <slot />
</div>
