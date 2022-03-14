# SDLE Project - dot

SDLE Project for group T1G16.

Group members:

1. André Gomes (up201806224@edu.fe.up.pt)
2. Daniel Silva (up201806524@edu.fe.up.pt)
3. Luís Marques (up201104354@edu.fe.up.pt)
4. Rodrigo Reis (up201806534@edu.fe.up.pt)

## Installing

Requirements (Both of the requirements can be obtained via `nvm`):

- npm v8.1.2
- Node v16.13.1

After this, clone the project and run `npm install` on the root folder to download the dependencies. Once that is finished, run `npm start` and the app should be available in `http://localhost:3000` and connected to a relay served hosted on `heroku`.

## Developing

`npm start` Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Gun Stores its data in the [browser Local Storage](https://ui.vision/howto/view-local-storage).


## Running with local server

Run relay server with `npm run server [port]`. The port is not necessary, defaulting to 8765 if not present.

**Restart everything:**
- Shutdown `npm start`'s, then shutdown relay
- `sessionStorage.clear(); localStorage.clear();` on peers
- close peers browser windows
- `npm run serverclean`

## Demo

A demonstration is available here [here](https://youtu.be/xwWr8N6CaYM)