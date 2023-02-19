import ProfileContent from "./ProfileContent.js";
import Base from "./base/Base.js";
export default class AccountProfile extends Base {
    content;
    avatarUrl;
    staticAvatarUrl;
    headerUrl;
    staticHeaderUrl;
    constructor(profileOpts, client) {
        super(client);
        this.content = new ProfileContent(profileOpts, client);
        this.assign(profileOpts);
    }
    assign(profileOpts, replace = true) {
        const assign = {
            avatarUrl: profileOpts.avatar,
            staticAvatarUrl: profileOpts.avatar_static,
            headerUrl: profileOpts.header,
            staticheaderUrl: profileOpts.header_static
        };
        this.content.assign(profileOpts, replace);
        super.assign(assign, replace);
    }
}
//# sourceMappingURL=AccountProfile.js.map