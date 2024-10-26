<script lang="ts">
  import { gitHubService } from '$lib/ui.composition/gitHubService';
  import { writable } from 'svelte/store';

  const id = writable('');

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    await gitHubService.submitIssie($id);
  };
</script>

<form on:submit={handleSubmit}>
  <div>
    <label for="id">ID:</label>
    <input type="text" id="id" bind:value={$id} required />
  </div>
  <div>
    <label for="url">URL:</label>
  </div>
  <button type="submit">Submit</button>
</form>
