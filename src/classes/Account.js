import { fetchError } from "../utils.js";
import AccountProfile from "./AccountProfile.js";
import Base from "./base/Base.js";
export default class Account extends Base {
    id;
    username;
    acct;
    displayName;
    url;
    instance;
    profile;
    followersCount;
    followingCount;
    statusesCount;
    createdDate;
    followRequestsLocked;
    movedTo;
    isBot;
    isGroup;
    isDiscoverable;
    noIndex;
    isSuspended;
    isSilenced;
    constructor(accountOpts, client) {
        super(client);
        const acctSplit = accountOpts.acct.split("@");
        if (acctSplit.length < 2) {
            this.instance = client.instance;
        }
        else {
            if (this.client.cache.instances.has(acctSplit[1])) {
                this.instance = this.client.cache.getInstance(acctSplit[1]);
            }
        }
        this.profile = new AccountProfile(accountOpts, client);
        this.assign(accountOpts);
    }
    assign(accountOpts, replace = true) {
        const assign = {
            id: accountOpts.id,
            username: accountOpts.username,
            acct: accountOpts.acct,
            displayName: accountOpts.display_name,
            url: accountOpts.url,
            followersCount: accountOpts.followers_count,
            followingCount: accountOpts.following_count,
            statusesCount: accountOpts.statuses_count,
            createdDate: new Date(accountOpts.created_at),
            followRequestsLocked: accountOpts.locked,
            isBot: accountOpts.bot,
            isGroup: accountOpts.group,
            isDiscoverable: accountOpts.discoverable || true,
            noIndex: accountOpts.noindex || false,
            isSuspended: accountOpts.suspended || false,
            isSilenced: accountOpts.limited || false
        };
        if (accountOpts.moved)
            this.movedTo = this.client.cache.getAccount(this.movedTo);
        this.profile.assign(accountOpts, replace);
        super.assign(assign, replace);
    }
    async fetchInstance() {
        const acctSplit = this.acct.split("@");
        if (!this.instance) {
            if (this.client.cache.instances.has(acctSplit[1])) {
                this.instance = this.client.cache.getInstance(acctSplit[1]);
            }
            else {
                const url = new URL("/api/v2/instance", `http://${acctSplit[1]}`);
                const res = await fetch(url.href, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json, text/plain, */*"
                    }
                });
                if (res.status == 404)
                    return;
                if (!res.ok)
                    throw await fetchError(res);
                const data = await res.json();
                this.instance = this.client.cache.getInstance(data);
            }
        }
        return this.instance;
    }
    async fetchStatuses(idOrOpts) {
        if (typeof idOrOpts == "string") {
            const statusRes = await this.client.GET(`/api/v1/statuses/${idOrOpts}`);
            if (!statusRes.ok)
                throw await fetchError(statusRes);
            const statusData = await statusRes.json();
            return [this.client.cache.getStatus(statusData)];
        }
        else {
            const reqParams = {
                limit: idOrOpts.limit,
                tagged: idOrOpts.tag,
                max_id: idOrOpts.maxId,
                since_id: idOrOpts.sinceId,
                min_id: idOrOpts.minId,
                only_media: idOrOpts.onlyMedia,
                pinned: idOrOpts.onlyPinned,
                exclude_replies: idOrOpts.noReplies,
                exclude_reblog: idOrOpts.noReblogs,
            };
            const statusesRes = await this.client.GET(`/api/v1/accounts/${this.id}/statuses`, {}, reqParams);
            if (!statusesRes.ok)
                throw await fetchError(statusesRes);
            const statusesData = await statusesRes.json();
            const statuses = statusesData.map(this.client.cache.getStatus);
            return statuses;
        }
    }
}
//# sourceMappingURL=Account.js.map