# Todos with FairOS and FDP Play

An web3 Todos application built using FairOS REST API and FDP Play.

## Roadmap

- improve dx w.r.t initial setup and env
- improve ui/ux
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
$ git clone https://github.com/fairDataSociety/fairos-TODO-app-example.git
```

```shell
$ cd fairos-TODO-app-example
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

#### Update `VITE_BEE_POSTAGE_BATCH_ID`

Update the `VITE_BEE_POSTAGE_BATCH_ID` in your `.env` file with the "batchId" returned in the previous step.

### Run application
**Requirements:** `fdp-play` must be running already! 

```shell
$ npm run dev
```

The application can be viewed at - http://localhost:5173/ 

## Screenshots

### Login / Register Page:

![image](https://user-images.githubusercontent.com/520570/210035932-433b63e8-7750-4684-8cd7-61b9ced6c3ca.png)

### Todo List:

![image](https://user-images.githubusercontent.com/520570/210035959-ed32a5de-4e7f-48b2-9433-c2c3cd9cd273.png)
