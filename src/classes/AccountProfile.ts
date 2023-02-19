
import { AccountField } from "./Account.js";
import Client from "./Client.js";
import ProfileContent from "./ProfileContent.js";
import Base from "./base/Base.js";

export interface ProfileOptions {
    note?: string;
    fields?: AccountField[];
    avatar?: string;
    avatar_static?: string;
    header?: string;
    header_static?: string;
}

export default class AccountProfile extends Base {

    public content: ProfileContent;
    public avatarUrl: string;
    public staticAvatarUrl: string;
    public headerUrl: string;
    public staticHeaderUrl: string;

    constructor(profileOpts: ProfileOptions, client: Client) {
        super(client);
        
        this.content = new ProfileContent(profileOpts, client);
        
        this.assign(profileOpts);
    }

    assign(profileOpts: ProfileOptions, replace = true) {
        const assign: any = {
            avatarUrl: profileOpts.avatar,
            staticAvatarUrl: profileOpts.avatar_static,
            headerUrl: profileOpts.header,
            staticheaderUrl: profileOpts.header_static
        }

        this.content.assign(profileOpts, replace);

        super.assign(assign, replace);
    }
}