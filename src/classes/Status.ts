
import Base from "./base/Base.js";
import Client from "./Client.js";
import Account, { AccountOptions } from "./Account.js";
import { StatusPostOptions } from "./ClientAccount.js";
import { fetchError } from "../utils.js";
import StatusContent from "./StatusContent.js";
import Instance from "./Instance.js";

export type StatusVisibilityTypes = "public" | "unlisted" | "private" | "direct";
type Chars = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";
export type StatusLanguageTypes = `${ Chars }${ Chars }`;

export interface StatusMention {
    id?: string;
    username?: string;
    url?: string;
    acct?: string;
}

export interface StatusTag {
    name?: string;
    url?: string;
}

export interface StatusApplication {
    name?: string;
    website?: string;
}

export interface statusEditOpts {
    contentText?: string;
    spoilerText?: string,
    mediaIds?: string[],
    language?: StatusLanguageTypes,
    poll?: any; // TODO Poll
    isSensitive?: boolean,
}

export interface StatusOptions {
    id?: string;
    uri?: string;
    created_at?: string;
    account?: AccountOptions;
    content?: string;
    visibility?: StatusVisibilityTypes;
    sensitive?: boolean;
    media_attachments?: any; // TODO MediaAttachment
    spoiler_text?: string;
    application?: StatusApplication;
    mentions?: StatusMention[];
    tags?: StatusTag[];
    emojis?: any[]; // TODO CustomEmoji
    reblogs_count?: number;
    favourites_count?: number;
    replies_count?: number;
    url?: string;
    in_reply_to_id?: string;
    in_reply_to_account_id?: string;
    reblog?: StatusOptions;
    poll?: any; // TODO Poll
    language?: StatusLanguageTypes;
    text?: string;
    edited_at?: string; 
    favourited?: boolean;
    reblogged?: boolean;
    muted?: boolean;
    bookmarked?: boolean;
    card?: any; // TODO PreviewCard
    pinned?: boolean;
    filtered?: any[]; // TODO FilterResult
}

export interface StatusContext {
    ancestors: Status[];
    descendants: Status[];
}

export default class Status extends Base {

    public id: string;
    public content: StatusContent;
    public account: Account;
    public repliesCount: number;
    public reblogsCount: number;
    public favoritesCount: number;
    public reblogged: boolean;
    public favourited: boolean;
    public application: StatusApplication;
    public visibility: StatusVisibilityTypes;
    public isDeleted = false;
    public isSensitive: boolean;
    public createdDate: Date;
    public editedDate?: Date;
    public replyPostId?: string;
    public reblogPost?: Status;
    
    constructor(statusOpts: StatusOptions, client: Client) {
        super(client);

        this.content = new StatusContent(statusOpts, client);
        this.account = this.client.cache.getAccount(statusOpts.account);
        
        this.assign(statusOpts);
    }

    assign(statusOpts: StatusOptions, replace = true) {
        const assign: any = {
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
        }
        if (statusOpts.edited_at) assign.editedDate = new Date(statusOpts.edited_at);
        if (statusOpts.reblog) assign.reblogPost = this.client.cache.getStatus(statusOpts.reblog);
        if (statusOpts.in_reply_to_id) assign.replyPostId = statusOpts.in_reply_to_id;

        this.content.assign(statusOpts, replace);
        this.account.assign(statusOpts.account, replace);

        super.assign(assign, replace);
    }

    async fetchContext(): Promise<StatusContext> {
        const res = await this.client.GET(`/api/v1/statuses/${ this.id }/context`);
        if (!res.ok) throw await fetchError(res);
        const data = await res.json();

        const ancestors = data.ancestors.map(status => this.client.cache.getStatus(status));
        const descendants = data.descendants.map(status => this.client.cache.getStatus(status));

        return {
            ancestors,
            descendants
        }
    }

    reply(contentOrStatusPostOpts?: string | StatusPostOptions) {
        if (typeof contentOrStatusPostOpts == "string") {
            return this.client.account.post({
                contentText: contentOrStatusPostOpts,
                replyPostId: this.id
            });
        } else {
            return this.client.account.post({
                contentText: contentOrStatusPostOpts?.contentText,
                ...contentOrStatusPostOpts,
                replyPostId: this.id
            });
        }
    }

    async favorite() {        
        const res = await this.client.POST(`/api/v1/statuses/${ this.id }/favourite`);
        if (!res.ok) throw await fetchError(res);
        const data = await res.json();
        
        this.assign(data);
        return this;
    }

    async unfavorite() {        
        const res = await this.client.POST(`/api/v1/statuses/${ this.id }/unfavourite`);
        if (!res.ok) throw await fetchError(res);
        const data = await res.json();

        this.assign(data);
        return this;
    }

    async edit(statusEditOpts: statusEditOpts) {
        const reqData = {
            status: statusEditOpts.contentText,
            spoiler_text: statusEditOpts.spoilerText,
            sensitive:  statusEditOpts.isSensitive,
            language: statusEditOpts.language,
            media_ids: statusEditOpts.mediaIds,
            poll: statusEditOpts.poll
        }

        const res = await this.client.PUT(`/api/v1/statuses/${ this.id }`, reqData);
        if (!res.ok) throw await fetchError(res);
        const data = await res.json();

        this.assign(data);
        return this;
    }

    async delete() {
        const res = await this.client.DELETE(`/api/v1/statuses/${ this.id }`);
        if (!res.ok) throw await fetchError(res);
        const data = await res.json();

        this.isDeleted = true;
        this.assign(data, false);
        return this;
    }

    async pin() {
        const res = await this.client.POST(`/api/v1/statuses/${ this.id }/pin`);
        if (!res.ok) throw await fetchError(res);
        const data = await res.json();

        this.assign(data);
        return this;
    }

    async unpin() {
        const res = await this.client.POST(`/api/v1/statuses/${ this.id }/unpin`);
        if (!res.ok) throw await fetchError(res);
        const data = await res.json();

        this.assign(data);
        return this;
    }
}