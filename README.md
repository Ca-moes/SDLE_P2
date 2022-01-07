# SDLE Project - dot

SDLE Project for group T1G16.

Group members:

1. André Gomes (up201806224@edu.fe.up.pt)
2. Daniel Silva (up201806524@edu.fe.up.pt)
3. Luís Marques (up201104354@edu.fe.up.pt)
4. Rodrigo Reis (up201806534@edu.fe.up.pt)

## Developing

`npm start` Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Gun Stores its data in the [browser Local Storage](https://ui.vision/howto/view-local-storage), in the file specified in the Gun constructor.

This data can be passed to `./src/Assets/gun_data.json` before a commit to share the state of a node. To retrive the state, this data needs to be copied manually into the browser Local Storage.

## Running

Run relay server with `npm run server [port]`. The port is not necessary, defaulting to 8765 if not present.
