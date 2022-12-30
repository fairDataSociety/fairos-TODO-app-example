import { writable, type Writable } from "svelte/store";
import type { Todo, Wallet } from "./types";

export let wallet: Writable<Wallet> = writable(undefined);
export let savedMnemonic = writable(false);
export let todoItems: Writable<Todo[]> = writable([]);
export let newTodo = writable("");
export let user = writable("");
export enum STATE {
  UNDEFINED,
  REGISTERING,
  ERROR,
  INFO,
}
export let state = writable(STATE.UNDEFINED);
export let message = writable("");
