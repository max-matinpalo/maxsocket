# maxsocket
[![npm version](https://img.shields.io/npm/v/maxsocket)](https://www.npmjs.com/package/maxsocket)
[![license](https://img.shields.io/github/license/max-matinpalo/maxsocket?v=1)](https://github.com/max-matinpalo/maxsocket/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/maxsocket)](https://bundlephobia.com/package/maxsocket)


**Lightweight alternative for `reconnecting-websocket` and `simple-websocket`**

*   **Very small package size:** ~0.9 kB (min+gzip).
*   **Auto-Reconnect:** Built-in reconnection with instant network recovery on browser `online` events.
*   **Offline Queueing:** Messages sent while disconnected are queued and flushed upon reconnect.
*   **JSON Handling:** Automatic parsing and stringifying of payloads.
*   **Functional API:** Explicit lifecycle handlers (`onMessage`, `onConnect`) instead of generic event listeners.
*   **Event Routing:** Built-in routing for structured server messages.

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


## Options
|  | Default | Description |
| :--- | :--- | :--- |
| `params` | `{}` | Object of key-values appended as a query string to the URL. |
| `protocols` | `[]` | Array of subprotocol strings for handshake negotiation. |
| `reconnect` | `5000` | Delay in ms before attempting to reconnect on failure. |
| `queue` | `true` | Queue messages sent while offline and flush them upon connection. |


## API
### Handlers
|  | Arguments | Description |
| :--- | :--- | :--- |
| `connect(url, options?)` | `url: string`, `options?: object` | Creates a stable socket accessor. |
| `socket.send(data)` | `data: any` | Sends data as JSON. |
| `socket.close()` | - | Closes the socket and disables reconnect. |
| `socket.onConnect(fn)` | `fn(socket)` | Runs when connected or reconnected. |
| `socket.onMessage(fn)` | `fn(message, socket)` | Runs with parsed message |
| `socket.onClose(fn)` | `fn(event, socket)` | Runs when the socket closes. |
| `socket.onError(fn)` | `fn(error, socket)` | Runs on socket, parsing, or handler errors. |

### Properties
| Property | Type | Description |
| :--- | :--- | :--- |
| `socket.status` | `string` | Returns `"closed"`, `"connecting"`, `"open"`, or `"closing"`. |
| `socket.isConnected` | `boolean` | `true` if the socket is fully open. |


## Event routing
Option to register handlers to route incomming messages based on there event types.
| | | |
| :--- | :--- | :--- |
| `socket.on(event, fn)` | `event: string`, `fn(data, socket)` | Register handler. |
| `socket.off(event)` | `event: string` | Remove handler. |

```javascript
function exampleHandler (data, socket) {}

socket.on("example", exampleHandler);
socket.on("chat", chatHandler)
...
```

If no route handler registered for the passed events, the `socket.onMessage()`handler will be called.  
**Requirement:** Server sends messages of the form: 
```js
{ event: "chat", data: { text: "hello" } }
```

## Comparison
|  | `maxsocket` | `reconnecting-websocket` | `simple-websocket` |
| :--- | :--- | :--- | :--- |
| Architecture | **Native Browser** `WebSocket` | **Native Browser** `WebSocket` | **Node.js Polyfills** `stream` & `buffer` |
| Size (min+gzip) | **~0.9 kB** | **~2.6 kB** | **~13.8 kB** |
| Auto-Reconnect | ✅ Built-in | ✅ Built-in | ❌ Manual |
| JSON Handling | ✅ Built-in | ❌ Manual | ❌ Manual |
| Routing | ✅ Built-in | ❌ Manual | ❌ Manual |


## License
MIT
