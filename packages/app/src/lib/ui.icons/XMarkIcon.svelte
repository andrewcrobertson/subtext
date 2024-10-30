<!-- from: https://heroicons.com -->
<script lang="ts">
  let _class = '';
  import { twMerge } from 'tailwind-merge';
  export { _class as class };

  const defaultClass = 'size-6';
</script>

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={twMerge(defaultClass, _class)}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
