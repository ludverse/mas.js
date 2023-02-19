import { EventEmitter } from "node:events";
import ClientAccount from "./ClientAccount.js";
import { fetchError } from "../utils.js";
import ClientWebSocket from "./ClientWebSocket.js";
import ClientCache from "./ClientCache.js";
class Client extends EventEmitter {
    token;
    url;
    cache;
    options;
    account;
    instance;
    ws;
    constructor(clientOptions) {
        super();
        if (typeof clientOptions?.url !== "string")
            throw new Error("'url' is not specified for 'clientOptions'");
        this.url = clientOptions.url;
        this.cache = new ClientCache(this);
        this.ws = new ClientWebSocket(this);
        this.ws.on("public", (data) => {
            if (data.event == "update") {
                const payload = JSON.parse(data.payload);
                return this.emit("status", this.cache.getStatus(payload));
            }
            else if (data.event == "status.update") {
                const payload = JSON.parse(data.payload);
                const status = this.cache.getStatus(payload);
                status.assign(payload);
                return this.emit("status:update", status);
            }
            else if (data.event == "delete") {
                const status = this.cache.getStatus(data.payload);
                if (!status)
                    return;
                status.isDeleted = true;
                return this.emit("status:delete", status);
            }
        });
        this.ws.on("user", (data) => {
            if (data.event == "notification") {
                const payload = JSON.parse(data.payload);
                const account = this.cache.getAccount(payload.account);
                let res = {
                    id: payload.id,
                    type: payload.type,
                    account,
                    date: new Date(payload.created_at)
                };
                if (payload.status) {
                    res.status = this.cache.getStatus(payload.status);
                }
                if (payload.type == "mention") {
                    this.emit("mention", res.status);
                }
                else if (payload.type == "favourite") {
                    this.emit("favourite", res.status);
                }
                return this.emit("notification", data);
            }
        });
        delete clientOptions.url;
        this.options = clientOptions;
    }
    async login(token) {
        if (typeof token != "string")
            throw new Error("passed argument 'token' not type of string.");
        this.token = token;
        const userRes = await this.GET("/api/v1/accounts/verify_credentials");
        if (!userRes.ok) {
            this.token = null;
            if (userRes?.status === 401) {
                throw new Error("passed token is invalid.");
            }
            else {
                throw new Error("failed to make request to instance in order to verify token. check your internet connection.");
            }
        }
        const userData = await userRes.json();
        this.token = token;
        this.account = new ClientAccount(userData, this);
        const instanceRes = await this.GET("/api/v2/instance");
        if (!instanceRes.ok)
            throw await fetchError(instanceRes);
        const instanceData = await instanceRes.json();
        this.instance = this.cache.getInstance(instanceData);
        await this.ws.setup(token);
        this.emit("ready");
    }
    async GET(apiPath, reqInfo, urlParams) {
        const url = new URL(`${apiPath}${urlParams ? "?" : ""}`, this.url);
        for (const key in urlParams) {
            if (urlParams[key])
                url.searchParams.set(key, urlParams[key]);
        }
        return await fetch(url.href, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Accept": "application/json, text/plain, */*"
            },
            ...reqInfo
        });
    }
    async POST(apiPath, reqData, reqInfo, urlParams) {
        const url = new URL(`${apiPath}${urlParams ? "?" : ""}`, this.url);
        for (const key in urlParams) {
            if (urlParams[key])
                url.searchParams.set(key, urlParams[key]);
        }
        return this.GET(url.href, {
            method: "POST",
            body: reqData ? JSON.stringify(reqData) : undefined,
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            ...reqInfo
        });
    }
    async PUT(apiPath, reqData, reqInfo, urlParams) {
        const url = new URL(`${apiPath}${urlParams ? "?" : ""}`, this.url);
        for (const key in urlParams) {
            if (urlParams[key])
                url.searchParams.set(key, urlParams[key]);
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
    async DELETE(apiPath, reqInfo, urlParams) {
        const url = new URL(`${apiPath}${urlParams ? "?" : ""}`, this.url);
        for (const key in urlParams) {
            if (urlParams[key])
                url.searchParams.set(key, urlParams[key]);
        }
        return this.GET(url.href, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Accept": "application/json, text/plain, */*"
            },
            ...reqInfo
        });
    }
}
export default Client;
//# sourceMappingURL=Client.js.map