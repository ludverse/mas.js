
import { WebSocket } from "ws";
import { EventEmitter } from "node:events";
import Client from "./Client.js";

export interface SocketMessageData {
    stream: string[]; // TODO types pls
    event: string;
    payload?: string;
}

export default class ClientWebSocket extends EventEmitter {

    public socket: WebSocket;
    
    constructor(protected client: Client) {
        super();
    }

    setup(accessToken: string): Promise<WebSocket> {
        return new Promise((resolve, reject) => {

            const socket = new WebSocket(`${ this.client.url.startsWith("https:") ? "wss:" : "ws:" }${ this.client.url.match(/(?<=(https:)|(http:))[\s\S]+/)[0] }/api/v1/streaming?access_token=${ accessToken }`);
            this.socket = socket;
    
            socket.on("open", () => {
                this.emit("ws:open", ...arguments);

                const subscribe = (stream) => socket.send(JSON.stringify({ type: "subscribe", stream }));
                subscribe("public");
                subscribe("user");
                subscribe("direct");

                return resolve(socket);
            });
    
            socket.on("message", raw => {
                this.emit("ws:message", ...arguments);

                const data: SocketMessageData = JSON.parse(raw.toString("utf8"));
                this.emit(data.stream[0], data);
            });
    
            socket.on("close", () => {
                this.emit("ws:close", ...arguments);
            });
    
            socket.on("error", () => {
                this.emit("ws:error", ...arguments);
                
                return reject(new Error("could not establish a WebSocket connection to the streaming API"));
            });
    
        });
    }
}