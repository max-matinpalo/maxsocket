# maxsocket
[![npm version](https://img.shields.io/npm/v/maxsocket)](https://www.npmjs.com/package/maxsocket)
[![license](https://img.shields.io/github/license/max-matinpalo/maxsocket?v=1)](https://github.com/max-matinpalo/maxsocket/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/maxsocket)](https://bundlephobia.com/package/maxsocket)


**Lightweight alternative for `reconnecting-websocket` and `simple-websocket`**

|  | `maxsocket` | `reconnecting-websocket` | `simple-websocket` |
| :--- | :--- | :--- | :--- |
| Architecture | **Native Browser** `WebSocket` | **Native Browser** `WebSocket` | **Node.js Polyfills** `stream` & `buffer` |
| Size (min+gzip) | **1.2 kB** | **~2.6 kB** | **13.8 kB** |
| Auto-Reconnect | ✅ Built-in | ✅ Built-in | ❌ Manual |
| JSON Handling | ✅ Built-in | ❌ Manual | ❌ Manual |
| Routing | ✅ Built-in | ❌ Manual | ❌ Manual |


## Install
```bash
npm install maxsocket
```

## Example
```javascript
import { connect } from "maxsocket";

const options = {};
const socket = connect("ws://api.example.com", options);

socket.onConnect(() => socket.send("connected"));
socket.onMessage(msg => console.log(msg));
socket.onClose(() => console.log("close"));
socket.send("hello");
```


### Options
|  | Default | Description |
| :--- | :--- | :--- |
| `params` | `{}` | Object of key-values appended as a query string to the URL. |
| `protocols` | `[]` | Array of subprotocol strings for handshake negotiation. |
| `reconnect` | `5000` | Delay in ms before attempting to reconnect on failure. |


### API
|  | Arguments | Description |
| :--- | :--- | :--- |
| `connect(url, options?)` | `url: string`, `options?: object` | Creates a stable socket accessor. |
| `socket.send(data)` | `data: any` | Sends data as JSON. |
| `socket.onConnect(fn)` | `fn(socket)` | Runs when connected or reconnected. |
| `socket.onMessage(fn)` | `fn(message, socket)` | Runs for unmatched inbound messages. |
| `socket.onClose(fn)` | `fn(event, socket)` | Runs when the socket closes. |
| `socket.onError(fn)` | `fn(error, socket)` | Runs on socket, parsing, or handler errors. |
| `socket.close()` | none | Closes the socket and disables reconnect. |
| `socket.status` | none | `"connecting"`, `"open"`, `"closing"`, or `"closed"`. |
| `socket.isConnected` | none | `true` when status is `"open"`. |
| `socket.on(event, fn)` | `event: string`, `fn(data, socket)` | Routes matching events to a handler. |
| `socket.off(event)` | `event: string` | Removes a routed handler. |




### Optional event routing
Option to register handlers for specific events.  
If no route handler registered for the passed events, the `socket.onMessage()`handler will be called.

```javascript
function exampleHandler (data, socket) {}

socket.on("example", exampleHandler);
socket.on("chat", chatHandler)
...
```

**Requirement:** Server must sent messages of the form: 
```js
{event: "", data: {}}
```
