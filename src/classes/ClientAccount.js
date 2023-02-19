import Account from "./Account.js";
import { fetchError } from "../utils.js";
export default class ClientAccount extends Account {
    constructor(accountOptions, client) {
        super(accountOptions, client);
    }
    async post(contentOrStatusPostOpts) {
        let reqParams = {};
        if (typeof contentOrStatusPostOpts == "string") {
            reqParams = { status: contentOrStatusPostOpts };
        }
        else {
            reqParams = {
                status: contentOrStatusPostOpts.contentText,
                scheduled_at: contentOrStatusPostOpts.scheduledAt,
                spoiler_text: contentOrStatusPostOpts.spoilerText,
                sensitive: contentOrStatusPostOpts.isSensitive,
                language: contentOrStatusPostOpts.language,
                visibility: contentOrStatusPostOpts.visibility,
                in_reply_to_id: contentOrStatusPostOpts.replyPostId,
                poll: contentOrStatusPostOpts.poll,
            };
        }
        const res = await this.client.POST("/api/v1/statuses", reqParams);
        if (!res.ok)
            throw await fetchError(res);
        const data = await res.json();
        return this.client.cache.getStatus(data);
    }
}
//# sourceMappingURL=ClientAccount.js.map