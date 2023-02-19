
import { EventEmitter } from "node:events";
import Instance from "./Instance.js";
import ClientAccount from "./ClientAccount.js";
import { fetchError } from "../utils.js";
import ClientWebSocket, { SocketMessageData } from "./ClientWebSocket.js";
import ClientCache from "./ClientCache.js";
import Status from "./Status.js";
import Account from "./Account.js";

export interface AccountNotificationData {
    id: string,
    type: string,
    account: Account,
    date: Date
}

export interface NotificationData extends AccountNotificationData {
    status?: Status
}

export interface StatusNotificationData extends NotificationData {
    status: Status,
}

export interface ClientOptions {
    url: string;
    socketAutoFetch?: boolean;
}

declare interface Client {
    addListener(event: "ready", listener: () => void): this;
    addListener(event: "status", listener: (status: Status) => void): this;
    addListener(event: "status:update", listener: (status: Status) => void): this;
    addListener(event: "status:delete", listener: (status: Status) => void): this;
    addListener(event: "mention", listener: (status: Status) => void): this;
    addListener(event: "favourite", listener: (status: Status) => void): this;
    addListener(event: "notification", listener: (data: NotificationData) => void): this;

    on(event: "ready", listener: () => void): this;
    on(event: "status", listener: (status: Status) => void): this;
    on(event: "status:update", listener: (status: Status) => void): this;
    on(event: "status:delete", listener: (status: Status) => void): this;
    on(event: "mention", listener: (status: Status) => void): this;
    on(event: "favourite", listener: (status: Status) => void): this;
    on(event: "notification", listener: (data: NotificationData) => void): this;
    
    once(event: "ready", listener: () => void): this;
    once(event: "status", listener: (status: Status) => void): this;
    once(event: "status:update", listener: (status: Status) => void): this;
    once(event: "status:delete", listener: (status: Status) => void): this;
    once(event: "mention", listener: (status: Status) => void): this;
    once(event: "favourite", listener: (status: Status) => void): this;
    once(event: "notification", listener: (data: NotificationData) => void): this;
}

class Client extends EventEmitter {

    public token: string;
    public url: string;
    public cache: ClientCache
    public options: ClientOptions;
    public account?: ClientAccount;
    public instance?: Instance;
    public ws: ClientWebSocket;

    constructor(clientOptions: ClientOptions) {
        super();

        if (typeof clientOptions?.url !== "string") throw new Error("'url' is not specified for 'clientOptions'");
        this.url = clientOptions.url;

        this.cache = new ClientCache(this);
        this.ws = new ClientWebSocket(this);

        this.ws.on("public", (data: SocketMessageData) => {
            if (data.event == "update") {
                const payload = JSON.parse(data.payload);
                return this.emit("status", this.cache.getStatus(payload));
            } else if (data.event == "status.update") {
                const payload = JSON.parse(data.payload);

                const status = this.cache.getStatus(payload);
                status.assign(payload);
                
                return this.emit("status:update", status);
            } else if (data.event == "delete") {
                const status = this.cache.getStatus(data.payload);
                if (!status) return;

                status.isDeleted = true;
                return this.emit("status:delete", status);
            }
        });

        this.ws.on("user", (data: SocketMessageData) => {
            if (data.event == "notification") {
                const payload = JSON.parse(data.payload);

                const account = this.cache.getAccount(payload.account);

                let res: NotificationData = {
                    id: payload.id,
                    type: payload.type,
                    account,
                    date: new Date(payload.created_at)
                }

                if (payload.status) {
                    res.status = this.cache.getStatus(payload.status);
                }
                
                if (payload.type == "mention") {
                    this.emit("mention", res.status);
                } else if (payload.type == "favourite") {
                    this.emit("favourite", res.status);
                }

                return this.emit("notification", data);
            }
        });

        delete clientOptions.url;
        this.options = clientOptions;
    }

    async login(token: string) {
        if (typeof token != "string") throw new Error("passed argument 'token' not type of string.");

        this.token = token;

        const userRes = await this.GET("/api/v1/accounts/verify_credentials");
        if (!userRes.ok) {
            this.token = null;
            if (userRes?.status === 401) {
                throw new Error("passed token is invalid.");
            } else {
                throw new Error("failed to make request to instance in order to verify token. check your internet connection.");
            }
        }
        const userData = await userRes.json();

        this.token = token;
        this.account = new ClientAccount(userData, this);
        
        const instanceRes = await this.GET("/api/v2/instance");
        if (!instanceRes.ok) throw await fetchError(instanceRes);
        const instanceData = await instanceRes.json();
        
        this.instance = this.cache.getInstance(instanceData);

        await this.ws.setup(token);

        this.emit("ready");
    }

    async GET(apiPath: string, reqInfo?: any, urlParams?: any) {
        const url = new URL(`${ apiPath }${ urlParams ? "?" : "" }`, this.url);
        for (const key in urlParams) {
            if (urlParams[key]) url.searchParams.set(key, urlParams[key]);
        }

        return await fetch(url.href, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${ this.token }`,
                "Accept": "application/json, text/plain, */*"
            },
            ...reqInfo
        });
    }

    async POST(apiPath: string, reqData?: any, reqInfo?: any, urlParams?: any) {
        const url = new URL(`${ apiPath }${ urlParams ? "?" : "" }`, this.url);
        for (const key in urlParams) {
            if (urlParams[key]) url.searchParams.set(key, urlParams[key]);
        }

        return this.GET(url.href, {
            method: "POST",
            body: reqData ? JSON.stringify(reqData) : undefined,
            headers: {
                "Authorization": `Bearer ${ this.token }`,
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            ...reqInfo
        });
    }

    async PUT(apiPath: string, reqData?: any, reqInfo?: any, urlParams?: any) {
        const url = new URL(`${ apiPath }${ urlParams ? "?" : "" }`, this.url);
        for (const key in urlParams) {
            if (urlParams[key]) url.searchParams.set(key, urlParams[key]);
        }

        return this.GET(url.href, {
            method: "PUT",
            body: reqData ? JSON.stringify(reqData) : undefined,
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            ...reqInfo
        });
    }

    async DELETE(apiPath: string, reqInfo?: any, urlParams?: any) {
        const url = new URL(`${ apiPath }${ urlParams ? "?" : "" }`, this.url);
        for (const key in urlParams) {
            if (urlParams[key]) url.searchParams.set(key, urlParams[key]);
        }

        return this.GET(url.href, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${ this.token }`,
                "Accept": "application/json, text/plain, */*"
            },
            ...reqInfo
        });
    }

}

export default Client;
