<script lang="ts">
  import Login from "./Login.svelte";
  import Register from "./Register.svelte";
</script>

<div id="wallet">
  <Login />
  <code>or</code>
  <Register />
</div>

<style>
  code {
    font-weight: bold;
  }
  #wallet {
    text-align: center;
  }
  button {
    margin: 1rem;
  }
</style>
