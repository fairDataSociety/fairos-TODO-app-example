<script lang="ts">
  import {
    newTodo,
    user,
    savedMnemonic,
    todoItems,
    wallet,
  } from "../store";
  import type { Todo } from "../types";
  import {
    addTodo,
    ago,
    deleteTodo,
    ENTER_KEY,
    saveMnemonic,
  } from "../utils";
  import Register from "./Register.svelte";
  const onKeyDown = (e) => {
    if (e.keyCode == ENTER_KEY) {
      const id = new Date().getTime();
      const todo: Todo = {
        id,
        text: $newTodo,
        done: false,
        createdAt: id,
      };
      $newTodo = "";
      addTodo(todo, $todoItems).then((todos) => {
        $todoItems = todos;
      });
    }
  };
</script>

{#if $wallet?.mnemonic && !$savedMnemonic}
  <dl class="notice">
    <dt>Wallet Address</dt>
    <dd>{$wallet.address}</dd>
    <dt>Wallet Mnemonic Phrase</dt>
    <dd>
      <pre>{$wallet?.mnemonic}</pre>
      <button on:click={() => saveMnemonic($wallet.mnemonic)}
        >Save Mnemonic Phrase</button
      >
    </dd>
  </dl>
{/if}
{#if !$user}
  <div class="notice">
    <p>
      <strong>Wallet: </strong><code>{$wallet.address}</code>
    </p>
    <Register />
  </div>
{/if}
<div class="notice">
  <p>
    <strong>Todos ({$todoItems.length})</strong>
  </p>
  <input
    id="todo"
    on:keydown={onKeyDown}
    type="text"
    bind:value={$newTodo}
    placeholder="What needs to be done?"
  />
  {#if $todoItems.length}
    <table>
      <tr>
        <th>#</th>
        <th>id</th>
        <th>todo</th>
        <th>done</th>
        <th>created</th>
        <th>Delete</th>
      </tr>
      {#each $todoItems as todo, idx (todo.id)}
        <tr>
          <td>{idx + 1}</td>
          <td>{todo.id}</td>
          <td>{todo.text}</td>
          <td
            ><input
              type="checkbox"
              disabled
              on:change={async () => {
                // $todoItems = await updateTodo(todo, $fdp, $todoItems);
              }}
              bind:checked={todo.done}
            /></td
          >
          <td>{ago(todo.createdAt)}</td>
          <td
            ><button
              on:click={async () => {
                $todoItems = await deleteTodo(todo, $todoItems);
              }}>Delete</button
            ></td
          >
        </tr>
      {/each}
    </table>
  {:else}
    Todo List is empty
  {/if}
</div>

<style>
  #todo {
    width: 100%;
    padding: 16px;
    border: none;
    background: lightyellow;
    box-shadow: inset 0 -2px 1px rgb(0 0 0 / 10%);
    margin-bottom: 2rem;
  }
  table {
    margin-top: 2rem;
  }
</style>
