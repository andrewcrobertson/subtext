<script lang="ts">
  import { join } from 'lodash-es';
  import { writable } from 'svelte/store';
  import { PUBLIC_REPO_TOKEN } from '$env/static/public';

  const id = writable('');

  const xorObfuscate = (text: string, key: string): string => {
  const ipBytes = new TextEncoder().encode(text);
  const keyBytes = new TextEncoder().encode(key);
  const result = ipBytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
  return Array.from(result)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

  const  handleSubmit = async(event: SubmitEvent) => {
    event.preventDefault();

    const res = await fetch('https://api.ipify.org/');
    const data = await res.text();

    const lines = [
      `:id: ${xorObfuscate(data, 'ipaddress')}`,
      ':robot: This issue is automated.',
      ':pray: Please don\'t edit this issue.',
    ]

    const issueData = { title: $id, body: join(lines, '\n'), labels: ['add'] };
    
    const response = await fetch('https://api.github.com/repos/andrewcrobertson/subtext/issues', {
      method: 'POST',
      headers: {
        'Authorization': `token ${PUBLIC_REPO_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issueData),
    });
  }
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
