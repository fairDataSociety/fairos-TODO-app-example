<script lang="ts">
  import { message, STATE, state, user } from "../store";
  import { registerAccount } from "../utils";
  let username = "";
  let password = "";
</script>

<form>
  <fieldset class="notice">
    <legend>Register</legend>
    <label
      >Username:
      <input
        id="username"
        type="text"
        bind:value={username}
        placeholder="Enter your FDP account username"
      />
    </label>
    <label
      >Password:
      <input
        id="password"
        type="password"
        bind:value={password}
        placeholder="Enter your FDP account password"
      />
    </label>
    {#if $message}
      <div class="notice" class:error={$state == STATE.ERROR}>{$message}</div>
    {/if}
    <button
      disabled={username == "" || password == "" || $state == STATE.REGISTERING}
      on:click|preventDefault={() => {
        $state = STATE.REGISTERING;
        $message = "";
        registerAccount(username, password);
      }}
      >{#if $state == STATE.REGISTERING}Registering...{:else}Register{/if}</button
    >
  </fieldset>
</form>
