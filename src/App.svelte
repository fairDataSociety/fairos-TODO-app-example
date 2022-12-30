<script lang="ts">
  import Fds from "./lib/components/FDS.svelte";
  import Github from "./lib/components/Github.svelte";
  import Home from "./lib/components/Home.svelte";
  import Todos from "./lib/components/Todos.svelte";
  import { todoItems, user, wallet } from "./lib/store";
</script>

<header>
  <nav>
    <Github />
  </nav>
  <h1>Todos with FairOS</h1>
  <Fds />

  {#if $wallet}
    <p class="notice">
      <strong>Address: </strong><code>{$wallet.address}</code><br />
      <strong>User: <code>{$user}</code></strong><br /><button
        on:click|preventDefault={() => {
          $wallet = null;
          $todoItems = [];
          $user = "";
        }}>Logout</button
      >
    </p>
  {/if}
</header>
<main>
  {#if $wallet}
    <Todos />
  {:else}
    <Home />
  {/if}
</main>
<footer />

<style>
  p.notice {
    text-align: left;
  }

  header {
    background-color: var(--accent-bg);
    border-bottom: 1px solid var(--border);
    text-align: center;
    padding: 0 0.5rem 2rem 0.5rem;
    grid-column: 1 / -1;
  }
</style>
