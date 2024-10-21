<script lang="ts">
  import TopBarSm from './TopBarSm.svelte';
  import TopBarStd from './TopBarStd.svelte';
  export let title = '';
</script>

<div class="block xs:hidden">
  <TopBarSm {title} on:backclick />
</div>
<div class="hidden xs:block">
  <TopBarStd on:backclick />
</div>
