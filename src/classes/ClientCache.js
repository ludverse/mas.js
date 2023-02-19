import Account from "./Account.js";
import Instance from "./Instance.js";
import Status from "./Status.js";
import Base from "./base/Base.js";
export default class ClientCache extends Base {
    statuses = new Map();
    accounts = new Map();
    instances = new Map();
    constructor(client) {
        super(client);
    }
    getStatus(statusOptsOrId) {
        if (typeof statusOptsOrId == "string") {
            return this.statuses.get(statusOptsOrId);
        }
        else {
            if (this.statuses.has(statusOptsOrId.id)) {
                return this.statuses.get(statusOptsOrId.id);
            }
            else {
                const status = new Status(statusOptsOrId, this.client);
                this.statuses.set(status.id, status);
                return status;
            }
        }
    }
    getAccount(accountOptsOrId) {
        if (typeof accountOptsOrId == "string") {
            return this.accounts.get(accountOptsOrId);
        }
        else {
            if (this.accounts.has(accountOptsOrId.id)) {
                return this.accounts.get(accountOptsOrId.id);
            }
            else {
                const account = new Account(accountOptsOrId, this.client);
                this.accounts.set(account.id, account);
                return account;
            }
        }
    }
    getInstance(instanceOptsOrId) {
        if (typeof instanceOptsOrId == "string") {
            return this.instances.get(instanceOptsOrId);
        }
        else {
            if (this.instances.has(instanceOptsOrId.domain)) {
                return this.instances.get(instanceOptsOrId.domain);
            }
            else {
                const instance = new Instance(instanceOptsOrId, this.client);
                this.instances.set(instance.domain, instance);
                return instance;
            }
        }
    }
}
//# sourceMappingURL=ClientCache.js.map