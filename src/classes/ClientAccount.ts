
import { StatusVisibilityTypes } from "../types.js";
import Client from "./Client.js";
import Account, { AccountOptions } from "./Account.js";
import Instance from "./Instance.js";
import Status, { StatusLanguageTypes } from "./Status.js";
import { fetchError } from "../utils.js";

export interface StatusPostOptions {
    contentText: string;
    scheduledAt?: string;
    spoilerText?: string;
    language?: StatusLanguageTypes;
    isSensitive?: boolean;
    mediaAttatchments?: any[]; // TODO MediaAttachment
    visibility?: StatusVisibilityTypes;
    replyPostId?: string;
    poll?: any; // TODO Poll
}

export default class ClientAccount extends Account {
        
    constructor(accountOptions: AccountOptions, client: Client) {
        super(accountOptions, client);
    }

    async post(contentOrStatusPostOpts?: string | StatusPostOptions) {
        let reqParams = {};

        if (typeof contentOrStatusPostOpts == "string") {
            reqParams = { status: contentOrStatusPostOpts };
        } else {
            reqParams = {
                status: contentOrStatusPostOpts.contentText,
                scheduled_at: contentOrStatusPostOpts.scheduledAt,
                spoiler_text: contentOrStatusPostOpts.spoilerText,
                sensitive: contentOrStatusPostOpts.isSensitive,
                language: contentOrStatusPostOpts.language,
                visibility: contentOrStatusPostOpts.visibility,
                in_reply_to_id: contentOrStatusPostOpts.replyPostId,
                poll: contentOrStatusPostOpts.poll,
            }
        }
            
        const res = await this.client.POST("/api/v1/statuses", reqParams);
        if (!res.ok) throw await fetchError(res);
        const data = await res.json();
        
        return this.client.cache.getStatus(data);
    }
}