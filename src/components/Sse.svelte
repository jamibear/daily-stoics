<script>
    import { onMount, onDestroy } from 'svelte';
    import EventSource from 'eventsource-polyfill';
  
    let sseEvents = [];
  
    onMount(() => {
      const eventSource = new EventSource('http://localhost:11434/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          model: 'llama2',
          prompt: 'hello',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      eventSource.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        sseEvents = [...sseEvents, eventData];
      };
  
      eventSource.onerror = (event) => {
        console.error('SSE error:', event);
      };
  
      onDestroy(() => {
        eventSource.close();
      });
    });
  </script>
  
  <main>
    <h1>SSE Events</h1>
    <ul>
      {#each sseEvents as event, index}
        <li key={index}>{JSON.stringify(event)}</li>
      {/each}
    </ul>
  </main>
  
  <style>
    main {
      text-align: center;
      padding: 1em;
      font-family: Arial, sans-serif;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin-bottom: 0.5em;
      border: 1px solid #ccc;
      padding: 0.5em;
      background-color: #f5f5f5;
    }
  </style>
  