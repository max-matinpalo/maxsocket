import { connect } from "maxsocket";

export default function testSocket(url = "ws://localhost:8080") {

	// 1. Initialize options
	const options = {
		reconnect: 3000,
		params: { session: "test-xyz" }
	};

	// 2. Connect using the provided url
	const socket = connect(url, options);

	// 3. Register routes
	socket.on("alert", (data) => console.log("Alert from server:", data));

	// 4. Lifecycle handlers
	socket.onConnect(() => {
		console.log("Connected to", url);
		socket.send({ event: "init", data: { platform: "web" } });
	});

	socket.onMessage((msg) => console.log("Raw message:", msg));

	socket.onError((err) => console.error("Socket error:", err));

	socket.onClose(() => console.log("Connection closed"));

	return socket;
}