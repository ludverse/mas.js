
import Account, { AccountOptions } from "./Account.js";
import Client from "./Client.js";
import Instance, { InstanceOptions } from "./Instance.js";
import Status, { StatusOptions } from "./Status.js";
import Base from "./base/Base.js";

export default class ClientCache extends Base {

    public statuses = new Map<string, Status>();
    public accounts = new Map<string, Account>();
    public instances = new Map<string, Instance>();
    
    constructor(client: Client) {
        super(client);
    }

    getStatus(statusOptsOrId: StatusOptions | string) {
        if (typeof statusOptsOrId == "string") {
            return this.statuses.get(statusOptsOrId);
        } else {
            if (this.statuses.has(statusOptsOrId.id)) {
                return this.statuses.get(statusOptsOrId.id);
            } else {
                const status = new Status(statusOptsOrId, this.client);
                this.statuses.set(status.id, status);
                return status;
            }
        }
    }

    getAccount(accountOptsOrId: AccountOptions | string) {
        if (typeof accountOptsOrId == "string") {
            return this.accounts.get(accountOptsOrId);
        } else {
            if (this.accounts.has(accountOptsOrId.id)) {
                return this.accounts.get(accountOptsOrId.id);
            } else {
                const account = new Account(accountOptsOrId, this.client);
                this.accounts.set(account.id, account);
                return account;
            }
        }
    }

    getInstance(instanceOptsOrId: InstanceOptions | string) {
        if (typeof instanceOptsOrId == "string") {
            return this.instances.get(instanceOptsOrId);
        } else {
            if (this.instances.has(instanceOptsOrId.domain)) {
                return this.instances.get(instanceOptsOrId.domain);
            } else {
                const instance = new Instance(instanceOptsOrId, this.client);
                this.instances.set(instance.domain, instance);
                
                return instance;
            }
        }
    }
}