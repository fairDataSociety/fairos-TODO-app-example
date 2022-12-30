import { FdpStorage } from "@fairdatasociety/fdp-storage";
import { utils } from "ethers";
import { saveAs } from "file-saver";
import { config } from "./config";
import {
  message,
  savedMnemonic,
  STATE,
  state,
  todoItems,
  user,
  wallet,
} from "./store";
import type { Todo } from "./types";
import moment from "moment";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const saveMnemonic = async (
  phrase: string,
  filename = "mnemonic.json"
) => {
  var blob = new Blob([JSON.stringify({ mnemonic: phrase })], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, filename);
  savedMnemonic.set(true);
  console.log("Saved mnemonic phrase as json file!");
};

export const addTodo = async (todo: Todo, todos: Todo[]) => {
  console.log({ todo, todos });
  const blob = new Blob([JSON.stringify(todo)], {
    type: "text/plain;charset=utf-8",
  });
  const formData = new FormData();
  formData.append("files", blob, "todo_" + todo.id + ".json");
  formData.set("podName", config.todoAppNamespace);
  formData.set("dirPath", config.todoItemsDirectory);
  formData.set("blockSize", "1Mb");

  const ENDPOINT = "/v1/file/upload";
  let response = await fetch(apiHost() + ENDPOINT, {
    credentials: "include",
    method: "POST",
    body: formData,
  });

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
    todos.push(todo);
  } else {
    console.error({ response, json });
  }
  return todos;
};

export const apiHost = () => {
  return window.location.href.split("/#/")[0].replace(/\/$/,'') + "/api";
};
export const deleteTodo = async (deleteTodo: Todo, todos: Todo[]) => {
  let data = {
    podName: config.todoAppNamespace,
    filePath: `${config.todoItemsDirectory}/todo_${deleteTodo.id}.json`,
  };

  let FAIROS_HOST = apiHost();
  let ENDPOINT = "/v1/file/delete";

  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    credentials: "include",
    method: "DELETE",
    headers,
    body: JSON.stringify(data),
  });

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
    return todos.filter((todo) => todo.id != deleteTodo.id);
  } else {
    console.error({ response, json });
  }
};
export const registerAccount = async (username: string, password: string) => {
  const fdp = new FdpStorage(config.beeUrl, config.postageBatchId);
  console.log({ username, password });
  const _wallet = fdp.account.createWallet();

  const ENDPOINT = "/v2/user/signup";
  const FAIROS_HOST = apiHost();
  let url = `${FAIROS_HOST}${ENDPOINT}`;
  let data = {
    userName: username,
    password,
    mnemonic: _wallet.mnemonic.phrase,
  };
  topUpAddress(fdp, _wallet.address).then(async () => {
    let response = await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify(data),
    });
    let json = await response.json();
    if (response.ok) {
      console.log("ok", { response, json });
      initTodos().then((todos) => {
        console.log({ todos });
        todoItems.set(todos);
        wallet.set({
          address: _wallet.address,
          mnemonic: _wallet.mnemonic.phrase,
        });
        user.set(username);
      });
    } else {
      state.set(STATE.ERROR);
      message.set(json.message);
      console.error("error", { response, json });
    }
  });
};

export const initTodos = () => {
  return createAppPod().then(() => {
    console.log(config.todoAppNamespace + ": AppPod created");
    return openAppPod().then(() => {
      console.log(config.todoAppNamespace + ": AppPod opened");
      return createAppDir().then(() => {
        console.log(config.todoItemsDirectory + ": Directory created opened");
        return listTodos();
      });
    });
  });
};

export const listTodos = async () => {
  let headers = {
    "Content-Type": "application/json",
  };

  let data = {
    podName: config.todoAppNamespace,
    dirPath: config.todoItemsDirectory,
  };

  let ENDPOINT = "/v1/dir/ls";
  const FAIROS_HOST = apiHost();
  let response = await fetch(
    FAIROS_HOST + ENDPOINT + "?" + new URLSearchParams(data),
    {
      method: "GET",
      headers,
    }
  );

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
    let res = (json.files || []).map(async ({ name }) => {
      return readTodo(name);
    });
    return Promise.all(res) as Promise<Todo[]>;
  } else {
    console.error({ response, json });
  }
};

export const readTodo = async (todofile: string) => {
  let headers = {
    "Content-Type": "application/json",
  };

  let data = {
    podName: config.todoAppNamespace,
    filePath: config.todoItemsDirectory + "/" + todofile,
  };

  let FAIROS_HOST = apiHost();
  let ENDPOINT = "/v1/file/download";

  let response = await fetch(
    FAIROS_HOST + ENDPOINT + "?" + new URLSearchParams(data),
    {
      credentials: "include",
      method: "GET",
      headers,
    }
  );

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
    return json;
  } else {
    console.error({ response, json });
  }
};

export const createAppPod = async () => {
  let data = {
    podName: config.todoAppNamespace,
  };

  const ENDPOINT = "/v1/pod/new";
  const FAIROS_HOST = apiHost();
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
  } else {
    console.error({ response, json });
  }
};

export const openAppPod = async () => {
  let data = {
    podName: config.todoAppNamespace,
  };

  const ENDPOINT = "/v1/pod/open";
  const FAIROS_HOST = apiHost();
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
  } else {
    console.error({ response, json });
  }
};

export const createAppDir = async () => {
  let data = {
    podName: config.todoAppNamespace,
    dirPath: config.todoItemsDirectory,
  };

  let ENDPOINT = "/v1/dir/mkdir";
  const FAIROS_HOST = apiHost();
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
  } else {
    console.error({ response, json });
  }
};

export const loginAccount = async (userName: string, password: string) => {
  const ENDPOINT = "/v2/user/login";
  const FAIROS_HOST = apiHost();
  let data = {
    userName,
    password,
  };
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  let json = await response.json();
  if (response.ok) {
    initTodos().then((todos) => {
      console.log({ todos });
      todoItems.set(todos);
      state.set(STATE.INFO);
      wallet.set({ address: json.address, mnemonic: "" });
      user.set(userName);
    });
    console.log({ response, json });
  } else {
    console.error({ response, json });
  }
};

export async function topUpAddress(
  fdp: FdpStorage,
  address: string,
  amountInEther = "0.01"
) {
  const ens = fdp.ens;
  const accounts = await ens.provider.listAccounts();
  const balances = [];
  accounts.map(async (addr, i) => {
    const balance = await await ens.provider.getBalance(addr);
    balances[i] = Number(balance._hex);
  });
  console.log({ accounts, balances });
  const account = (await ens.provider.listAccounts())[0];
  console.log(`Topping ${address} with ${amountInEther} ETH...`);
  return ens.provider
    .send("eth_sendTransaction", [
      {
        from: account,
        to: address,
        value: utils.hexlify(utils.parseEther(amountInEther)),
      },
    ])
    .then((txHash) => {
      return ens.provider.waitForTransaction(txHash).then(() => {
        console.log("Topped! ", { txHash });
        return txHash;
      });
    });
}
export const ago = (date: number) => {
  //@ts-ignore
  return moment(date, false).fromNow();
};
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
