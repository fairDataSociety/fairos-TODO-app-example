# Todos with `fdp-storage` and `fdp-play`

An web3 Todos application built using `fdp-storage` and `fdp-play`.

## Roadmap

- improve dx w.r.t initial setup and env
- improve ui/ux
- bump `fdp-storage` version when released (currently uses "github:fairDataSociety/fdp-storage#fix/bee-js-762")
- make todos editable (https://github.com/fairDataSociety/fdp-storage/issues/192)

## Local Development Setup

### Prerequisites:

- `node` and `npm` must be installed
- docker must be installed
- the following ports must be free and available for FDP Play to use
    - **1634** and **1635** - for the queen bee node
    - **9545** - for the blockhain
    - **9090** - for fairOS

#### Install `fdp-play` globally
```shell
$ npm install -g @fairdatasociety/fdp-play
```

#### Spin up a local FDP development environment with fairos
```shell
$ fdp-play start --fairos
```

### Setup & Installation:

#### Clone the repo
```shell
$ git clone https://github.com/rampall/fdp-storage-todos.git
```

```shell
$ cd fdp-storage-todos/
```

### Install dependencies
```shell
$ npm install
```

### Env file setup

#### Copy `.env.example` to `.env`:

```shell
$ cp .env.example .env
```
#### Generate a Postage Batch Id:

```shell
$ curl -s -XPOST http://localhost:1635/stamps/10000000/18
```

#### Update `VITE_POSTAGE_BATCH_ID`

Update the `VITE_POSTAGE_BATCH_ID` in your `.env` file with the "batchId" returned in the previous step.

### Run application
**Requirements:** `fdp-play` must be running already! 

```shell
$ npm run dev
```

The application can be viewed at - http://localhost:5173/ 

## Screenshots

### Login / Import Wallet Page:

![image](https://user-images.githubusercontent.com/520570/208272229-c78d1c0c-d191-4e79-b6b8-9affc9092321.png)

### Todo List:

![image](https://user-images.githubusercontent.com/520570/208272239-65ee9554-ec47-428f-b84c-5b5bb769a98c.png)


