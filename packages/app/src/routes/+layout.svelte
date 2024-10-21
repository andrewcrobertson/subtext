<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';

  const detectSWUpdate = async () => {
    const registration = await navigator.serviceWorker.ready;

    registration.addEventListener('updatefound', () => {
      const newSW = registration.installing;
      newSW?.addEventListener('statechange', () => {
        if(newSW.state === 'installed') {
          if(confirm('Update available. Install?')) {
            newSW.postMessage({ type: 'SKIP_WAITING' })
            window.location.reload()
          }
        }
      })
    })
  }

  onMount(() => detectSWUpdate())
</script>

<slot />

<style>
  :global(body) {
    background-color: #000;
    /* height: 100vh; */
  }
</style>
