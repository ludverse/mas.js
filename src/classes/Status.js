import Base from "./base/Base.js";
import { fetchError } from "../utils.js";
import StatusContent from "./StatusContent.js";
export default class Status extends Base {
    id;
    content;
    account;
    repliesCount;
    reblogsCount;
    favoritesCount;
    reblogged;
    favourited;
    application;
    visibility;
    isDeleted = false;
    isSensitive;
    createdDate;
    editedDate;
    replyPostId;
    reblogPost;
    constructor(statusOpts, client) {
        super(client);
        this.content = new StatusContent(statusOpts, client);
        this.account = this.client.cache.getAccount(statusOpts.account);
        this.assign(statusOpts);
    }
    assign(statusOpts, replace = true) {
        const assign = {
            id: statusOpts.id,
            repliesCount: statusOpts.replies_count,
            reblogsCount: statusOpts.reblogs_count,
            favoritesCount: statusOpts.favourites_count,
            reblogged: statusOpts.reblogged,
            favourited: statusOpts.favourited,
            application: statusOpts.application,
            visibility: statusOpts.visibility,
            isSensitive: statusOpts.sensitive,
            createdDate: new Date(statusOpts.created_at)
        };
        if (statusOpts.edited_at)
            assign.editedDate = new Date(statusOpts.edited_at);
        if (statusOpts.reblog)
            assign.reblogPost = this.client.cache.getStatus(statusOpts.reblog);
        if (statusOpts.in_reply_to_id)
            assign.replyPostId = statusOpts.in_reply_to_id;
        this.content.assign(statusOpts, replace);
        this.account.assign(statusOpts.account, replace);
        super.assign(assign, replace);
    }
    async fetchContext() {
        const res = await this.client.GET(`/api/v1/statuses/${this.id}/context`);
        if (!res.ok)
            throw await fetchError(res);
        const data = await res.json();
        const ancestors = data.ancestors.map(status => this.client.cache.getStatus(status));
        const descendants = data.descendants.map(status => this.client.cache.getStatus(status));
        return {
            ancestors,
            descendants
        };
    }
    reply(contentOrStatusPostOpts) {
        if (typeof contentOrStatusPostOpts == "string") {
            return this.client.account.post({
                contentText: contentOrStatusPostOpts,
                replyPostId: this.id
            });
        }
        else {
            return this.client.account.post({
                contentText: contentOrStatusPostOpts?.contentText,
                ...contentOrStatusPostOpts,
                replyPostId: this.id
            });
        }
    }
    async favorite() {
        const res = await this.client.POST(`/api/v1/statuses/${this.id}/favourite`);
        if (!res.ok)
            throw await fetchError(res);
        const data = await res.json();
        this.assign(data);
        return this;
    }
    async unfavorite() {
        const res = await this.client.POST(`/api/v1/statuses/${this.id}/unfavourite`);
        if (!res.ok)
            throw await fetchError(res);
        const data = await res.json();
        this.assign(data);
        return this;
    }
    async edit(statusEditOpts) {
        const reqData = {
            status: statusEditOpts.contentText,
            spoiler_text: statusEditOpts.spoilerText,
            sensitive: statusEditOpts.isSensitive,
            language: statusEditOpts.language,
            media_ids: statusEditOpts.mediaIds,
            poll: statusEditOpts.poll
        };
        const res = await this.client.PUT(`/api/v1/statuses/${this.id}`, reqData);
        if (!res.ok)
            throw await fetchError(res);
        const data = await res.json();
        this.assign(data);
        return this;
    }
    async delete() {
        const res = await this.client.DELETE(`/api/v1/statuses/${this.id}`);
        if (!res.ok)
            throw await fetchError(res);
        const data = await res.json();
        this.isDeleted = true;
        this.assign(data, false);
        return this;
    }
    async pin() {
        const res = await this.client.POST(`/api/v1/statuses/${this.id}/pin`);
        if (!res.ok)
            throw await fetchError(res);
        const data = await res.json();
        this.assign(data);
        return this;
    }
    async unpin() {
        const res = await this.client.POST(`/api/v1/statuses/${this.id}/unpin`);
        if (!res.ok)
            throw await fetchError(res);
        const data = await res.json();
        this.assign(data);
        return this;
    }
}
//# sourceMappingURL=Status.js.map