
export function connect(url, options = {}) {
	// 1. Initialize options and state
	const reconnectDelay = options.reconnect ?? 5000;
	const shouldUseReconnect = options.reconnect !== false;
	const protocols = options.protocols || [];
	const params = options.params || {};
	const useQueue = options.queue ?? true;

	let shouldReconnect = true;
	let reconnectTimer = null;
	let ws = null;
	const queue = [];

	// 2. Build URL and initialize routing
	const fullUrl = buildUrl(url, params);
	const routes = {};
	let connectHandler = null;
	let messageHandler = null;
	let closeHandler = null;
	let errorHandler = null;

	// 3. Define internal helpers
	function send(data) {
		const payload = JSON.stringify(data);

		if (socket.isConnected) {
			ws.send(payload);
			return true;
		}

		if (useQueue) queue.push(payload);
		return false;
	}

	function flushQueue() {
		while (queue.length && socket.isConnected) ws.send(queue.shift());
	}

	function handleMessage(event) {
		let message = event.data;

		try {
			message = JSON.parse(event.data);
		} catch { }

		try {
			const handler = message?.event ? routes[message.event] : null;
			if (handler) handler(message.data, socket);
			else if (messageHandler) messageHandler(message, socket);
		} catch (err) {
			if (errorHandler) errorHandler(err, socket);
		}
	}

	function handleClose(event) {
		if (closeHandler) closeHandler(event, socket);
		if (!shouldReconnect || !shouldUseReconnect) return;

		clearTimeout(reconnectTimer);
		reconnectTimer = setTimeout(initSocket, reconnectDelay);
	}

	function handleOnline() {
		if (!shouldReconnect || !shouldUseReconnect) return;
		if (socket.status === "open" || socket.status === "connecting") return;
		clearTimeout(reconnectTimer);
		initSocket();
	}

	function initSocket() {
		ws = new WebSocket(fullUrl, protocols);

		ws.onopen = () => {
			if (connectHandler) connectHandler(socket);
			flushQueue();
		};

		ws.onmessage = handleMessage;
		ws.onclose = handleClose;
		ws.onerror = (err) => {
			if (errorHandler) errorHandler(err, socket);
		};
	}

	// 4. Define the stable socket accessor
	const socket = {
		get status() {
			if (!ws) return "closed";
			if (ws.readyState === 0) return "connecting";
			if (ws.readyState === 1) return "open";
			if (ws.readyState === 2) return "closing";
			return "closed";
		},
		get isConnected() {
			return socket.status === "open";
		},
		send,
		onConnect: fn => { connectHandler = fn; },
		onMessage: fn => { messageHandler = fn; },
		onClose: fn => { closeHandler = fn; },
		onError: fn => { errorHandler = fn; },
		on: (event, fn) => { routes[event] = fn; },
		off: event => { delete routes[event]; },
		close: () => {
			shouldReconnect = false;
			clearTimeout(reconnectTimer);
			if (typeof window !== "undefined") window.removeEventListener("online", handleOnline);
			if (ws) ws.close();
		}
	};

	// 5. Start the initial connection
	if (typeof window !== "undefined") window.addEventListener("online", handleOnline);
	initSocket();

	return socket;
}

function buildUrl(url, params) {
	const base = typeof window !== "undefined" ? window.location.href : undefined;
	const finalUrl = new URL(url, base);

	for (const [key, value] of Object.entries(params))
		finalUrl.searchParams.set(key, value);

	return finalUrl.toString();
}
