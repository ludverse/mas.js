
import Account from "./Account.js";
import Client from "./Client.js";
import Base from "./base/Base.js";
import InstanceConfig from "./InstanceConfig.js";

export interface InstanceOptions {
    domain?: string;
    title?: string;
    version?: string;
    source_url?: string;
    description?: string;
    languages?: string[];
    configuration?: InstanceConfigOpts;
    registrations?: {
        enabled?: boolean;
        approval_required?: boolean;
        message?: string;
    };
    contact?: {
        email?: string;
        account?: Account;
    };
    rules?: InstanceRule[];
}

export interface InstanceConfigOpts {
    urls?: {
        streaming_api?: string;
    };
    accounts?: {
        max_featured_tags?: number;
    };
    statuses?: {
        max_characters?: number;
        max_media_attachments?: number;
        characters_reserved_per_url?: number;
    };
    media_attachments?: {
        supported_mime_types?: string[];
        image_size_limit?: number;
        image_matrix_limit?: number;
        video_size_limit?: number;
        video_frame_rate_limit?: number;
        video_matrix_limit?: number;
    };
    polls?: {
        max_options?: number;
        max_characters_per_option?: number;
        min_expiration?: number;
        max_expiration?: number;
    };
    translation?: {
        enabled?: boolean;
    };    
}

export interface InstanceRule {
    id: string;
    text: string;
}

export interface Thumbnail {
    url: string;
    blurhash: string;
    versions: { [key: string]: string };
}

export default class Instance extends Base {

    public domain: string;
    public title: string;
    public config: InstanceConfig;
    public description: string;
    public contactEmail: string;
    public contantAccount: Account;
    public rules: InstanceRule[];
    public sourceRepoUrl: string;
    public version: string;

    constructor(instanceOpts: InstanceOptions, client: Client) {
        super(client);

        this.config = new InstanceConfig(instanceOpts, client);

        this.assign(instanceOpts);
    }

    assign(instanceOpts: InstanceOptions, overwrite = true) {
        const assign: any = {
            domain: instanceOpts.domain,
            title: instanceOpts.title,
            description: instanceOpts.description,
            contactEmail: instanceOpts.contact.email,
            contactAccount: this.client.cache.getAccount(instanceOpts.contact.account),
            sourceRepoUrl: instanceOpts.source_url,
            version: instanceOpts.version,
        }

        super.assign(assign, overwrite);
    }

}