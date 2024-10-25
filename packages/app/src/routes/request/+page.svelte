<script lang="ts">
    import { join } from 'lodash-es';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const id = writable('');
  const url = writable('');

  const xorObfuscate = (text: string, key: string): string => {
    const ipBytes = new TextEncoder().encode(text); // Convert the IP string to bytes
  const keyBytes = new TextEncoder().encode(key); // Convert the key string to bytes
  const result = ipBytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
  return Array.from(result)
    .map(byte => byte.toString(16).padStart(2, '0')) // Convert each byte to a hex string
    .join(''); // Join all the hex strings together
}

  const  handleSubmit = async(event: SubmitEvent) => {
    event.preventDefault();

    const res = await fetch('https://api.ipify.org/');
    const data = await res.text();

    const lines = [
      ':robot: This issue is automated.',
      ':pray: Please don\'t edit this issue.',
      '',
      '===',
      '',
      `id: ${xorObfuscate(data, 'ipaddress')}`,
      `url: ${$url}`,
    ]

    const issueData = { title: $id, body: join(lines, '\n'), labels: ['add', 'zip'] };
    
    const response = await fetch('https://api.github.com/repos/andrewcrobertson/subtext/issues', {
      method: 'POST',
      headers: {
        'Authorization': `token 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`,
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
    <input type="url" id="url" bind:value={$url} required />
  </div>
  <button type="submit">Submit</button>
</form>
